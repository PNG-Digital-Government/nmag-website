import { cache } from "react";
import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { generateServerClientUsingReqRes } from "@aws-amplify/adapter-nextjs/data";
import { getUrl } from "aws-amplify/storage/server";
import type { Schema } from "@/amplify/data/resource";
import { amplifyOutputs } from "./amplify-outputs";
import { SEED } from "./seed";
import type { AmplifyServer } from "aws-amplify/adapter-core";
import type { CollectionArea, Exhibition, HeroSlide, LearningItem, NewsPost, SiteContent, SiteSettings } from "./types";

type Ctx = AmplifyServer.ContextSpec;

const runner = amplifyOutputs ? createServerRunner({ config: amplifyOutputs }) : null;
const client = amplifyOutputs ? generateServerClientUsingReqRes<Schema>({ config: amplifyOutputs }) : null;

/** Runs an Amplify call as a public visitor (no sign-in). */
function asVisitor<T>(operation: (ctx: Ctx) => Promise<T>): Promise<T> {
  if (!runner) throw new Error("Amplify is not configured");
  return runner.runWithAmplifyServerContext({ nextServerContext: null, operation }) as Promise<T>;
}

function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

const byOrder = (a: { order?: number | null }, b: { order?: number | null }) => (a.order ?? 0) - (b.order ?? 0);

async function imageUrl(path?: string | null): Promise<string | null> {
  if (!path) return null;
  try {
    const res = await asVisitor((ctx) => getUrl(ctx, { path, options: { expiresIn: 60 * 60 * 6 } }));
    return res.url.toString();
  } catch {
    return null;
  }
}

async function withImages<T extends { imagePath?: string | null }>(items: T[]): Promise<(T & { imageUrl: string | null })[]> {
  return Promise.all(items.map(async (i) => ({ ...i, imageUrl: await imageUrl(i.imagePath) })));
}

/** Leaves out null fields so the sample defaults fill those gaps. */
function clean<T extends object>(o: T): T {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null && v !== undefined)) as T;
}

/**
 * Everything the public site needs, fetched once per request.
 * Falls back to the sample content when no backend is connected,
 * when the CMS is still empty, or when the CMS can't be reached.
 */
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  if (!client || !runner) return SEED;
  const db = client;

  try {
    const opts = { authMode: "apiKey" as const, limit: 500 };
    const [settingsRes, hero, ex, col, learn, news] = await Promise.all([
      asVisitor((ctx) => db.models.SiteSettings.get(ctx, { key: "site" }, { authMode: "apiKey" })),
      asVisitor((ctx) => db.models.HeroSlide.list(ctx, opts)),
      asVisitor((ctx) => db.models.Exhibition.list(ctx, opts)),
      asVisitor((ctx) => db.models.CollectionArea.list(ctx, opts)),
      asVisitor((ctx) => db.models.LearningItem.list(ctx, opts)),
      asVisitor((ctx) => db.models.NewsPost.list(ctx, opts)),
    ]);

    const s = settingsRes.data;
    const d = SEED.settings;
    const settings: SiteSettings = s
      ? {
          identity: { ...d.identity, ...parseJson(s.identity, {}) },
          header: { ...d.header, ...parseJson(s.header, {}) },
          welcome: { ...d.welcome, ...parseJson(s.welcome, {}) },
          keyFacts: parseJson(s.keyFacts, d.keyFacts),
          sections: parseJson(s.sections, d.sections),
          widgets: { ...d.widgets, ...parseJson(s.widgets, {}) },
          siteMode: { ...d.siteMode, ...parseJson(s.siteMode, {}) },
          visit: { ...d.visit, ...parseJson(s.visit, {}) },
          footer: { ...d.footer, ...parseJson(s.footer, {}) },
          chat: { ...d.chat, ...parseJson(s.chat, {}) },
        }
      : d;

    // Each list uses the sample items until staff add the first real one.
    const pick = <U,>(rows: readonly object[] | null | undefined, sample: U[], base: Partial<U>): U[] =>
      rows && rows.length ? [...rows].sort((a, b) => byOrder(a as { order?: number | null }, b as { order?: number | null })).map((r) => ({ ...base, ...clean(r) }) as U) : sample;

    const heroSlides = pick<HeroSlide>(hero.data, SEED.heroSlides, { tag: "", text: "", cta: "", ctaLink: "/exhibitions" });
    const exhibitions = pick<Exhibition>(ex.data, SEED.exhibitions, { region: "", status: "On now", dates: "", gallery: "", summary: "", pattern: 0 });
    const collections = pick<CollectionArea>(col.data, SEED.collections, { type: "", note: "", text: "" });
    const learning = pick<LearningItem>(learn.data, SEED.learning, { text: "" });
    const newsPosts = pick<NewsPost>(news.data, SEED.news, { date: "", category: "", excerpt: "" });

    const [h, e, c, l, n, welcomeImageUrl] = await Promise.all([
      withImages(heroSlides),
      withImages(exhibitions),
      withImages(collections),
      withImages(learning),
      withImages(newsPosts),
      imageUrl(settings.welcome.imagePath),
    ]);

    return {
      sample: !s && !hero.data?.length && !ex.data?.length,
      settings: { ...settings, welcomeImageUrl },
      heroSlides: h,
      exhibitions: e,
      collections: c,
      learning: l,
      news: n,
    };
  } catch (err) {
    console.error("Could not load content from Amplify, showing sample content instead.", err);
    return SEED;
  }
});

/** The answer text for a help chat button. */
export function chatAnswer(item: SiteSettings["chat"]["items"][number], visit: SiteSettings["visit"]): string {
  if (item.src === "hours") return visit.hours.map((h) => h.join(": ")).join(" · ");
  if (item.src === "fees") return visit.fees.map((f) => f.join(": ")).join(" · ");
  return item.answer;
}
