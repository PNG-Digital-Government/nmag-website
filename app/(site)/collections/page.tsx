import type { Metadata } from "next";
import { PageHead } from "@/components/cards";
import { CollectionList } from "@/components/Filters";
import { Tr } from "@/components/Lang";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = { title: "Collections" };

export default async function CollectionsPage() {
  const { collections } = await getSiteContent();
  return (
    <>
      <PageHead crumb={<Tr en="Collections" tp="Ol samting bilong bipo" />} title="Collections" text="Search the collection areas held by the museum." />
      <section className="blk">
        <div className="wrap">
          <CollectionList items={collections} />
        </div>
      </section>
    </>
  );
}
