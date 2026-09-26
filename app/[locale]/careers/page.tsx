import type { Metadata } from 'next';
import { ArrowUpRight, Code2, MessagesSquare, Route } from 'lucide-react';
import { TransitionLink } from '@/components/layout/PageTransition';
import { ButtonLink } from '@/components/ui/Button';
import { OPEN_ROLES } from '@/lib/careers';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { pageMetadata } from '@/lib/i18n/metadata';
import { localeFrom, type LocaleParams } from '@/lib/i18n/server';
import { localized } from '@/lib/team';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFrom(params);
  const t = await getDictionary(locale);
  return pageMetadata(locale, '/careers', { title: t.careers.metaTitle, description: t.careers.metaDescription });
}

const WHY_VISUALS = [
  { Icon: MessagesSquare, gradient: 'var(--gradient-wire)' },
  { Icon: Route, gradient: 'var(--gradient-pulse)' },
  { Icon: Code2, gradient: 'var(--gradient-link)' },
];
const APPLY_HREF = '/contact?topic=careers';

export default async function CareersPage({ params }: LocaleParams) {
  const locale = await localeFrom(params);
  const t = await getDictionary(locale);
  const c = t.careers;

  return (
    <main className="relative overflow-x-clip px-6 pb-28 pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-[-10%] -z-10 h-[520px] w-[620px] rounded-full opacity-25 blur-[130px]"
        style={{ backgroundImage: 'var(--gradient-pulse)' }}
      />
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <h1 className="font-display text-4xl font-semibold tracking-[-0.03em] text-white md:text-6xl">{c.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mist">{c.body}</p>
          <ButtonLink href={APPLY_HREF} size="lg" className="mt-9">
            {c.apply}
          </ButtonLink>
        </header>

        <section aria-labelledby="why-title" className="mt-24">
          <h2 id="why-title" className="font-display text-3xl font-semibold tracking-[-0.02em] text-white">
            {c.whyTitle}
          </h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {c.why.map(({ title, body }, i) => {
              const { Icon, gradient } = WHY_VISUALS[i % WHY_VISUALS.length];
              return (
                <li
                  key={title}
                  className="glass wire-border group rounded-3xl p-7 transition-colors duration-300 [--wire-opacity:0] [--wire-play:paused] hover:border-white/15 hover:[--wire-opacity:1] hover:[--wire-play:running]"
                >
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

        <section aria-labelledby="roles-title" className="mt-24">
          <h2 id="roles-title" className="font-display text-3xl font-semibold tracking-[-0.02em] text-white">
            {c.openTitle}
          </h2>
          {OPEN_ROLES.length === 0 ? (
            <div className="panel mt-8 flex flex-col gap-6 rounded-3xl p-7 sm:flex-row sm:items-center sm:justify-between md:p-9">
              <div>
                <p className="font-display text-xl font-semibold text-white">{c.none}</p>
                <p className="mt-2 text-mist">{c.noneBody}</p>
              </div>
              <ButtonLink href={APPLY_HREF} variant="secondary" className="shrink-0">
                {c.apply}
              </ButtonLink>
            </div>
          ) : (
            <ul className="mt-8 space-y-3">
              {OPEN_ROLES.map((role) => (
                <li key={role.id}>
                  <TransitionLink
                    href={`${APPLY_HREF}&role=${encodeURIComponent(role.id)}`}
                    className="panel group flex flex-col gap-4 rounded-3xl p-6 transition-[border-color,transform] duration-200 hover:border-signal/40 active:scale-[0.99] md:flex-row md:items-center md:justify-between md:p-7"
                  >
                    <div>
                      <h3 className="font-display text-xl font-semibold text-white">{localized(role.title, locale)}</h3>
                      <p className="mt-1.5 max-w-2xl text-mist">{localized(role.summary, locale)}</p>
                      {role.responsibilities && role.responsibilities.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">{c.responsibilities}</p>
                          <ul className="mt-2 max-w-2xl list-disc space-y-1 pl-5 text-[15px] text-mist marker:text-signal">
                            {role.responsibilities.map((item) => (
                              <li key={item.en}>{localized(item, locale)}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <dl className="mt-4 flex flex-wrap gap-2 text-sm">
                        {role.department && (
                          <div className="rounded-full border border-white/10 px-3 py-1">
                            <dt className="sr-only">{c.department}</dt>
                            <dd className="text-white">{localized(role.department, locale)}</dd>
                          </div>
                        )}
                        <div className="rounded-full border border-white/10 px-3 py-1">
                          <dt className="sr-only">{c.location}</dt>
                          <dd className="text-white">{localized(role.location, locale)}</dd>
                        </div>
                        <div className="rounded-full border border-white/10 px-3 py-1">
                          <dt className="sr-only">{c.type}</dt>
                          <dd className="text-white">{localized(role.type, locale)}</dd>
                        </div>
                      </dl>
                    </div>
                    <span className="inline-flex items-center gap-1.5 font-medium text-signal transition-colors group-hover:text-white">
                      {c.applyRole}
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </TransitionLink>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="process-title" className="mt-24">
          <h2 id="process-title" className="font-display text-3xl font-semibold tracking-[-0.02em] text-white">
            {c.processTitle}
          </h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {c.process.map((step, i) => (
              <li key={step} className="relative rounded-3xl border border-white/[0.08] p-7">
                <span
                  className="grid h-8 w-8 place-items-center rounded-full text-sm font-semibold tabular-nums text-white"
                  style={{ backgroundImage: 'var(--gradient-wire)' }}
                >
                  {i + 1}
                </span>
                <p className="mt-5 leading-relaxed text-mist">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}
