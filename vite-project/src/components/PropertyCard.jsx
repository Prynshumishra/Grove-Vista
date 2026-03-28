import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import Button from './Button';
import { MapPin, Bed, Bath, Square, Loader2, Check, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PropertyCard = ({ property, index, onBooked }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(property._booked || false);
  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');

  const handleBook = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowModal(true);
  };

  const confirmBooking = async (e) => {
    e.preventDefault();
    setBooking(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          propertyId: property.id,
          title: property.title,
          location: property.location,
          price: property.price,
          beds: property.beds,
          baths: property.baths,
          sqft: property.sqft,
          image: property.image,
          name,
          email,
          phone,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setBooked(true);
        setShowModal(false);
        if (onBooked) onBooked(data);
      } else {
        setError(data.message || 'Booking failed');
      }
    } catch (err) {
      setError('Server error');
    }
    setBooking(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-accent/30 transition-colors"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={property.image} 
          alt={property.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
        <div className="absolute top-4 right-4 bg-accent text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
          ₹{property.price.toLocaleString('en-IN')}
        </div>
        {booked && (
          <div className="absolute top-4 left-4 bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
            <Check className="w-3 h-3" /> Booked
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{property.title}</h3>
        <div className="flex items-center text-gray-400 mb-4">
          <MapPin className="w-4 h-4 mr-1 text-teal-400" />
          <span className="text-sm">{property.location}</span>
        </div>
        
        <p className="text-gray-400 text-sm mb-6 line-clamp-2">
          {property.description}
        </p>
        
        <div className="flex justify-between items-center text-gray-300 mb-6 border-t border-white/5 pt-4">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4 text-accent" />
            <span className="text-sm">{property.beds} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4 text-accent" />
            <span className="text-sm">{property.baths} Baths</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4 text-accent" />
            <span className="text-sm">{property.sqft} sqft</span>
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-xs mb-3 text-center">{error}</p>
        )}
        
        <Button
          variant={booked ? 'secondary' : 'primary'}
          className="w-full"
          onClick={handleBook}
          disabled={booking || booked}
        >
          {booking ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Booking...
            </span>
          ) : booked ? (
            <span className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4" /> Property Booked
            </span>
          ) : (
            'Book Property'
          )}
        </Button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl w-full max-w-md p-6 relative border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-2">Book Property</h2>
            <p className="text-gray-400 text-sm mb-6">
              Please confirm your details to book {property.title}.
            </p>

            <form onSubmit={confirmBooking} className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  placeholder="Your Name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  placeholder="+91 9876543210"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full mt-6"
                disabled={booking}
              >
                {booking ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                  </span>
                ) : (
                  'Confirm Booking'
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
};

export default PropertyCard;
