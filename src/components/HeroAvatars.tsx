"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { useShuffled } from "@/lib/shuffle";

interface Face {
  slug: string;
  src: string;
}

/** Overlapping portraits under the hero text: a random few, in the same order as the catalog. */
export default function HeroAvatars({ faces, total }: { faces: Face[]; total: number }) {
  const shown = useShuffled(faces).slice(0, 5);

  return (
    <div className="hero__people">
      <div className="avatars" aria-hidden="true">
        {shown.map((face, i) => (
          <span key={face.slug} className="avatars__item" style={{ "--i": i } as CSSProperties}>
            <Image src={face.src} alt="" fill sizes="46px" />
          </span>
        ))}
      </div>
      <span>{total} emprendedoras con historia</span>
    </div>
  );
}
