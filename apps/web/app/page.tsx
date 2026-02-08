import Link from "next/link";
import { Button } from "@stackpage/ui";
import { ArrowRight, LayoutTemplate, AlignLeft, ImagePlus, Link2, Zap, Palette, Lock } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      {/* Background Gradient (Dark Mode) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(9,9,11,0))] pointer-events-none" />

      {/* Header */}
      <header className="glass-header h-16 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold font-mono">
            SP
          </div>
          <span className="text-lg font-bold tracking-tight">StackPage</span>
        </div>

        <nav className="flex items-center gap-4">
          <ModeToggle />
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Login
          </Link>
          <Link href="/login">
            <Button className="font-semibold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-indigo-500/20">
              Get Started
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center pt-24 px-6">

        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="mb-6 inline-flex items-center justify-center rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-mono text-muted-foreground">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            v1.0.0 Public Beta
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
            Construi o teu site <br />
            <span className="text-primary">tijolo a tijolo.</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            A experiência de edição que parece física. Arrastar, largar, publicar.
            Sem código confuso, apenas design puro e performance extrema.
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="rounded-xl h-12 px-8 text-base bg-foreground text-background hover:bg-foreground/90">
                Começar a Construir <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Bento Grid Features */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-32 px-2">

          {/* Card Grande: Visual Editor */}
          <div className="md:col-span-2 bento-card p-8 subtle-glow relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center text-primary mb-4">
                <LayoutTemplate className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Editor Visual LEGO™-like</h3>
              <p className="text-muted-foreground max-w-md">
                Cada parte do teu site é um bloco independente. Move-os e sente o feedback da interface.
              </p>
            </div>
            {/* Abstract Visual Representation of Blocks */}
            <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-10 group-hover:opacity-20 transition-opacity">
              <div className="absolute top-10 right-10 w-32 h-20 border-2 border-primary rounded-lg rotate-6" />
              <div className="absolute top-20 right-20 w-32 h-32 border-2 border-primary rounded-lg -rotate-3" />
            </div>
          </div>

          {/* Card: Dark Mode */}
          <div className="bento-card p-8 subtle-glow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-foreground mb-4">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Theming</h3>
              <p className="text-muted-foreground text-sm">
                Modo escuro nativo e cores personalizáveis.
              </p>
            </div>
          </div>

          {/* Card: Performance */}
          <div className="bento-card p-8 subtle-glow">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center text-orange-600 mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Ultra Rápido</h3>
            <p className="text-muted-foreground text-sm">
              Static Generation (SSG). O teu site carrega antes de piscar.
            </p>
          </div>

          {/* Card: Auth */}
          <div className="md:col-span-2 bento-card p-8 subtle-glow">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-950/30 flex items-center justify-center text-green-600 mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Autenticação Integrada</h3>
            <p className="text-muted-foreground">
              Google, GitHub e Email prontos a usar. Não percas tempo a configurar logins.
            </p>
          </div>
        </div>

        {/* Avaliable Blocks Strip */}
        <div className="w-full max-w-4xl mx-auto mb-32 border-t border-border pt-16 text-center">
          <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-8">Blocos Disponíveis (v1.0)</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <BlockBadge icon={<LayoutTemplate className="w-4 h-4" />} label="Hero Section" />
            <BlockBadge icon={<AlignLeft className="w-4 h-4" />} label="Rich Text" />
            <BlockBadge icon={<ImagePlus className="w-4 h-4" />} label="Image Gallery" />
            <BlockBadge icon={<Link2 className="w-4 h-4" />} label="Action Buttons" />
          </div>
        </div>

      </main>

      <footer className="border-t border-border py-12 bg-secondary/30">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} StackPage Inc.</p>
        </div>
      </footer>
    </div>
  );
}

function BlockBadge({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background shadow-sm text-sm font-medium text-foreground">
      {icon}
      {label}
    </div>
  )
}
