export const SITE = {
  name: 'Wireish',
  url: 'https://wireish.com',
  // TODO: confirm this address has an inbox before launch (it is currently the Resend "from" identity).
  email: 'contact@wireish.com',
  instagram: 'https://www.instagram.com/wireish/',
  linkedin: 'https://www.linkedin.com/in/ahmed-ma%C5%A1ala-b97524261/',
  // TODO: replace with the Wireish profile URL.
  x: 'https://x.com',
} as const;

export const NAV_LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/canvas', label: 'Canvas' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
] as const;

export const DEMO_HREF = '/book-a-demo';
