import type { Metadata } from 'next';
import { Bot, Eye, Users } from 'lucide-react';
import { TeamShowcase } from '@/components/team/TeamShowcase';
import { ButtonLink } from '@/components/ui/Button';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { pageMetadata } from '@/lib/i18n/metadata';
import { localeFrom, type LocaleParams } from '@/lib/i18n/server';
import { localized, TEAM } from '@/lib/team';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFrom(params);
  const t = await getDictionary(locale);
  return pageMetadata(locale, '/team', { title: t.team.metaTitle, description: t.team.metaDescription });
}

const VALUE_VISUALS = [
  { Icon: Bot, gradient: 'var(--gradient-wire)' },
  { Icon: Users, gradient: 'var(--gradient-pulse)' },
  { Icon: Eye, gradient: 'var(--gradient-link)' },
];

export default async function TeamPage({ params }: LocaleParams) {
  const locale = await localeFrom(params);
  const t = await getDictionary(locale);
  // Resolve each member's text on the server so the client only receives one language.
  const members = TEAM.map((m) => ({
    id: m.id,
    name: m.name,
    role: localized(m.role, locale),
    bio: localized(m.bio, locale),
    photo: m.photo,
    email: m.email,
    linkedin: m.linkedin,
  }));

  return (
    <main className="relative overflow-x-clip pb-28 pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[460px] w-[820px] -translate-x-1/2 rounded-full opacity-25 blur-[130px]"
        style={{ backgroundImage: 'var(--gradient-spectrum)' }}
      />
      <header className="mx-auto max-w-6xl px-6">
        <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-[-0.03em] text-white md:text-6xl">{t.team.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mist">{t.team.body}</p>
      </header>

      <TeamShowcase members={members} />

      <section aria-labelledby="values-title" className="mx-auto mt-24 max-w-6xl px-6">
        <h2 id="values-title" className="font-display text-3xl font-semibold tracking-[-0.02em] text-white">
          {t.team.valuesTitle}
        </h2>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {t.team.values.map(({ title, body }, i) => {
            const { Icon, gradient } = VALUE_VISUALS[i % VALUE_VISUALS.length];
            return (
              <li key={title} className="glass rounded-3xl p-7">
                <span className="grid h-11 w-11 place-items-center rounded-xl text-white" style={{ backgroundImage: gradient }}>
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-6 font-display text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-mist">{body}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="px-6">
        <div className="glass-raised relative mx-auto mt-24 max-w-6xl overflow-hidden rounded-[2rem] px-8 py-14 md:flex md:items-end md:justify-between md:px-14">
          <div className="wire-line absolute inset-x-0 top-0" aria-hidden />
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.02em] text-white md:text-4xl">{t.team.joinTitle}</h2>
            <p className="mt-4 text-lg text-mist">{t.team.joinBody}</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 md:mt-0">
            <ButtonLink href="/careers" size="lg">
              {t.team.joinCta}
            </ButtonLink>
            <ButtonLink href="/contact" size="lg" variant="secondary">
              {t.common.sendMessage}
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
