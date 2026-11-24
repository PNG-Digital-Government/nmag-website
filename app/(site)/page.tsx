import type { ReactNode } from "react";
import { CollectionCard, ExhibitionCard, NewsCard, SecHead } from "@/components/cards";
import { VisitBlock } from "@/components/VisitBlock";
import { HeroSlider } from "@/components/HeroSlider";
import { Tr } from "@/components/Lang";
import { getSiteContent } from "@/lib/content";
import type { HomeSectionId, SiteContent } from "@/lib/types";

type Section = (c: SiteContent) => ReactNode;

const SECTIONS: Record<HomeSectionId, Section> = {
  kpis: ({ settings }) => (
    <section className="blk" key="kpis">
      <div className="wrap">
        <div className="kpis">
          {settings.keyFacts.map((k, i) => (
            <div className="kpi" key={i}>
              <div className="n">{k.n}</div>
              <div className="l">{k.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  ),

  welcome: ({ settings }) => {
    const w = settings.welcome;
    return (
      <section className="blk alt" key="welcome">
        <div className="wrap welcome">
          {settings.welcomeImageUrl ? (
            <div className="portrait hasimg">
              <img src={settings.welcomeImageUrl} alt={w.imageAlt || w.name} />
            </div>
          ) : (
            <div className="portrait" aria-hidden="true">
              {w.initials}
            </div>
          )}
          <div>
            <div className="eyebrow">
              <Tr en="Welcome" tp="Welkam" />
            </div>
            <blockquote>
              <p>{w.text}</p>
            </blockquote>
            <cite>
              <b>{w.name}</b>
              <br />
              {w.role}
            </cite>
          </div>
        </div>
      </section>
    );
  },

  exhibitions: ({ exhibitions }) => (
    <section className="blk" key="exhibitions">
      <div className="wrap">
        <SecHead
          eyebrow={<Tr en="Exhibitions" tp="Soim" />}
          title="What's on"
          text="Current and upcoming exhibitions in the Waigani galleries."
          link={{ href: "/exhibitions", label: "All exhibitions" }}
        />
        <div className="grid">
          {exhibitions
            .filter((e) => e.status !== "Past")
            .slice(0, 3)
            .map((e) => (
              <ExhibitionCard key={e.id} e={e} />
            ))}
        </div>
      </div>
    </section>
  ),

  collections: ({ collections }) => (
    <section className="blk alt" key="collections">
      <div className="wrap">
        <SecHead
          eyebrow={<Tr en="Collections" tp="Ol samting bilong bipo" />}
          title="The national collection"
          text="Collection areas cared for by curators and conservators."
          link={{ href: "/collections", label: "Explore collections" }}
        />
        <div className="grid">
          {collections.slice(0, 3).map((c, i) => (
            <CollectionCard key={c.id} c={c} i={i} />
          ))}
        </div>
      </div>
    </section>
  ),

  visit: ({ settings }) => <VisitBlock key="visit" settings={settings} />,

  news: ({ news }) => (
    <section className="blk alt" key="news">
      <div className="wrap">
        <SecHead eyebrow={<Tr en="News" tp="Nius" />} title="Latest from the museum" link={{ href: "/news", label: "All news" }} />
        <div className="grid">
          {news.slice(0, 3).map((n, i) => (
            <NewsCard key={n.id} n={n} i={i} />
          ))}
        </div>
      </div>
    </section>
  ),
};

export default async function HomePage() {
  const content = await getSiteContent();
  return (
    <>
      <HeroSlider slides={content.heroSlides} />
      {content.settings.sections.filter((s) => s.on && SECTIONS[s.id]).map((s) => SECTIONS[s.id](content))}
    </>
  );
}
