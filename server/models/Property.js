import mongoose from 'mongoose';

const propertySchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    beds: { type: Number, required: true },
    baths: { type: Number, required: true },
    sqft: { type: Number, required: true },
    description: { type: String },
    image: { type: String },
    type: { type: String, default: 'Luxury' },
  },
  { timestamps: true }
);

const Property = mongoose.model('Property', propertySchema);
export default Property;
