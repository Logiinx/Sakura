/**
 * Build script to generate sitemap.xml with current dates
 * Run this script during the build process to update the sitemap
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Sitemap configuration
const SITE_URL = "https://sakura-photography.com"
const OUTPUT_PATH = path.join(__dirname, "..", "public", "sitemap.xml")

// Define all pages with their properties
const pages = [
  {
    url: "",
    changefreq: "weekly",
    priority: "1.0",
  },
  {
    url: "/galerie",
    changefreq: "weekly",
    priority: "0.9",
  },
  {
    url: "/contact",
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    url: "/grossesse",
    changefreq: "monthly",
    priority: "0.9",
  },
  {
    url: "/famille",
    changefreq: "monthly",
    priority: "0.9",
  },
  {
    url: "/bebe",
    changefreq: "monthly",
    priority: "0.9",
  },
  {
    url: "/complices",
    changefreq: "monthly",
    priority: "0.9",
  },
  {
    url: "/partenaires",
    changefreq: "monthly",
    priority: "0.7",
  },
  {
    url: "/mentions-legales",
    changefreq: "yearly",
    priority: "0.3",
  },
]

// Generate sitemap XML
function generateSitemap() {
  const currentDate = new Date().toISOString().split("T")[0] // YYYY-MM-DD format

  const urlsXml = pages
    .map(
      (page) => `
  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join("")

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlsXml}
</urlset>`

  return sitemapXml
}

// Write sitemap to file
function writeSitemap() {
  try {
    const sitemapContent = generateSitemap()
    fs.writeFileSync(OUTPUT_PATH, sitemapContent, "utf8")
    console.log("✅ Sitemap generated successfully at:", OUTPUT_PATH)
    console.log("📅 Last modified:", new Date().toISOString().split("T")[0])
  } catch (error) {
    console.error("❌ Error generating sitemap:", error)
    process.exit(1)
  }
}

// Run the script when executed directly
writeSitemap()

export { generateSitemap, writeSitemap }
