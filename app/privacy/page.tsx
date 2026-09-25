import type { Metadata } from 'next';
import { LegalPage, type LegalSection } from '@/components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Wireish handles data across its website, AI agents and integrations.',
};

// TODO: set to the date this text last actually changed (the old page showed today's date on every visit).
const LAST_UPDATED = '2026-09-25';

const SECTIONS: LegalSection[] = [
  {
    id: 'overview',
    title: 'Overview & Scope',
    body: (
      <p>
        Welcome to <strong>Wireish</strong> (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). We
        provide advanced AI chatbot integration services across web and messaging platforms. This Privacy Policy governs
        your access to and use of our website, services, and infrastructure. By accessing or using Wireish, you explicitly
        agree to be bound by this Policy. If you disagree with any part of these terms, you must immediately cease all use
        of our services.
      </p>
    ),
  },
  {
    id: 'disclaimer',
    title: 'Zero Liability & "As-Is" Disclaimer',
    body: (
      <>
        <p>
          To the maximum extent permitted by applicable law, Wireish and its operators, developers, and partners provide
          all services <strong>&quot;AS IS&quot;</strong> and <strong>&quot;AS AVAILABLE&quot;</strong>, without warranty
          of any kind, express or implied.
        </p>
        <ul>
          <li>We disclaim all warranties of merchantability, fitness for a particular purpose, and non-infringement.</li>
          <li>We do not guarantee that AI-generated responses will be 100% free from errors, hallucinations, or unintended outputs.</li>
          <li>
            <strong>Limitation of Liability:</strong> Under no circumstances shall Wireish be held liable for any indirect,
            incidental, special, consequential, or punitive damages, including loss of profits, data, or business
            interruption arising from the use of our AI infrastructure.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'data-processing',
    title: 'Data Processing & AI Training Rights',
    body: (
      <p>
        When interacting with our client bots (Website, Instagram, WhatsApp), conversation logs and interaction data may
        be processed to deliver real-time AI responses. We implement industry-standard encryption protocols (SSL/TLS and
        secure database storage) to protect data streams. However, no digital transmission over the internet is 100%
        secure, and we assume no liability for malicious third-party breaches beyond our reasonable control.
      </p>
    ),
  },
  {
    id: 'client-responsibility',
    title: 'Client Responsibility & Indemnification',
    body: (
      <p>
        Clients using Wireish integration services are solely responsible for ensuring that their training data,
        proprietary knowledge bases, and customer interactions comply with local data protection laws (such as GDPR,
        CCPA, etc.). You agree to defend, indemnify, and hold harmless Wireish from any claims, damages, or legal expenses
        arising from your misuse of the AI agent or violation of third-party platform terms (Meta/Instagram/WhatsApp).
      </p>
    ),
  },
  {
    id: 'modifications',
    title: 'Modifications to Terms',
    body: (
      <p>
        We reserve the right to modify, amend, or update this Privacy Policy at any time and at our sole discretion.
        Continued use of the platform following any modifications constitutes your formal acceptance of the revised terms.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact & Legal Inquiries',
    body: (
      <p>
        For any formal legal notices, compliance questions, or data removal requests, you may contact our legal desk
        directly via our main contact channel or schedule a discussion with our team.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return <LegalPage title="Privacy Policy" updated={LAST_UPDATED} sections={SECTIONS} />;
}
