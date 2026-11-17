import type { CSSProperties } from "react";
import { ViewTransition } from "react";
import Image from "next/image";
import { categoryLabel } from "@/lib/profiles";
import { themeVars } from "@/lib/theme";
import type { Profile } from "@/lib/types";
import BackButton from "./BackButton";
import ProfileAppbar from "./ProfileAppbar";
import { InstagramIcon, MaterialIcon, WhatsAppIcon } from "./Icons";
import SiteFooter from "./SiteFooter";

/** Full profile page, themed with a Material 3 scheme generated from the profile photo. */
export default function ProfileDetail({ profile }: { profile: Profile }) {
  const { contact, product } = profile;
  const firstName = profile.name.split(" ")[0];

  const waHref = contact?.whatsapp
    ? `https://wa.me/57${contact.whatsapp}?text=${encodeURIComponent(`Hola ${firstName}, vi tu perfil en Raíces en Red y quisiera más información.`)}`
    : null;
  const igHref = contact?.instagram ? `https://instagram.com/${contact.instagram}` : null;

  return (
    // The whole page is the shared element: it grows out of the catalog card when you open it
    // and scales back down into that card when you leave.
    <ViewTransition name={`perfil-${profile.slug}`} share="morph" default="none">
      <main
        className="profile"
        style={{ ...themeVars(profile.theme), "--ar": profile.photo.width / profile.photo.height } as CSSProperties}
      >
      <article className="detail">
        <ProfileAppbar name={profile.name} photoSrc={profile.photo.src} />

        <div className="detail__photo-col">
          <div className="detail__media" style={{ "--photo": `url(${profile.photo.src})` } as CSSProperties}>
            <Image
              className="detail__photo"
              src={profile.photo.src}
              alt={`Retrato de ${profile.name}`}
              fill
              priority
              sizes="(min-width: 1139px) 42vw, 100vw"
            />
            <span className="pill">{categoryLabel(profile.category)}</span>
          </div>
        </div>

        <div className="detail__content">
            <header>
              <h1 className="detail__name">{profile.name}</h1>
              <p className="detail__role">{profile.role}</p>
            </header>
            <p className="detail__tagline">{profile.tagline}</p>
            <p className="detail__story">{profile.story}</p>

            <section className="panel offer">
              <h2 className="panel__title">
                <MaterialIcon name="storefront" /> Lo que ofrece
              </h2>
              <p>{profile.activity}</p>
              {profile.price && (
                <p className="offer__price">
                  <MaterialIcon name="sell" />
                  <span>{profile.price}</span>
                </p>
              )}
            </section>

            {product && (
              <figure className="product">
                <div className="product__img">
                  <Image
                    src={product.src}
                    alt={`Producto o servicio de ${profile.name}`}
                    width={product.width}
                    height={product.height}
                    sizes="(min-width: 1139px) 55vw, 100vw"
                  />
                </div>
                <figcaption>Producto o servicio de {firstName}</figcaption>
              </figure>
            )}

            {profile.quote && (
              <blockquote className="quote">
                <span className="quote__mark" aria-hidden="true">
                  &ldquo;
                </span>
                {profile.quote}
              </blockquote>
            )}

            {contact && (waHref || igHref) && (
              <section className="panel contact">
                <h2 className="panel__title">
                  <MaterialIcon name="forum" /> {contact.lead}
                </h2>
                <div className="contact__actions">
                  {waHref && (
                    <a className="btn btn--filled" href={waHref} target="_blank" rel="noopener noreferrer">
                      <WhatsAppIcon /> WhatsApp {contact.whatsappLabel}
                    </a>
                  )}
                  {igHref && (
                    <a className="btn btn--outlined" href={igHref} target="_blank" rel="noopener noreferrer">
                      <InstagramIcon /> @{contact.instagram}
                    </a>
                  )}
                </div>
                {contact.notes.map((n) => (
                  <p key={n} className="contact__note">
                    {n}
                  </p>
                ))}
              </section>
            )}
        </div>
      </article>

      {/* Mobile: one connected button group at the bottom: back (icon only), then contact actions. */}
      <div className="dock">
        <BackButton variant="dock" />
        {waHref && (
          <a
            className="dock__btn dock__btn--main"
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Escribir a ${firstName} por WhatsApp`}
          >
            <WhatsAppIcon /> Escribir
          </a>
        )}
        {igHref && (
          <a
            className="dock__btn"
            href={igHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram de ${firstName}`}
          >
            <InstagramIcon />
          </a>
        )}
      </div>

      {/* Desktop: extended FAB. */}
      {waHref && (
        <a className="fab" href={waHref} target="_blank" rel="noopener noreferrer" aria-label={`Escribir a ${firstName} por WhatsApp`}>
          <WhatsAppIcon /> Escribir
        </a>
      )}

      <SiteFooter />
      </main>
    </ViewTransition>
  );
}
