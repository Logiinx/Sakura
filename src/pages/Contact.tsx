import React, { useState } from "react"
import { FaMapPin, FaPhone, FaEnvelope } from "react-icons/fa"

import ContactEmailTemplate from "@/components/resendcontacttemplate"
import { useToast } from "@/hooks/use-toast"
import { resend } from "@/lib/resend"

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
      // await new Promise((resolve) => setTimeout(resolve, 1000))
      // TODO : VERIFY DOMAIN mombphotographie.f IN RESEND TO TRY TO SEND EMAIL
      await resend.emails.send({
        from: "contact@mombphotographie.fr", // use a verified sender domain
        to: "mombphotographie@gmail.com", // your own address (as you said)
        replyTo: formData.email, // reply to the sender's email
        subject: `🌸 Nouveau message de ${formData.name} – ${formData.subject}`,
        react: (
          <ContactEmailTemplate
            name={formData.name}
            email={formData.email}
            subject={formData.subject}
            message={formData.message}
          />
        ),
      })

      toast({
        title: "Message envoyé !",
        description: "Vous receverez une réponse dès que possible.",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error)
      toast({
        title: "Une erreur est survenue",
        description: "L'envoi de votre message a échoué. Veuillez réessayer.",
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
            <h1 className="mb-4 mt-12 font-bad-script text-4xl font-bold tracking-widest md:text-5xl">Contactez-moi</h1>
            <div className="mx-auto h-1 w-20 bg-sakura-pink"></div>
            <p className="mx-auto mt-6 max-w-2xl text-gray-600">
              N&apos;hésitez pas à me contacter pour parler ensemble de votre projet ou pour toute autre question.
            </p>
          </div>

          <div className="flex flex-col gap-12 lg:flex-row">
            {/* Contact Info */}
            <div className="lg:w-1/3">
              <div className="rounded-lg bg-sakura-light-gray p-6">
                <h2 className="mb-6 font-bad-script text-3xl font-bold tracking-wider">Mes informations</h2>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="mt-1 flex-shrink-0">
                      <FaMapPin className="text-sakura-pink" />
                    </div>
                    <div className="ml-4">
                      <h3 className="mb-1 font-bad-script text-xl font-bold tracking-wider">Emplacement</h3>
                      <p className="text-gray-600">
                        Cazouls-lès-Béziers
                        <br />
                        Hérault (34370)
                        <br />
                        France
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="mt-1 flex-shrink-0">
                      <FaPhone className="text-sakura-pink" />
                    </div>
                    <div className="ml-4">
                      <h3 className="mb-1 font-bad-script text-xl font-bold tracking-wider">Téléphone</h3>
                      <p className="text-gray-600">06 03 74 98 93</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="mt-1 flex-shrink-0">
                      <FaEnvelope className="text-sakura-pink" />
                    </div>
                    <div className="ml-4">
                      <h3 className="mb-1 font-bad-script text-xl font-bold tracking-wider">E-mail</h3>
                      <p className="text-gray-600">mombphotographie@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:w-2/3">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block font-medium">
                      Votre nom <span className="text-red-500">*</span>
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
                      Votre e-mail <span className="text-red-500">*</span>
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
                    Objet <span className="text-red-500">*</span>
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
                    Votre message <span className="text-red-500">*</span>
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
                    {isSubmitting ? "Envoi..." : "Envoyer message"}
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
            <h2 className="mb-4 text-3xl font-bold">Sur la carte</h2>
            <div className="mx-auto h-1 w-20 bg-sakura-pink"></div>
          </div>

          {/* Map Placeholder */}
          <div className="flex h-96 w-full items-center justify-center rounded-lg bg-gray-200">
            <iframe
              src="https://maps.google.com/maps?width=100%&amp;height=100%&amp;hl=en&amp;q=Cazouls-lès-Béziers&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"></iframe>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
