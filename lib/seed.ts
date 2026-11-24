import type { SiteContent } from "./types";

/**
 * Sample content, carried over from the approved demo.
 * Shown until the CMS has content (or when no backend is connected).
 * Everything here still needs confirming with NMAG.
 */
export const SEED: SiteContent = {
  sample: true,
  settings: {
    identity: {
      title: "National Museum & Art Gallery",
      short: "NMAG",
      tagline: "Papua New Guinea's national collection of culture, history and art",
    },
    header: {
      banner: "An official website of the Government of Papua New Guinea",
      nav: [
        { id: "home", label: "Home", tp: "Hom", on: true },
        { id: "about", label: "About", tp: "Long Mipela", on: true },
        { id: "exhibitions", label: "Exhibitions", tp: "Soim", on: true },
        { id: "collections", label: "Collections", tp: "Ol Samting Bilong Bipo", on: true },
        { id: "visit", label: "Plan a Visit", tp: "Kam Lukim", on: true },
        { id: "learn", label: "Learning", tp: "Skul", on: true },
        { id: "news", label: "News", tp: "Nius", on: true },
        { id: "contact", label: "Contact", tp: "Toktok", on: true },
      ],
    },
    welcome: {
      name: "Office of the Director",
      role: "Director, National Museum & Art Gallery",
      initials: "NM",
      text: "The National Museum & Art Gallery holds objects made by people from every province of Papua New Guinea. Our job is to look after them, to study them with the communities they belong to, and to make sure every Papua New Guinean can see them. Welcome to your museum.",
    },
    keyFacts: [
      { n: "1954", l: "Founded as a national collection" },
      { n: "22", l: "Provinces represented" },
      { n: "8", l: "Galleries open to the public" },
      { n: "1977", l: "Waigani building opened" },
    ],
    sections: [
      { id: "kpis", label: "Key facts", on: true },
      { id: "welcome", label: "Director's welcome", on: true },
      { id: "exhibitions", label: "Exhibitions", on: true },
      { id: "collections", label: "Collections", on: true },
      { id: "visit", label: "Visit info", on: true },
      { id: "news", label: "News", on: true },
    ],
    widgets: {
      announce: true,
      announceText: "Galleries 3 and 4 are closed for re-installation. All other galleries are open as usual.",
      backToTop: true,
      chat: true,
    },
    siteMode: {
      value: "live",
      back: "Today, 2:00 pm",
      title: "We're rehanging the website",
      msg: "Our website is closed for scheduled maintenance while we make improvements. The galleries at Waigani are open as usual.",
      tp: "Mipela i wok long stretim websait. Haus tumbuna i op olsem oltaim.",
      launch: "",
      soonTitle: "Our new website opens soon",
      soonMsg: "The National Museum & Art Gallery is launching a new website. The galleries at Waigani are open as usual.",
      soonTp: "Nupela websait bilong mipela bai op klostu.",
    },
    visit: {
      address: "Independence Drive, Waigani, National Capital District",
      phone: "+675 000 0000",
      email: "info@museum.gov.pg",
      hours: [
        ["Monday – Friday", "8:30 am – 3:30 pm"],
        ["Saturday", "9:00 am – 3:00 pm"],
        ["Sunday & public holidays", "Closed"],
      ],
      fees: [
        ["PNG citizens", "Free"],
        ["School groups (booked)", "Free"],
        ["International visitors", "K10"],
      ],
    },
    footer: {
      about: "The National Museum & Art Gallery is the custodian of Papua New Guinea's cultural, natural and artistic heritage.",
      copy: "© 2026 National Museum & Art Gallery, Papua New Guinea",
    },
    chat: {
      title: "Museum helper (automated)",
      greeting: "Hello! What would you like to know?",
      items: [
        { label: "Opening hours", icon: "clock", src: "hours", answer: "" },
        { label: "Entry fees", icon: "ticket", src: "fees", answer: "" },
        { label: "School visits", icon: "cap", src: "text", answer: "School groups are free when booked. Use the Contact page to book." },
      ],
    },
  },
  heroSlides: [
    { id: "s1", tag: "Now showing", title: "Voices of the <em>Sepik</em>", text: "Carved spirit boards, orators' stools and garamut drums from river villages, shown together for the first time in a generation.", cta: "See the exhibition", ctaLink: "/exhibitions" },
    { id: "s2", tag: "Repatriation", title: "Objects coming <em>home</em>", text: "Follow the return of cultural material from overseas institutions to the communities and the national collection.", cta: "Read the story", ctaLink: "/news" },
    { id: "s3", tag: "Free entry for schools", title: "Bring your class to <em>Waigani</em>", text: "Guided tours, handling sessions and teaching packs matched to the PNG curriculum.", cta: "Book a school visit", ctaLink: "/learn" },
  ],
  exhibitions: [
    { id: "e1", title: "Voices of the Sepik", region: "East Sepik", status: "On now", dates: "Until 28 Feb 2027", gallery: "Gallery 1", summary: "Spirit boards, orators' stools and garamut drums from the middle Sepik River.", pattern: 0 },
    { id: "e2", title: "Bilas: Body Adornment", region: "Highlands", status: "On now", dates: "Until 15 Dec 2026", gallery: "Gallery 2", summary: "Shell, feather and pig-tusk adornment worn at sing-sings, with the stories of who made them.", pattern: 1 },
    { id: "e3", title: "Lakatoi: Voyages of the Hiri", region: "Central", status: "Opening soon", dates: "From 16 Sep 2027", gallery: "Main Hall", summary: "The Motu trading voyages between Port Moresby and the Gulf, told through canoe parts and pots.", pattern: 3 },
    { id: "e4", title: "Masks of New Ireland", region: "New Ireland", status: "On now", dates: "Permanent", gallery: "Gallery 5", summary: "Malagan carvings made for memorial ceremonies, and what they meant to the clans that made them.", pattern: 2 },
    { id: "e5", title: "Contemporary PNG Painting", region: "National", status: "Past", dates: "Closed Aug 2026", gallery: "Art Gallery", summary: "Canvas works by PNG painters from the 1970s to today.", pattern: 4 },
    { id: "e6", title: "War in the Pacific 1942–45", region: "Oro & Morobe", status: "On now", dates: "Permanent", gallery: "Gallery 7", summary: "Objects and oral histories from the Kokoda Track and the north coast campaigns.", pattern: 5 },
  ],
  collections: [
    { id: "c1", name: "Ethnography", note: "Largest collection", type: "Cultural", text: "Carvings, masks, shields, string bags, pottery and canoes from all provinces." },
    { id: "c2", name: "Archaeology", note: "Sites across PNG", type: "Science", text: "Stone tools, Lapita pottery and material from excavations including Kuk Early Agricultural Site." },
    { id: "c3", name: "Natural History", note: "Reference collection", type: "Science", text: "Birds, insects, reptiles and plant specimens used by researchers." },
    { id: "c4", name: "Modern History", note: "Colonial to Independence", type: "History", text: "War relics, documents and objects from the colonial era to 1975 and after." },
    { id: "c5", name: "Contemporary Art", note: "National art collection", type: "Art", text: "Paintings, prints and sculpture by Papua New Guinean artists." },
    { id: "c6", name: "Photographs & Film", note: "Archive", type: "History", text: "Field photographs, film and sound recordings of cultural practice." },
  ],
  learning: [
    { id: "l1", title: "Guided school tours", text: "Grades 3–12, 60 minutes, booked two weeks ahead." },
    { id: "l2", title: "Object handling", text: "Students handle replica objects with a curator." },
    { id: "l3", title: "Teacher packs", text: "Lesson plans that use the collection, matched to the PNG curriculum." },
  ],
  news: [
    { id: "n1", title: "Sepik spirit boards return after conservation", date: "14 Oct 2026", category: "Collections", excerpt: "Twelve boards are back on display after six months of conservation work." },
    { id: "n2", title: "School holiday programme announced", date: "02 Oct 2026", category: "Learning", excerpt: "Weaving, drawing and storytelling sessions run every weekday morning in December." },
    { id: "n3", title: "Call for contemporary artists", date: "19 Sep 2026", category: "Art Gallery", excerpt: "Expressions of interest are open for the 2027 national contemporary art show." },
  ],
};
