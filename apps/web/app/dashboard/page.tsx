import { Button } from "@stackpage/ui";
import Link from "next/link";

export default function DashboardPage() {
    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Meus Sites</h1>
                <Button>
                    <Link href="/dashboard/new">+ Novo Site</Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Placeholder Card */}
                <div className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-32 bg-gray-100 rounded-md mb-4 flex items-center justify-center text-gray-400">
                        Preview
                    </div>
                    <h3 className="font-semibold text-lg mb-1">Meu Primeiro Blog</h3>
                    <p className="text-sm text-gray-500 mb-4">meu-blog.stackpage.app</p>
                    <div className="flex gap-2">
                        <Button className="w-full bg-gray-900 text-white hover:bg-gray-800">
                            <Link href="/dashboard/editor/1">Editar</Link>
                        </Button>
                    </div>
                </div>

                {/* Empty State if needed */}
                {/* <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center h-64 text-gray-500">
          <p>Nenhum site criado ainda.</p>
          <Button variant="link">Criar o primeiro</Button>
        </div> */}
            </div>
        </div>
    );
}
