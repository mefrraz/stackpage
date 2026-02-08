"use client";

import { Button } from "@stackpage/ui";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Github, Play } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [view, setView] = useState<"sign_in" | "sign_up">("sign_in");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleOAuthLogin = async (provider: "github" | "google") => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        });

        if (error) {
            setMessage({ type: "error", text: error.message });
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (view === "sign_up") {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;
                setMessage({ type: "success", text: "Conta criada! Verifique o seu email para confirmar." });
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                    options: {

                    }
                });
                if (error) throw error;
                router.push("/dashboard");
                router.refresh();
            }
        } catch (error: any) {
            setMessage({ type: "error", text: error.message || "Ocorreu um erro." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
            {/* Background Atmosphere */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />

            {/* Header Link */}
            <header className="absolute top-6 left-6 z-20">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center text-primary-foreground text-sm font-bold font-mono shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                        S
                    </div>
                    <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">StackPage</span>
                </Link>
            </header>

            {/* Main Card */}
            <div className="w-full max-w-md relative z-10 animate-fade-in-up">
                <div className="rounded-3xl border border-white/10 bg-background/60 backdrop-blur-xl shadow-2xl shadow-black/5 p-8 md:p-10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                            {view === "sign_in" ? "Bem-vindo" : "Criar Conta"}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-2">
                            {view === "sign_in" ? "Entra para continuar a construir." : "Começa o teu site em segundos."}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                onClick={() => handleOAuthLogin("github")}
                                disabled={loading}
                                variant="outline"
                                className="w-full h-11 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 hover:text-foreground hover:border-white/20 transition-all"
                            >
                                <Github className="w-4 h-4 mr-2" /> GitHub
                            </Button>

                            <Button
                                onClick={() => handleOAuthLogin("google")}
                                disabled={loading}
                                variant="outline"
                                className="w-full h-11 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 hover:text-foreground hover:border-white/20 transition-all"
                            >
                                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </Button>
                        </div>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border/50" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground/60 backdrop-blur-xl">ou continuar com email</span>
                            </div>
                        </div>

                        <form onSubmit={handleEmailAuth} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground ml-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-11 px-4 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground/40"
                                    placeholder="exemplo@email.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-semibold text-muted-foreground ml-1">Password</label>
                                    {view === "sign_in" && (
                                        <a href="#" className="text-xs text-primary hover:underline">Esqueceste-te?</a>
                                    )}
                                </div>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-11 px-4 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground/40"
                                    placeholder="••••••••"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-11 rounded-xl font-medium mt-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/25 transition-all"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                        Processando...
                                    </span>
                                ) : (view === "sign_in" ? "Entrar na Conta" : "Criar Conta Grátis")}
                            </Button>
                        </form>

                        <div className="text-center text-sm pt-6 border-t border-border/40 mt-6">
                            <button
                                type="button"
                                onClick={() => { setView(view === "sign_in" ? "sign_up" : "sign_in"); setMessage(null); }}
                                className="text-muted-foreground hover:text-primary transition-colors font-medium"
                            >
                                {view === "sign_in" ? "Ainda não tens conta? Regista-te" : "Já tens conta? Faz Login"}
                            </button>
                        </div>

                        {message && (
                            <div className={`rounded-xl p-4 text-sm flex items-start gap-3 animate-fade-in border ${message.type === 'success' ? 'border-green-500/20 bg-green-500/10 text-green-500' : 'border-red-500/20 bg-red-500/10 text-red-500'}`}>
                                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span className="leading-relaxed">{message.text}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
