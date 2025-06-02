/**
 * SEOHead Component
 *
 * This component provides dynamic meta tags and structured data for SEO optimization.
 * It can be used on different pages to set page-specific SEO metadata.
 */

import { Helmet } from "react-helmet-async"

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  canonicalUrl?: string
  structuredData?: object
  noIndex?: boolean
}

/**
 * SEOHead component for managing page-specific SEO metadata
 * @param props - SEO configuration options
 */
export const SEOHead: React.FC<SEOHeadProps> = ({
  title = "MOM.B Photographie | Séance photo grossesse, famille, bébé, mariage",
  description = "Bienvenue sur MOM.B | Capturer l'émotion d'un instant, figer un regard, une complicité, une histoire... Chez MOM.B, la photographie est bien plus qu'une image : c'est un souvenir intemporel, un moment de vie sublimé. Spécialiste de la photographie de famille, de grossesse, de bébé et de mariage, je mets tout mon coeur.",
  keywords = "photographie, grossesse, famille, bébé, mariage, séance photo, photographe professionnel",
  ogTitle,
  ogDescription,
  ogImage = "https://mjlgssaipclicfybxjnj.supabase.co/storage/v1/object/public/assets/public/og-image.webp",
  ogUrl = "https://www.momb-photographie.fr",
  twitterTitle,
  twitterDescription,
  twitterImage,
  canonicalUrl = "https://www.momb-photographie.fr",
  structuredData,
  noIndex = false,
}) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="MOM.B" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:site_name" content="MOM.B" />

      {/* Twitter */}
      <meta name="twitter:title" content={twitterTitle || title} />
      <meta name="twitter:description" content={twitterDescription || description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@mom.b" />
      <meta name="twitter:image" content={twitterImage || ogImage} />

      {/* Structured Data */}
      {structuredData && <script type="application/ld+json">{JSON.stringify(structuredData)}</script>}
    </Helmet>
  )
}

/**
 * Default structured data for the main business
 */
export const getBusinessStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://www.momb-photographie.fr/",
  name: "MOM.B Photographie",
  description:
    "Photographe professionnelle spécialisée en séances photo grossesse, famille, bébé et mariage. Capturer l'émotion d'un instant, figer un regard, une complicité, une histoire.",
  url: "https://www.momb-photographie.fr",
  logo: "https://mjlgssaipclicfybxjnj.supabase.co/storage/v1/object/public/assets/public/og-image.webp",
  image: "https://mjlgssaipclicfybxjnj.supabase.co/storage/v1/object/public/assets/public/og-image.webp",
  telephone: "+33-603749893",
  email: "contact@momb-photographie.fr",
  address: {
    "@type": "15 lotissement le Recpharès",
    addressLocality: "Cazouls-lès-Béziers",
    addressRegion: "Hérault",
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "43.392108",
    longitude: "3.101108",
  },
  openingHours: "Mo-Sa 09:00-18:00", // TODO: Add real opening hours
  priceRange: "€€",
  serviceArea: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: "43.392108",
      longitude: "3.101108",
    },
    geoRadius: "50000", // 50km radius
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services de Photographie",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Séance Photo Grossesse",
          description: "Immortalisez cette période unique avec des photos de grossesse artistiques et émouvantes.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Séance Photo Famille",
          description: "Capturez les moments précieux en famille avec des photos naturelles et authentiques.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Séance Photo Bébé",
          description: "Photographiez les premiers moments de votre bébé avec tendresse et créativité.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Séance Photo Mariage",
          description: "Immortalisez votre jour J avec des photos de mariage romantiques et intemporelles.",
        },
      },
    ],
  },
  sameAs: [
    "https://www.facebook.com/mombphotographie",
    "https://www.instagram.com/mombphotographie",
    "https://www.tiktok.com/@mombphotographie",
  ],
})

/**
 * Photographer person structured data
 */
export const getPhotographerStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://www.momb-photographie.fr/",
  name: "MOM.B",
  jobTitle: "Photographe Professionnelle",
  description: "Photographe spécialisée en photographie de grossesse, famille, bébé et mariage.",
  url: "https://www.momb-photographie.fr",
  image: "https://mjlgssaipclicfybxjnj.supabase.co/storage/v1/object/public/assets/public/og-image.webp",
  telephone: "+33-603749893",
  email: "contact@momb-photographie.fr",
  worksFor: {
    "@id": "https://www.momb-photographie.fr/",
  },
  sameAs: [
    "https://www.facebook.com/mombphotographie",
    "https://www.instagram.com/mombphotographie",
    "https://www.tiktok.com/@mombphotographie",
  ],
})

/**
 * Website structured data
 */
export const getWebsiteStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.momb-photographie.fr",
  url: "https://www.momb-photographie.fr",
  name: "MOM.B Photographie",
  description: "Site officiel de MOM.B Photographie - Séances photo grossesse, famille, bébé et mariage",
  publisher: {
    "@id": "https://www.momb-photographie.fr",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.momb-photographie.fr",
    },
    "query-input": "required name=search_term_string",
  },
})
