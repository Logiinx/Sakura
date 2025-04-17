import React from "react"
import { FaCheck } from "react-icons/fa"
import { Link } from "react-router-dom"

const PricingCard = ({
  title,
  price,
  description,
  features,
  isPopular = false,
}: {
  title: string
  price: string
  description: string
  features: string[]
  isPopular?: boolean
}) => {
  return (
    <div
      className={`flex h-full flex-col rounded-lg border p-6 shadow-sm transition-shadow hover:shadow-md ${
        isPopular ? "border-sakura-pink" : "border-gray-200"
      }`}>
      {isPopular && (
        <div className="mb-4 self-start rounded-full bg-sakura-pink px-4 py-1 text-sm font-medium text-white">
          Most Popular
        </div>
      )}
      <h3 className="font-playfair text-2xl font-bold">{title}</h3>
      <div className="mb-6 mt-4">
        <span className="text-4xl font-bold">{price}</span>
        <span className="ml-1 text-white">/ session</span>
      </div>
      <p className="mb-6 text-white">{description}</p>
      <ul className="mb-8 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <FaCheck size={18} className="mr-2 flex-shrink-0 text-sakura-pink" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        to="/book-now"
        className={`mt-auto rounded-md px-4 py-2 text-center transition-colors ${
          isPopular
            ? "bg-sakura-pink text-white hover:bg-opacity-90"
            : "border border-sakura-pink text-sakura-pink hover:bg-sakura-pink hover:text-white"
        }`}>
        Book Now
      </Link>
    </div>
  )
}

const Pricing = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-[url('https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center py-16 md:py-24">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Content Container */}
        <div className="sakura-container relative z-10">
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">Photography Packages</h1>
            <div className="mx-auto h-1 w-20 bg-sakura-pink"></div>
            <p className="mx-auto mt-6 max-w-2xl text-white">
              Choose the perfect photography package for your needs. All packages include professional editing and
              digital delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 text-white md:grid-cols-3">
            <PricingCard
              title="Basic"
              price="$199"
              description="Perfect for individual portraits and small shoots."
              features={[
                "1-hour session",
                "1 location",
                "15 edited digital photos",
                "Online gallery",
                "Digital download",
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
                "5 physical prints (8×10)",
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
                "Custom photo album",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Additional Services Section (Now correctly positioned below the hero) */}
      <section className="bg-sakura-light-gray py-16">
        <div className="sakura-container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Additional Services</h2>
            <div className="mx-auto h-1 w-20 bg-sakura-pink"></div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-playfair text-xl font-bold">À La Carte Options</h3>
              <ul className="space-y-3">
                <li className="flex justify-between border-b border-gray-100 pb-2">
                  <span>Extra hour</span>
                  <span className="font-medium">$75</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 pb-2">
                  <span>Additional edited photos (per 10)</span>
                  <span className="font-medium">$50</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 pb-2">
                  <span>Extra location</span>
                  <span className="font-medium">$40</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 pb-2">
                  <span>Rush editing (48 hours)</span>
                  <span className="font-medium">$100</span>
                </li>
                <li className="flex justify-between">
                  <span>Second photographer</span>
                  <span className="font-medium">$200</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-playfair text-xl font-bold">Print & Product Options</h3>
              <ul className="space-y-3">
                <li className="flex justify-between border-b border-gray-100 pb-2">
                  <span>Additional 8×10 prints (each)</span>
                  <span className="font-medium">$15</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 pb-2">
                  <span>Canvas print 16×20</span>
                  <span className="font-medium">$95</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 pb-2">
                  <span>Custom photo album (20 pages)</span>
                  <span className="font-medium">$150</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 pb-2">
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

      {/* FAQ Section (Now correctly positioned below additional services) */}
      <section className="bg-white py-16 md:py-24">
        <div className="sakura-container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Frequently Asked Questions</h2>
            <div className="mx-auto h-1 w-20 bg-sakura-pink"></div>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="mb-8">
              <h3 className="mb-2 font-playfair text-xl font-bold">How do I schedule a session?</h3>
              <p className="text-gray-600">
                You can book directly through our website by visiting the &quot;Book Now&quot; page, or contact us via
                email or phone to discuss your specific needs.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="mb-2 font-playfair text-xl font-bold">What should I wear to my photo session?</h3>
              <p className="text-gray-600">
                We recommend wearing solid colors and avoiding busy patterns. Once you book, we&apos;ll send you a
                detailed guide with suggestions based on your specific photoshoot.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="mb-2 font-playfair text-xl font-bold">How long until I receive my photos?</h3>
              <p className="text-gray-600">
                For standard editing, you&apos;ll receive your photos within 2 weeks. Rush editing is available for an
                additional fee.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-playfair text-xl font-bold">Do you offer mini sessions?</h3>
              <p className="text-gray-600">
                Yes, we offer seasonal mini sessions throughout the year. Follow us on social media or join our mailing
                list to be notified.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Pricing
