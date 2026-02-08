import Link from "next/link";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
                        StackPage
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md font-medium"
                    >
                        Meus Sites
                    </Link>
                    <Link
                        href="/dashboard/settings"
                        className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md font-medium"
                    >
                        Configurações
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            U
                        </div>
                        <div className="text-sm">
                            <p className="font-medium">User Name</p>
                            <p className="text-xs text-gray-500">user@example.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
