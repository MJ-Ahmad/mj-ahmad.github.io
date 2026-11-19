"use client";

import { LAYOUTS, LAYOUT_IDS, type LayoutId } from "@/lib/layouts";

export default function PrintSelect({ value, page }: { value: LayoutId; page: number }) {
  return (
    <label>
      <span>Print</span>
      <select
        id="layout"
        aria-label="Print"
        value={value}
        onChange={(e) => {
          // The runtime reads its layout config once at load, so switching needs a full load.
          window.location.assign(`/reader/${page}?print=${e.target.value}`);
        }}
      >
        {LAYOUT_IDS.map((id) => (
          <option key={id} value={id}>
            {LAYOUTS[id].label}
          </option>
        ))}
      </select>
    </label>
  );
}
