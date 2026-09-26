import type { Locale } from '@/lib/i18n/config';

/** English is required; other languages are optional and fall back to English. */
export type LocalizedText = { en: string } & Partial<Record<Exclude<Locale, 'en'>, string>>;

export interface TeamMember {
  id: string;
  name: string;
  role: LocalizedText;
  bio: LocalizedText;
  /** Optional photo in /public, e.g. '/team/armin.jpg' (square, at least 480×480). Initials are shown without one. */
  photo?: string;
  email?: string;
  linkedin?: string;
}

export function localized(text: LocalizedText, locale: Locale): string {
  return (locale !== 'en' && text[locale]) || text.en;
}

/*
 * Photos are optional. Translations are optional per field, e.g.
 * bio: { en: '…', bs: '…', de: '…' }.
 */
export const TEAM: TeamMember[] = [
  {
    id: 'armin',
    name: 'Armin Imamović',
    role: {
      en: 'Co-Founder & Lead Software Engineer',
      bs: 'Suosnivač i glavni softverski inženjer',
      de: 'Mitgründer & Lead Software Engineer',
      fr: 'Cofondateur et ingénieur logiciel principal',
      es: 'Cofundador e ingeniero de software principal',
      sv: 'Medgrundare & ledande mjukvaruingenjör',
      ja: '共同創業者・リードソフトウェアエンジニア',
      ko: '공동 창업자 · 리드 소프트웨어 엔지니어',
    },
    bio: {
      en:
        'Software engineer specializing in architecting high-performance web applications and engineering advanced AI chatbots. ' +
        'Focuses on pushing the limits of web tech, implementing immersive Three.js spatial scenes, optimizing execution speed, and crafting buttery-smooth interactive states. ' +
        'Driven by a passion for clean code architecture, modular design systems, and bridging raw computational logic with fluid, organic user interfaces.',
      bs:
        'Softverski inženjer specijaliziran za arhitekturu web aplikacija visokih performansi i razvoj naprednih AI chatbotova. ' +
        'Fokusiran na pomjeranje granica web tehnologija kroz imerzivne prostorne scene u Three.js-u, optimizaciju brzine izvršavanja i besprijekorno glatke interaktivne prelaze. ' +
        'Pokreće ga strast prema čistoj arhitekturi koda, modularnim dizajn sistemima i spajanju sirove računarske logike s fluidnim, organskim korisničkim interfejsima.',
      de:
        'Softwareentwickler mit Schwerpunkt auf der Architektur leistungsstarker Webanwendungen und der Entwicklung fortschrittlicher KI-Chatbots. ' +
        'Er lotet die Grenzen der Webtechnologie aus – mit immersiven räumlichen Szenen in Three.js, optimierter Ausführungsgeschwindigkeit und butterweichen Interaktionen. ' +
        'Angetrieben von einer Leidenschaft für saubere Code-Architektur, modulare Designsysteme und die Verbindung roher Rechenlogik mit fließenden, organischen Benutzeroberflächen.',
      fr:
        'Ingénieur logiciel spécialisé dans l’architecture d’applications web hautes performances et le développement de chatbots IA avancés. ' +
        'Il repousse les limites du web avec des scènes spatiales immersives en Three.js, une vitesse d’exécution optimisée et des états interactifs d’une fluidité parfaite. ' +
        'Animé par une passion pour une architecture de code propre, les design systems modulaires et le lien entre logique de calcul brute et interfaces fluides et organiques.',
      es:
        'Ingeniero de software especializado en la arquitectura de aplicaciones web de alto rendimiento y el desarrollo de chatbots de IA avanzados. ' +
        'Se centra en llevar la tecnología web al límite con escenas espaciales inmersivas en Three.js, una velocidad de ejecución optimizada y estados interactivos de una fluidez impecable. ' +
        'Le apasionan la arquitectura de código limpio, los sistemas de diseño modulares y unir la lógica computacional pura con interfaces de usuario fluidas y orgánicas.',
      sv:
        'Mjukvaruingenjör specialiserad på att arkitektera högpresterande webbapplikationer och utveckla avancerade AI-chattbottar. ' +
        'Fokuserar på att tänja på webbteknikens gränser med immersiva spatiala scener i Three.js, optimerad körhastighet och silkeslena interaktiva tillstånd. ' +
        'Drivs av en passion för ren kodarkitektur, modulära designsystem och att förena rå beräkningslogik med flytande, organiska användargränssnitt.',
      ja:
        '高性能なWebアプリケーションの設計と、高度なAIチャットボットの開発を専門とするソフトウェアエンジニア。' +
        'Three.jsによる没入感のある空間シーンの実装、実行速度の最適化、なめらかなインタラクションの追求を通じて、Web技術の限界に挑んでいます。' +
        'クリーンなコードアーキテクチャとモジュール型デザインシステムを重視し、純粋な計算ロジックと流れるような有機的なUIの橋渡しに情熱を注いでいます。',
      ko:
        '고성능 웹 애플리케이션 설계와 고급 AI 챗봇 개발을 전문으로 하는 소프트웨어 엔지니어입니다. ' +
        'Three.js 기반의 몰입감 있는 공간 장면 구현, 실행 속도 최적화, 매끄러운 인터랙션 구현을 통해 웹 기술의 한계를 넓히는 데 집중하고 있습니다. ' +
        '깔끔한 코드 아키텍처와 모듈식 디자인 시스템, 그리고 순수한 연산 로직과 유려하고 유기적인 사용자 인터페이스를 잇는 일에 열정을 가지고 있습니다.',
    },
    photo: '/team/armin.jpg',
    linkedin: 'https://www.linkedin.com/in/armin-imamovi%C4%87-1a90ba439/',
  },
  {
    id: 'ahmed',
    name: 'Ahmed Mašala',
    role: {
      en: 'Co-Founder & Product Strategy / Legal Tech Lead',
      bs: 'Suosnivač, voditelj produktne strategije i pravne tehnologije',
      de: 'Mitgründer & Leiter Produktstrategie / Legal Tech',
      fr: 'Cofondateur, responsable stratégie produit et legal tech',
      es: 'Cofundador, responsable de estrategia de producto y legal tech',
      sv: 'Medgrundare & ansvarig för produktstrategi / legal tech',
      ja: '共同創業者・プロダクト戦略／リーガルテック責任者',
      ko: '공동 창업자 · 제품 전략 / 리걸테크 리드',
    },
    bio: {
      en:
        'Law student bringing a rare, strategic perspective to software development, compliance, data privacy, and digital rights. ' +
        'Focuses on shaping Wireish’s product roadmap, ensuring robust legal-tech readiness, and designing intuitive user-centric experiences that balance powerful features with absolute clarity. ' +
        'Driven by the intersection of law and technology, building secure, compliant, and universally accessible digital products.',
      bs:
        'Student prava koji donosi rijetku, stratešku perspektivu u razvoj softvera, usklađenost s propisima, zaštitu podataka i digitalna prava. ' +
        'Fokusiran na oblikovanje Wireishove produktne mape puta, osiguravanje pune pravno-tehnološke spremnosti i dizajn intuitivnih iskustava usmjerenih na korisnika koja spajaju moćne funkcije s potpunom jasnoćom. ' +
        'Pokreće ga spoj prava i tehnologije, a gradi sigurne, usklađene i univerzalno pristupačne digitalne proizvode.',
      de:
        'Jurastudent, der eine seltene, strategische Perspektive auf Softwareentwicklung, Compliance, Datenschutz und digitale Rechte einbringt. ' +
        'Er gestaltet die Produkt-Roadmap von Wireish, sorgt für solide rechtliche und regulatorische Einsatzbereitschaft und entwirft intuitive, nutzerzentrierte Erlebnisse, die starke Funktionen mit absoluter Klarheit verbinden. ' +
        'Angetrieben von der Schnittstelle zwischen Recht und Technologie, entwickelt er sichere, konforme und für alle zugängliche digitale Produkte.',
      fr:
        'Étudiant en droit, il apporte un regard stratégique rare sur le développement logiciel, la conformité, la protection des données et les droits numériques. ' +
        'Il façonne la feuille de route produit de Wireish, garantit une solide préparation juridique et technique, et conçoit des expériences intuitives centrées sur l’utilisateur qui allient fonctionnalités puissantes et clarté absolue. ' +
        'Animé par la rencontre du droit et de la technologie, il construit des produits numériques sûrs, conformes et accessibles à tous.',
      es:
        'Estudiante de Derecho que aporta una perspectiva estratégica poco común al desarrollo de software, el cumplimiento normativo, la privacidad de datos y los derechos digitales. ' +
        'Se centra en definir la hoja de ruta de producto de Wireish, garantizar una sólida preparación legal y tecnológica, y diseñar experiencias intuitivas centradas en el usuario que equilibran funciones potentes con una claridad absoluta. ' +
        'Motivado por la intersección entre el derecho y la tecnología, construye productos digitales seguros, conformes a la normativa y accesibles para todos.',
      sv:
        'Juriststudent som tillför ett ovanligt, strategiskt perspektiv på mjukvaruutveckling, regelefterlevnad, dataskydd och digitala rättigheter. ' +
        'Fokuserar på att forma Wireishs produktplan, säkerställa en robust beredskap inom legal tech och utforma intuitiva, användarcentrerade upplevelser som förenar kraftfulla funktioner med absolut tydlighet. ' +
        'Drivs av mötet mellan juridik och teknik, och bygger säkra, regelefterlevande och universellt tillgängliga digitala produkter.',
      ja:
        '法学を学ぶ立場から、ソフトウェア開発、コンプライアンス、データプライバシー、デジタル権利に独自の戦略的視点をもたらしています。' +
        'Wireishのプロダクトロードマップの策定、リーガルテック面での万全な備え、そして強力な機能と明快さを両立する直感的でユーザー中心の体験設計を担っています。' +
        '法とテクノロジーの交差点に原動力を見いだし、安全でコンプライアンスに準拠した、誰もが利用できるデジタルプロダクトを築いています。',
      ko:
        '법학을 공부하며 소프트웨어 개발, 규정 준수, 데이터 프라이버시, 디지털 권리에 보기 드문 전략적 관점을 더합니다. ' +
        'Wireish의 제품 로드맵을 수립하고, 리걸테크 측면의 탄탄한 준비를 갖추며, 강력한 기능과 명확성을 균형 있게 담은 직관적인 사용자 중심 경험을 설계합니다. ' +
        '법과 기술의 교차점에서 동기를 얻어, 안전하고 규정을 준수하며 누구나 접근할 수 있는 디지털 제품을 만듭니다.',
    },
    photo: '/team/ahmed.jpg',
    linkedin: 'https://www.linkedin.com/in/ahmed-ma%C5%A1ala-b97524261/',
  },
];
