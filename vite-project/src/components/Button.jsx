import { motion } from 'framer-motion';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-6 py-2.5 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-accent to-yellow-600 text-white shadow-lg shadow-accent/20 hover:shadow-accent/40",
    secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-sm",
    outline: "border-2 border-accent text-accent hover:bg-accent hover:text-white"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
