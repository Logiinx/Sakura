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
        <div className="absolute inset-0 bg-[url('@/assets/cropped-camera-581126_1920.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
        <div className="sakura-container relative z-10 text-center text-white">
          <h1 className="text-shadow-md font-bad-script text-4xl font-bold tracking-widest text-sakura-pink md:text-5xl">
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
                <p>SIRET : 98009342100017</p>
                <p>Email : contact@momb-photographie.fr</p>
                <p>Téléphone : 06 03 74 98 93</p>
              </div>
            </div>

            {/* Hosting Section */}
            <div>
              <h2 className="mb-4 font-playfair text-2xl font-bold text-sakura-dark-text">Hébergement</h2>
              <div className="space-y-2 text-gray-600">
                <p>Ce site est hébergé par :</p>
                <p>Nom de l&apos;hébergeur : o2switch</p>
                <p>Adresse : 222-224 Boulevard Gustave Flaubert, 63000 Clermont-Ferrand, France</p>
                <p>SIRET : 510 909 807 00024</p>
              </div>
            </div>

            {/* Intellectual Property Section */}
            <div>
              <h2 className="mb-4 font-playfair text-2xl font-bold text-sakura-dark-text">Propriété Intellectuelle</h2>
              <div className="space-y-2 text-gray-600">
                <p>
                  L&apos;ensemble des éléments visuels et textuels de ce site, y compris les marques, logos, icônes,
                  infographies, photographies, et autres contenus, fait l&apos;objet d&apos;un dépôt INPI-SOLEAU et est
                  protégé par la législation française et internationale sur le droit d&apos;auteur et la propriété
                  intellectuelle. Toute utilisation, reproduction, ou représentation, par quelque procédé que ce soit et
                  sur quelque support que ce soit, de tout ou partie du site et/ou des éléments qui le composent, est
                  interdite sans le consentement exprès de MOMB Photographie.
                </p>
              </div>
            </div>

            {/* Personal Data Section */}
            <div>
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
            </div>

            {/* Cookies Section */}
            <div>
              <h2 className="mb-4 font-playfair text-2xl font-bold text-sakura-dark-text">Cookies</h2>
              <div className="space-y-2 text-gray-600">
                <p>
                  Ce site utilise des cookies pour améliorer l&apos;expérience utilisateur. En poursuivant votre
                  navigation sur ce site, vous acceptez l&apos;utilisation de ces cookies. Vous pouvez gérer vos
                  préférences de cookies via les paramètres de votre navigateur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default MentionsLegales
