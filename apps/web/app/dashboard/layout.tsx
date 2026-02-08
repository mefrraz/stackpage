"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { LayoutGrid, Settings, LogOut, Moon, Sun, Monitor, User } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@stackpage/ui";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error || !user) {
                router.push("/login");
            } else {
                setUser(user);
            }
            setLoading(false);
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                router.push('/login');
            } else if (session?.user) {
                setUser(session.user);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background text-muted-foreground animate-pulse">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <span className="text-sm font-medium">A carregar o teu espaço...</span>
                </div>
            </div>
        );
    }

    const isActive = (path: string) => pathname === path;

    return (
        <div className="min-h-screen flex bg-background selection:bg-primary/20">
            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            {/* Sidebar */}
            <aside className="w-64 hidden md:flex flex-col border-r border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/20 z-10 sticky top-0 h-screen transition-all duration-300">
                {/* Logo */}
                <div className="h-20 flex items-center px-6 border-b border-border/40">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center text-primary-foreground text-sm font-bold font-mono shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                            S
                        </div>
                        <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">StackPage</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        href="/dashboard"
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${isActive('/dashboard')
                            ? 'bg-primary/10 text-primary shadow-sm'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                    >
                        <LayoutGrid className={`w-5 h-5 transition-colors ${isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                        Meus Sites
                    </Link>
                    <Link
                        href="/dashboard/settings"
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${isActive('/dashboard/settings')
                            ? 'bg-primary/10 text-primary shadow-sm'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                    >
                        <Settings className={`w-5 h-5 transition-colors ${isActive('/dashboard/settings') ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                        Configurações
                    </Link>
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-border/40 space-y-4 bg-background/40 backdrop-blur-md">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center text-sm font-medium border border-border/50 shadow-sm relative overflow-hidden">
                            {user?.user_metadata?.avatar_url ? (
                                <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span>{user?.email?.[0].toUpperCase()}</span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{user?.user_metadata?.full_name || "Criador"}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex-1">
                            <ModeToggle />
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleLogout}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                            title="Sair"
                        >
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative z-10 overflow-y-auto h-screen">
                {children}
            </main>
        </div>
    );
}
