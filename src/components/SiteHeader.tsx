"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { InstagramIcon, MaterialIcon, TikTokIcon, YouTubeIcon } from "./Icons";

const NAV = [
  { id: "inicio", label: "Inicio", href: "/#inicio" },
  { id: "emprendedoras", label: "Emprendedoras", href: "/#emprendedoras" },
  { id: "red", label: "Sobre la red", href: "/#red" },
];

type NavItem = (typeof NAV)[number];

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/funamujer", Icon: InstagramIcon },
  { label: "TikTok", href: "https://www.tiktok.com/@funamujer", Icon: TikTokIcon },
  { label: "YouTube", href: "https://www.youtube.com/@FUNAMUJER", Icon: YouTubeIcon },
];

const FUNAMUJER_URL = "https://funamujer.org";

function NavLink({
  item,
  className,
  tabIndex,
  onClick,
}: {
  item: NavItem;
  className?: string;
  tabIndex?: number;
  onClick?: () => void;
}) {
  return (
    <Link className={className} href={item.href} tabIndex={tabIndex} onClick={onClick}>
      {item.label}
    </Link>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const onProfile = pathname.startsWith("/perfil");
  const [spy, setSpy] = useState("inicio");
  const [menuOpen, setMenuOpen] = useState(false);
  const active = onProfile ? "emprendedoras" : spy;
  const menuVisible = menuOpen && !onProfile;

  // Scroll spy for the in-page sections of the home page.
  useEffect(() => {
    if (onProfile) return;
    const ids = ["inicio", "emprendedoras", "red"];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setSpy(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [onProfile]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const logo = (
    <Link className="header__logo" href="/#inicio" aria-label="Raíces en Red, inicio" onClick={() => setMenuOpen(false)}>
      <Image src="/brand/funamujer-logo-white.png" alt="Funamujer" width={504} height={194} priority />
    </Link>
  );

  return (
    <>
      {/* Desktop: floating glass pill */}
      <header className={`header header--desktop${onProfile ? " is-hidden" : ""}`} inert={onProfile}>
        {logo}
        <nav className="header__nav" aria-label="Principal">
          {NAV.map((item) => (
            <NavLink key={item.id} item={item} className={`header__link${active === item.id ? " is-active" : ""}`} />
          ))}
        </nav>
        <a className="header__cta" href={FUNAMUJER_URL}>
          Volver a Funamujer
        </a>
      </header>

      {/* Mobile: floating bottom bar */}
      <header className={`header header--mobile${onProfile ? " is-hidden" : ""}`} inert={onProfile}>
        {logo}
        <a className="header__icon-btn" href={FUNAMUJER_URL} aria-label="Volver a Funamujer" title="Volver a Funamujer">
          <MaterialIcon name="arrow_back" />
        </a>
        <button
          type="button"
          className="header__icon-btn"
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <MaterialIcon name="menu" />
        </button>
      </header>

      <div className={`mobile-menu${menuVisible ? " is-open" : ""}`} aria-hidden={!menuVisible}>
        <button type="button" className="mobile-menu__scrim" aria-label="Cerrar menú" tabIndex={-1} onClick={() => setMenuOpen(false)} />
        <div className="mobile-menu__panel" role="dialog" aria-modal="true" aria-label="Menú">
          <button type="button" className="mobile-menu__close" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)}>
            <MaterialIcon name="close" />
          </button>
          <div className="mobile-menu__logo">
            <Image src="/brand/funamujer-logo-white.png" alt="Funamujer" width={504} height={194} />
          </div>
          <nav className="mobile-menu__list" aria-label="Menú móvil">
            {NAV.map((item) => (
              <NavLink
                key={item.id}
                item={item}
                className={active === item.id ? "is-active" : undefined}
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
              />
            ))}
          </nav>
          <div className="mobile-menu__socials">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer" tabIndex={menuOpen ? 0 : -1}>
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
