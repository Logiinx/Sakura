import { Card } from "@/components/ui/card"

/**
 * Partner interface defining the structure of partner data
 */
interface Partner {
  id: string
  name: string
  description: string
  logo: string
  website: string
  category?: string
}

/**
 * Sample partners data - replace with actual data from your database
 */
const partners: Partner[] = [
  {
    id: "1",
    name: "Rosemood Atelier",
    description:
      "MOM.B travaille en collaboration avec Rosemood Atelier pour vos impressions de faire-part, album-photo ou tirage-photo. Bénéficiez de réduction sur vos commandes avec un code-promo pour toute séance effectuée avec MOM.B.",
    logo: "https://mjlgssaipclicfybxjnj.supabase.co/storage/v1/object/public/assets/partenaires/rosemoodlogo.webp",
    website: "https://www.rosemood.fr",
    category: "Impression",
  },
  // Add more partners here as needed
]

/**
 * PartnerCard component for displaying individual partner information in horizontal layout
 */
const PartnerCard = ({ partner }: { partner: Partner }) => {
  const handleWebsiteClick = () => {
    window.open(partner.website, "_blank", "noopener,noreferrer")
  }

  return (
    <Card
      onClick={handleWebsiteClick}
      className="group cursor-pointer transition-all duration-100 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center p-6">
        {/* Logo Section */}
        <div className="mr-6 flex-shrink-0">
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={partner.logo}
              alt={`${partner.name} logo`}
              className="h-auto max-h-32 w-auto max-w-96 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg"
              }}
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <h3 className="font-bad-script text-xl font-bold tracking-widest text-sakura-dark-text">
                  {partner.name}
                </h3>
                {partner.category && (
                  <span className="inline-block rounded-full bg-[#607D8B] px-3 py-1 text-xs font-medium text-white">
                    {partner.category}
                  </span>
                )}
              </div>
              <p className="mb-4 text-sm leading-relaxed text-gray-600">{partner.description}</p>
              {/* <button
                onClick={handleWebsiteClick}
                className="inline-flex items-center gap-2 rounded-lg bg-sakura-pink px-4 py-2 text-sm font-medium text-white transition-colors duration-100 text-shadow-md hover:bg-sakura-pink/90 focus:outline-none focus:ring-2 focus:ring-sakura-pink focus:ring-offset-2">
                <span>Visiter le site</span>
                <FaExternalLinkAlt className="h-4 w-4" />
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

const Partenaires = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative flex h-96 items-center bg-sakura-dark-text">
        <div className="absolute inset-0 bg-[url('https://mjlgssaipclicfybxjnj.supabase.co/storage/v1/object/public/assets/camera404.webp')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="sakura-container relative z-10 text-center text-white">
          <h1 className="font-bad-script text-4xl font-bold tracking-widest text-sakura-pink text-shadow-md md:text-5xl">
            Nos Partenaires
          </h1>
          <p className="mt-4 text-lg text-white/90">Découvrez nos collaborateurs de confiance</p>
        </div>
      </section>

      {/* Partners Section */}
      <section className="sakura-container py-8">
        {/* <div className="mb-12 text-center">
          <h2 className="mb-4 font-bad-script text-3xl font-bold tracking-wide text-sakura-dark-text">
            Nos Collaborateurs
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Nous travaillons avec des partenaires de qualité pour vous offrir les meilleurs services et produits.
          </p>
        </div> */}

        {partners.length > 0 ? (
          <div className="space-y-6">
            {partners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">Aucun partenaire à afficher pour le moment.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default Partenaires
