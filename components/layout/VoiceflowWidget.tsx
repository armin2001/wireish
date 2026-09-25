'use client';

import Script from 'next/script';

declare global {
  interface Window {
    voiceflow?: { chat: { load: (config: Record<string, unknown>) => void } };
  }
}

const PROJECT_ID = '6ab17309b5c99d6f94fb35d9';

/** Loads the Voiceflow chat when the browser is idle, so it never competes with first paint. */
export function VoiceflowWidget() {
  return (
    <Script
      id="voiceflow-widget"
      src="https://cdn.voiceflow.com/widget-next/bundle.mjs"
      strategy="lazyOnload"
      onLoad={() => {
        window.voiceflow?.chat.load({
          verify: { projectID: PROJECT_ID },
          url: 'https://general-runtime.voiceflow.com',
          voice: { url: 'https://runtime-api.voiceflow.com' },
        });
      }}
    />
  );
}
