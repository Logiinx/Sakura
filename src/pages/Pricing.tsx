
import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const PricingCard = ({ 
  title, 
  price, 
  description, 
  features, 
  isPopular = false 
}: { 
  title: string; 
  price: string; 
  description: string; 
  features: string[];
  isPopular?: boolean;
}) => {
  return (
    <div className={`flex flex-col h-full p-6 rounded-lg shadow-sm transition-shadow hover:shadow-md border ${isPopular ? 'border-sakura-pink' : 'border-gray-200'}`}>
      {isPopular && (
        <div className="py-1 px-4 bg-sakura-pink text-white text-sm font-medium self-start rounded-full mb-4">
          Most Popular
        </div>
      )}
      <h3 className="font-playfair text-2xl font-bold">{title}</h3>
      <div className="mt-4 mb-6">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-gray-600 ml-1">/ session</span>
      </div>
      <p className="text-gray-600 mb-6">{description}</p>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check size={18} className="text-sakura-pink mr-2 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link 
        to="/book-now" 
        className={`mt-auto text-center py-2 px-4 rounded-md transition-colors ${
          isPopular 
            ? 'bg-sakura-pink text-white hover:bg-opacity-90' 
            : 'border border-sakura-pink text-sakura-pink hover:bg-sakura-pink hover:text-white'
        }`}
      >
        Book Now
      </Link>
    </div>
  );
};

const Pricing = () => {
  return (
    <div className="animate-fade-in">
      <section className="py-16 md:py-24 bg-white">
        <div className="sakura-container">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Photography Packages</h1>
            <div className="h-1 w-20 bg-sakura-pink mx-auto"></div>
            <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
              Choose the perfect photography package for your needs. All packages include professional editing and digital delivery.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard 
              title="Basic"
              price="$199"
              description="Perfect for individual portraits and small shoots."
              features={[
                "1-hour session",
                "1 location",
                "15 edited digital photos",
                "Online gallery",
                "Digital download"
              ]}
            />
            
            <PricingCard 
              title="Standard"
              price="$349"
              description="Ideal for couples, families, and engagement sessions."
              features={[
                "2-hour session",
                "2 locations",
                "30 edited digital photos",
                "Online gallery",
                "Digital download",
                "5 physical prints (8×10)"
              ]}
              isPopular
            />
            
            <PricingCard 
              title="Premium"
              price="$599"
              description="Our comprehensive package for special events and full photoshoots."
              features={[
                "4-hour session",
                "Multiple locations",
                "50+ edited digital photos",
                "Online gallery",
                "Digital download",
                "10 physical prints (8×10)",
                "Custom photo album"
              ]}
            />
          </div>
        </div>
      </section>
      
      {/* Additional Services */}
      <section className="py-16 bg-sakura-light-gray">
        <div className="sakura-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Additional Services</h2>
            <div className="h-1 w-20 bg-sakura-pink mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-playfair text-xl font-bold mb-4">À La Carte Options</h3>
              <ul className="space-y-3">
                <li className="flex justify-between pb-2 border-b border-gray-100">
                  <span>Extra hour</span>
                  <span className="font-medium">$75</span>
                </li>
                <li className="flex justify-between pb-2 border-b border-gray-100">
                  <span>Additional edited photos (per 10)</span>
                  <span className="font-medium">$50</span>
                </li>
                <li className="flex justify-between pb-2 border-b border-gray-100">
                  <span>Extra location</span>
                  <span className="font-medium">$40</span>
                </li>
                <li className="flex justify-between pb-2 border-b border-gray-100">
                  <span>Rush editing (48 hours)</span>
                  <span className="font-medium">$100</span>
                </li>
                <li className="flex justify-between">
                  <span>Second photographer</span>
                  <span className="font-medium">$200</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-playfair text-xl font-bold mb-4">Print & Product Options</h3>
              <ul className="space-y-3">
                <li className="flex justify-between pb-2 border-b border-gray-100">
                  <span>Additional 8×10 prints (each)</span>
                  <span className="font-medium">$15</span>
                </li>
                <li className="flex justify-between pb-2 border-b border-gray-100">
                  <span>Canvas print 16×20</span>
                  <span className="font-medium">$95</span>
                </li>
                <li className="flex justify-between pb-2 border-b border-gray-100">
                  <span>Custom photo album (20 pages)</span>
                  <span className="font-medium">$150</span>
                </li>
                <li className="flex justify-between pb-2 border-b border-gray-100">
                  <span>Digital slideshow</span>
                  <span className="font-medium">$75</span>
                </li>
                <li className="flex justify-between">
                  <span>USB drive with all images</span>
                  <span className="font-medium">$40</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="sakura-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="h-1 w-20 bg-sakura-pink mx-auto"></div>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h3 className="font-playfair text-xl font-bold mb-2">How do I schedule a session?</h3>
              <p className="text-gray-600">
                You can book directly through our website by visiting the "Book Now" page, or contact us
                via email or phone to discuss your specific needs.
              </p>
            </div>
            
            <div className="mb-8">
              <h3 className="font-playfair text-xl font-bold mb-2">What should I wear to my photo session?</h3>
              <p className="text-gray-600">
                We recommend wearing solid colors and avoiding busy patterns. Once you book, we'll send you a detailed guide
                with suggestions based on your specific photoshoot.
              </p>
            </div>
            
            <div className="mb-8">
              <h3 className="font-playfair text-xl font-bold mb-2">How long until I receive my photos?</h3>
              <p className="text-gray-600">
                For standard editing, you'll receive your photos within 2 weeks. Rush editing is available for an additional fee.
              </p>
            </div>
            
            <div>
              <h3 className="font-playfair text-xl font-bold mb-2">Do you offer mini sessions?</h3>
              <p className="text-gray-600">
                Yes, we offer seasonal mini sessions throughout the year. Follow us on social media or join our mailing list to be notified.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
