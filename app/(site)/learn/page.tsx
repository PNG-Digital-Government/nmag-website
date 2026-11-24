import type { Metadata } from "next";
import { LearningCard, PageHead } from "@/components/cards";
import { Tr } from "@/components/Lang";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = { title: "Learning" };

export default async function LearnPage() {
  const { learning } = await getSiteContent();
  return (
    <>
      <PageHead crumb={<Tr en="Learning" tp="Skul" />} title="Learning & school visits" text="Guided tours, handling sessions and teaching packs." />
      <section className="blk">
        <div className="wrap grid">
          {learning.map((l, i) => (
            <LearningCard key={l.id} l={l} i={i} />
          ))}
        </div>
      </section>
    </>
  );
}
