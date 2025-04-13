
import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Facebook, Twitter } from 'lucide-react';

const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Add scroll listener to change header appearance when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <header className={`py-5 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white bg-opacity-90 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}>
        <div className="sakura-container flex justify-between items-center">
          <Link to="/" className={`font-playfair text-2xl font-bold ${
            isScrolled ? 'text-sakura-dark-text' : 'text-white'
          }`}>
            Sakura Lens
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className={`md:hidden ${isScrolled ? 'text-sakura-dark-text' : 'text-white'}`} 
            onClick={toggleMenu}
            aria-label="Toggle mobile menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <NavLink to="/" className={({ isActive }) => 
              `${isScrolled ? 'text-sakura-dark-text' : 'text-white'} hover:text-sakura-pink transition-colors ${isActive ? 'font-medium' : ''}`
            }>
              Home
            </NavLink>
            <NavLink to="/pricing" className={({ isActive }) => 
              `${isScrolled ? 'text-sakura-dark-text' : 'text-white'} hover:text-sakura-pink transition-colors ${isActive ? 'font-medium' : ''}`
            }>
              Pricing
            </NavLink>
            <NavLink to="/gallery" className={({ isActive }) => 
              `${isScrolled ? 'text-sakura-dark-text' : 'text-white'} hover:text-sakura-pink transition-colors ${isActive ? 'font-medium' : ''}`
            }>
              Gallery
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => 
              `${isScrolled ? 'text-sakura-dark-text' : 'text-white'} hover:text-sakura-pink transition-colors ${isActive ? 'font-medium' : ''}`
            }>
              Contact
            </NavLink>
            <NavLink 
              to="/book-now" 
              className="px-5 py-2 bg-sakura-pink text-white rounded-md hover:bg-opacity-90 transition-all duration-300 font-medium hover-float"
            >
              Book Now
            </NavLink>
          </nav>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden fixed inset-0 bg-white z-50 flex flex-col items-center justify-center space-y-8 animate-fade-in">
            <button 
              className="absolute top-4 right-4" 
              onClick={toggleMenu}
              aria-label="Close mobile menu"
            >
              <X size={24} />
            </button>
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive ? "text-sakura-pink font-medium text-xl" : "text-xl hover:text-sakura-pink transition-colors"
              }
              onClick={toggleMenu}
            >
              Home
            </NavLink>
            <NavLink 
              to="/pricing" 
              className={({ isActive }) => 
                isActive ? "text-sakura-pink font-medium text-xl" : "text-xl hover:text-sakura-pink transition-colors"
              }
              onClick={toggleMenu}
            >
              Pricing
            </NavLink>
            <NavLink 
              to="/gallery" 
              className={({ isActive }) => 
                isActive ? "text-sakura-pink font-medium text-xl" : "text-xl hover:text-sakura-pink transition-colors"
              }
              onClick={toggleMenu}
            >
              Gallery
            </NavLink>
            <NavLink 
              to="/contact" 
              className={({ isActive }) => 
                isActive ? "text-sakura-pink font-medium text-xl" : "text-xl hover:text-sakura-pink transition-colors"
              }
              onClick={toggleMenu}
            >
              Contact
            </NavLink>
            <NavLink 
              to="/book-now" 
              className="sakura-btn text-xl"
              onClick={toggleMenu}
            >
              Book Now
            </NavLink>
          </nav>
        )}
      </header>
      
      <main className="flex-grow pt-21">
        <Outlet />
      </main>
      
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="sakura-container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link to="/" className="font-playfair text-xl font-bold">
                Sakura Lens
              </Link>
              <p className="text-gray-500 mt-2 text-sm">
                Photography with a cherry blossom touch
              </p>
            </div>
            
            <div className="flex space-x-6">
              <a 
                href="#" 
                className="text-gray-500 hover:text-sakura-pink transition-colors hover-float"
                aria-label="Instagram"
              >
                <Instagram aria-hidden="true" />
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-sakura-pink transition-colors hover-float"
                aria-label="Facebook"
              >
                <Facebook aria-hidden="true" />
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-sakura-pink transition-colors hover-float"
                aria-label="Twitter"
              >
                <Twitter aria-hidden="true" />
              </a>
            </div>
          </div>
          
          <div className="border-t border-gray-100 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Sakura Lens. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
