import React from "react"

/**
 * src/pages/MentionsLegales.tsx
 *
 * This component renders the legal notices page of the application.
 * It follows the website's design theme while presenting legal information.
 */

const MentionsLegales: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative flex h-96 items-center bg-sakura-dark-text">
        <div className="absolute inset-0 bg-[url('https://mjlgssaipclicfybxjnj.supabase.co/storage/v1/object/public/assets/camera404.webp')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
        <div className="sakura-container relative z-10 text-center text-white">
          <h1 className="font-bad-script text-4xl font-bold tracking-widest text-sakura-pink text-shadow-md md:text-5xl">
            Mentions Légales
          </h1>
        </div>
      </section>

      {/* Legal Content Section */}
      <section className="bg-white py-16">
        <div className="sakura-container">
          <div className="mx-auto max-w-3xl space-y-8">
            {/* Identity Section */}
            <div>
              <h2 className="mb-4 font-playfair text-2xl font-bold text-sakura-dark-text">Identité</h2>
              <div className="space-y-2 text-gray-600">
                <p>Nom de l&apos;entreprise : MOM.B Photographie</p>
                <p>Forme juridique : Entreprise individuelle</p>
                <p>Siège social : 15 lotissement le Recpharès, 34370 Cazouls-lès-Béziers</p>
                <p>SIRET : 980 093 421 00017</p>
                <p>Email : contact@momb-photographie.fr</p>
                <p>Téléphone : 06 03 74 98 93</p>
              </div>
            </div>

            {/* Hosting Section */}
            <div>
              <h2 className="mb-4 font-playfair text-2xl font-bold text-sakura-dark-text">Hébergement</h2>
              <div className="space-y-2 text-gray-600">
                <p>Nom de l&apos;hébergeur : Vercel</p>
                <p>Raison sociale : Vercel Inc.</p>
                <p>Adresse : 440 N Barranca Ave #4133 Covina, CA 91723, USA.</p>
                <p>Téléphone : +1 559 288 7060</p>
              </div>
            </div>

            {/* Intellectual Property Section */}
            <div>
              <h2 className="mb-4 font-playfair text-2xl font-bold text-sakura-dark-text">Propriété Intellectuelle</h2>
              <div className="space-y-2 text-gray-600">
                <p>
                  Toutes les photographies et les textes présents sur ce site sont la propriété exclusive de MOM.B
                  Photographie et sont protégés par le Code de la propriété intellectuelle (loi n°92-597 du 1er juillet
                  1992).
                </p>
                <p>
                  Toute reproduction, représentation, modification, ou utilisation, totale ou partielle, des contenus du
                  site, par quelque procédé que ce soit et sur quelque support que ce soit, est strictement interdite
                  sans l&apos;autorisation écrite préalable de MOM.B Photographie.
                </p>
              </div>
            </div>

            {/* Personal Data Section */}
            {/* <div>
              <h2 className="mb-4 font-playfair text-2xl font-bold text-sakura-dark-text">
                Protection des Données Personnelles
              </h2>
              <div className="space-y-2 text-gray-600">
                <p>
                  Conformément à la loi « Informatique et Libertés » du 6 janvier 1978 modifiée et au Règlement Général
                  sur la Protection des Données (RGPD), vous disposez d&apos;un droit d&apos;accès, de rectification, de
                  suppression, et d&apos;opposition aux données personnelles vous concernant. Les données collectées via
                  le formulaire de contact sont traitées avec la plus stricte confidentialité et ne sont conservées que
                  pour la durée nécessaire à leur traitement.
                </p>
                <p>
                  La collecte, l&apos;enregistrement, et la conservation automatisés d&apos;informations nominatives
                  sont effectués dans le cadre d&apos;une déclaration auprès de la Commission Nationale de
                  l&apos;Informatique et des Libertés (CNIL).
                </p>
                <p>
                  Pour exercer vos droits ou pour toute question sur le traitement de vos données, vous pouvez nous
                  contacter à l&apos;adresse suivante : contact@momb-photographie.fr.
                </p>
              </div>
            </div> */}

            {/* Cookies Section */}
            {/* <div>
              <h2 className="mb-4 font-playfair text-2xl font-bold text-sakura-dark-text">Cookies</h2>
              <div className="space-y-2 text-gray-600">
                <p>
                  Ce site utilise des cookies pour améliorer l&apos;expérience utilisateur. En poursuivant votre
                  navigation sur ce site, vous acceptez l&apos;utilisation de ces cookies. Vous pouvez gérer vos
                  préférences de cookies via les paramètres de votre navigateur.
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </section>
    </div>
  )
}

export default MentionsLegales
