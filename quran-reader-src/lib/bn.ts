const DIGITS = "০১২৩৪৫৬৭৮৯";

/** Convert ASCII digits in a value to Bengali digits. */
export function bn(value: number | string): string {
  return String(value).replace(/[0-9]/g, (d) => DIGITS[Number(d)]);
}

/** Quarter-hizb part: 0 = start of hizb, 1..3 = quarter fractions. */
const PART_LABEL = ["", "১/৪", "১/২", "৩/৪"] as const;

export function hizbLabel(hizb: number, part: number): string {
  return `হিজব ${bn(hizb)}` + (part ? ` · ${PART_LABEL[part]}` : "");
}

export const TYPE_BN: Record<string, string> = { Meccan: "মাক্কী", Medinan: "মাদানী" };
export const SAJDA_BN: Record<string, string> = { obligatory: "ওয়াজিব", recommended: "মুস্তাহাব" };
