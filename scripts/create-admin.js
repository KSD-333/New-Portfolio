const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Admin schema (same as in models/Admin.ts)
const AdminSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Password: { type: String, required: true },
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function createAdminUser() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not set');
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await Admin.findOne({ Name: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Username: admin');
      console.log('You can use this to login to the admin panel');
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const newAdmin = new Admin({
        Name: 'admin',
        Password: hashedPassword,
      });

      await newAdmin.save();
      console.log('Admin user created successfully!');
      console.log('Username: admin');
      console.log('Password: admin123');
      console.log('Please change the password after first login');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createAdminUser(); 