import Link from "next/link";
import { Button } from "@stackpage/ui";
import { ArrowRight, LayoutTemplate, Type, Image as ImageIcon, MousePointer, Sparkles, Zap, Globe, Github } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white selection:bg-purple-500/30">

      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      {/* Header */}
      <header className="h-20 flex items-center justify-between px-6 md:px-12 sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 bg-[#050505]/60">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-br from-white to-white/50 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            <span className="text-black font-bold font-mono text-sm">S</span>
          </div>
          <span className="text-lg font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">StackPage</span>
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-400 hidden md:block">Olá, {user.email?.split('@')[0]}</span>
              <Link href="/dashboard">
                <Button className="h-9 px-4 rounded-full bg-white text-black hover:bg-neutral-200 transition-all font-medium border border-transparent hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  Ir para Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/login">
                <Button className="h-9 px-5 rounded-full bg-white text-black hover:bg-neutral-200 transition-all font-medium border border-transparent hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  Começar
                </Button>
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="flex-1 relative z-10">
        {/* Hero */}
        <section className="pt-32 pb-24 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-purple-300 mb-8 backdrop-blur-md shadow-inner animate-fade-in-up">
              <Sparkles className="w-3 h-3" />
              <span>Agora com Cloudinary & Custom Pages</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40 drop-shadow-sm">
              O futuro do blogging <br className="hidden md:block" /> é <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">minimalista</span>.
            </h1>

            <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-xl mx-auto leading-relaxed">
              Crie sites ultra-rápidos com um editor focado no que importa: o seu conteúdo. Sem plugins, sem distrações.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Link href={user ? "/dashboard" : "/login"}>
                <Button className="h-12 px-8 rounded-full text-base bg-white text-black hover:bg-neutral-200 hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                  Criar o meu Site <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" className="h-12 px-8 rounded-full text-base border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white backdrop-blur-md transition-all">
                  Ver Funcionalidades
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Floating Preview (Mockup) */}
        <div className="max-w-6xl mx-auto px-6 mb-32 relative group perspective-1000">
          <div className="relative rounded-2xl md:rounded-3xl border border-white/10 bg-[#111]/80 backdrop-blur-xl overflow-hidden shadow-2xl shadow-purple-900/20 transform transition-transform duration-700 hover:rotate-x-2">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-blue-500/10 opacity-50" />
            <div className="h-8 md:h-12 border-b border-white/10 flex items-center px-4 gap-2 bg-[#050505]/50">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
              <div className="ml-4 px-3 py-1 rounded-md bg-white/5 text-[10px] md:text-xs text-neutral-500 font-mono w-64 text-center border border-white/5">
                stackpage.com/editor
              </div>
            </div>
            <div className="aspect-[16/9] md:aspect-[21/9] flex items-center justify-center p-8 md:p-20 relative">
              {/* Abstract content representation */}
              <div className="w-full max-w-2xl space-y-6 opacity-80">
                <div className="h-12 w-3/4 bg-white/5 rounded-lg shimmer animate-pulse" />
                <div className="h-4 w-full bg-white/5 rounded shimmer animate-pulse delay-75" />
                <div className="h-4 w-5/6 bg-white/5 rounded shimmer animate-pulse delay-100" />
                <div className="h-64 w-full bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl border border-white/5 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                  <ImageIcon className="w-12 h-12 text-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid (Bento) */}
        <section id="features" className="py-24 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-4">
                Construído para performance.
              </h2>
              <p className="text-neutral-400">Design atemporal, código moderno.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <FeatureCard
                icon={<LayoutTemplate className="w-6 h-6 text-purple-400" />}
                title="Editor de Blocos"
                desc="Arraste e solte. Cada elemento é independente."
                className="md:col-span-2"
              />
              {/* Card 2 */}
              <FeatureCard
                icon={<Zap className="w-6 h-6 text-yellow-400" />}
                title="Ultra Rápido"
                desc="Next.js 15 + Turbopack sob o capô."
              />
              {/* Card 3 */}
              <FeatureCard
                icon={<Type className="w-6 h-6 text-blue-400" />}
                title="Tipografia"
                desc="Fontes Inter otimizadas para leitura."
              />
              {/* Card 4 */}
              <FeatureCard
                icon={<Globe className="w-6 h-6 text-green-400" />}
                title="SEO Nativo"
                desc="Metatags dinâmicas e sitemaps automáticos."
                className="md:col-span-2"
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 to-transparent pointer-events-none" />
          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="text-4xl font-bold mb-6 text-white">Pronto para começar?</h2>
            <p className="text-neutral-400 mb-8 text-lg">
              Junte-se a criadores que valorizam a simplicidade.
            </p>
            <Link href={user ? "/dashboard" : "/login"}>
              <Button className="h-12 px-10 rounded-full bg-white text-black hover:bg-neutral-200 transition-all font-medium text-lg shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                {user ? "Ir para o meu Dashboard" : "Criar Conta Grátis"}
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 px-6 bg-[#020202]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-neutral-500 gap-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-white/10 rounded flex items-center justify-center text-white text-[10px] font-mono">S</div>
            <p>&copy; {new Date().getFullYear()} StackPage</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="https://github.com/mefrraz/stackpage" className="hover:text-white transition-colors flex items-center gap-2">
              <Github className="w-4 h-4" /> GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, className }: { icon: React.ReactNode; title: string; desc: string; className?: string }) {
  return (
    <div className={`p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-sm transition-all duration-300 hover:border-white/10 group ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-black/50">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
      <p className="text-neutral-400 leading-relaxed">{desc}</p>
    </div>
  );
}
