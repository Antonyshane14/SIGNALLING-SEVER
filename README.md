# VoIP Signaling Server

🚀 **Railway-Ready WebRTC Signaling Server for VoIP Applications**

A production-ready Node.js signaling server built with Socket.IO and Express, designed for seamless Railway deployment.

## 🌟 Features

- **WebRTC Signaling**: Complete SDP offer/answer and ICE candidate exchange
- **Real-time Communication**: Socket.IO powered real-time messaging
- **Call Management**: Handle incoming/outgoing calls with user lookup
- **Health Monitoring**: Built-in health check and stats endpoints
- **Railway Optimized**: Environment variables and graceful shutdown support
- **CORS Enabled**: Cross-origin resource sharing for web clients
- **Production Ready**: Error handling and connection cleanup

## 🚀 Quick Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

1. Click the Railway button above
2. Connect your GitHub account
3. Select this repository
4. Railway will automatically detect and deploy!

## 🛠️ Local Development

```bash
# Clone the repository
git clone git@github.com:Antonyshane14/SIGNALLING-SEVER.git
cd SIGNALLING-SEVER

# Install dependencies
npm install

# Start development server
npm run dev

# Or start production server
npm start
```

## 📡 API Endpoints

### Health Check
```
GET /health
```
Returns server status and connection statistics.

### Server Stats
```
GET /stats
```
Returns detailed server metrics including uptime and memory usage.

### Test Connection
```
GET /test
```
Simple test endpoint to verify server is responding.

### Root Endpoint
```
GET /
```
Returns server information and available endpoints.

## 🔌 Socket.IO Events

### Client Registration
```javascript
socket.emit('register', { userId: 'user123', name: 'John Doe' });
```

### Call Management
```javascript
// Initiate a call
socket.emit('call-request', { target: 'user456', offer: sdpOffer });

// Accept/reject call
socket.emit('call-response', { accepted: true, callerId: 'user123' });

// End call
socket.emit('end-call', { roomId: 'room123' });
```

### WebRTC Signaling
```javascript
// Send SDP offer
socket.emit('offer', { roomId: 'room123', offer: sdpOffer });

// Send SDP answer
socket.emit('answer', { roomId: 'room123', answer: sdpAnswer });

// Send ICE candidate
socket.emit('ice-candidate', { roomId: 'room123', candidate: iceCandidate });
```

## 🔧 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port (Railway sets this automatically) |
| `HOST` | `0.0.0.0` | Server host address |
| `NODE_ENV` | `development` | Environment mode |

## 🌐 Production Deployment

### Railway Deployment
1. Connect your GitHub repository to Railway
2. Railway will automatically:
   - Detect the Node.js environment
   - Install dependencies
   - Start the server with `npm start`
   - Assign a public URL

### Manual Railway Setup
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

## 📊 Monitoring

The server provides comprehensive monitoring through several endpoints:

- **Health Status**: `/health` - Basic server health and client count
- **Detailed Stats**: `/stats` - Memory usage, uptime, and performance metrics
- **Connection Test**: `/test` - Simple connectivity verification

## 🔒 Security Features

- **CORS Protection**: Configurable cross-origin resource sharing
- **Graceful Shutdown**: Proper cleanup on server termination
- **Connection Limits**: Built-in socket connection management
- **Error Handling**: Comprehensive error catching and logging

## 🚀 Performance

- **Lightweight**: Minimal dependencies for fast startup
- **Scalable**: Designed for horizontal scaling
- **Memory Efficient**: Automatic cleanup of disconnected clients
- **Low Latency**: Optimized for real-time communication

## 📱 Client Integration

This server is compatible with:
- Flutter WebRTC applications
- Web browsers with WebRTC support
- React Native applications
- Native mobile apps
- Desktop applications

## 🔄 Auto-scaling

Railway automatically handles:
- **Load Balancing**: Distribute traffic across instances
- **Auto-scaling**: Scale based on demand
- **Health Checks**: Automatic restart on failures
- **Zero-downtime**: Rolling deployments

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :3000
   
   # Kill the process
   kill -9 <PID>
   ```

2. **CORS Errors**
   - Ensure your client origin is allowed in CORS configuration
   - Check browser console for specific CORS errors

3. **Connection Timeouts**
   - Verify Railway environment variables
   - Check server logs for errors

### Debug Mode
```bash
DEBUG=socket.io* npm start
```

## 📄 License

MIT License - feel free to use this in your projects!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check the Railway logs for deployment issues
- Verify environment variables are set correctly

---

**Built with ❤️ for the VoIP community**
