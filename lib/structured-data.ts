import { SITE } from '@/lib/content';
import { LOCALE_META, type Locale } from '@/lib/i18n/config';
import { SITE_URL } from '@/lib/i18n/metadata';
import { TEAM, localized } from '@/lib/team';

/** Serializes JSON-LD for a <script> tag; escaping `<` stops a "</script>" in the copy from closing it early. */
export function jsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/**
 * Who runs the site and what it is called, for the home page. Search engines take the
 * WebSite name for the site name above each result, and the Organization for the brand's
 * logo, profiles and knowledge panel. `url` is the domain root, as Google requires.
 */
export function homeStructuredData(locale: Locale, description: string) {
  const organization = `${SITE_URL}/#organization`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organization,
        name: SITE.name,
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/icon.png`,
        description,
        email: SITE.email,
        // Company profiles only: SITE.linkedin is a founder's page and SITE.x is still a placeholder.
        sameAs: [SITE.instagram],
        founder: TEAM.filter((member) => /founder/i.test(member.role.en)).map((member) => ({
          '@type': 'Person',
          name: member.name,
          jobTitle: localized(member.role, locale),
          ...(member.linkedin ? { sameAs: [member.linkedin] } : {}),
        })),
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE.name,
        url: `${SITE_URL}/`,
        inLanguage: LOCALE_META[locale].htmlLang,
        publisher: { '@id': organization },
      },
    ],
  };
}
