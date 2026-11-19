"use client";

import { useEffect } from "react";

/** Client-side redirect for pages that used to redirect on the server. `to` must include the base path. */
export default function ClientRedirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return (
    <main className="page">
      <p className="loading">
        <a href={to}>→</a>
      </p>
    </main>
  );
}
