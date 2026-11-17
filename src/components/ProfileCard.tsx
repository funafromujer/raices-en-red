import type { CSSProperties } from "react";
import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { cardAspect } from "@/lib/masonry";
import type { Profile } from "@/lib/types";
import { MaterialIcon } from "./Icons";

interface Props {
  profile: Profile;
  index: number;
  categoryLabel: string;
  /** Whether this card starts a new column at 2, 3 and 4 columns (see lib/masonry). */
  startsColumn: { two: boolean; three: boolean; four: boolean };
}

export default function ProfileCard({ profile, index, categoryLabel, startsColumn }: Props) {
  const style = {
    "--card-bg": profile.theme.surfaceContainerHigh,
    "--i": index,
  } as CSSProperties;

  return (
    <Link
      href={`/perfil/${profile.slug}`}
      className="card"
      data-ar={profile.photo.width / profile.photo.height}
      data-col2={startsColumn.two ? "" : undefined}
      data-col3={startsColumn.three ? "" : undefined}
      data-col4={startsColumn.four ? "" : undefined}
      style={style}
      aria-label={`Ver perfil de ${profile.name}`}
      transitionTypes={["nav-forward"]}
    >
      <ViewTransition name={`perfil-${profile.slug}`} share="morph" default="none">
        <div className="card__media" style={{ aspectRatio: cardAspect(index) }}>
          <Image
            className="card__img"
            src={profile.photo.src}
            alt=""
            fill
            sizes="(min-width: 1200px) 25vw, (min-width: 800px) 33vw, 50vw"
          />
          <span className="card__badge">{categoryLabel}</span>
        </div>
      </ViewTransition>
      <span className="card__meta">
        <span className="card__text">
          <span className="card__name">{profile.name}</span>
          <span className="card__role">{profile.role}</span>
        </span>
        <span className="card__go" aria-hidden="true">
          <MaterialIcon name="north_east" />
        </span>
      </span>
    </Link>
  );
}
