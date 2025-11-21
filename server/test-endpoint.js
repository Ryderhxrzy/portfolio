// Test script to verify server endpoints
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/contact',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

// Write test data
req.write(JSON.stringify({
  full_name: 'Test User',
  email: 'test@example.com',
  message: 'Test message',
  recaptchaToken: 'test-token'
}));

req.end();
