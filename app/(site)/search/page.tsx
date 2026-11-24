import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/cards";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();
  const { exhibitions, collections, news, learning } = await getSiteContent();

  const all = [
    ...exhibitions.map((e) => ({ t: e.title, s: e.summary, href: "/exhibitions", kind: "Exhibition" })),
    ...collections.map((c) => ({ t: c.name, s: c.text, href: "/collections", kind: "Collection" })),
    ...news.map((n) => ({ t: n.title, s: n.excerpt, href: "/news", kind: "News" })),
    ...learning.map((l) => ({ t: l.title, s: l.text, href: "/learn", kind: "Learning" })),
  ];
  const hits = query ? all.filter((x) => `${x.t} ${x.s}`.toLowerCase().includes(query)) : [];

  return (
    <>
      <PageHead crumb="Search" title={query ? `Results for “${q.trim()}”` : "Search"} text={query ? `${hits.length} result${hits.length === 1 ? "" : "s"}` : "Type in the search box at the top of the page."} />
      <section className="blk">
        <div className="wrap">
          {query && !hits.length && <p>Nothing matched. Try a different word, or browse the Exhibitions and Collections pages.</p>}
          <ul className="results">
            {hits.map((h, i) => (
              <li key={i}>
                <span className="eyebrow">{h.kind}</span>
                <Link href={h.href}>
                  <h3>{h.t}</h3>
                </Link>
                <p>{h.s}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
