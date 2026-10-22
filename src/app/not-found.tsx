import Link from "next/link";

export default function NotFound() {
  return (
    <main id="conteudo" className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Página não encontrada</h1>
      <p className="mt-2 text-slate-700">O endereço não existe ou você não tem acesso a ele.</p>
      <Link href="/" className="mt-4 inline-block rounded-md bg-indigo-700 px-4 py-2 font-medium text-white hover:bg-indigo-800">Voltar ao painel</Link>
    </main>
  );
}
