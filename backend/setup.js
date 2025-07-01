#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Volleyball Gesture System Backend...\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  
  const envContent = `# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/volleyball_gesture_system

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# JWT Secret (if needed for authentication)
JWT_SECRET=your-secret-key-here
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully');
} else {
  console.log('✅ .env file already exists');
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('\n📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Dependencies already installed');
}

// Check MongoDB connection
console.log('\n🔍 Checking MongoDB connection...');
try {
  // Try to connect to MongoDB (this will be handled by the actual server)
  console.log('ℹ️  MongoDB connection will be tested when server starts');
  console.log('ℹ️  Make sure MongoDB is running on localhost:27017');
  console.log('ℹ️  Or update MONGODB_URI in .env for MongoDB Atlas');
} catch (error) {
  console.error('❌ MongoDB connection failed:', error.message);
  console.log('💡 Please ensure MongoDB is running or update MONGODB_URI in .env');
}

console.log('\n🎉 Setup completed!');
console.log('\n📋 Next steps:');
console.log('1. Start MongoDB (if using local): mongod');
console.log('2. Start the server: npm run dev');
console.log('3. The server will be available at: http://localhost:3001');
console.log('4. Test the health endpoint: http://localhost:3001/health');
console.log('\n📚 For more information, see README.md'); 