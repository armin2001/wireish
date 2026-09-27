import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/i18n/metadata';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/', // form endpoints, nothing to index
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
