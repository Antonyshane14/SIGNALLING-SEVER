const http = require('http');
const socketIoClient = require('socket.io-client');

// Test configuration
const TEST_URL = process.env.TEST_URL || 'http://localhost:3000';
const TIMEOUT = 10000; // 10 seconds

console.log('🧪 Starting VoIP Signaling Server Tests...');
console.log(`📡 Testing server at: ${TEST_URL}`);

// Test 1: Health Check
async function testHealthCheck() {
  console.log('\n1️⃣ Testing Health Check Endpoint...');
  
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    http.get(`${TEST_URL}/health`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        
        if (res.statusCode === 200) {
          const response = JSON.parse(data);
          console.log(`✅ Health check passed (${responseTime}ms)`);
          console.log(`   Status: ${response.status}`);
          console.log(`   Message: ${response.message}`);
          console.log(`   Connected Clients: ${response.connectedClients}`);
          resolve();
        } else {
          reject(new Error(`Health check failed with status ${res.statusCode}`));
        }
      });
    }).on('error', (err) => {
      reject(new Error(`Health check request failed: ${err.message}`));
    });
    
    setTimeout(() => {
      reject(new Error('Health check timeout'));
    }, TIMEOUT);
  });
}

// Test 2: Socket.IO Connection
async function testSocketConnection() {
  console.log('\n2️⃣ Testing Socket.IO Connection...');
  
  return new Promise((resolve, reject) => {
    const socket = socketIoClient(TEST_URL, {
      timeout: TIMEOUT,
      transports: ['websocket', 'polling']
    });
    
    const startTime = Date.now();
    
    socket.on('connect', () => {
      const connectionTime = Date.now() - startTime;
      console.log(`✅ Socket.IO connection established (${connectionTime}ms)`);
      console.log(`   Socket ID: ${socket.id}`);
      
      // Test registration
      socket.emit('register', { userId: 'test-user-123', name: 'Test User' });
    });
    
    socket.on('registered', (data) => {
      console.log('✅ User registration successful');
      console.log(`   Socket ID: ${data.socketId}`);
      console.log(`   Message: ${data.message}`);
      
      // Test connection test event
      socket.emit('test-connection');
    });
    
    socket.on('test-response', (data) => {
      console.log('✅ Connection test successful');
      console.log(`   Response: ${data.message}`);
      console.log(`   Timestamp: ${data.timestamp}`);
      
      socket.disconnect();
      resolve();
    });
    
    socket.on('connect_error', (error) => {
      reject(new Error(`Socket.IO connection failed: ${error.message}`));
    });
    
    socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
    });
    
    setTimeout(() => {
      socket.disconnect();
      reject(new Error('Socket.IO connection timeout'));
    }, TIMEOUT);
  });
}

// Test 3: Stats Endpoint
async function testStatsEndpoint() {
  console.log('\n3️⃣ Testing Stats Endpoint...');
  
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    http.get(`${TEST_URL}/stats`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        
        if (res.statusCode === 200) {
          const stats = JSON.parse(data);
          console.log(`✅ Stats endpoint working (${responseTime}ms)`);
          console.log(`   Uptime: ${Math.round(stats.uptime)}s`);
          console.log(`   Connected Clients: ${stats.connectedClients}`);
          console.log(`   Active Rooms: ${stats.activeRooms}`);
          console.log(`   Environment: ${stats.environment}`);
          console.log(`   Port: ${stats.port}`);
          resolve();
        } else {
          reject(new Error(`Stats endpoint failed with status ${res.statusCode}`));
        }
      });
    }).on('error', (err) => {
      reject(new Error(`Stats request failed: ${err.message}`));
    });
    
    setTimeout(() => {
      reject(new Error('Stats endpoint timeout'));
    }, TIMEOUT);
  });
}

// Test 4: Test Endpoint
async function testTestEndpoint() {
  console.log('\n4️⃣ Testing Test Endpoint...');
  
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    http.get(`${TEST_URL}/test`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        
        if (res.statusCode === 200) {
          const response = JSON.parse(data);
          console.log(`✅ Test endpoint working (${responseTime}ms)`);
          console.log(`   Server: ${response.server}`);
          console.log(`   Version: ${response.version}`);
          console.log(`   Features: ${response.features.length} features`);
          resolve();
        } else {
          reject(new Error(`Test endpoint failed with status ${res.statusCode}`));
        }
      });
    }).on('error', (err) => {
      reject(new Error(`Test request failed: ${err.message}`));
    });
    
    setTimeout(() => {
      reject(new Error('Test endpoint timeout'));
    }, TIMEOUT);
  });
}

// Run all tests
async function runTests() {
  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'Socket.IO Connection', fn: testSocketConnection },
    { name: 'Stats Endpoint', fn: testStatsEndpoint },
    { name: 'Test Endpoint', fn: testTestEndpoint }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      await test.fn();
      passed++;
    } catch (error) {
      console.log(`❌ ${test.name} failed: ${error.message}`);
      failed++;
    }
  }
  
  console.log('\n🏁 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Success Rate: ${Math.round((passed / tests.length) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Server is working correctly.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Please check the server configuration.');
    process.exit(1);
  }
}

// Start tests
runTests().catch((error) => {
  console.error('💥 Test suite failed to start:', error.message);
  process.exit(1);
});
