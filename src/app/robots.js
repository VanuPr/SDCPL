export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/'], // Hide admin dashboards from crawlers
    },
    sitemap: 'https://stavyadesignconstruction.com/sitemap.xml',
  }
}
