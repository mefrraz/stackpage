"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
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

        // Listen for auth state changes
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

    if (loading) return <div className="flex h-screen items-center justify-center">Carregando...</div>;

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
                        StackPage
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md font-medium"
                    >
                        Meus Sites
                    </Link>
                    <Link
                        href="/dashboard/settings"
                        className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md font-medium"
                    >
                        Configurações
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {user?.email?.[0].toUpperCase()}
                        </div>
                        <div className="text-sm">
                            <p className="font-medium truncate max-w-[120px]">{user?.user_metadata?.full_name || "Utilizador"}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[120px]">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
