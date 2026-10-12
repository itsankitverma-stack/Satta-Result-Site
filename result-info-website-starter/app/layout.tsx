import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Daily Results & Monthly Chart", template: "%s | Result Desk" },
  description: "Browse published daily results and historical monthly charts. Informational results archive.",
  robots: { index: true, follow: true },
  openGraph: { title: "Daily Results & Monthly Chart", description: "Daily results and historical charts.", type: "website" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><div className="topline"/>{children}</body></html>;
}