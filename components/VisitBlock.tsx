import type { SiteSettings } from "@/lib/types";
import { PairList, SecHead } from "./cards";
import { Tr } from "./Lang";

export function VisitBlock({ settings }: { settings: SiteSettings }) {
  return (
    <section className="blk">
      <div className="wrap split">
        <div>
          <SecHead eyebrow={<Tr en="Plan a visit" tp="Kam lukim" />} title="Opening hours" />
          <PairList rows={settings.visit.hours} />
        </div>
        <div>
          <SecHead eyebrow={" "} title="Entry" />
          <PairList rows={settings.visit.fees} />
          <p style={{ color: "var(--muted)" }}>{settings.visit.address}</p>
        </div>
      </div>
    </section>
  );
}
