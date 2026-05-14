const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const User = require('./models/User');

async function verifyAllUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Auto-verify all users so the user can test logging in
    const result = await User.updateMany({}, { $set: { isEmailVerified: true } });
    console.log(`Auto-verified ${result.modifiedCount} users.`);

    const users = await User.find({}, 'email firstName lastName userType isEmailVerified');
    console.log('Users in database:');
    users.forEach(u => {
      console.log(`- ${u.email} (Role: ${u.userType})`);
    });
    
    if (users.length === 0) {
      console.log('No users found! You might need to register first.');
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

verifyAllUsers();
