import { BlockRenderer, Block } from "@stackpage/blocks";

const TEST_BLOCKS: Block[] = [
    {
        id: "1",
        type: "hero",
        props: {
            title: "Bem-vindo ao StackPage",
            subtitle: "Construa blogs incríveis empilhando blocos.",
            ctaText: "Começar Agora",
            ctaLink: "/dashboard"
        }
    }
];

export default function TestPage() {
    return (
        <main className="min-h-screen p-24">
            <h1 className="text-2xl font-bold mb-8">Teste de Blocos (Monorepo Integration)</h1>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <BlockRenderer blocks={TEST_BLOCKS} />
            </div>
        </main>
    );
}
