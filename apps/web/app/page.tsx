import Link from "next/link";
import { Button } from "@stackpage/ui";
import { ArrowRight, LayoutTemplate, Type, Image, MousePointer } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="header-bar h-14 flex items-center justify-between px-6 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center text-background text-xs font-bold font-mono">
            S
          </div>
          <span className="text-sm font-semibold tracking-tight">StackPage</span>
        </Link>

        <nav className="flex items-center gap-3">
          <ModeToggle />
          <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Login
          </Link>
          <Link href="/login">
            <Button className="h-8 px-4 text-sm rounded-md">
              Começar
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="pt-24 pb-16 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm font-mono text-muted-foreground mb-4">v1.0 — Beta Pública</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
              O construtor de sites<br />que faz sentido.
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Blocos simples. Interface limpa. Performance real. Sem distrações.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/login">
                <Button className="h-10 px-6 rounded-md">
                  Criar Site <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" className="h-10 px-6 rounded-md">
                  Ver mais
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="py-16 px-6 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm font-mono text-muted-foreground mb-8 text-center">Funcionalidades</p>

            <div className="grid md:grid-cols-2 gap-4">
              <FeatureCard
                icon={<LayoutTemplate className="w-5 h-5" />}
                title="Editor de Blocos"
                desc="Arrasta e larga. Cada elemento do teu site é um bloco independente."
              />
              <FeatureCard
                icon={<Type className="w-5 h-5" />}
                title="Tipografia Perfeita"
                desc="Fontes otimizadas para legibilidade. Sem configurações extras."
              />
              <FeatureCard
                icon={<Image className="w-5 h-5" />}
                title="Media Otimizada"
                desc="Imagens convertidas automaticamente para formatos modernos."
              />
              <FeatureCard
                icon={<MousePointer className="w-5 h-5" />}
                title="Interações Simples"
                desc="Hover, clique, scroll. Tudo funciona de forma intuitiva."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 border-t border-border">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Pronto para começar?</h2>
            <p className="text-muted-foreground mb-6">
              Cria uma conta gratuita em 30 segundos.
            </p>
            <Link href="/login">
              <Button className="h-10 px-8 rounded-md">
                Criar Conta Grátis
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} StackPage</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground transition-colors">Termos</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="card p-6 cursor-pointer">
      <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
