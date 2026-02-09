import { getSiteBySlug } from "@/lib/sites";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "@/app/globals.css";

// Fonts
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

// Helper to get theme styles (copied from editor for consistency)
const getThemeStyles = (themeId: string | undefined): React.CSSProperties => {
    switch (themeId) {
        case 'luminous':
            return {
                '--primary': '#c084fc',
                '--primary-foreground': '#09090b',
                '--radius': '1rem'
            } as React.CSSProperties;
        case 'cyberpunk':
            return {
                '--primary': '#00ff41',
                '--primary-foreground': '#000000',
                '--radius': '0px'
            } as React.CSSProperties;
        case 'neo-brutalism':
            return {
                '--primary': '#4f46e5',
                '--primary-foreground': '#ffffff',
                '--radius': '0.5rem',
                '--border': '#000000'
            } as React.CSSProperties;
        case 'swiss':
            return {
                '--primary': '#000000',
                '--primary-foreground': '#ffffff',
                '--radius': '0px'
            } as React.CSSProperties;
        default:
            return {} as React.CSSProperties;
    }
};

interface SiteLayoutProps {
    children: React.ReactNode;
    params: Promise<{ siteSlug: string }>;
}

export async function generateMetadata({ params }: SiteLayoutProps): Promise<Metadata> {
    const { siteSlug } = await params;
    const site = await getSiteBySlug(siteSlug);
    if (!site) return { title: "Site não encontrado" };
    return {
        title: site.title,
        description: `Site criado com StackPage`,
    };
}

export default async function SiteLayout({ children, params }: SiteLayoutProps) {
    const { siteSlug } = await params;
    const site = await getSiteBySlug(siteSlug);

    if (!site) {
        notFound();
    }

    const themeStyles = getThemeStyles(site.config?.theme);

    return (
        <div className={`${inter.variable} ${jetbrainsMono.variable} font-sans min-h-screen bg-background text-foreground`} style={themeStyles}>
            {children}
        </div>
    );
}
