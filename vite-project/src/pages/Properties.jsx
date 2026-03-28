import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ALL_PROPERTIES = [
  {
    id: 1,
    title: "Modern Glass Villa",
    location: "Bandra West, Mumbai",
    price: 450000000,
    beds: 5,
    baths: 6,
    sqft: 6500,
    description: "Experience unparalleled luxury in this contemporary masterpiece featuring floor-to-ceiling glass walls, infinity pool, and panoramic seascape views.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 2,
    title: "Sea-facing Estate",
    location: "Alibaug, Maharashtra",
    price: 890000000,
    beds: 6,
    baths: 8,
    sqft: 8200,
    description: "Stunning sea-facing property with private beach access, custom interior finishes, and a sprawling entertainment deck.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 3,
    title: "Urban Luxury Penthouse",
    location: "Vasant Vihar, New Delhi",
    price: 620000000,
    beds: 3,
    baths: 4,
    sqft: 4100,
    description: "Spectacular penthouse overlooking the city skyline. Features include private elevator, smart home technology, and expansive terrace.",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 4,
    title: "Hill Station Retreat",
    location: "Ooty, Tamil Nadu",
    price: 380000000,
    beds: 4,
    baths: 5,
    sqft: 5200,
    description: "Exclusive hill station chalet with vaulted ceilings, massive stone fireplace, and heated outdoor patios.",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 5,
    title: "Heritage Villa",
    location: "Udaipur, Rajasthan",
    price: 750000000,
    beds: 6,
    baths: 7,
    sqft: 7800,
    description: "Classic heritage estate surrounded by lush gardens, featuring a resort-style pool and pristine architecture.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 6,
    title: "Tech Park Smart Home",
    location: "Whitefield, Bengaluru",
    price: 590000000,
    beds: 5,
    baths: 4,
    sqft: 4800,
    description: "Ultra-modern eco-friendly home with fully integrated automation systems and minimalist aesthetic.",
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  }
];

const Properties = () => {
  const { user } = useContext(AuthContext);
  const [dbProperties, setDbProperties] = useState([]);
  const [bookedIds, setBookedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all properties from DB
  useEffect(() => {
    fetch(`${API_URL}/api/properties`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDbProperties(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Fetch existing bookings to mark as booked
  useEffect(() => {
    if (user?.token) {
      fetch(`${API_URL}/api/bookings`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setBookedIds(data.map(b => b.propertyId));
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const handleBooked = (booking) => {
    setBookedIds(prev => [...prev, booking.propertyId]);
  };

  // Combine DB properties with fallback hardcoded ones if DB is empty
  const displayProperties = dbProperties.length > 0 ? dbProperties : ALL_PROPERTIES;

  const properties = displayProperties.map(p => ({
    ...p,
    id: p._id || p.id, // Support both MongoDB _id and hardcoded id
    _booked: bookedIds.includes(p._id || p.id),
  }));

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1120]">
      
      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
            Exclusive <span className="text-accent">Properties</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Browse our curated collection of the most sought-after luxury real estate across the globe.
          </p>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full mt-8" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             <div className="col-span-full text-center py-20 text-gray-400">Loading fine estates...</div>
          ) : (
            properties.map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} onBooked={handleBooked} />
            ))
          )}
        </div>
      </main>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
};

export default Properties;
