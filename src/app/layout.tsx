import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { QueryProvider } from "@/lib/query-provider";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "R-SYNC — Find Your Perfect Next Transition",
    template: "%s | R-SYNC",
  },
  description:
    "The intelligent DJ transition assistant. Instant BPM, key, and harmonic matches from your library — mix better, discover faster.",
  metadataBase: new URL("https://rsync.app"),
  openGraph: {
    title: "R-SYNC — Find Your Perfect Next Transition",
    description:
      "The intelligent DJ transition assistant. Instant BPM, key, and harmonic matches from your library.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#09090B",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
        <body className="bg-background font-body text-foreground">
          <QueryProvider>{children}</QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
