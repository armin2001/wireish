# Wireish update: languages, splash, team and careers

This package builds on the overhaul you already deployed. Copy the folders over the project
root (every file is new or a full replacement), then delete the old root pages listed in
step 2. No new npm packages, no new environment variables.

## 1. What's new

- **8 languages** on every page, under a prefix: `/en`, `/bs`, `/de`, `/fr`, `/es`, `/sv`,
  `/ja`, `/ko`. `proxy.ts` redirects anything without a prefix (`/`, `/pricing`, old
  bookmarks) to the saved language, then the browser language, then English.
  Croatian/Serbian/Montenegrin browsers get Bosnian; Norwegian browsers get Swedish.
- **Language switcher** in the navbar (SVG flags, keyboard accessible) and in the mobile
  drawer. The choice is stored in the `NEXT_LOCALE` cookie for a year.
- **Splash screen** on the first page view of a browser session (1.1 to 4.2 s, driven by
  fonts, page load and the 3D scene chunk). Hidden before first paint for repeat visitors;
  failsafes make sure it can never stay stuck.
- **/team** and **/careers**, with Careers linked from the footer and the mobile drawer.
- **Mobile**: the menu is a right-hand drawer you can swipe closed; team cards are a
  swipeable carousel; the canvas has a floating selection bar (duplicate, delete, clear)
  so those actions work without a keyboard.
- **Localized everywhere else**: metadata with hreflang alternates, the sitemap (every page
  × every language), dates and numbers, form errors, the 404 page, FAQ structured data,
  the 3D scene labels, and the booking confirmation email and calendar file.
- The team emails stay in Bosnian and now show which language the visitor used. The canvas
  map now travels as structured data and is described in English for the team.

## 2. Delete the old root pages

The root layout moved to `app/[locale]/layout.tsx`. Next.js refuses to build with both,
so remove the old ones (API routes, `globals.css`, `sitemap.ts` and `robots.ts` stay):

```bash
rm app/layout.tsx app/page.tsx app/template.tsx app/not-found.tsx
rm -r app/services app/canvas app/contact app/book-a-demo app/pricing app/privacy app/terms
```

On Windows PowerShell:

```powershell
Remove-Item app\layout.tsx, app\page.tsx, app\template.tsx, app\not-found.tsx
Remove-Item -Recurse app\services, app\canvas, app\contact, app\book-a-demo, app\pricing, app\privacy, app\terms
```

Your `app` folder should then contain only `[locale]/`, `api/`, `globals.css`,
`robots.ts` and `sitemap.ts`.

## 3. Fill in before launch

- **Team** (`lib/team.ts`): the role and bio text are placeholders. Write your own, add or
  remove people, optionally add square photos in `public/team/` (`photo: '/team/armin.jpg'`).
  Translations per field are optional; missing ones fall back to English.
- **Open roles** (`lib/careers.ts`): empty for now, so the careers page shows an open
  application and the footer shows no "Hiring" badge. There's a commented example entry.
- **Copy to confirm**: the Team "How we work" values and the Careers "Why Wireish" points
  are based on your existing site copy; make sure they're accurate.
- **Translations**: all text lives in `lib/i18n/dictionaries/*.ts`. They're solid drafts;
  have native speakers review Korean, Japanese and Swedish before launch. TypeScript fails
  the build if any language misses a key, so partial edits are safe.
- **Legal pages** stay in English in every language, with a translated note that the
  English version is binding.
- Still open from last time: `LAST_UPDATED` in the privacy and terms pages, `SITE.x` in
  `lib/content.ts`, an inbox for booking@wireish.com, and a privacy policy that describes
  what the site collects.

## 4. How to add or change text

- Edit `lib/i18n/dictionaries/en.ts`, then the same key in the other seven files.
- Keep `{placeholders}` exactly as they are in English.
- Server components receive the dictionary as `t`; client components call
  `const { t, locale } = useI18n()`.
- Write internal links without a language (`href="/contact"`): `TransitionLink`,
  `ButtonLink` and `useTransitionRouter` add the current one.

## 5. Notes

- `proxy.ts` is the Next.js 16 name for middleware. On Next 15 or older, rename the file to
  `middleware.ts` and the function to `middleware`.
- Korean and Japanese use the visitor's system font (Apple SD Gothic Neo / Malgun Gothic,
  Hiragino / Yu Gothic); nothing extra is downloaded.
- The splash covers the first paint once per session. If your Lighthouse score on first
  visits matters more than the intro, remove `<SplashScreen />` from the layout.

## 6. Verify

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Then check: `/` redirects to your language; the flag menu switches language on the same
page (try `/de/pricing` → Français); the splash plays once in a new tab and not on reload;
the mobile drawer closes with a right swipe; `/team` swipes on a phone; `/careers` →
"Send an open application" opens the contact form with Careers selected; the canvas
selection bar deletes a node on touch; a booking in Japanese sends a Japanese confirmation
email; and `/de/does-not-exist` shows the German 404.
