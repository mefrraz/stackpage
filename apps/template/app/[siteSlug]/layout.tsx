import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";
import "@/app/globals.css";

// This layout runs for all pages under /[siteSlug]/...
export default async function SiteLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ siteSlug: string }>;
}) {
    const { siteSlug } = await params;
    const supabase = createClient();

    // Fetch Site Details for the Header
    const { data: site } = await supabase
        .from("sites")
        .select("id, title, subdomain")
        .eq("subdomain", siteSlug)
        .single();

    if (!site) {
        return notFound();
    }

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
                {/* Navigation Bar */}
                <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container flex h-14 max-w-screen-2xl items-center px-6">
                        {/* Site Title / Home Link */}
                        <div className="mr-4 flex">
                            <Link href={`/${siteSlug}`} className="mr-6 flex items-center space-x-2">
                                <span className="font-bold inline-block">{site.title}</span>
                            </Link>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex items-center space-x-6 text-sm font-medium flex-1">
                            <Link
                                href={`/${siteSlug}`}
                                className="transition-colors hover:text-foreground/80 text-foreground/60"
                            >
                                Home
                            </Link>
                            <Link
                                href={`/${siteSlug}/posts`}
                                className="transition-colors hover:text-foreground/80 text-foreground/60"
                            >
                                Blog
                            </Link>
                            {/* Future: Dynamic Pages Link */}
                        </nav>

                        {/* Right Side: Theme Toggle */}
                        <div className="flex items-center justify-end space-x-4">
                            <nav className="flex items-center space-x-2">
                                <ModeToggle />
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 animate-fade-in">
                    {children}
                </main>

                {/* Footer */}
                <footer className="py-6 md:px-8 md:py-0">
                    <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row max-w-screen-2xl px-6">
                        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                            Built with <a href="https://stackpage.vercel.app" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">StackPage</a>.
                        </p>
                    </div>
                </footer>
            </div>
        </ThemeProvider>
    );
}
