interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

/**
 * Estado de error inline para usar dentro de secciones que consumen /api/*.
 * Distingue "no hay datos" de "falló la conexión" para el usuario.
 */
export function ErrorState({
  message = "No pudimos cargar la información.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-copper/40 bg-bg-2/40 p-8 text-center">
      <div className="font-mono text-[10px] uppercase tracking-widest text-copper">
        Error de conexión
      </div>
      <div className="mt-2 text-sm text-ink">{message}</div>
      <p className="mt-1 text-xs text-ink-dim">
        Revisa tu conexión a internet e intenta de nuevo.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-full border border-line bg-bg-3 px-4 py-2 text-xs font-medium text-ink transition-colors hover:border-lime hover:text-lime"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
