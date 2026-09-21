import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Ako nekad želiš sakriti neku stranicu od Google-a, koristiš disallow:
      // disallow: '/private-folder/',
    },
    sitemap: 'https://wireish.com/sitemap.xml',
  };
}