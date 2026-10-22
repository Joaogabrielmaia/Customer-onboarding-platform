import Link from "next/link";
import { NavLinks } from "@/components/nav-links";
import { requireUser } from "@/lib/auth";
import { roleLabel } from "@/lib/labels";
import { logoutAction } from "../actions/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  const items = [
    { href: "/", label: "Painel" },
    { href: "/implantacoes", label: "Implantações" },
    { href: "/pendencias", label: "Minhas pendências" },
    { href: "/clientes", label: "Clientes" },
    { href: "/modelos", label: "Modelos" },
    ...(user.role === "ADMIN"
      ? [
          { href: "/usuarios", label: "Usuários" },
          { href: "/configuracoes", label: "Configurações" },
        ]
      : []),
  ];

  return (
    <>
      <p className="bg-slate-900 px-4 py-1 text-center text-xs text-slate-100">
        Caso simulado de portfólio. Empresa, pessoas e dados são fictícios.
      </p>
      <header className="border-b border-slate-300 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-2">
          <Link href="/" className="text-xl font-bold text-indigo-900">
            Trilha
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-800">
              {user.name} · {roleLabel[user.role]}
            </span>
            <form action={logoutAction}>
              <button type="submit" className="rounded-md border border-slate-400 px-3 py-1.5 font-medium text-slate-900 hover:bg-slate-100">
                Sair
              </button>
            </form>
          </div>
          <nav aria-label="Principal" className="w-full">
            <NavLinks items={items} />
          </nav>
        </div>
      </header>
      <main id="conteudo" className="mx-auto max-w-6xl px-4 py-6">
        {children}
      </main>
    </>
  );
}
