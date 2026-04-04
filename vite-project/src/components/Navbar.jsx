import { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Button from './Button';
import { Home, Menu, X, ChevronDown, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed w-full z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
            <Home className="text-accent w-8 h-8 group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-bold tracking-tighter text-white">
              Grove Vista
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-gray-300 hover:text-accent transition-colors">About</Link>
            <Link to="/properties" className="text-gray-300 hover:text-accent transition-colors">Properties</Link>
            <Link to="/dashboard" className="text-gray-300 hover:text-accent transition-colors">Dashboard</Link>
            

            {user && (
              <div className="relative ml-2" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-white font-medium text-sm hidden lg:inline">{user.name}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-[#0c1322] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-white/10">
                        <p className="text-white font-semibold text-sm">{user.name}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm"
                        >
                          <User className="w-4 h-4" /> Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-sm"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none p-2"
            >
              {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#0B1120]/95 backdrop-blur-3xl border-t border-white/5 absolute top-20 left-0 w-full overflow-hidden flex flex-col items-center justify-start pt-12 px-8 gap-8 shadow-2xl"
          >
            <Link to="/" onClick={closeMenu} className="text-2xl text-white font-medium hover:text-accent transition-colors tracking-wide">Home</Link>
            <Link to="/properties" onClick={closeMenu} className="text-2xl text-white font-medium hover:text-accent transition-colors tracking-wide">Properties</Link>
            <Link to="/about" onClick={closeMenu} className="text-2xl text-white font-medium hover:text-accent transition-colors tracking-wide">About</Link>
            <Link to="/dashboard" onClick={closeMenu} className="text-2xl text-accent font-bold hover:text-yellow-400 transition-colors tracking-wide">Dashboard</Link>
            
            <div className="w-full h-px bg-white/10 my-4" />
            
            {user ? (
              <div className="w-full flex flex-col items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-gray-400 text-xs">{user.email}</p>
                  </div>
                </div>
                <Button variant="secondary" onClick={handleLogout} className="w-full py-4 text-xl">Log Out</Button>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
