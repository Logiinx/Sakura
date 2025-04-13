
import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Clock, Heart, Award } from 'lucide-react';

const Index = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
        <div className="sakura-container relative z-10 text-white">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6">
            Sakura Lens
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-lg font-light">
            Capturing moments with the delicate beauty of cherry blossoms.
          </p>
          <Link to="/book-now" className="sakura-btn inline-block hover-float">
            Book a Session
          </Link>
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="sakura-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Our Vision</h2>
            <div className="section-divider"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="p-6 text-center hover-scale">
              <div className="w-14 h-14 bg-sakura-light-pink rounded-full flex items-center justify-center mx-auto mb-5">
                <Camera className="text-sakura-pink" />
              </div>
              <h3 className="font-playfair text-xl font-bold mb-3">Elegance</h3>
              <p className="text-gray-600">Clean and minimalist compositions that highlight the subject.</p>
            </div>
            
            <div className="p-6 text-center hover-scale">
              <div className="w-14 h-14 bg-sakura-light-pink rounded-full flex items-center justify-center mx-auto mb-5">
                <Clock className="text-sakura-pink" />
              </div>
              <h3 className="font-playfair text-xl font-bold mb-3">Timing</h3>
              <p className="text-gray-600">Capturing those fleeting moments that tell your unique story.</p>
            </div>
            
            <div className="p-6 text-center hover-scale">
              <div className="w-14 h-14 bg-sakura-light-pink rounded-full flex items-center justify-center mx-auto mb-5">
                <Heart className="text-sakura-pink" />
              </div>
              <h3 className="font-playfair text-xl font-bold mb-3">Emotion</h3>
              <p className="text-gray-600">Emphasizing genuine emotions and authentic connections.</p>
            </div>
            
            <div className="p-6 text-center hover-scale">
              <div className="w-14 h-14 bg-sakura-light-pink rounded-full flex items-center justify-center mx-auto mb-5">
                <Award className="text-sakura-pink" />
              </div>
              <h3 className="font-playfair text-xl font-bold mb-3">Quality</h3>
              <p className="text-gray-600">Professional retouching and high-resolution delivery.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Work */}
      <section className="py-20 md:py-28 bg-sakura-light-gray">
        <div className="sakura-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Featured Gallery</h2>
            <div className="section-divider"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="overflow-hidden rounded-md hover-scale">
              <img 
                src="https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=600&q=80" 
                alt="Orange flowers" 
                className="w-full h-80 object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="overflow-hidden rounded-md hover-scale">
              <img 
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" 
                alt="Body of water surrounded by trees" 
                className="w-full h-80 object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="overflow-hidden rounded-md hover-scale">
              <img 
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80" 
                alt="Mountain hit by sun rays" 
                className="w-full h-80 object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
          
          <div className="text-center mt-14">
            <Link to="/gallery" className="px-6 py-3 border border-sakura-pink text-sakura-pink rounded-md hover:bg-sakura-pink hover:text-white transition-all duration-300 font-medium hover-float">
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="sakura-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for Your Session?</h2>
          <div className="section-divider"></div>
          <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto mt-6">
            Let us help you capture memories that bloom eternally.
          </p>
          <Link to="/book-now" className="sakura-btn inline-block hover-float">
            Book Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
