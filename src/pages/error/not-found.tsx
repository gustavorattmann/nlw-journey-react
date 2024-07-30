import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-10">
      <div className="gap-2">
        <h1 className="text-9xl font-bold text-slate-200">404</h1>
        <h2 className="text-4xl text-slate-400">Page not found</h2>
      </div>
      <Link to={"/"} className="text-zinc-200 hover:text-indigo-200">
        Clique aqui para voltar para a página inicial.
      </Link>
    </div>
  );
}
