import Link from "next/link";
import { Button } from "@stackpage/ui";
import { ArrowRight, CheckCircle2, Zap, LayoutTemplate, Share2 } from "lucide-react"; // Assumindo Lucide instalado

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      {/* Background Gradient Blurs */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[100px] animate-pulse delay-700" />
      </div>

      {/* Header (Glass) */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-50 glass">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
            StackPage
          </span>
          <span className="text-[10px] px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-bold uppercase tracking-wider border border-blue-200 dark:border-blue-800">Beta</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1">
            Entrar
          </Link>
          <Link href="/login">
            <Button className="font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all">
              Começar Grátis
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 text-center relative max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border backdrop-blur-sm mb-8 text-xs font-medium text-muted-foreground animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Disponível para todos os criadores
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground mb-8 leading-[1.1]">
            Crie o seu blog <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
              sem limites.
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            O construtor de sites focado na <strong>performance</strong> e na sua <strong>liberdade</strong>.
            Edite visualmente, publique num clique e tenha um site ultra-rápido.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-14 px-8 text-lg font-bold shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 transition-all rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 border-0">
                Criar o meu Site <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#features" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full h-14 px-8 text-lg rounded-full backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border-gray-200 dark:border-gray-800 hover:bg-white/80 dark:hover:bg-slate-800/80">
                Como funciona?
              </Button>
            </Link>
          </div>

          {/* Mockup (Glass Card) */}
          <div className="relative mx-auto w-full max-w-5xl rounded-xl border border-border bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden aspect-video group transform hover:scale-[1.01] transition-transform duration-500">
            {/* Fake Browser Bar */}
            <div className="h-10 border-b border-border bg-muted/30 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
              <div className="mx-auto bg-background/50 w-64 h-6 rounded text-xs flex items-center justify-center text-muted-foreground font-mono">
                stackpage.app/editor
              </div>
            </div>

            {/* Content Placeholder */}
            <div className="absolute inset-0 top-10 flex flex-col items-center justify-center bg-gradient-to-tr from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-10">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mx-auto flex items-center justify-center text-4xl shadow-lg border border-blue-200 dark:border-blue-800">
                  🎨
                </div>
                <h3 className="text-2xl font-bold">Screenshot do Editor</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Aqui verás o teu dashboard com a interface de arrastar e largar blocos em tempo real.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-32 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Tudo o que precisas. <span className="text-muted-foreground">Nada do que não precisas.</span></h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Desenhado para criadores que querem focar no conteúdo, não na configuração de servidores.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                title="Editor Visual Intuitivo"
                desc="Arraste blocos, edite textos e veja as mudanças em tempo real. O que vê é o que obtém."
                icon={<LayoutTemplate className="w-6 h-6 text-blue-600" />}
              />
              <FeatureCard
                title="Performance de Topo"
                desc="Sites estáticos gerados com Next.js v15 e edge caching. Carrega instantaneamente."
                icon={<Zap className="w-6 h-6 text-amber-500" />}
              />
              <FeatureCard
                title="Domínio Personalizado"
                desc="Use o nosso subdomínio gratuito ou ligue o seu próprio domínio .com facilmente."
                icon={<Share2 className="w-6 h-6 text-violet-500" />}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 border-t border-border bg-gradient-to-b from-background to-secondary/30">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-bold">Pronto para lançar o teu projeto?</h2>
            <Link href="/login" className="inline-block">
              <Button size="lg" className="h-14 px-10 text-lg rounded-full font-bold shadow-xl shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
                Começar Agora - É Grátis
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">Sem cartão de crédito necessário.</p>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border bg-secondary/10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">StackPage</span>
            <span className="text-sm text-muted-foreground ml-2">&copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Termos</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacidade</a>
            <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="glass-card p-8 rounded-2xl flex flex-col gap-4 group hover:-translate-y-1 transition-transform duration-300">
      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-bold text-xl">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  )
}
