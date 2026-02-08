"use client";

import { Button } from "@stackpage/ui";
import { supabase } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Shield, LogOut, Trash2 } from "lucide-react";

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
        <div className="p-6 lg:p-12 max-w-4xl mx-auto space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Configurações</h1>
                <p className="text-muted-foreground">Gere a tua conta e preferências.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Sidebar Navigation (Visual only for now) */}
                <div className="space-y-2 md:col-span-1">
                    <button className="w-full text-left px-4 py-2 rounded-lg bg-secondary/50 text-foreground font-medium text-sm border border-border/50">
                        Geral
                    </button>
                    {/* Future tabs */}
                </div>

                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">

                    {/* Profile Section */}
                    <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-6">
                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" /> Perfil
                        </h2>

                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-20 h-20 rounded-full bg-secondary border-2 border-border/50 flex items-center justify-center relative overflow-hidden shadow-md">
                                {user?.user_metadata?.avatar_url ? (
                                    <img
                                        src={user.user_metadata.avatar_url}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-10 h-10 text-muted-foreground/50" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">{user?.user_metadata?.full_name || "Utilizador"}</h3>
                                <p className="text-sm text-muted-foreground">Membro desde {new Date(user?.created_at || Date.now()).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground ml-1 uppercase mb-1.5 block">Email</label>
                                <div className="flex items-center h-11 px-4 rounded-xl border border-border/50 bg-secondary/20 text-sm">
                                    <Mail className="w-4 h-4 mr-3 text-muted-foreground" />
                                    <span className="flex-1 opacity-80">{user?.email}</span>
                                    <span className="text-xs px-2 py-0.5 rounded-md bg-green-500/10 text-green-500 font-medium border border-green-500/20">Verificado</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-muted-foreground ml-1 uppercase mb-1.5 block">Método de Login</label>
                                <div className="flex items-center h-11 px-4 rounded-xl border border-border/50 bg-secondary/20 text-sm">
                                    <Shield className="w-4 h-4 mr-3 text-muted-foreground" />
                                    <span className="capitalize">{user?.app_metadata?.provider || "email"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-sm p-6">
                        <h2 className="text-lg font-semibold mb-4 text-red-500 flex items-center gap-2">
                            Zona de Perigo
                        </h2>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                variant="outline"
                                className="flex-1 h-11 rounded-xl border-border/50 hover:bg-secondary/50"
                                onClick={handleLogout}
                                disabled={loading}
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                {loading ? "A sair..." : "Terminar Sessão"}
                            </Button>

                            <Button
                                variant="ghost"
                                className="flex-1 h-11 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                onClick={() => alert("Funcionalidade em desenvolvimento.")}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Eliminar Conta
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
