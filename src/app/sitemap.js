import { locationsData } from '../lib/locationsData';

export default function sitemap() {
  const baseUrl = 'https://stavyadesignconstruction.com';
  
  // Standard pages
  const routes = [
    '',
    '/about',
    '/services',
    '/contact',
    '/features',
    '/build',
    '/join-franchise',
    '/join-designer'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic location pages
  const locationRoutes = locationsData.map((loc) => ({
    url: `${baseUrl}/locations/${loc.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.9, // High priority for local SEO
  }));

  return [...routes, ...locationRoutes];
}
