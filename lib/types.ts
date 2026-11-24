export type Pair = [string, string];

export interface NavItem {
  id: string; // route: "home" -> "/", otherwise "/<id>"
  label: string;
  tp: string; // Tok Pisin label
  on: boolean;
}

export interface SiteSettings {
  identity: { title: string; short: string; tagline: string };
  header: { banner: string; nav: NavItem[] };
  welcome: {
    name: string;
    role: string;
    initials: string;
    text: string;
    imagePath?: string;
    imageAlt?: string;
  };
  keyFacts: { n: string; l: string }[];
  sections: { id: HomeSectionId; label: string; on: boolean }[];
  widgets: { announce: boolean; announceText: string; backToTop: boolean; chat: boolean };
  siteMode: {
    value: "live" | "maintenance" | "soon";
    back: string;
    title: string;
    msg: string;
    tp: string;
    launch: string; // ISO date-time for the coming-soon countdown
    soonTitle: string;
    soonMsg: string;
    soonTp: string;
  };
  visit: { address: string; phone: string; email: string; hours: Pair[]; fees: Pair[] };
  footer: { about: string; copy: string };
  chat: { title: string; greeting: string; items: ChatItem[] };
}

export type HomeSectionId = "kpis" | "welcome" | "exhibitions" | "collections" | "visit" | "news";

export type ChatIcon = "clock" | "ticket" | "cap" | "pin" | "phone" | "info" | "camera";

export interface ChatItem {
  label: string;
  icon: ChatIcon;
  src: "text" | "hours" | "fees"; // where the answer comes from
  answer: string;
  note?: string;
}

interface WithImage {
  imagePath?: string | null;
  imageAlt?: string | null;
  /** Resolved, viewable URL for imagePath (filled in on the server). */
  imageUrl?: string | null;
}

export interface HeroSlide extends WithImage {
  id: string;
  tag: string;
  title: string;
  text: string;
  cta: string;
  ctaLink: string;
}

export type ExhibitionStatus = "On now" | "Opening soon" | "Past";

export interface Exhibition extends WithImage {
  id: string;
  title: string;
  region: string;
  status: ExhibitionStatus;
  dates: string;
  gallery: string;
  summary: string;
  pattern: number;
}

export interface CollectionArea extends WithImage {
  id: string;
  name: string;
  type: string;
  note: string;
  text: string;
}

export interface LearningItem extends WithImage {
  id: string;
  title: string;
  text: string;
}

export interface NewsPost extends WithImage {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  body?: string;
}

export interface SiteContent {
  settings: SiteSettings & { welcomeImageUrl?: string | null };
  heroSlides: HeroSlide[];
  exhibitions: Exhibition[];
  collections: CollectionArea[];
  learning: LearningItem[];
  news: NewsPost[];
  /** true when content comes from the built-in sample set rather than the CMS */
  sample: boolean;
}
