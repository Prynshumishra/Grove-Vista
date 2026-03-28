import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from '../models/Property.js';

dotenv.config({ path: '.env' });

const properties = [
  {
    title: 'Sky-High Penthouse',
    location: 'Worli, Mumbai',
    price: 450000000,
    beds: 5,
    baths: 6,
    sqft: 8500,
    type: 'Penthouse',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    description: 'A masterpiece of contemporary architecture with panoramic vistas of the Arabian Sea.'
  },
  {
    title: 'Azure Bay Mansion',
    location: 'Alibaug, Maharashtra',
    price: 280000000,
    beds: 6,
    baths: 7,
    sqft: 12000,
    type: 'Mansion',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    description: 'Beachfront luxury with private docks, an infinity pool, and sprawling tropical gardens.'
  },
  {
    title: 'Royal Heritage Villa',
    location: 'Udaipur, Rajasthan',
    price: 150000000,
    beds: 4,
    baths: 5,
    sqft: 6000,
    type: 'Villa',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    description: 'Bespoke heritage architecture combined with modern amenities in the heart of Udaipur.'
  },
  {
    title: 'Emerald Forest Retreat',
    location: 'Coorg, Karnataka',
    price: 95000000,
    beds: 3,
    baths: 3,
    sqft: 4500,
    type: 'Estate',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    description: 'Tucked away in coffee plantations, this sustainable luxury home offers pure tranquility.'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    // Only insert if empty
    const count = await Property.countDocuments();
    if (count === 0) {
      await Property.insertMany(properties);
      console.log('Dummy properties seeded!');
    } else {
      console.log('Properties already exist in DB.');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
