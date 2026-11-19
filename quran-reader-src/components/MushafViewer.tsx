"use client";

import { useEffect, useRef } from "react";
import { LAYOUTS, type LayoutId } from "@/lib/layouts";
import { BASE_PATH } from "@/lib/base";

const RUNTIME_SRC = `${BASE_PATH}/qmh/dist/quran-madina-html.min.js`;
const CDN_BASE = `${BASE_PATH}/qmh/`;

/**
 * Renders one Mushaf page with the vendored quran-madina-html 2.x library.
 * The library reads its layout and font size from the script tag once per document,
 * so a layout change is a full page load (see PrintSelect).
 */
export default function MushafViewer({ page, layout }: { page: number; layout: LayoutId }) {
  const def = LAYOUTS[layout];
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (document.querySelector("script[data-qmh]")) return;
    const s = document.createElement("script");
    s.src = RUNTIME_SRC;
    s.async = true;
    s.setAttribute("data-qmh", "1");
    s.setAttribute("data-cdn", CDN_BASE);
    s.setAttribute("data-layout", def.libLayout);
    s.setAttribute("data-font-size", "20");
    document.body.appendChild(s);
  }, [def.libLayout]);

  useEffect(() => {
    ref.current?.setAttribute("page", String(page));
  }, [page]);

  return <quran-madina-html ref={ref} dir="rtl" />;
}
