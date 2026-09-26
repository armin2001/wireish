'use client';

import type { ReactNode } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Globe, Map as MapIcon, Workflow } from 'lucide-react';
import { FaFacebookMessenger, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { Chip } from '@/components/ui/Chip';
import { Honeypot, TextArea, TextField } from '@/components/ui/Field';
import { TransitionLink } from '@/components/layout/PageTransition';
import { summarizeDoc, type CanvasDoc, type NodeKind } from '@/lib/canvas/model';
import {
  CHANNEL_OPTIONS,
  GOAL_OPTIONS,
  VOLUME_OPTIONS,
  type BookingDetails,
  type Channel,
  type Goal,
  type Volume,
} from '@/lib/schema';
import { useI18n } from '@/lib/i18n/client';
import { intlLocale } from '@/lib/i18n/config';
import { fieldError } from '@/lib/i18n/errors';
import { format } from '@/lib/i18n/format';

export interface NeedsDraft {
  channels: Channel[];
  volume: Volume | null;
  goal: Goal | null;
  attachMap: boolean;
}

const CHANNEL_ICONS: Record<Channel, ReactNode> = {
  website: <Globe className="h-4 w-4" aria-hidden />,
  instagram: <FaInstagram className="h-4 w-4" aria-hidden />,
  whatsapp: <FaWhatsapp className="h-4 w-4" aria-hidden />,
  messenger: <FaFacebookMessenger className="h-4 w-4" aria-hidden />,
  custom: <Workflow className="h-4 w-4" aria-hidden />,
};

const KIND_TO_CHANNEL: Partial<Record<NodeKind, Channel>> = {
  website: 'website',
  instagram: 'instagram',
  whatsapp: 'whatsapp',
  messenger: 'messenger',
  crm: 'custom',
  calendar: 'custom',
  email: 'custom',
};

function Question({ title, error, children }: { title: string; error?: string | false; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium text-white">{title}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}

/* ---------------------------------------------------------------- Step 1 */

interface NeedsStepProps {
  value: NeedsDraft;
  onChange: (patch: Partial<NeedsDraft>) => void;
  showErrors: boolean;
  blueprint: CanvasDoc | null;
}

export function NeedsStep({ value, onChange, showErrors, blueprint }: NeedsStepProps) {
  const { t } = useI18n();
  const n = t.booking.needs;
  const toggleChannel = (channel: Channel) =>
    onChange({
      channels: value.channels.includes(channel)
        ? value.channels.filter((c) => c !== channel)
        : [...value.channels, channel],
    });

  const mapChannels = blueprint
    ? [...new Set(blueprint.nodes.map((n) => KIND_TO_CHANNEL[n.kind]).filter((c): c is Channel => Boolean(c)))]
    : [];
  const hasMap = Boolean(blueprint && blueprint.nodes.length);

  return (
    <div className="space-y-8">
      {hasMap && blueprint && (
        <div className="rounded-2xl border border-white/8 bg-field p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white" style={{ backgroundImage: 'var(--gradient-wire)' }}>
              <MapIcon className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white">{n.mapTitle}</p>
              <ul className="mt-1 space-y-0.5 text-sm text-mist">
                {summarizeDoc(
                  blueprint,
                  (kind) => t.canvas.kinds[kind].label,
                  (list) => format(t.canvas.notConnected, { list }),
                )
                  .slice(0, 4)
                  .map((line) => (
                    <li key={line} className="truncate">
                      {line}
                    </li>
                  ))}
              </ul>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={value.attachMap}
                    onChange={(e) => onChange({ attachMap: e.target.checked })}
                    className="h-4 w-4 accent-signal"
                  />
                  {n.attach}
                </label>
                {mapChannels.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onChange({ channels: [...new Set([...value.channels, ...mapChannels])] })}
                    className="font-medium text-signal hover:text-white"
                  >
                    {n.useChannels}
                  </button>
                )}
                <TransitionLink href="/canvas" className="text-mist hover:text-white">
                  {n.editMap}
                </TransitionLink>
              </div>
            </div>
          </div>
        </div>
      )}

      <Question
        title={n.channels}
        error={showErrors && value.channels.length === 0 && t.errors.pickChannel}
      >
        {CHANNEL_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            selected={value.channels.includes(option.value)}
            onToggle={() => toggleChannel(option.value)}
            icon={CHANNEL_ICONS[option.value]}
          >
            {t.channels[option.value]}
          </Chip>
        ))}
      </Question>

      <Question
        title={n.volume}
        error={showErrors && !value.volume && t.errors.pickVolume}
      >
        {VOLUME_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            role="radio"
            selected={value.volume === option.value}
            onToggle={() => onChange({ volume: option.value })}
          >
            {t.booking.volumes[option.value]}
          </Chip>
        ))}
      </Question>

      <Question title={n.goal} error={showErrors && !value.goal && t.errors.pickGoal}>
        {GOAL_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            role="radio"
            selected={value.goal === option.value}
            onToggle={() => onChange({ goal: option.value })}
          >
            {t.booking.goals[option.value]}
          </Chip>
        ))}
      </Question>

      {!hasMap && (
        <p className="text-sm text-haze">
          {n.mapPrompt}{' '}
          <TransitionLink href="/canvas" className="text-signal hover:text-white">
            {n.mapLink}
          </TransitionLink>{' '}
          {n.mapSuffix}
        </p>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- Step 3 */

interface DetailsStepProps {
  register: UseFormRegister<BookingDetails>;
  errors: FieldErrors<BookingDetails>;
  notesLength: number;
}

export function DetailsStep({ register, errors, notesLength }: DetailsStepProps) {
  const { t } = useI18n();
  const d = t.booking.details;
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label={d.name} autoComplete="name" error={fieldError(t, errors.name?.message)} {...register('name')} />
        <TextField
          label={d.email}
          type="email"
          inputMode="email"
          autoComplete="email"
          error={fieldError(t, errors.email?.message)}
          {...register('email')}
        />
        <TextField label={d.company} autoComplete="organization" error={fieldError(t, errors.company?.message)} {...register('company')} />
        <TextField
          label={d.phone}
          optional
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          error={fieldError(t, errors.phone?.message)}
          {...register('phone')}
        />
      </div>
      <TextArea
        label={d.notes}
        optional
        maxLength={2000}
        count={notesLength}
        hint={d.notesHint}
        error={fieldError(t, errors.notes?.message)}
        {...register('notes')}
      />
      <Honeypot {...register('hp')} />
    </div>
  );
}

/* ---------------------------------------------------------------- Step 4 */

interface ReviewStepProps {
  needs: NeedsDraft;
  slot: string;
  timeZone: string;
  details: BookingDetails;
  mapLines: string[] | null;
  onEdit: (step: number) => void;
}

export function ReviewStep({ needs, slot, timeZone, details, mapLines, onEdit }: ReviewStepProps) {
  const { t, locale } = useI18n();
  const r = t.booking.review;
  const when = new Intl.DateTimeFormat(intlLocale(locale), {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  }).format(new Date(slot));

  const rows: Array<{ label: string; value: ReactNode; step: number }> = [
    { label: r.when, value: `${when} (${timeZone.replace(/_/g, ' ')})`, step: 1 },
    { label: r.channels, value: needs.channels.map((c) => t.channels[c]).join(', '), step: 0 },
    {
      label: r.volumeGoal,
      value: format(r.volumeLine, {
        volume: needs.volume ? t.booking.volumes[needs.volume] : '',
        goal: needs.goal ? t.booking.goals[needs.goal] : '',
      }),
      step: 0,
    },
    {
      label: r.you,
      value: [details.name, details.email, details.company, details.phone].filter(Boolean).join(', '),
      step: 2,
    },
  ];
  if (details.notes) rows.push({ label: r.notes, value: details.notes, step: 2 });
  if (mapLines?.length) rows.push({ label: r.map, value: mapLines.join('; '), step: 0 });

  return (
    <dl className="divide-y divide-white/[0.07] rounded-2xl border border-white/8 bg-field">
      {rows.map((row) => (
        // Phones: label and "Change" share the top line, the value spans below. Wider: one row.
        <div
          key={row.label}
          className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-1 p-4 sm:grid-cols-[8rem_minmax(0,1fr)_auto]"
        >
          <dt className="col-1 row-1 text-sm text-haze">{row.label}</dt>
          <dd className="col-span-full row-2 min-w-0 whitespace-pre-line wrap-break-word text-sm text-white sm:col-2 sm:row-1">
            {row.value}
          </dd>
          <button
            type="button"
            onClick={() => onEdit(row.step)}
            className="col-2 row-1 rounded-full px-2 text-sm text-signal hover:text-white sm:col-3"
            aria-label={format(r.changeLabel, { item: row.label })}
          >
            {r.change}
          </button>
        </div>
      ))}
    </dl>
  );
}
