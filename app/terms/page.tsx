import type { Metadata } from 'next';
import { LegalPage, type LegalSection } from '@/components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms that govern use of the Wireish website, AI agents and integrations.',
};

// TODO: set to the date this text last actually changed (the old page showed today's date on every visit).
const LAST_UPDATED = '2026-09-25';

const SECTIONS: LegalSection[] = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    body: (
      <p>
        By accessing, integrating, or utilizing the <strong>Wireish</strong> platform, website, or AI chatbot
        infrastructure, you agree to be legally bound by these Terms of Service. If you are entering into this agreement
        on behalf of a company or legal entity, you represent that you have the authority to bind such entity. If you lack
        such authority, or if you do not agree with these terms, you must not use our services.
      </p>
    ),
  },
  {
    id: 'services',
    title: 'Description of Services & AI Limitations',
    body: (
      <>
        <p>
          Wireish provides automated AI agent integration for customer communication channels (Web widgets, Instagram,
          WhatsApp). You acknowledge and agree to the following operational realities of generative AI:
        </p>
        <ul>
          <li>AI responses are generated dynamically and may occasionally contain inaccuracies, hallucinations, or unverified statements.</li>
          <li>You are solely responsible for reviewing and supervising the outputs and knowledge base configured for your AI agents.</li>
          <li>We do not guarantee 100% uptime, as services rely on third-party cloud infrastructure, APIs, and messaging network availability.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable Use Policy',
    body: (
      <>
        <p>
          You agree not to misuse the Wireish platform or assist any third party in doing so. Prohibited actions include,
          but are not limited to:
        </p>
        <ul>
          <li>Using the AI agents to distribute spam, unsolicited promotional material, or malicious content.</li>
          <li>Attempting to bypass security controls, reverse-engineer, or extract underlying model weights and proprietary source code.</li>
          <li>Training the AI on content that violates intellectual property rights, privacy rights, or local and international laws.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'payment',
    title: 'Payment Terms & Custom Agreements',
    body: (
      <p>
        Services provided via custom scopes and tailored architectures are governed by individual client agreements,
        statements of work (SOW), or direct invoicing terms. Failure to settle agreed-upon billing cycles may result in the
        immediate suspension or termination of AI agent integrations.
      </p>
    ),
  },
  {
    id: 'liability',
    title: 'Indemnification & Limitation of Liability',
    body: (
      <p>
        To the fullest extent permitted by law, Wireish shall not be liable for any direct, indirect, incidental, special,
        or consequential damages resulting from the use or inability to use our services. You agree to indemnify and hold
        harmless Wireish, its founders, and contractors from any third-party claims, liabilities, or expenses resulting
        from your breach of these terms or misuse of platform integrations.
      </p>
    ),
  },
  {
    id: 'termination',
    title: 'Modifications & Termination',
    body: (
      <p>
        We reserve the right to suspend, modify, or terminate access to our services at any time, with or without notice,
        for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.
      </p>
    ),
  },
];

export default function TermsPage() {
  return <LegalPage title="Terms of Service" updated={LAST_UPDATED} sections={SECTIONS} />;
}
