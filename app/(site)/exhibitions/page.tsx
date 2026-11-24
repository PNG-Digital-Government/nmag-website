import type { Metadata } from "next";
import { PageHead } from "@/components/cards";
import { ExhibitionList } from "@/components/Filters";
import { Tr } from "@/components/Lang";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = { title: "Exhibitions" };

export default async function ExhibitionsPage() {
  const { exhibitions } = await getSiteContent();
  return (
    <>
      <PageHead crumb={<Tr en="Exhibitions" tp="Soim" />} title="Exhibitions" text="Current, upcoming and past exhibitions." />
      <section className="blk">
        <div className="wrap">
          <ExhibitionList items={exhibitions} />
        </div>
      </section>
    </>
  );
}
