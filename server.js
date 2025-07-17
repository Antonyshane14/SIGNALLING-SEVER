const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store connected clients and their rooms
const clients = new Map();
const rooms = new Map();

// Health check endpoint for testing
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'VoIP Signaling Server is running',
    timestamp: new Date().toISOString(),
    connectedClients: clients.size,
    activeRooms: rooms.size
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'VoIP Signaling Server',
    version: '1.0.0',
    status: 'running',
    description: 'WebRTC signaling server for VoIP applications',
    endpoints: {
      health: '/health',
      stats: '/stats',
      test: '/test',
      iceServers: '/ice-servers'
    },
    connectedClients: clients.size,
    activeRooms: rooms.size,
    timestamp: new Date().toISOString()
  });
});

// Server test endpoint
app.get('/test', (req, res) => {
  res.json({
    message: 'Server test successful!',
    server: 'VoIP Signaling Server',
    version: '1.0.0',
    features: [
      'WebRTC Signaling',
      'Socket.IO Communication',
      'Call Management',
      'Real-time Messaging'
    ],
    timestamp: new Date().toISOString()
  });
});

// Get server stats for monitoring
app.get('/stats', (req, res) => {
  const stats = {
    uptime: process.uptime(),
    connectedClients: clients.size,
    activeRooms: rooms.size,
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000
  };
  res.json(stats);
});

// ICE servers configuration for WebRTC (TURN/STUN servers for Railway hosting)
app.get('/ice-servers', (req, res) => {
  const iceServers = [
    // Google's public STUN servers
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    
    // ExpressTurn TURN servers for Railway NAT traversal
    {
      urls: 'turn:relay1.expressturn.com:3478',
      username: 'ef3V7P4V1KMA8PJHQ2',
      credential: 'FKQA7J4t72SL4beb'
    },
    {
      urls: 'turn:relay2.expressturn.com:3478', 
      username: 'ef3V7P4V1KMA8PJHQ2',
      credential: 'FKQA7J4t72SL4beb'
    },
    
    // Additional public STUN servers for redundancy
    { urls: 'stun:stun.services.mozilla.com:3478' },
    { urls: 'stun:stun.voiparound.com:3478' },
    { urls: 'stun:stun.voipbuster.com:3478' }
  ];

  res.json({
    iceServers: iceServers,
    message: 'ICE servers configuration for Railway WebRTC',
    timestamp: new Date().toISOString(),
    serverCount: iceServers.length,
    turnServers: iceServers.filter(server => server.urls.includes('turn')).length,
    stunServers: iceServers.filter(server => server.urls.includes('stun')).length
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`📱 Client connected: ${socket.id}`);
  
  // Register client
  socket.on('register', (data) => {
    const { userId, name } = data;
    clients.set(socket.id, { userId, name, socketId: socket.id });
    console.log(`👤 Client registered: ${name} (${userId})`);
    
    // Send registration confirmation
    socket.emit('registered', { 
      success: true, 
      socketId: socket.id,
      message: 'Successfully registered to signaling server'
    });
  });

  // Join room for call
  socket.on('join-room', (data) => {
    const { roomId, userId } = data;
    socket.join(roomId);
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(socket.id);
    
    console.log(`🏠 Client ${userId} joined room: ${roomId}`);
    
    // Notify others in the room
    socket.to(roomId).emit('user-joined', { userId, socketId: socket.id });
    
    // Send join confirmation
    socket.emit('joined-room', { 
      roomId, 
      success: true,
      participants: Array.from(rooms.get(roomId)).length
    });
  });

  // Handle WebRTC signaling
  socket.on('offer', (data) => {
    console.log(`📞 Offer from ${socket.id} to room ${data.roomId}`);
    socket.to(data.roomId).emit('offer', {
      offer: data.offer,
      from: socket.id
    });
  });

  socket.on('answer', (data) => {
    console.log(`📞 Answer from ${socket.id} to room ${data.roomId}`);
    socket.to(data.roomId).emit('answer', {
      answer: data.answer,
      from: socket.id
    });
  });

  socket.on('ice-candidate', (data) => {
    console.log(`🧊 ICE candidate from ${socket.id}`);
    socket.to(data.roomId).emit('ice-candidate', {
      candidate: data.candidate,
      from: socket.id
    });
  });

  // Handle call management
  socket.on('initiate-call', (data) => {
    const { targetUserId, callerInfo } = data;
    console.log(`📞 Call initiated from ${callerInfo.name} to ${targetUserId}`);
    
    // Find target user and emit incoming call
    for (const [socketId, client] of clients.entries()) {
      if (client.userId === targetUserId) {
        io.to(socketId).emit('incoming-call', {
          caller: callerInfo,
          callId: data.callId || socket.id + '-' + Date.now()
        });
        break;
      }
    }
  });

  // Handle call-request (compatible with VoIP service)
  socket.on('call-request', (data) => {
    const { target, offer } = data;
    const currentClient = clients.get(socket.id);
    console.log(`📞 Call request from ${currentClient?.userId || socket.id} to ${target}`);
    
    // Find target user and emit call-request
    for (const [socketId, client] of clients.entries()) {
      if (client.userId === target) {
        console.log(`📞 Forwarding call to ${target} at socket ${socketId}`);
        io.to(socketId).emit('call-request', {
          from: currentClient?.userId || socket.id,
          offer: offer
        });
        return;
      }
    }
    
    console.log(`❌ Target user ${target} not found`);
    socket.emit('call-failed', { reason: 'User not found', target });
  });

  socket.on('call-response', (data) => {
    const { accepted, callerId, callId } = data;
    console.log(`📞 Call ${accepted ? 'accepted' : 'rejected'} by ${socket.id}`);
    
    // Find caller and send response
    for (const [socketId, client] of clients.entries()) {
      if (client.userId === callerId) {
        io.to(socketId).emit('call-response', {
          accepted,
          callId,
          responder: clients.get(socket.id)
        });
        break;
      }
    }
  });

  socket.on('end-call', (data) => {
    const { roomId } = data;
    console.log(`📞 Call ended in room ${roomId}`);
    
    // Notify all participants
    socket.to(roomId).emit('call-ended', { from: socket.id });
    
    // Clean up room
    if (rooms.has(roomId)) {
      rooms.get(roomId).delete(socket.id);
      if (rooms.get(roomId).size === 0) {
        rooms.delete(roomId);
      }
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`📱 Client disconnected: ${socket.id}`);
    
    // Clean up client data
    clients.delete(socket.id);
    
    // Clean up rooms
    for (const [roomId, participants] of rooms.entries()) {
      if (participants.has(socket.id)) {
        participants.delete(socket.id);
        // Notify other participants
        socket.to(roomId).emit('user-left', { socketId: socket.id });
        
        // Remove empty rooms
        if (participants.size === 0) {
          rooms.delete(roomId);
        }
      }
    }
  });

  // Test connection
  socket.on('test-connection', () => {
    socket.emit('test-response', {
      message: 'Connection test successful!',
      socketId: socket.id,
      timestamp: new Date().toISOString()
    });
  });
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log('🚀 VoIP Signaling Server started!');
  console.log(`📡 Server running on ${HOST}:${PORT}`);
  console.log(`🌐 Health check: http://${HOST}:${PORT}/health`);
  console.log(`🔧 Test endpoint: http://${HOST}:${PORT}/test`);
  console.log(`📊 Stats endpoint: http://${HOST}:${PORT}/stats`);
  console.log('⚡ Ready for WebRTC connections!');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
