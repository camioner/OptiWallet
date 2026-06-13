"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("OptiWallet error boundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-bg px-6 text-center text-ink">
      <div className="font-mono text-[10px] uppercase tracking-widest text-copper">
        Algo salió mal
      </div>
      <h1 className="font-serif text-2xl">No pudimos cargar esta página.</h1>
      <p className="max-w-sm text-sm text-ink-dim">
        Ocurrió un error inesperado. Puedes intentar de nuevo o volver al inicio.
      </p>
      <div className="mt-2 flex gap-3">
        <button
          onClick={reset}
          className="rounded-full border border-line bg-bg-2 px-4 py-2 text-xs font-medium text-ink transition-colors hover:border-lime hover:text-lime"
        >
          Reintentar
        </button>
        <a
          href="/"
          className="rounded-full border border-line bg-bg-2 px-4 py-2 text-xs font-medium text-ink transition-colors hover:border-lime hover:text-lime"
        >
          Ir al inicio
        </a>
      </div>
    </div>
  );
}
