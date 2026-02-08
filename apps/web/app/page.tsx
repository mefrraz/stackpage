import Link from "next/link";
import { Button } from "@stackpage/ui";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
        StackPage
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-lg text-center">
        O construtor de blogs No-Code que te dá total liberdade.
      </p>

      <div className="flex gap-4">
        <Button>
          <Link href="/dashboard">Ir para o Dashboard</Link>
        </Button>
        <Button className="bg-white text-gray-900 border border-gray-200 hover:bg-gray-50">
          <Link href="/test-blocks">Ver Teste de Blocos</Link>
        </Button>
      </div>
    </div>
  );
}
