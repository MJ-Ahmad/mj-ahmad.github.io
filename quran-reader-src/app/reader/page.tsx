"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getLastRead, hydrateLastRead } from "@/lib/lastread";
import { DEFAULT_LAYOUT } from "@/lib/layouts";

/** /reader (the Mushaf nav link) opens the last-read page, or page 1. */
export default function ReaderEntry() {
  const router = useRouter();
  useEffect(() => {
    hydrateLastRead();
    const last = getLastRead();
    router.replace(last ? `/reader/${last.page}?print=${last.layout}` : `/reader/1?print=${DEFAULT_LAYOUT}`);
  }, [router]);
  return <p className="loading">…</p>;
}
