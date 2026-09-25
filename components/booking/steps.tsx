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
  labelFor,
  type BookingDetails,
  type Channel,
  type Goal,
  type Volume,
} from '@/lib/schema';

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
              <p className="font-medium text-white">Your canvas map</p>
              <ul className="mt-1 space-y-0.5 text-sm text-mist">
                {summarizeDoc(blueprint)
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
                  Attach it to this booking
                </label>
                {mapChannels.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onChange({ channels: [...new Set([...value.channels, ...mapChannels])] })}
                    className="font-medium text-signal hover:text-white"
                  >
                    Use channels from the map
                  </button>
                )}
                <TransitionLink href="/canvas" className="text-mist hover:text-white">
                  Edit map
                </TransitionLink>
              </div>
            </div>
          </div>
        </div>
      )}

      <Question
        title="Which channels should the agent answer?"
        error={showErrors && value.channels.length === 0 && 'Pick at least one channel.'}
      >
        {CHANNEL_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            selected={value.channels.includes(option.value)}
            onToggle={() => toggleChannel(option.value)}
            icon={CHANNEL_ICONS[option.value]}
          >
            {option.label}
          </Chip>
        ))}
      </Question>

      <Question
        title="Customer conversations per month"
        error={showErrors && !value.volume && 'Pick the closest range.'}
      >
        {VOLUME_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            role="radio"
            selected={value.volume === option.value}
            onToggle={() => onChange({ volume: option.value })}
          >
            {option.label}
          </Chip>
        ))}
      </Question>

      <Question title="What should it handle first?" error={showErrors && !value.goal && 'Pick one to continue.'}>
        {GOAL_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            role="radio"
            selected={value.goal === option.value}
            onToggle={() => onChange({ goal: option.value })}
          >
            {option.label}
          </Chip>
        ))}
      </Question>

      {!hasMap && (
        <p className="text-sm text-haze">
          Want to show us your setup?{' '}
          <TransitionLink href="/canvas" className="text-signal hover:text-white">
            Map it on the canvas
          </TransitionLink>{' '}
          and it will be attached here.
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
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Your name" autoComplete="name" error={errors.name?.message} {...register('name')} />
        <TextField
          label="Work email"
          type="email"
          inputMode="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <TextField label="Company" autoComplete="organization" error={errors.company?.message} {...register('company')} />
        <TextField
          label="Phone"
          optional
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          error={errors.phone?.message}
          {...register('phone')}
        />
      </div>
      <TextArea
        label="Anything we should know"
        optional
        maxLength={2000}
        count={notesLength}
        hint="Your website address, tools you use, questions customers ask most."
        error={errors.notes?.message}
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
  const when = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  }).format(new Date(slot));

  const rows: Array<{ label: string; value: ReactNode; step: number }> = [
    { label: 'When', value: `${when} (${timeZone.replace(/_/g, ' ')})`, step: 1 },
    { label: 'Channels', value: needs.channels.map((c) => labelFor(CHANNEL_OPTIONS, c)).join(', '), step: 0 },
    {
      label: 'Volume and focus',
      value: `${labelFor(VOLUME_OPTIONS, needs.volume ?? '')} conversations a month. ${labelFor(GOAL_OPTIONS, needs.goal ?? '')}.`,
      step: 0,
    },
    {
      label: 'You',
      value: [details.name, details.email, details.company, details.phone].filter(Boolean).join(', '),
      step: 2,
    },
  ];
  if (details.notes) rows.push({ label: 'Notes', value: details.notes, step: 2 });
  if (mapLines?.length) rows.push({ label: 'Canvas map', value: mapLines.join('; '), step: 0 });

  return (
    <dl className="divide-y divide-white/[0.07] rounded-2xl border border-white/8 bg-field">
      {rows.map((row) => (
        <div key={row.label} className="flex items-start gap-4 p-4">
          <dt className="w-32 shrink-0 text-sm text-haze">{row.label}</dt>
          <dd className="min-w-0 flex-1 whitespace-pre-line wrap-break-word text-sm text-white">{row.value}</dd>
          <button
            type="button"
            onClick={() => onEdit(row.step)}
            className="shrink-0 rounded-full px-2 text-sm text-signal hover:text-white"
            aria-label={`Change ${row.label.toLowerCase()}`}
          >
            Change
          </button>
        </div>
      ))}
    </dl>
  );
}
