import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../server/models/User.js';

dotenv.config({ path: '../server/.env' });

const elevate = async (email) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOneAndUpdate({ email }, { isAdmin: true }, { new: true });
    if (user) {
      console.log(`Success: ${user.email} is now an Admin.`);
    } else {
      console.log(`Error: User with email ${email} not found.`);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const email = process.argv[2] || 'admin@grovevista.com';
elevate(email);
