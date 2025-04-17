import React, { useState } from "react"
import { FaMapPin, FaPhone, FaEnvelope } from "react-icons/fa"

import { useToast } from "@/hooks/use-toast"

const Contact = () => {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // EmailJS integration would go here
      // Example:
      /*
      await emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        },
        'YOUR_PUBLIC_KEY'
      );
      */

      // For demo purposes, we'll simulate a successful API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Something went wrong",
        description: "Failed to send your message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <section className="py-16 md:py-24">
        <div className="sakura-container">
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Contact Us</h1>
            <div className="mx-auto h-1 w-20 bg-sakura-pink"></div>
            <p className="mx-auto mt-6 max-w-2xl text-gray-600">
              We&apos;d love to hear from you. Fill out the form below, and we&apos;ll get back to you as soon as
              possible.
            </p>
          </div>

          <div className="flex flex-col gap-12 lg:flex-row">
            {/* Contact Info */}
            <div className="lg:w-1/3">
              <div className="rounded-lg bg-sakura-light-gray p-6">
                <h2 className="mb-6 font-playfair text-2xl font-bold">Get In Touch</h2>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="mt-1 flex-shrink-0">
                      <FaMapPin className="text-sakura-pink" />
                    </div>
                    <div className="ml-4">
                      <h3 className="mb-1 font-bold">Location</h3>
                      <p className="text-gray-600">
                        123 Cherry Blossom Avenue
                        <br />
                        Sakura City, SC 10001
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="mt-1 flex-shrink-0">
                      <FaPhone className="text-sakura-pink" />
                    </div>
                    <div className="ml-4">
                      <h3 className="mb-1 font-bold">Phone</h3>
                      <p className="text-gray-600">(123) 456-7890</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="mt-1 flex-shrink-0">
                      <FaEnvelope className="text-sakura-pink" />
                    </div>
                    <div className="ml-4">
                      <h3 className="mb-1 font-bold">Email</h3>
                      <p className="text-gray-600">hello@sakuralens.com</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="mb-3 font-bold">Business Hours</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:w-2/3">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block font-medium">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sakura-pink"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block font-medium">
                      Your Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sakura-pink"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="mb-2 block font-medium">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sakura-pink"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block font-medium">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full resize-none rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sakura-pink"
                    required></textarea>
                </div>

                <div>
                  <button type="submit" className="sakura-btn" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-sakura-light-gray py-16">
        <div className="sakura-container">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold">Find Us</h2>
            <div className="mx-auto h-1 w-20 bg-sakura-pink"></div>
          </div>

          {/* Map Placeholder - In a real project, you'd insert a Google Map or similar here */}
          <div className="flex h-96 w-full items-center justify-center rounded-lg bg-gray-200">
            <p className="text-gray-600">Map would be displayed here</p>
            {/* Alternative: Embed a real map
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12345.67890!2d-73.9877!3d40.7484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwMjUnNDMuNyJOIDczwrA1OScwOC4yIlc!5e0!3m2!1sen!2sus!4v1625761840283!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
            ></iframe>
            */}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
