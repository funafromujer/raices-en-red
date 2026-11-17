"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import BackButton from "./BackButton";

interface Props {
  name: string;
  photoSrc: string;
}

/**
 * Back button that sits in the page at first and docks (sticky) once the page is scrolled,
 * morphing into a pinned control. On mobile a small photo + name pops in beside it while the
 * large photo fades away. `data-stuck` drives the CSS animation.
 */
export default function ProfileAppbar({ name, photoSrc }: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove("is-leaving");
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      setStuck(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} className="appbar__sentinel" aria-hidden="true" />
      <div className="appbar" data-stuck={stuck ? "" : undefined}>
        <BackButton />
        <span className="appbar__title">Perfil</span>
        <span className="appbar__who" aria-hidden="true">
          <span className="appbar__avatar">
            <Image src={photoSrc} alt="" fill sizes="36px" />
          </span>
          <span className="appbar__name">{name}</span>
        </span>
      </div>
    </>
  );
}
