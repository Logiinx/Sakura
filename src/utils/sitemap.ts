/**
 * Sitemap generator utility
 * Generates dynamic sitemap with current dates and proper URLs
 */

export interface SitemapUrl {
  loc: string
  lastmod: string
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  priority: string
}

export const generateSitemapUrls = (baseUrl = "https://www.momb-photographie.fr"): SitemapUrl[] => {
  const currentDate = new Date().toISOString().split("T")[0] // YYYY-MM-DD format

  return [
    {
      loc: baseUrl,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: "1.0",
    },
    {
      loc: `${baseUrl}/galerie`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: "0.9",
    },
    {
      loc: `${baseUrl}/contact`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: "0.8",
    },
    {
      loc: `${baseUrl}/grossesse`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: "0.9",
    },
    {
      loc: `${baseUrl}/famille`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: "0.9",
    },
    {
      loc: `${baseUrl}/bebe`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: "0.9",
    },
    {
      loc: `${baseUrl}/complices`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: "0.9",
    },
    {
      loc: `${baseUrl}/partenaires`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: "0.7",
    },
    {
      loc: `${baseUrl}/mentions-legales`,
      lastmod: currentDate,
      changefreq: "yearly",
      priority: "0.3",
    },
  ]
}

export const generateSitemapXml = (urls: SitemapUrl[]): string => {
  const urlsXml = urls
    .map(
      (url) => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join("")

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlsXml}
</urlset>`
}

// Function to update the sitemap file (for build process)
export const updateSitemap = async (outputPath: string, baseUrl?: string): Promise<void> => {
  const urls = generateSitemapUrls(baseUrl)
  const sitemapXml = generateSitemapXml(urls)

  // This would be used in a build script to write the sitemap
  // For now, we'll just return the XML content
  console.log("Generated sitemap:", sitemapXml)
}
