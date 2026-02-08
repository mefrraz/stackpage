import Link from "next/link";
import { Button } from "@stackpage/ui";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="h-16 border-b flex items-center justify-between px-6 sticky top-0 bg-white/80 backdrop-blur z-50">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
            StackPage
          </span>
          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">BETA</span>
        </div>
        <nav className="flex gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2">
            Entrar
          </Link>
          <Link href="/login">
            <Button className="bg-black text-white hover:bg-gray-800">
              Começar Grátis
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-6 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6">
            O Construtor de Blogs <br />
            <span className="text-blue-600">Simples e Poderoso.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Crie o seu site em segundos, edite visualmente sem código e publique com um clique.
            Focado na performance e na sua liberdade criativa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button className="h-12 px-8 text-lg bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                Criar o meu Site
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" className="h-12 px-8 text-lg w-full sm:w-auto">
                Saber mais
              </Button>
            </Link>
          </div>

          {/* Mockup / Image Placeholder */}
          <div className="mt-16 rounded-xl border-4 border-gray-200 shadow-2xl bg-gray-50 overflow-hidden relative aspect-video group">
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">
              (Screenshot do Editor aqui)
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 bg-gray-50 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Tudo o que precisa para publicar</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                title="Editor Visual"
                desc="Arraste blocos, edite textos e veja as mudanças em tempo real. O que vê é o que obtém."
                icon="🎨"
              />
              <FeatureCard
                title="Ultra Rápido"
                desc="Sites estáticos gerados com Next.js para carregar instantaneamente em qualquer lugar."
                icon="⚡"
              />
              <FeatureCard
                title="Domínio Personalizado"
                desc="Use o nosso subdomínio gratuito ou ligue o seu próprio domínio .com facilmente."
                icon="🌐"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} StackPage. Todos os direitos reservados.
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc, icon }: { title: string, desc: string, icon: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-bold text-xl mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </div>
  )
}
