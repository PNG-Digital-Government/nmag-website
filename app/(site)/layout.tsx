import type { ReactNode } from "react";
import { Gate } from "@/components/Gate";
import { HelpFab } from "@/components/HelpFab";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { chatAnswer, getSiteContent } from "@/lib/content";

// Rebuild pages with fresh CMS content at most every 5 minutes.
export const revalidate = 300;

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const { settings } = await getSiteContent();

  // Site Mode: show the "Closed for Rehanging" screen instead of the site.
  if (settings.siteMode.value !== "live") {
    return <Gate settings={settings} />;
  }

  const chat = settings.widgets.chat
    ? {
        title: settings.chat.title,
        greeting: settings.chat.greeting,
        buttons: settings.chat.items.map((item) => ({
          label: item.label,
          icon: item.icon,
          note: item.note,
          answer: chatAnswer(item, settings.visit),
        })),
      }
    : null;

  return (
    <>
      <SiteHeader settings={settings} />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter settings={settings} />
      <HelpFab chat={chat} backToTop={settings.widgets.backToTop} />
    </>
  );
}
