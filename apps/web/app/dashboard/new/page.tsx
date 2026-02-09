"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSite } from "@/lib/sites";
import { TEMPLATES, SiteModel } from "@/lib/templates";

import { Button } from "@stackpage/ui";
import { Check, ChevronRight, Loader2, Wand2 } from "lucide-react";

// Local theme definition for Wizard (Mirroring apps/template/lib/themes.ts)
const WIZARD_THEMES = [
    { id: 'luminous', name: 'Luminous Glass', color: '#c084fc', bg: '#09090b' },
    { id: 'swiss', name: 'Swiss Minimal', color: '#000000', bg: '#ffffff' },
    { id: 'cyberpunk', name: 'Cyberpunk', color: '#00ff41', bg: '#050505' },
    { id: 'neo-brutalism', name: 'Neo Brutalism', color: '#4f46e5', bg: '#fff1f2' },
];

export default function NewSiteWizard() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        subdomain: "",
        model: "portfolio" as SiteModel,
        theme: "luminous"
    });

    const handleCreate = async () => {
        setLoading(true);
        try {
            const site = await createSite(formData.title, formData.subdomain, {
                theme: formData.theme,
                model: formData.model
            });
            if (site) {
                router.push(`/dashboard/editor/${site.id}`);
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao criar site. Verifique se o subdomínio já existe.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-4xl z-10">
                <div className="mb-10 text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary mb-3">
                        <Wand2 className="w-5 h-5" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Vamos criar o teu site</h1>
                    <p className="text-base text-muted-foreground">Em 3 passos simples, o teu espaço na web estará pronto.</p>
                </div>

                {/* Steps Indicator */}
                <div className="flex justify-center gap-4 mb-12">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`h-1 w-12 rounded-full transition-all ${step >= s ? 'bg-primary' : 'bg-muted'}`} />
                    ))}
                </div>

                {/* Step 1: Identity */}
                {step === 1 && (
                    <div className="max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="space-y-3">
                            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Qual o nome do teu site?</label>
                            <input
                                type="text"
                                placeholder="Ex: O Meu Portfolio"
                                className="w-full text-xl font-bold bg-transparent border-b-2 border-border focus:border-primary outline-none py-2 placeholder:text-muted-foreground/30 transition-colors"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                autoFocus
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Escolhe o teu link (subdomínio)</label>
                            <div className="flex items-end gap-2">
                                <span className="text-base text-muted-foreground pb-2">stackpage.vercel.app/</span>
                                <input
                                    type="text"
                                    placeholder="omeusite"
                                    className="flex-1 text-base font-mono bg-transparent border-b-2 border-border focus:border-primary outline-none py-2 placeholder:text-muted-foreground/30 transition-colors"
                                    value={formData.subdomain}
                                    onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                                />
                            </div>
                        </div>
                        <Button
                            className="w-full mt-8"
                            size="lg"
                            disabled={!formData.title || !formData.subdomain}
                            onClick={() => setStep(2)}
                        >
                            Próximo <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                )}

                {/* Step 2: Model */}
                {step === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-8">
                        {Object.values(TEMPLATES).map((template) => (
                            <button
                                key={template.id}
                                onClick={() => setFormData({ ...formData, model: template.id })}
                                className={`group relative p-4 rounded-2xl border-2 text-left transition-all duration-300 hover:scale-[1.02] ${formData.model === template.id ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'}`}
                            >
                                <div className="text-2xl mb-3">{template.thumbnail}</div>
                                <h3 className="text-base font-bold mb-1">{template.name}</h3>
                                <p className="text-xs text-muted-foreground">{template.description}</p>

                                {formData.model === template.id && (
                                    <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                                        <Check className="w-4 h-4" />
                                    </div>
                                )}
                            </button>
                        ))}
                        <div className="col-span-full mt-8 flex justify-between">
                            <Button variant="ghost" onClick={() => setStep(1)}>Voltar</Button>
                            <Button onClick={() => setStep(3)} size="lg">Próximo <ChevronRight className="w-4 h-4 ml-2" /></Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Theme */}
                {step === 3 && (
                    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {WIZARD_THEMES.map((theme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => setFormData({ ...formData, theme: theme.id })}
                                    className={`relative h-32 rounded-2xl border-2 overflow-hidden transition-all ${formData.theme === theme.id ? 'border-primary ring-2 ring-primary/20 scale-[1.02]' : 'border-border hover:border-primary/50'}`}
                                >
                                    <div className="absolute inset-0 flex flex-col" style={{ backgroundColor: theme.bg }}>
                                        <div className="h-1/2 w-full p-4 flex items-center justify-center">
                                            <span style={{ color: theme.color }} className="font-bold text-lg">Aa</span>
                                        </div>
                                        <div className="h-1/2 w-full flex items-center gap-2 px-4" style={{ backgroundColor: theme.color }}>
                                            <div className="w-8 h-2 rounded-full bg-white/50" />
                                            <div className="w-4 h-2 rounded-full bg-white/30" />
                                        </div>
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 p-3 bg-background/80 backdrop-blur-sm border-t border-border/10 flex justify-between items-center">
                                        <span className={`text-sm font-medium ${formData.theme === theme.id ? 'text-primary' : 'text-foreground'}`}>{theme.name}</span>
                                        {formData.theme === theme.id && <Check className="w-4 h-4 text-primary" />}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Resumo</h3>
                            <div className="flex justify-between items-center py-2 border-b border-border/50">
                                <span>Nome</span>
                                <span className="font-medium">{formData.title}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border/50">
                                <span>URL</span>
                                <span className="font-mono text-xs">{formData.subdomain}.stackpage.vercel.app</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border/50">
                                <span>Modelo</span>
                                <span className="font-medium capitalize">{TEMPLATES[formData.model].name}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span>Tema</span>
                                <span className="font-medium capitalize">{WIZARD_THEMES.find(t => t.id === formData.theme)?.name}</span>
                            </div>
                        </div>

                        <div className="flex justify-between mt-8">
                            <Button variant="ghost" onClick={() => setStep(2)}>Voltar</Button>
                            <Button onClick={handleCreate} size="lg" disabled={loading} className="w-full ml-4">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
                                {loading ? "A criar magia..." : "Criar o meu Site"}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
