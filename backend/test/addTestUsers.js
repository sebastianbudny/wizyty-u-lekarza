import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { mongoDBURL } from '../config.js';
import User from '../models/userModel.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoDBURL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const addTestUsers = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    const rejestratorExists = await User.findOne({ email: 'user@example.com' });

    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin', salt);
      const admin = new User({
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
      });
      await admin.save();
      console.log('Admin user created');
    }

    if (!rejestratorExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('user', salt);
      const rejestrator = new User({
        username: 'user',
        email: 'user@example.com',
        password: hashedPassword,
        role: 'rejestrator',
        isActive: true,
      });
      await rejestrator.save();
      console.log('Rejestrator user created');
    }

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB().then(addTestUsers);