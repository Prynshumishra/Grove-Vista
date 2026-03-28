import { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import Button from '../components/Button';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DUMMY_PROPERTIES = [
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
  }
];

const TESTIMONIALS = [
  {
    id: 1,
    name: "Vikram Singhania",
    role: "CEO, TechVentures",
    text: "Grove Vista made our transition to a new corporate headquarters in Bengaluru incredibly seamless. Their discretion and access to off-market properties are unmatched.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
  },
  {
    id: 2,
    name: "Ananya Desai",
    role: "Founding Partner, Desai Capital",
    text: "Finding a sea-facing estate in Mumbai that met all our architectural requirements felt impossible until we partnered with the elite team at Grove Vista.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
  },
  {
    id: 3,
    name: "Rahul Mehta",
    role: "Global Director, Meridian Group",
    text: "The level of bespoke service and international standards they bring to the Indian luxury real estate market is completely revolutionary. Highly recommended.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [dbProperties, setDbProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/properties`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDbProperties(data.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const displayProperties = dbProperties.length > 0 ? dbProperties : DUMMY_PROPERTIES;

  return (
    <>
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Luxury Home" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-black/50 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-2xl"
          >
            Find Your <span className="text-accent">Dream Property</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-200 mb-10 drop-shadow-lg"
          >
            Discover the most exclusive luxury real estate worldwide.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              onClick={() => navigate("/properties")}
              className="mx-auto text-lg px-8 py-4 rounded-md shadow-[0_0_30px_rgba(212,175,55,0.3)]"
            >
              Explore Properties
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-black/40 border-y border-white/5 relative z-10 text-center px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white mb-4"
          >
            The Grove Vista Experience
          </motion.h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full mb-16" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }} 
              className="p-8 glass rounded-3xl border border-white/5"
            >
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-accent text-2xl">✨</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Curated Luxury</h3>
              <p className="text-gray-400 leading-relaxed font-medium">Every property in our portfolio is meticulously selected to meet the highest standards of luxury, design, and exclusivity.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -10 }} 
              className="p-8 glass rounded-3xl border border-white/5"
            >
              <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-teal-400 text-2xl">🛡️</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Absolute Discretion</h3>
              <p className="text-gray-400 leading-relaxed font-medium">We provide a highly confidential and private service tailored strictly for high-net-worth individuals and corporate clients.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -10 }} 
              className="p-8 glass rounded-3xl border border-white/5"
            >
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-blue-400 text-2xl">🤝</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">End-to-End Service</h3>
              <p className="text-gray-400 leading-relaxed font-medium">From personalized viewings to bespoke legal and financial advisory, our world-class team meticulously handles every detail.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section id="properties" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Featured Listings</h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             <div className="col-span-full text-center py-10 text-gray-400">Loading fine estates...</div>
          ) : (
            displayProperties.map((property, index) => (
              <PropertyCard key={property._id || property.id} property={{...property, id: property._id || property.id}} index={index} />
            ))
          )}
        </div>
        
        <div className="text-center mt-12">
          <Button onClick={() => navigate("/properties")} variant="secondary" className="px-10 py-3 mx-auto rounded-md">
            View All Properties
          </Button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-black/40 border-y border-white/5 relative z-10 w-full px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-white mb-4"
            >
              Client Testimonials
            </motion.h2>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass p-8 rounded-[2rem] border border-white/10 relative mt-8 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] transition-shadow"
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-[#0B1120] overflow-hidden bg-black shadow-xl">
                  <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center mt-8">
                  <p className="text-gray-300 italic mb-6 leading-relaxed">"{testimonial.text}"</p>
                  <h4 className="text-xl font-bold text-white">{testimonial.name}</h4>
                  <p className="text-accent text-sm font-medium mt-1">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
