import type { Metadata } from 'next';
import { CanvasLoader } from '@/components/canvas/CanvasLoader';

export const metadata: Metadata = {
  title: 'Canvas',
  description: 'Map your channels, AI agent and tools on an open canvas, then attach the map to your demo request.',
};

export default function CanvasPage() {
  return (
    <main className="relative h-dvh overflow-hidden bg-night">
      <h1 className="sr-only">Wireish canvas: map your customer channels and tools</h1>
      <CanvasLoader />
    </main>
  );
}
