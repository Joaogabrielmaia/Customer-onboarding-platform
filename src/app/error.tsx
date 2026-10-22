"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="conteudo" className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Algo deu errado</h1>
      <p className="mt-2 text-slate-700">Não foi possível concluir a operação. Tente novamente; se continuar, avise o administrador.</p>
      <button onClick={reset} className="mt-4 rounded-md bg-indigo-700 px-4 py-2 font-medium text-white hover:bg-indigo-800">Tentar de novo</button>
    </main>
  );
}
