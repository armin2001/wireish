/**
 * Static light behind the booking page: two soft glows in logo gradients and a dot grid
 * that fades out. No WebGL here, so nothing ever floats across the form or the text.
 * (The 3D scene lives in its own framed panel: DemoScenePanel.)
 */
export function BookingBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="dot-grid absolute inset-0 opacity-70 [mask-image:radial-gradient(70%_45%_at_50%_0%,#000,transparent)]" />
      <div
        className="absolute -top-48 left-[4%] h-[560px] w-[560px] rounded-full opacity-25 blur-[140px]"
        style={{ backgroundImage: 'var(--gradient-wire)' }}
      />
      <div
        className="absolute -right-[8%] top-[12%] h-[520px] w-[520px] rounded-full opacity-20 blur-[150px]"
        style={{ backgroundImage: 'var(--gradient-pulse)' }}
      />
    </div>
  );
}
