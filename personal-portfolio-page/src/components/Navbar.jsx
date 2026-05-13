import { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { navLinks } from '../data/portfolioData';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-dark/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href="#home" className="text-2xl font-bold gradient-text">
            Portfolio
          </a>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-white transition-colors duration-300 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 gradient-bg group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
            <a
              href="#contact"
              className="gradient-bg px-6 py-2 rounded-full text-white font-medium hover:opacity-90 transition-opacity"
            >
              联系我
            </a>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white text-2xl"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <div className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white transition-colors duration-300 py-2"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="gradient-bg px-6 py-2 rounded-full text-white font-medium text-center hover:opacity-90 transition-opacity"
            >
              联系我
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
