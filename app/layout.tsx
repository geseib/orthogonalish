import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import {
  parseTrustedForwardedHosts,
  resolveMetadataBase,
} from "./metadata-origin";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "The Nearly Orthogonal Society";
const description =
  "Estimate—and then test—how many nearly perpendicular vectors fit in N dimensions.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const metadataBase = resolveMetadataBase(requestHeaders, {
    trustedForwardedHosts: parseTrustedForwardedHosts(
      process.env.TRUSTED_FORWARDED_HOSTS,
    ),
  });

  return {
    metadataBase,
    title: "The Nearly Orthogonal Society",
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
          alt: "Rosencrantz and Guildenstern measure a field of cyan vector arrows beside The Nearly Orthogonal Society title.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
