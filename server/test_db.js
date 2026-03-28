import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from './models/Property.js';

dotenv.config({ path: '.env' });

const check = async () => {
  try {
    console.log('Connecting to: ' + process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('Connected!');
    const count = await Property.countDocuments();
    console.log('Property Count: ' + count);
    process.exit(0);
  } catch (err) {
    console.error('Error: ' + err.message);
    process.exit(1);
  }
};

check();
