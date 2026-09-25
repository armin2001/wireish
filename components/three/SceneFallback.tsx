/** Static stand-in while three.js loads, when WebGL is unavailable, or before idle. No three.js import. */
export function SceneFallback({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`absolute inset-0 ${className}`}
      style={{
        background:
          'radial-gradient(40% 45% at 68% 50%, rgb(90 65 253 / 0.28), transparent 70%), radial-gradient(28% 32% at 58% 40%, rgb(21 195 255 / 0.18), transparent 70%)',
      }}
    />
  );
}
