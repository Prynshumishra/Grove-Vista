import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B1120]">
      
      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
            About <span className="text-accent">Grove Vista</span>
          </h1>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full mt-8" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Our Legacy of Luxury</h2>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed font-light">
              Founded in 2026, Grove Vista has established itself as the premier destination for exclusive real estate across India. We specialize in curating an elite portfolio of properties that offer unparalleled luxury, sophisticated design, and breathtaking locations.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed font-light">
              Our core mission is to seamlessly connect discerning clients with their ultimate dream homes, all while maintaining absolute transparency, exemplary elite service standards, and total confidentiality throughout every stage of the process.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="rounded-[2rem] overflow-hidden glass border border-white/5 relative h-[28rem] shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Luxury Interior" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass p-12 lg:p-16 rounded-[2.5rem] border border-white/10 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-teal-500/5 opacity-80" />
          <h3 className="text-4xl font-bold text-white mb-4 relative z-10 tracking-tight">Our Core Values</h3>
          <p className="text-gray-400 mb-12 relative z-10 max-w-2xl mx-auto">The foundational pillars that guide everything we do.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 relative z-10">
            <div className="px-4">
              <div className="w-16 h-16 mx-auto bg-accent/10 rounded-2xl flex items-center justify-center mb-6 border border-accent/20 text-accent text-3xl">🏆</div>
              <h4 className="text-xl font-bold text-white mb-3">Excellence</h4>
              <p className="text-gray-400 leading-relaxed text-sm">Demanding the highest standards in every property we list and every interaction we have with our clients.</p>
            </div>
            <div className="px-4">
              <div className="w-16 h-16 mx-auto bg-teal-500/10 rounded-2xl flex items-center justify-center mb-6 border border-teal-500/20 text-teal-400 text-3xl">⚖️</div>
              <h4 className="text-xl font-bold text-white mb-3">Integrity</h4>
              <p className="text-gray-400 leading-relaxed text-sm">Operating with complete transparency, unyielding honesty, and uncompromising ethics in a dynamic market.</p>
            </div>
            <div className="px-4">
              <div className="w-16 h-16 mx-auto bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 text-blue-400 text-3xl">🚀</div>
              <h4 className="text-xl font-bold text-white mb-3">Innovation</h4>
              <p className="text-gray-400 leading-relaxed text-sm">Continuously utilizing state-of-the-art technology to enhance and simplify the buying and selling experience.</p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Decorative Blur */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
};
export default About;
