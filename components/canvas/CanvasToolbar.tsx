'use client';

import type { ReactNode } from 'react';
import { Keyboard, Magnet, Minus, Plus, Redo2, RotateCcw, Scan, Undo2 } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ToolButtonProps {
  label: string;
  shortcut?: string;
  onClick: () => void;
  disabled?: boolean;
  pressed?: boolean;
  children: ReactNode;
}

function ToolButton({ label, shortcut, onClick, disabled, pressed, children }: ToolButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={shortcut ? `${label} (${shortcut})` : label}
      aria-pressed={pressed}
      className={cn(
        'group relative grid h-9 w-9 place-items-center rounded-xl text-mist transition-[color,background-color,transform] duration-150',
        'hover:bg-white/[0.08] hover:text-white active:scale-90 disabled:pointer-events-none disabled:opacity-30',
        pressed && 'bg-signal/15 text-signal hover:text-signal',
      )}
    >
      {children}
      <span
        role="tooltip"
        className="glass-overlay pointer-events-none absolute left-1/2 top-full z-30 mt-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs text-white opacity-0 transition-[opacity,transform] duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
      >
        {label}
        {shortcut && <kbd className="ml-2 font-sans text-haze">{shortcut}</kbd>}
      </span>
    </button>
  );
}

const Divider = () => <span className="mx-0.5 h-5 w-px bg-white/10" aria-hidden />;

interface CanvasToolbarProps {
  zoom: number;
  mod: string;
  canUndo: boolean;
  canRedo: boolean;
  snapping: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onFit: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onToggleSnap: () => void;
  onLoadExample: () => void;
  onHelp: () => void;
  action: ReactNode;
}

export function CanvasToolbar(props: CanvasToolbarProps) {
  const { zoom, mod } = props;
  return (
    <div className="glass-overlay flex items-center gap-1 rounded-2xl p-1.5 max-md:max-w-[calc(100vw-1.5rem)] max-md:overflow-x-auto">
      <ToolButton label="Zoom out" shortcut="−" onClick={props.onZoomOut}>
        <Minus className="h-4 w-4" />
      </ToolButton>
      <button
        type="button"
        onClick={props.onZoomReset}
        aria-label={`Zoom ${Math.round(zoom * 100)}%. Reset to 100% (0)`}
        className="h-9 w-14 rounded-xl text-sm tabular-nums text-white transition-colors hover:bg-white/[0.08] active:scale-95"
      >
        {Math.round(zoom * 100)}%
      </button>
      <ToolButton label="Zoom in" shortcut="+" onClick={props.onZoomIn}>
        <Plus className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Fit to content" shortcut="F" onClick={props.onFit}>
        <Scan className="h-4 w-4" />
      </ToolButton>
      <Divider />
      <ToolButton label="Undo" shortcut={`${mod}Z`} onClick={props.onUndo} disabled={!props.canUndo}>
        <Undo2 className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Redo" shortcut={`${mod}⇧Z`} onClick={props.onRedo} disabled={!props.canRedo}>
        <Redo2 className="h-4 w-4" />
      </ToolButton>
      <ToolButton label={props.snapping ? 'Snapping on' : 'Snapping off'} shortcut="G" onClick={props.onToggleSnap} pressed={props.snapping}>
        <Magnet className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Load example setup" onClick={props.onLoadExample}>
        <RotateCcw className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Keyboard shortcuts" shortcut="?" onClick={props.onHelp}>
        <Keyboard className="h-4 w-4" />
      </ToolButton>
      <Divider />
      {props.action}
    </div>
  );
}
