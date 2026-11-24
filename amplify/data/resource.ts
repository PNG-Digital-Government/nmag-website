import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

/**
 * Website content edited through the Admin dashboard.
 *
 * Visitors read everything through the public API key.
 * ADMINISTRATOR and EDITOR staff can create, edit and delete content.
 * CONTRIBUTOR staff can create and edit content, but not delete it.
 * Site-wide settings (colours, menu, Site Mode, visit info, help chat) can be
 * changed by ADMINISTRATOR, and edited (not deleted) by EDITOR.
 */
const contentRules = (allow: any) => [
  allow.publicApiKey().to(["read"]),
  allow.groups(["ADMINISTRATOR", "EDITOR"]),
  allow.groups(["CONTRIBUTOR"]).to(["create", "read", "update"]),
];

const schema = a.schema({
  /** One record with key "site". Each field holds a group of settings as JSON. */
  SiteSettings: a
    .model({
      key: a.id().required(),
      identity: a.json(), // title, short name, tagline
      header: a.json(), // official banner text, menu items with Tok Pisin labels
      welcome: a.json(), // Director's name, role, initials, message, imagePath, imageAlt
      keyFacts: a.json(), // [{ n, l }]
      sections: a.json(), // homepage section order and visibility
      widgets: a.json(), // announcement bar, back-to-top, help chat on/off
      siteMode: a.json(), // live / maintenance / soon, with gate texts
      visit: a.json(), // address, phone, email, hours, fees
      footer: a.json(), // about text, copyright line
      chat: a.json(), // help chat title, greeting, quick-question buttons
    })
    .identifier(["key"])
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.groups(["ADMINISTRATOR"]),
      allow.groups(["EDITOR"]).to(["read", "update"]),
    ]),

  HeroSlide: a
    .model({
      order: a.integer().default(0),
      tag: a.string(),
      title: a.string().required(), // may contain <em> around the highlighted word
      text: a.string(),
      cta: a.string(),
      ctaLink: a.string(),
      imagePath: a.string(),
      imageAlt: a.string(),
    })
    .authorization(contentRules),

  Exhibition: a
    .model({
      order: a.integer().default(0),
      title: a.string().required(),
      region: a.string(),
      status: a.string().default("On now"), // "On now" | "Opening soon" | "Past"
      dates: a.string(),
      gallery: a.string(),
      summary: a.string(),
      pattern: a.integer().default(0),
      imagePath: a.string(),
      imageAlt: a.string(),
    })
    .authorization(contentRules),

  CollectionArea: a
    .model({
      order: a.integer().default(0),
      name: a.string().required(),
      type: a.string(),
      note: a.string(),
      text: a.string(),
      imagePath: a.string(),
      imageAlt: a.string(),
    })
    .authorization(contentRules),

  LearningItem: a
    .model({
      order: a.integer().default(0),
      title: a.string().required(),
      text: a.string(),
      imagePath: a.string(),
      imageAlt: a.string(),
    })
    .authorization(contentRules),

  NewsPost: a
    .model({
      order: a.integer().default(0),
      title: a.string().required(),
      date: a.string(),
      category: a.string(),
      excerpt: a.string(),
      body: a.string(),
      imagePath: a.string(),
      imageAlt: a.string(),
    })
    .authorization(contentRules),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API keys last at most 365 days. Renew it before it expires (see README).
    apiKeyAuthorizationMode: { expiresInDays: 365 },
  },
});
