"use client";

import { Button } from "@stackpage/ui";
import { supabase } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

export default function SettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });
    }, []);

    const handleLogout = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-xl font-bold mb-6">Configurações</h1>

            {/* Profile Section */}
            <section className="card p-6 mb-6">
                <h2 className="text-sm font-mono text-muted-foreground mb-4">Perfil</h2>

                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                        {user?.user_metadata?.avatar_url ? (
                            <img
                                src={user.user_metadata.avatar_url}
                                alt="Avatar"
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <User className="w-8 h-8 text-muted-foreground" />
                        )}
                    </div>
                    <div>
                        <p className="font-semibold">{user?.user_metadata?.full_name || "Utilizador"}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Email</label>
                        <input
                            type="email"
                            value={user?.email || ""}
                            disabled
                            className="w-full h-10 px-3 rounded-md border border-border bg-secondary text-sm text-muted-foreground"
                        />
                        <p className="text-xs text-muted-foreground mt-1">O email não pode ser alterado.</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-1 block">Provider</label>
                        <p className="text-sm text-muted-foreground font-mono">
                            {user?.app_metadata?.provider || "email"}
                        </p>
                    </div>
                </div>
            </section>

            {/* Account Actions */}
            <section className="card p-6">
                <h2 className="text-sm font-mono text-muted-foreground mb-4">Conta</h2>

                <div className="space-y-3">
                    <Button
                        variant="outline"
                        className="w-full h-10 rounded-md justify-start"
                        onClick={handleLogout}
                        disabled={loading}
                    >
                        {loading ? "A sair..." : "Terminar Sessão"}
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full h-10 rounded-md justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => alert("Funcionalidade em desenvolvimento.")}
                    >
                        Eliminar Conta
                    </Button>
                </div>
            </section>
        </div>
    );
}
