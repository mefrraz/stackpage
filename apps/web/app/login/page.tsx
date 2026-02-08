"use client";

import { Button } from "@stackpage/ui";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        {view === "sign_in" ? "Bem-vindo de volta" : "Criar Conta"}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        StackPage - O seu construtor de blogs
                    </p>
                </div>

                <div className="space-y-3">
                    <Button
                        onClick={() => handleOAuthLogin("github")}
                        disabled={loading}
                        className="w-full bg-[#24292F] text-white hover:bg-[#24292F]/90"
                    >
                        {loading ? "..." : "Continuar com GitHub"}
                    </Button>

                    <Button
                        onClick={() => handleOAuthLogin("google")}
                        disabled={loading}
                        className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    >
                        {loading ? "..." : "Continuar com Google"}
                    </Button>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">Ou com email</span>
                        </div>
                    </div>

                    <form onSubmit={handleEmailAuth} className="space-y-4">
                        <div>
                            <label className="text-xs font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white hover:bg-blue-700"
                        >
                            {loading ? "A processar..." : (view === "sign_in" ? "Entrar" : "Registar")}
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <button
                            type="button"
                            onClick={() => { setView(view === "sign_in" ? "sign_up" : "sign_in"); setMessage(null); }}
                            className="text-blue-600 hover:underline"
                        >
                            {view === "sign_in" ? "Não tem conta? Registe-se" : "Já tem conta? Entre aqui"}
                        </button>
                    </div>

                    {message && (
                        <div className={`rounded-md p-4 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
