import React from "react"

export default function ContactEmailTemplate({
  name,
  email,
  subject,
  message,
}: {
  name: string
  email: string
  subject: string
  message: string
}) {
  return (
    <div className="mx-auto max-w-xl rounded-xl border border-[#ffe0e6] bg-[#f9f9fa] p-6 font-sans text-gray-800">
      <h2 className="text-center font-[cursive] text-2xl font-bold text-gray-800">
        🌸 Nouveau message via le formulaire de contact
      </h2>
      <div className="mx-auto my-4 h-1.5 w-24 rounded-full bg-pink-200" />

      <p className="mb-2">
        <span className="font-semibold">Nom :</span> {name}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Email :</span> {email}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Objet :</span> {subject}
      </p>

      <div className="mt-4 whitespace-pre-line rounded-md border-l-4 border-pink-200 bg-pink-50 p-4">{message}</div>

      <p className="mt-6 text-center text-sm text-gray-500">
        Ce message a été envoyé via le formulaire de contact de votre site.
      </p>
    </div>
  )
}
