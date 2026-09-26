import { useId, type InputHTMLAttributes, type Ref, type TextareaHTMLAttributes } from 'react';
import { CircleAlert } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n/client';

interface BaseProps {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
}

const shell = (invalid: boolean) =>
  cn(
    'relative rounded-2xl border bg-field transition-[border-color,box-shadow,background-color] duration-200',
    'hover:bg-field-hover focus-within:bg-field-hover',
    invalid
      ? 'border-danger/60 focus-within:shadow-[0_0_0_4px_rgb(255_92_122/0.14)]'
      : 'border-white/[0.08] hover:border-white/20 focus-within:border-signal/60 focus-within:shadow-[0_0_0_4px_rgb(21_195_255/0.12)]',
  );

const control =
  'peer block w-full bg-transparent px-4 pb-2.5 pt-6 text-[15px] text-white outline-none placeholder:text-transparent autofill:shadow-[inset_0_0_0_1000px_#1a2150] autofill:[-webkit-text-fill-color:#fff]';

const floatingLabel =
  'pointer-events-none absolute left-4 top-2 text-xs text-mist transition-all duration-200 ease-wire peer-placeholder-shown:top-4 peer-placeholder-shown:text-[15px] peer-focus:top-2 peer-focus:text-xs peer-focus:text-signal';

function Message({ id, error, hint, counter }: { id: string; error?: string; hint?: string; counter?: string }) {
  if (!error && !hint && !counter) return null;
  return (
    <div className="mt-1.5 flex items-start justify-between gap-3 px-1 text-xs">
      {error ? (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-danger" role="alert">
          <CircleAlert className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-haze">
          {hint}
        </p>
      ) : (
        <span />
      )}
      {counter && <span className="shrink-0 tabular-nums text-haze">{counter}</span>}
    </div>
  );
}

function LabelText({ label, optional }: { label: string; optional?: boolean }) {
  const { t } = useI18n();
  return (
    <>
      {label}
      {optional && <span className="text-haze"> ({t.common.optional})</span>}
    </>
  );
}

type InputProps = BaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & { ref?: Ref<HTMLInputElement> };

export function TextField({ label, error, hint, optional, className, id, ref, ...props }: InputProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <div className={className}>
      <div className={shell(Boolean(error))}>
        <input
          ref={ref}
          id={fieldId}
          placeholder=" "
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
          className={control}
          {...props}
        />
        <label htmlFor={fieldId} className={floatingLabel}>
          <LabelText label={label} optional={optional} />
        </label>
      </div>
      <Message id={fieldId} error={error} hint={hint} />
    </div>
  );
}

type AreaProps = BaseProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> & {
    ref?: Ref<HTMLTextAreaElement>;
    count?: number;
  };

export function TextArea({ label, error, hint, optional, className, id, ref, count, maxLength, ...props }: AreaProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const counter = maxLength !== undefined && count !== undefined ? `${count.toLocaleString()} / ${maxLength.toLocaleString()}` : undefined;
  return (
    <div className={className}>
      <div className={shell(Boolean(error))}>
        <textarea
          ref={ref}
          id={fieldId}
          placeholder=" "
          maxLength={maxLength}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
          className={cn(control, 'min-h-36 resize-y leading-relaxed')}
          {...props}
        />
        <label htmlFor={fieldId} className={floatingLabel}>
          <LabelText label={label} optional={optional} />
        </label>
      </div>
      <Message id={fieldId} error={error} hint={hint} counter={counter} />
    </div>
  );
}

/** Visually hidden spam trap. Bots fill every input; people never see this one. */
export function Honeypot(props: InputHTMLAttributes<HTMLInputElement> & { ref?: Ref<HTMLInputElement> }) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this empty
        <input type="text" tabIndex={-1} autoComplete="off" {...props} />
      </label>
    </div>
  );
}
