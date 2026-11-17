import type { Metadata, Viewport } from "next";
import { Poppins, Yeseva_One } from "next/font/google";
import Ripple from "@/components/Ripple";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const yeseva = Yeseva_One({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Raíces en Red · Emprendedoras de Puerto Tejada",
  description:
    "Catálogo de perfiles de mujeres emprendedoras de Puerto Tejada y sus alrededores, en el norte del Cauca. Una iniciativa de Funamujer.",
};

export const viewport: Viewport = {
  themeColor: "#361f34",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${poppins.variable} ${yeseva.variable}`}>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=block"
        />
      </head>
      <body>
        <SiteHeader />
        <Ripple />
        {children}
      </body>
    </html>
  );
}
