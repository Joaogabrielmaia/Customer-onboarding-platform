import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Trilha", template: "%s · Trilha" },
  description: "Acompanhamento de implantação de clientes. Caso simulado de portfólio: empresa, pessoas e dados são fictícios.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2"
        >
          Ir para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
