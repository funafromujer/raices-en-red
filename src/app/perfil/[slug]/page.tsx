import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProfileDetail from "@/components/ProfileDetail";
import { profiles } from "@/lib/profiles";

// Profiles are fully prerendered via generateStaticParams; keep the destination whole so the
// card-to-hero view transition always finds both elements in the same commit.
export const instant = false;

export function generateStaticParams() {
  return profiles.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/perfil/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const profile = profiles.find((p) => p.slug === slug);
  if (!profile) return {};
  return {
    title: `${profile.name} · Raíces en Red`,
    description: profile.tagline,
    openGraph: { title: profile.name, description: profile.tagline, images: [profile.photo.src] },
  };
}

export default async function ProfilePage({ params }: PageProps<"/perfil/[slug]">) {
  const { slug } = await params;
  const profile = profiles.find((p) => p.slug === slug);
  if (!profile) notFound();

  return <ProfileDetail profile={profile} />;
}
