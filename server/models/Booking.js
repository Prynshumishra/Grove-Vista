import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    propertyId: { type: Number, required: true },
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    beds: { type: Number },
    baths: { type: Number },
    sqft: { type: Number },
    image: { type: String },
    status: { type: String, default: 'Confirmed', enum: ['Confirmed', 'Pending', 'Cancelled'] },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
