import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/', // form endpoints, nothing to index
    },
    sitemap: 'https://wireish.com/sitemap.xml',
  };
}
