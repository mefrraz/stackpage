import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "StackPage | Construtor de Blogs Moderno",
    template: "%s | StackPage",
  },
  description: "Crie o seu site em segundos com o editor visual mais rápido do mercado. Sem código, apenas criatividade.",
  keywords: ["website builder", "no-code", "blog", "saas", "nextjs", "supabase"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className="scroll-smooth">
      <body className={`${sans.variable} antialiased font-sans min-h-screen bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
