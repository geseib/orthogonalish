import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import BackgroundMusic from "./background-music";
import { MachineOverlay } from "./machine-overlay";
import {
  parseTrustedForwardedHosts,
  resolveMetadataBase,
} from "./metadata-origin";

const title = "orthogonalish";
const description =
  "An illustrated argument about near-orthogonal vectors, superposition, and how language models make room for meaning.";
const illustratedLessonAlt =
  "illustrated lesson with Rosencrantz and Guildenstern measuring a field of cyan vector arrows.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const metadataBase = resolveMetadataBase(requestHeaders, {
    trustedForwardedHosts: parseTrustedForwardedHosts(
      process.env.TRUSTED_FORWARDED_HOSTS,
    ),
  });

  return {
    metadataBase,
    title,
    description,
    alternates: { canonical: "/" },
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      type: "website",
      url: "/",
      siteName: title,
      title,
      description,
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: `${title}: ${illustratedLessonAlt}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: "/og.png",
          alt: `${title}: ${illustratedLessonAlt}`,
        },
      ],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <MachineOverlay />
        <BackgroundMusic />
      </body>
    </html>
  );
}
