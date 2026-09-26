import type { LocalizedText } from '@/lib/team';

export interface OpenRole {
  id: string;
  title: LocalizedText;
  department?: LocalizedText;
  summary: LocalizedText;
  location: LocalizedText;
  /** e.g. Full-time, Part-time, Contract. */
  type: LocalizedText;
  responsibilities?: LocalizedText[];
}

const REMOTE: LocalizedText = {
  en: 'Remote',
  bs: 'Rad na daljinu',
  de: 'Remote',
  fr: 'À distance',
  es: 'Remoto',
  sv: 'Distans',
  ja: 'リモート',
  ko: '원격 근무',
};

const FULL_TIME: LocalizedText = {
  en: 'Full-time',
  bs: 'Puno radno vrijeme',
  de: 'Vollzeit',
  fr: 'Temps plein',
  es: 'Jornada completa',
  sv: 'Heltid',
  ja: '正社員',
  ko: '정규직',
};

/*
 * Open positions. While this list is empty the careers page shows an open-application
 * call to action, and the footer shows no "Hiring" badge. Translations are optional per
 * field, e.g. title: { en: 'Frontend engineer', bs: 'Frontend inženjer' }.
 */
export const OPEN_ROLES: OpenRole[] = [
  {
    id: 'senior-frontend-creative-technologist',
    title: {
      en: 'Senior Frontend Creative Technologist',
      bs: 'Senior Frontend Creative Technologist',
      de: 'Senior Frontend Creative Technologist (m/w/d)',
      fr: 'Creative Technologist Frontend Senior',
      es: 'Creative Technologist Frontend Sénior',
      sv: 'Senior Frontend Creative Technologist',
      ja: 'シニア フロントエンド クリエイティブテクノロジスト',
      ko: '시니어 프론트엔드 크리에이티브 테크놀로지스트',
    },
    department: {
      en: 'Engineering & 3D Graphics',
      bs: 'Inženjering i 3D grafika',
      de: 'Engineering & 3D-Grafik',
      fr: 'Ingénierie et graphisme 3D',
      es: 'Ingeniería y gráficos 3D',
      sv: 'Utveckling & 3D-grafik',
      ja: 'エンジニアリング・3Dグラフィックス',
      ko: '엔지니어링 · 3D 그래픽',
    },
    summary: {
      en: 'Lead the development of our high-performance interactive canvas and Three.js rendering pipelines. Build butter-smooth UI components, optimize 60+ FPS animations, and push the limits of modern web technologies.',
      bs: 'Vodite razvoj našeg interaktivnog canvasa visokih performansi i Three.js pipelinea za renderovanje. Gradite besprijekorno glatke UI komponente, optimizujte animacije od 60+ FPS i pomjerajte granice modernih web tehnologija.',
      de: 'Leite die Entwicklung unseres leistungsstarken interaktiven Canvas und unserer Three.js-Rendering-Pipelines. Baue butterweiche UI-Komponenten, optimiere Animationen mit 60+ FPS und lote die Grenzen moderner Webtechnologien aus.',
      fr: 'Pilotez le développement de notre canvas interactif hautes performances et de nos pipelines de rendu Three.js. Concevez des composants UI d’une fluidité parfaite, optimisez des animations à plus de 60 FPS et repoussez les limites des technologies web modernes.',
      es: 'Lidera el desarrollo de nuestro canvas interactivo de alto rendimiento y de nuestros pipelines de renderizado con Three.js. Crea componentes de interfaz de una fluidez impecable, optimiza animaciones a más de 60 FPS y lleva al límite las tecnologías web modernas.',
      sv: 'Led utvecklingen av vår högpresterande interaktiva canvas och våra renderingspipelines i Three.js. Bygg silkeslena UI-komponenter, optimera animationer i 60+ FPS och tänj på gränserna för modern webbteknik.',
      ja: '高性能なインタラクティブキャンバスとThree.jsレンダリングパイプラインの開発をリードしていただきます。なめらかなUIコンポーネントを構築し、60FPS以上のアニメーションを最適化して、最新のWeb技術の限界に挑戦してください。',
      ko: '고성능 인터랙티브 캔버스와 Three.js 렌더링 파이프라인 개발을 이끌어 주세요. 매끄러운 UI 컴포넌트를 구축하고, 60FPS 이상의 애니메이션을 최적화하며, 최신 웹 기술의 한계를 넓혀 갑니다.',
    },
    location: REMOTE,
    type: FULL_TIME,
    responsibilities: [
      {
        en: 'Architect modular React/Three.js components',
        bs: 'Projektovanje modularnih React/Three.js komponenti',
        de: 'Modulare React/Three.js-Komponenten konzipieren',
        fr: 'Concevoir des composants React/Three.js modulaires',
        es: 'Diseñar componentes modulares con React/Three.js',
        sv: 'Arkitektera modulära React/Three.js-komponenter',
        ja: 'モジュール型のReact/Three.jsコンポーネントの設計',
        ko: '모듈식 React/Three.js 컴포넌트 설계',
      },
      {
        en: 'Manage animation states using GSAP/Framer Motion',
        bs: 'Upravljanje stanjima animacija pomoću GSAP-a/Framer Motiona',
        de: 'Animationszustände mit GSAP/Framer Motion steuern',
        fr: 'Gérer les états d’animation avec GSAP/Framer Motion',
        es: 'Gestionar estados de animación con GSAP/Framer Motion',
        sv: 'Hantera animationstillstånd med GSAP/Framer Motion',
        ja: 'GSAP/Framer Motionを用いたアニメーション状態の管理',
        ko: 'GSAP/Framer Motion을 활용한 애니메이션 상태 관리',
      },
      {
        en: 'Ensure flawless cross-device performance',
        bs: 'Osiguravanje besprijekornih performansi na svim uređajima',
        de: 'Einwandfreie Performance auf allen Geräten sicherstellen',
        fr: 'Garantir des performances irréprochables sur tous les appareils',
        es: 'Garantizar un rendimiento impecable en todos los dispositivos',
        sv: 'Säkerställa felfri prestanda på alla enheter',
        ja: 'あらゆるデバイスでの完璧なパフォーマンスの確保',
        ko: '모든 기기에서 완벽한 성능 보장',
      },
    ],
  },
  {
    id: 'ai-llm-integration-engineer',
    title: {
      en: 'AI / LLM Integration Engineer',
      bs: 'Inženjer za integraciju AI / LLM sistema',
      de: 'AI / LLM Integration Engineer (m/w/d)',
      fr: 'Ingénieur intégration IA / LLM',
      es: 'Ingeniero de integración de IA / LLM',
      sv: 'AI-/LLM-integrationsingenjör',
      ja: 'AI / LLM インテグレーションエンジニア',
      ko: 'AI / LLM 통합 엔지니어',
    },
    department: {
      en: 'Artificial Intelligence & Core Systems',
      bs: 'Umjetna inteligencija i ključni sistemi',
      de: 'Künstliche Intelligenz & Kernsysteme',
      fr: 'Intelligence artificielle et systèmes cœur',
      es: 'Inteligencia artificial y sistemas centrales',
      sv: 'Artificiell intelligens & kärnsystem',
      ja: '人工知能・コアシステム',
      ko: '인공지능 · 코어 시스템',
    },
    summary: {
      en: 'Design, train, and optimize advanced conversational AI chatbots and automated workflows integrated directly into the Wireish platform.',
      bs: 'Dizajnirajte, trenirajte i optimizujte napredne konverzacijske AI chatbotove i automatizovane tokove rada integrisane direktno u Wireish platformu.',
      de: 'Entwirf, trainiere und optimiere fortschrittliche konversationelle KI-Chatbots und automatisierte Workflows, die direkt in die Wireish-Plattform integriert sind.',
      fr: 'Concevez, entraînez et optimisez des chatbots d’IA conversationnelle avancés et des workflows automatisés intégrés directement à la plateforme Wireish.',
      es: 'Diseña, entrena y optimiza chatbots avanzados de IA conversacional y flujos de trabajo automatizados integrados directamente en la plataforma Wireish.',
      sv: 'Designa, träna och optimera avancerade konversationella AI-chattbottar och automatiserade arbetsflöden som är integrerade direkt i Wireish-plattformen.',
      ja: 'Wireishプラットフォームに直接統合された、高度な対話型AIチャットボットと自動化ワークフローの設計・トレーニング・最適化を担当していただきます。',
      ko: 'Wireish 플랫폼에 직접 통합되는 고급 대화형 AI 챗봇과 자동화 워크플로를 설계하고, 학습시키고, 최적화합니다.',
    },
    location: REMOTE,
    type: FULL_TIME,
    responsibilities: [
      {
        en: 'Implement secure API pipelines',
        bs: 'Implementacija sigurnih API pipelinea',
        de: 'Sichere API-Pipelines implementieren',
        fr: 'Mettre en place des pipelines d’API sécurisés',
        es: 'Implementar pipelines de API seguros',
        sv: 'Implementera säkra API-pipelines',
        ja: 'セキュアなAPIパイプラインの実装',
        ko: '안전한 API 파이프라인 구현',
      },
      {
        en: 'Manage stateful LLM context',
        bs: 'Upravljanje kontekstom LLM-a sa stanjem',
        de: 'Zustandsbehafteten LLM-Kontext verwalten',
        fr: 'Gérer le contexte des LLM avec état',
        es: 'Gestionar el contexto con estado de los LLM',
        sv: 'Hantera tillståndsbaserad LLM-kontext',
        ja: 'ステートフルなLLMコンテキストの管理',
        ko: '상태 기반 LLM 컨텍스트 관리',
      },
      {
        en: 'Reduce response latencies',
        bs: 'Smanjenje latencije odgovora',
        de: 'Antwortlatenzen reduzieren',
        fr: 'Réduire les temps de réponse',
        es: 'Reducir la latencia de las respuestas',
        sv: 'Minska svarslatenser',
        ja: '応答レイテンシの削減',
        ko: '응답 지연 시간 단축',
      },
      {
        en: 'Build intelligent agent features',
        bs: 'Razvoj funkcionalnosti inteligentnih agenata',
        de: 'Intelligente Agenten-Features entwickeln',
        fr: 'Développer des fonctionnalités d’agents intelligents',
        es: 'Desarrollar funciones de agentes inteligentes',
        sv: 'Bygga funktioner för intelligenta agenter',
        ja: 'インテリジェントなエージェント機能の開発',
        ko: '지능형 에이전트 기능 개발',
      },
    ],
  },
  {
    id: 'legal-tech-compliance-specialist',
    title: {
      en: 'Legal Tech & Compliance Specialist',
      bs: 'Specijalista za pravnu tehnologiju i usklađenost',
      de: 'Legal Tech & Compliance Specialist (m/w/d)',
      fr: 'Spécialiste legal tech et conformité',
      es: 'Especialista en legal tech y cumplimiento normativo',
      sv: 'Specialist inom legal tech & regelefterlevnad',
      ja: 'リーガルテック・コンプライアンススペシャリスト',
      ko: '리걸테크 · 컴플라이언스 전문가',
    },
    department: {
      en: 'Strategy & Legal Operations',
      bs: 'Strategija i pravne operacije',
      de: 'Strategie & Legal Operations',
      fr: 'Stratégie et opérations juridiques',
      es: 'Estrategia y operaciones legales',
      sv: 'Strategi & juridisk verksamhet',
      ja: '戦略・リーガルオペレーション',
      ko: '전략 · 법무 운영',
    },
    summary: {
      en: 'Bridge the gap between software features and regulatory compliance (GDPR, data privacy, intellectual property, and digital rights management).',
      bs: 'Premostite jaz između softverskih funkcionalnosti i regulatorne usklađenosti (GDPR, privatnost podataka, intelektualno vlasništvo i upravljanje digitalnim pravima).',
      de: 'Schlage die Brücke zwischen Software-Features und regulatorischer Compliance (DSGVO, Datenschutz, geistiges Eigentum und digitales Rechtemanagement).',
      fr: 'Faites le lien entre les fonctionnalités logicielles et la conformité réglementaire (RGPD, protection des données, propriété intellectuelle et gestion des droits numériques).',
      es: 'Tiende puentes entre las funcionalidades del software y el cumplimiento normativo (RGPD, privacidad de datos, propiedad intelectual y gestión de derechos digitales).',
      sv: 'Överbrygga klyftan mellan mjukvarufunktioner och regelefterlevnad (GDPR, dataskydd, immateriella rättigheter och hantering av digitala rättigheter).',
      ja: 'ソフトウェアの機能と規制遵守（GDPR、データプライバシー、知的財産、デジタル著作権管理）との橋渡し役を担っていただきます。',
      ko: '소프트웨어 기능과 규제 준수(GDPR, 데이터 프라이버시, 지식재산권, 디지털 저작권 관리) 사이의 간극을 메워 주세요.',
    },
    location: REMOTE,
    type: FULL_TIME,
    responsibilities: [
      {
        en: 'Review product workflows for regulatory alignment',
        bs: 'Pregled produktnih tokova rada radi usklađenosti s propisima',
        de: 'Produkt-Workflows auf regulatorische Konformität prüfen',
        fr: 'Vérifier la conformité réglementaire des parcours produit',
        es: 'Revisar los flujos del producto para garantizar su alineación normativa',
        sv: 'Granska produktflöden utifrån regulatoriska krav',
        ja: 'プロダクトのワークフローが規制に沿っているかのレビュー',
        ko: '제품 워크플로의 규제 적합성 검토',
      },
      {
        en: 'Draft user agreements and privacy policies',
        bs: 'Izrada korisničkih ugovora i politika privatnosti',
        de: 'Nutzungsbedingungen und Datenschutzerklärungen verfassen',
        fr: 'Rédiger les conditions d’utilisation et les politiques de confidentialité',
        es: 'Redactar acuerdos de usuario y políticas de privacidad',
        sv: 'Utforma användaravtal och integritetspolicyer',
        ja: '利用規約およびプライバシーポリシーの起草',
        ko: '이용 약관 및 개인정보 처리방침 작성',
      },
      {
        en: 'Advise on legal-tech product scaling',
        bs: 'Savjetovanje o skaliranju legal-tech proizvoda',
        de: 'Beratung zur Skalierung von Legal-Tech-Produkten',
        fr: 'Conseiller sur le passage à l’échelle des produits legal tech',
        es: 'Asesorar sobre el escalado de productos legal tech',
        sv: 'Ge råd kring skalning av legal tech-produkter',
        ja: 'リーガルテック製品のスケーリングに関する助言',
        ko: '리걸테크 제품 확장에 대한 자문',
      },
    ],
  },
];
