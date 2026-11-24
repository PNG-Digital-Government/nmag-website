import type { Metadata } from "next";
import { PageHead } from "@/components/cards";
import { Tr } from "@/components/Lang";
import { VisitBlock } from "@/components/VisitBlock";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = { title: "Plan a Visit" };

export default async function VisitPage() {
  const { settings } = await getSiteContent();
  return (
    <>
      <PageHead crumb={<Tr en="Plan a visit" tp="Kam lukim" />} title="Plan your visit" text={settings.visit.address} />
      <VisitBlock settings={settings} />
    </>
  );
}
