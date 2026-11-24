import type { Metadata } from "next";
import { NewsCard, PageHead } from "@/components/cards";
import { Tr } from "@/components/Lang";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = { title: "News" };

export default async function NewsPage() {
  const { news } = await getSiteContent();
  return (
    <>
      <PageHead crumb={<Tr en="News" tp="Nius" />} title="News & media" text="Announcements, stories and media releases." />
      <section className="blk">
        <div className="wrap grid">
          {news.map((n, i) => (
            <NewsCard key={n.id} n={n} i={i} />
          ))}
        </div>
      </section>
    </>
  );
}
