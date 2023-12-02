import type { Metadata } from "next";
import { Toaster } from "sonner";
import { League_Spartan } from "next/font/google";

import "./styles/globals.css";
import { cn } from "~/lib/utils";
import { siteConfig } from "~/config";
import { Providers } from "~/components/providers";

const font = League_Spartan({ subsets: ["latin"], weight: "500" });

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name}.`,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Next.js",
    "Tailwind CSS",
    "NextAuth.js",
    "TypeScript",
    "Prisma",
    "shadcn/ui",
    "Server Components",
    "Vercel",
    "Typing",
    "Tournament",
    "UEFA",
    "League",
    "WPM",
    "Typournament",
  ],
  authors: [
    {
      name: "Sukrit Saha",
      url: "https://github.com/Sukrittt",
    },
  ],
  creator: "Sukrittt",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@SukritSaha11",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          font.className,
          "bg-gradient-to-r from-[#000] to-[#1e1e1e]"
        )}
      >
        <Providers>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
