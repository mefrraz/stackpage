import { createClient } from "@/lib/supabase";
import { ThemeWrapper } from "@/components/theme-wrapper";
import { notFound } from "next/navigation";

export default async function SiteLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ siteSlug: string }>;
}) {
    const { siteSlug } = await params;
    const supabase = createClient();

    const { data: site } = await supabase
        .from("sites")
        .select("config")
        .eq("subdomain", siteSlug)
        .single();

    if (!site) return notFound();

    const themeId = site.config?.theme || 'luminous';

    return (
        <>
            <ThemeWrapper themeId={themeId} />
            {children}
        </>
    );
}
