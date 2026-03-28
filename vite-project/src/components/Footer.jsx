import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-lg mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Grove Vista</h3>
            <p className="text-gray-400 max-w-xs mx-auto md:mx-0">
              Discover unparalleled luxury and exclusivity with our curated collection of premium real estate properties.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 flex flex-col">
            <li><Link to="/about" className="text-gray-400 hover:text-accent transition-colors">About</Link></li>
              <li><Link to="/properties" className="text-gray-400 hover:text-accent transition-colors">Properties</Link></li>
               <li><Link to="/dashboard" className="text-gray-400 hover:text-accent transition-colors">Dashboard</Link></li>
              
             
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Info</h4>
            <ul className="space-y-2 text-gray-400">
              <li>123 Luxury Lane, Bandra West, Mumbai</li>
              <li>info@grovevista.com</li>
              <li>+91 9876543210</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Grove Vista Properties. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
