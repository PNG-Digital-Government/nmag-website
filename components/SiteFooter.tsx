import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { Tr } from "./Lang";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const { footer, visit } = settings;
  return (
    <footer>
      <div className="wrap cols">
        <div>
          <img src="/images/nmag-seal.webp" alt="" width={56} height={56} />
          <p>{footer.about}</p>
        </div>
        <div>
          <h4>
            <Tr en="Visit" tp="Kam" />
          </h4>
          <ul>
            <li><Link href="/visit">Opening hours</Link></li>
            <li><Link href="/visit">Getting here</Link></li>
            <li><Link href="/learn">School groups</Link></li>
            <li><Link href="/visit">Accessibility</Link></li>
          </ul>
        </div>
        <div>
          <h4>
            <Tr en="Explore" tp="Lukluk" />
          </h4>
          <ul>
            <li><Link href="/exhibitions">Exhibitions</Link></li>
            <li><Link href="/collections">Collections</Link></li>
            <li><Link href="/news">News</Link></li>
            <li><Link href="/about">About NMAG</Link></li>
          </ul>
        </div>
        <div>
          <h4>
            <Tr en="Contact" tp="Toktok" />
          </h4>
          <ul>
            <li>{visit.address}</li>
            <li><a href={`tel:${visit.phone.replace(/\s/g, "")}`}>{visit.phone}</a></li>
            <li><a href={`mailto:${visit.email}`}>{visit.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="legal">
        <div className="wrap">
          <span>{footer.copy}</span>
          <span>Privacy · Disclaimer · Copyright · Accessibility</span>
        </div>
      </div>
    </footer>
  );
}
