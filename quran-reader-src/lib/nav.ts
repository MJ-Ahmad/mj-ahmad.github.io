import type { Key } from "@/lib/i18n";

/** Site navigation: href and the translation key of its label. Plain data, shared by the header and the tabs. */
export const NAV: [string, Key][] = [
  ["/", "nav.home"],
  ["/reader", "nav.mushaf"],
  ["/sections", "nav.index"],
  ["/search", "nav.search"],
  ["/settings", "nav.settings"],
  ["/about", "nav.about"],
];

/** Whether a nav item is active for the current path. */
export function isActive(path: string, href: string): boolean {
  if (href === "/") return path === "/";
  return path === href || path.startsWith(href + "/");
}
