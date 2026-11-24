import type { Metadata } from "next";
import { PageHead } from "@/components/cards";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const { settings } = await getSiteContent();
  return (
    <>
      <PageHead crumb="About" title="About the National Museum & Art Gallery" text="Custodian of Papua New Guinea's cultural, natural and artistic heritage." />
      <section className="blk">
        <div className="wrap split">
          <div className="prose">
            <h2 style={{ marginBottom: "1rem" }}>Our mandate</h2>
            <p>{settings.welcome.text}</p>
            <p>
              The museum collects, conserves, researches and exhibits material that records the history and cultures of Papua New Guinea, and works
              with provinces and communities to protect sites and objects of national importance.
            </p>
          </div>
          <div>
            <h2 style={{ marginBottom: "1rem" }}>What we value</h2>
            <ul className="list">
              <li><span>Respect for custom owners</span><span>Kastom</span></li>
              <li><span>Care for the collection</span><span>Conservation</span></li>
              <li><span>Open to every citizen</span><span>Access</span></li>
              <li><span>Knowledge shared</span><span>Research</span></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
