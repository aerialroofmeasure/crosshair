import type { Metadata } from "next";
import { Fraunces, Inter, Inter_Tight } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  title: {
    default: "Aerial Roof Measure — Professional Roof & Wall Measurement Reports",
    template: "%s · Aerial Roof Measure",
  },
  description:
    "Premium aerial roof, wall and gutter measurement reports for contractors, adjusters and architects. 98%+ accuracy guarantee. 6-hour rush available.",
  metadataBase: new URL("https://aerialroofmeasure.com"),
  openGraph: {
    title: "Aerial Roof Measure",
    description: "Professional · Precise · On Time",
    url: "https://aerialroofmeasure.com",
    siteName: "Aerial Roof Measure",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} ${fraunces.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
