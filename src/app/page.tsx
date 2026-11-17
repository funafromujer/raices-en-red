import Image from "next/image";
import Catalog from "@/components/Catalog";
import HeroAvatars from "@/components/HeroAvatars";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import { network, profiles } from "@/lib/profiles";

/** Headline revealed word by word; the last word is highlighted in the brand color. */
function HeroTitle({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <h1 className="hero__title" aria-label={text}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden="true">
          <span className={`w${i === words.length - 1 ? " hl" : ""}`}>
            <span style={{ "--i": i } as React.CSSProperties}>{word}</span>
          </span>{" "}
        </span>
      ))}
    </h1>
  );
}

export default function Home() {
  const faces = profiles.map((p) => ({ slug: p.slug, src: p.photo.src }));

  return (
    <main>
      <section id="inicio" className="hero">
        <div className="hero__inner">
          <Image
            className="hero__logo"
            src="/brand/raices-en-red.webp"
            alt="Raíces en Red"
            width={900}
            height={318}
            priority
          />
          <HeroTitle text={network.title} />
          {network.paragraphs.map((p) => (
            <p key={p} className="hero__text">
              {p}
            </p>
          ))}
          <div className="hero__actions">
            <a className="btn btn--filled" href="#emprendedoras">
              Conoce a las emprendedoras
            </a>
            <a className="btn btn--outlined" href="https://funamujer.org" target="_blank" rel="noopener noreferrer">
              Conoce Funamujer
            </a>
          </div>
          <HeroAvatars faces={faces} total={profiles.length} />
        </div>
      </section>

      <Catalog profiles={profiles} />

      <section id="red" className="about">
        <Reveal>
          <div className="about__inner">
            <p className="eyebrow">Una iniciativa de Funamujer</p>
            <h2 className="about__title">
              Cuando una mujer avanza, <em>su comunidad florece</em>
            </h2>
            <p className="about__text">
              Funamujer acompaña procesos de liderazgo consciente que nacen en la raíz afrodescendiente. Raíces en Red
              es una vitrina para que sus saberes, productos y servicios lleguen a más personas.
            </p>
            <a className="btn btn--white" href="https://funamujer.org" target="_blank" rel="noopener noreferrer">
              Conoce Funamujer
            </a>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </main>
  );
}
