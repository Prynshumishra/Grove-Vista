import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

connectDB();

const seedDB = async () => {
  try {
    await User.deleteMany();

    await User.create({
      name: 'Admin User',
      email: 'admin@grovevista.com',
      password: 'password123', // Will be hashed by pre-save middleware
    });

    console.log('Dummy user seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with seeding: ${error}`);
    process.exit(1);
  }
};

seedDB();
