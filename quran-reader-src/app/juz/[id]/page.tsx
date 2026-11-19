import { notFound } from "next/navigation";
import { DEFAULT_LAYOUT } from "@/lib/layouts";
import { JUZS } from "@/lib/data";
import { BASE_PATH } from "@/lib/base";
import ClientRedirect from "@/components/ClientRedirect";

// Static site: only the routes listed here exist; anything else is a 404 at build time.
export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: 30 }, (_, i) => ({ id: String(i + 1) }));
}

/** A juz opens its first page. Static export has no server redirect, so the client does it. */
export default async function JuzPage({ params }: { params: Promise<{ id: string }> }) {
  const n = Number((await params).id);
  const entry = Number.isInteger(n) ? JUZS[n - 1] : undefined;
  if (!entry) notFound();
  return <ClientRedirect to={`${BASE_PATH}/reader/${entry.page}/?print=${DEFAULT_LAYOUT}`} />;
}
