import { notFound } from "next/navigation";
import ReaderShell from "@/components/ReaderShell";
import { DEFAULT_LAYOUT, PAGE_COUNT, parsePage } from "@/lib/layouts";
import { ayahsOnPage, pageSummary } from "@/lib/quran";

// Static site: only the routes listed here exist; anything else is a 404 at build time.
export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: PAGE_COUNT }, (_, i) => ({ page: String(i + 1) }));
}

/** The print layout comes from ?print= on the client (ReaderShell reads it); the server renders the default. */
export default async function ReaderPage({ params }: { params: Promise<{ page: string }> }) {
  const n = parsePage((await params).page);
  if (n === null) notFound();
  return (
    <ReaderShell
      page={n}
      initialLayout={DEFAULT_LAYOUT}
      info={pageSummary(n)}
      pageAyahs={ayahsOnPage(n)}
    />
  );
}
