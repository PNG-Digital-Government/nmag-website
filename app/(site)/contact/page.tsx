import type { Metadata } from "next";
import { PageHead } from "@/components/cards";
import { ContactForm } from "@/components/ContactForm";
import { Tr } from "@/components/Lang";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const { settings } = await getSiteContent();
  const v = settings.visit;
  return (
    <>
      <PageHead crumb={<Tr en="Contact" tp="Toktok" />} title="Contact us" text="Send a message, book a school visit or ask about the collection." />
      <section className="blk">
        <div className="wrap split">
          <ContactForm to={v.email} />
          <div>
            <h2 style={{ marginBottom: "1rem" }}>Visit or call</h2>
            <ul className="list">
              <li><span>Address</span><span>{v.address}</span></li>
              <li><span>Phone</span><span><a href={`tel:${v.phone.replace(/\s/g, "")}`}>{v.phone}</a></span></li>
              <li><span>Email</span><span><a href={`mailto:${v.email}`}>{v.email}</a></span></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
