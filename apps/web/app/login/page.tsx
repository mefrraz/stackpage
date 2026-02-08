"use client";

import { Button } from "@stackpage/ui";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="header-bar h-14 flex items-center px-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center text-background text-xs font-bold font-mono">
                        S
                    </div>
                    <span className="text-sm font-semibold tracking-tight">StackPage</span>
                </Link>
            </header>

            {/* Main */}
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold tracking-tight">
                            {view === "sign_in" ? "Entrar" : "Criar Conta"}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            {view === "sign_in" ? "Bem-vindo de volta" : "Começa a construir o teu site"}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={() => handleOAuthLogin("github")}
                            disabled={loading}
                            variant="outline"
                            className="w-full h-10 rounded-md"
                        >
                            {loading ? "..." : "Continuar com GitHub"}
                        </Button>

                        <Button
                            onClick={() => handleOAuthLogin("google")}
                            disabled={loading}
                            variant="outline"
                            className="w-full h-10 rounded-md"
                        >
                            {loading ? "..." : "Continuar com Google"}
                        </Button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-background px-2 text-muted-foreground">ou</span>
                            </div>
                        </div>

                        <form onSubmit={handleEmailAuth} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-10 rounded-md"
                            >
                                {loading ? "A processar..." : (view === "sign_in" ? "Entrar" : "Criar Conta")}
                            </Button>
                        </form>

                        <div className="text-center text-sm pt-4">
                            <button
                                type="button"
                                onClick={() => { setView(view === "sign_in" ? "sign_up" : "sign_in"); setMessage(null); }}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {view === "sign_in" ? "Não tem conta? Registe-se" : "Já tem conta? Entre aqui"}
                            </button>
                        </div>

                        {message && (
                            <div className={`rounded-md p-3 text-sm border ${message.type === 'success' ? 'border-green-500 text-green-700 bg-green-50 dark:bg-green-950 dark:text-green-300' : 'border-red-500 text-red-700 bg-red-50 dark:bg-red-950 dark:text-red-300'}`}>
                                {message.text}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
