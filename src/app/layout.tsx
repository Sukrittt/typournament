import type { Metadata } from "next";
import { Toaster } from "sonner";
import { GeistSans } from "geist/font/sans";
import { League_Spartan } from "next/font/google";

import "./styles/globals.css";
import { siteConfig } from "~/config";
import { Providers } from "~/components/providers";
import { cn } from "~/lib/utils";

const font = League_Spartan({ subsets: ["latin"], weight: "500" });

export const metadata: Metadata = {
  // metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: `${siteConfig.name} - ${siteConfig.description}`,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  // manifest: "/manifest.json",
  keywords: [
    "Next.js",
    "Tailwind CSS",
    "NextAuth.js",
    "TypeScript",
    "Prisma",
    "shadcn/ui",
    "Server Components",
    "Vercel",
  ],
  authors: [
    {
      name: "Sukrit Saha",
      url: "https://github.com/Sukrittt",
    },
  ],
  creator: "Sukrittt",
  // openGraph: {
  //   type: "website",
  //   locale: "en_IN",
  //   url: siteConfig.url,
  //   title: siteConfig.name,
  //   description: siteConfig.description,
  //   siteName: siteConfig.name,
  // },
  // twitter: {
  //   card: "summary_large_image",
  //   title: siteConfig.name,
  //   description: siteConfig.description,
  //   images: [`${siteConfig.url}/og.jpg`],
  //   creator: "@SukritSaha11",
  // },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* <body className={GeistSans.className}> */}
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
