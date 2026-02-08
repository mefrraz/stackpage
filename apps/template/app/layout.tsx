import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StackPage Site",
  description: "Powered by StackPage",
};

import { THEMES, ThemeId } from "@/lib/themes";

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ siteSlug: string }>; // Params are now available in Layout in Next.js 15
}>) {
  // Fetch site config to determine theme
  // Note: specific implementation depends on how we fetch site data in layout
  // For now, we'll fetch it again or assume a default. 
  // Ideally, we should fetch site data in a parent component or use a context, 
  // but for Layout, we need to fetch based on domain/subdomain.

  // Since we don't have direct access to subdomain here easily without middleware or specific route structure,
  // we might need to rely on the page.tsx to inject styles, OR fetch here if possible.
  // However, Next.js Layouts don't always receive params in the same way.
  // USE CAUTION: accessing params in RootLayout can be tricky depending on the router.
  // A safer approach for "Global Theme" is to use a Client Component wrapper that receives the theme
  // or inline styles if we can fetch data server-side.

  // Simplified approach: Render params are NOT available in Root Layout for all routes (like 404).
  // Strategy: We will inject a script or style tag in the [siteSlug]/layout.tsx instead?
  // No, [siteSlug] is the route. The RootLayout wraps EVERYTHING.
  // LET'S MOVE THE THEME INJECTION TO A NEW [siteSlug]/layout.tsx to be safe/correct.
  // But wait, existing structure is `app/[siteSlug]/page.tsx`.
  // We should create `app/[siteSlug]/layout.tsx` to handle site-specific layout (Theme).

  return (
    <html lang="pt" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-background text-foreground selection:bg-primary/20`}>
        {/* Luminous Background Atmosphere for all sites */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px]" />
        </div>

        {children}
      </body>
    </html>
  );
}
