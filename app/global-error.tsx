"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("OptiWallet global error:", error);
  }, [error]);

  return (
    <html lang="es-CL">
      <body
        style={{
          background: "#0b0d0c",
          color: "#f5f1e8",
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          minHeight: "100dvh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#d67846" }}>
          Algo salió mal
        </div>
        <h1 style={{ fontSize: "24px", margin: 0 }}>OptiWallet no pudo cargar.</h1>
        <p style={{ maxWidth: "360px", fontSize: "14px", color: "#9a958a" }}>
          Ocurrió un error inesperado al iniciar la aplicación. Intenta recargar la página.
        </p>
        <button
          onClick={reset}
          style={{
            background: "#d4ff3a",
            color: "#0b0d0c",
            border: "none",
            borderRadius: "100px",
            padding: "10px 22px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Reintentar
        </button>
      </body>
    </html>
  );
}
