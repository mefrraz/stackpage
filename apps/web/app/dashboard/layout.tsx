"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { LayoutGrid, Settings, LogOut } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

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
            <div className="flex h-screen items-center justify-center bg-background text-muted-foreground">
                Carregando...
            </div>
        );
    }

    const isActive = (path: string) => pathname === path;

    return (
        <div className="min-h-screen flex bg-background">
            {/* Sidebar */}
            <aside className="w-56 border-r border-border hidden md:flex flex-col bg-background">
                {/* Logo */}
                <div className="h-14 flex items-center px-4 border-b border-border">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center text-background text-xs font-bold font-mono">
                            S
                        </div>
                        <span className="text-sm font-semibold tracking-tight">StackPage</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1">
                    <Link
                        href="/dashboard"
                        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/dashboard')
                                ? 'bg-secondary text-foreground font-medium'
                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                            }`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        Meus Sites
                    </Link>
                    <Link
                        href="/dashboard/settings"
                        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/dashboard/settings')
                                ? 'bg-secondary text-foreground font-medium'
                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                            }`}
                    >
                        <Settings className="w-4 h-4" />
                        Configurações
                    </Link>
                </nav>

                {/* User Section */}
                <div className="p-3 border-t border-border space-y-2">
                    <div className="flex items-center gap-2 px-2">
                        <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
                            {user?.email?.[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.user_metadata?.full_name || "Utilizador"}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                        <ModeToggle />
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-secondary/30">
                {children}
            </main>
        </div>
    );
}
