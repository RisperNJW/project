const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../index');
const User = require('../models/user');
const { createTokens } = require('./tokenUtils');

// Test security headers
const testSecurityHeaders = async () => {
  const res = await request(app).get('/api/health');
  
  const securityHeaders = [
    'X-Content-Type-Options',
    'X-Frame-Options',
    'X-XSS-Protection',
    'Strict-Transport-Security',
    'Content-Security-Policy'
  ];
  
  const missingHeaders = securityHeaders.filter(header => !res.headers[header.toLowerCase()]);
  
  if (missingHeaders.length > 0) {
    console.error('❌ Missing security headers:', missingHeaders);
  } else {
    console.log('✅ All security headers are present');
  }
};

// Test rate limiting
const testRateLimiting = async () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'Test@1234';
  
  // Create a test user
  const user = await User.create({
    name: 'Test User',
    email: testEmail,
    password: testPassword,
    role: 'user'
  });
  
  // Generate tokens
  const { accessToken } = await createTokens(user._id);
  
  try {
    // Test login rate limiting
    const loginAttempts = 15; // More than the rate limit
    let rateLimited = false;
    
    for (let i = 0; i < loginAttempts; i++) {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: testEmail, password: 'wrongpassword' });
      
      if (res.status === 429) {
        rateLimited = true;
        console.log(`✅ Rate limiting triggered after ${i + 1} attempts`);
        break;
      }
    }
    
    if (!rateLimited) {
      console.error('❌ Rate limiting not working as expected');
    }
    
    // Test API rate limiting
    let apiRateLimited = false;
    for (let i = 0; i < 150; i++) { // More than the API rate limit
      const res = await request(app)
        .get('/api/v1/services')
        .set('Authorization', `Bearer ${accessToken}`);
      
      if (res.status === 429) {
        apiRateLimited = true;
        console.log(`✅ API rate limiting triggered after ${i + 1} requests`);
        break;
      }
    }
    
    if (!apiRateLimited) {
      console.error('❌ API rate limiting not working as expected');
    }
    
  } finally {
    // Clean up
    await User.findByIdAndDelete(user._id);
  }
};

// Test input validation
const testInputValidation = async () => {
  // Test XSS protection
  const xssPayload = '<script>alert(\'XSS\')</script>';
  const res = await request(app)
    .post('/api/v1/auth/register')
    .send({
      name: xssPayload,
      email: 'test@example.com',
      password: 'Test@1234',
      passwordConfirm: 'Test@1234'
    });
  
  if (res.body.data.user.name.includes('<script>')) {
    console.error('❌ XSS protection not working');
  } else {
    console.log('✅ XSS protection is working');
  }
  
  // Clean up
  await User.deleteOne({ email: 'test@example.com' });
};

// Test NoSQL injection protection
const testNoSQLInjection = async () => {
  try {
    await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: { $ne: null },
        password: { $ne: null }
      });
    
    console.error('❌ NoSQL injection protection not working');
  } catch (err) {
    if (err.message.includes('NoSQL injection detected')) {
      console.log('✅ NoSQL injection protection is working');
    } else {
      console.error('❌ Unexpected error testing NoSQL injection:', err);
    }
  }
};

// Run all security tests
const runSecurityTests = async () => {
  console.log('🚀 Running security tests...\n');
  
  try {
    await testSecurityHeaders();
    await testRateLimiting();
    await testInputValidation();
    await testNoSQLInjection();
    
    console.log('\n✨ Security tests completed!');
  } catch (err) {
    console.error('\n❌ Security tests failed:', err);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Connect to database and run tests
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => runSecurityTests())
  .catch(err => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });
