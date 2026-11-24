import Link from "next/link";
import type { ReactNode } from "react";
import type { CollectionArea, Exhibition, LearningItem, NewsPost } from "@/lib/types";
import { coverClass } from "@/lib/text";

export function Pill({ status }: { status: string }) {
  const cls = status === "On now" ? "on" : status === "Past" ? "past" : "soon";
  return <span className={`pill ${cls}`}>{status}</span>;
}

/** Card banner: the uploaded picture if there is one, otherwise a pattern. */
function Cover({
  pattern,
  imageUrl,
  imageAlt,
  ratio,
  children,
}: {
  pattern: number;
  imageUrl?: string | null;
  imageAlt?: string | null;
  ratio?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`cov ${coverClass(pattern)}${imageUrl ? " hasimg" : ""}`} style={ratio ? { aspectRatio: ratio } : undefined}>
      {imageUrl && <img src={imageUrl} alt={imageAlt ?? ""} />}
      {children}
    </div>
  );
}

export function ExhibitionCard({ e }: { e: Exhibition }) {
  return (
    <article className="card">
      <Cover pattern={e.pattern} imageUrl={e.imageUrl} imageAlt={e.imageAlt}>
        <Pill status={e.status} />
      </Cover>
      <div className="body">
        <span className="eyebrow">{e.region}</span>
        <h3>{e.title}</h3>
        <p>{e.summary}</p>
        <div className="meta">
          <span>{e.gallery}</span>
          <span>{e.dates}</span>
        </div>
      </div>
    </article>
  );
}

export function CollectionCard({ c, i }: { c: CollectionArea; i: number }) {
  return (
    <article className="card">
      <Cover pattern={i + 2} imageUrl={c.imageUrl} imageAlt={c.imageAlt} ratio="3/1" />
      <div className="body">
        <span className="eyebrow">{c.type}</span>
        <h3>{c.name}</h3>
        <p>{c.text}</p>
        <div className="meta">
          <span>{c.note}</span>
        </div>
      </div>
    </article>
  );
}

export function NewsCard({ n, i }: { n: NewsPost; i: number }) {
  return (
    <article className="card">
      <Cover pattern={i + 1} imageUrl={n.imageUrl} imageAlt={n.imageAlt} ratio="2/1">
        {n.category && <span className="pill">{n.category}</span>}
      </Cover>
      <div className="body">
        <h3>{n.title}</h3>
        <p>{n.excerpt}</p>
        <div className="meta">
          <span>{n.date}</span>
        </div>
      </div>
    </article>
  );
}

export function LearningCard({ l, i }: { l: LearningItem; i: number }) {
  return (
    <article className="card">
      <Cover pattern={i + 3} imageUrl={l.imageUrl} imageAlt={l.imageAlt} ratio="3/1" />
      <div className="body">
        <h3>{l.title}</h3>
        <p>{l.text}</p>
      </div>
    </article>
  );
}

export function SecHead({
  eyebrow,
  title,
  text,
  link,
}: {
  eyebrow: ReactNode;
  title: string;
  text?: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="sec-head">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      {link && (
        <Link className="btn btn-outline btn-sm" href={link.href}>
          {link.label} →
        </Link>
      )}
    </div>
  );
}

export function PageHead({ crumb, title, text }: { crumb: ReactNode; title: string; text?: string }) {
  return (
    <div className="ph">
      <div className="wrap">
        <div className="crumb">
          <Link href="/">Home</Link> / {crumb}
        </div>
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
    </div>
  );
}

export function PairList({ rows }: { rows: [string, string][] }) {
  return (
    <ul className="list">
      {rows.map(([a, b], i) => (
        <li key={i}>
          <span>{a}</span>
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}
