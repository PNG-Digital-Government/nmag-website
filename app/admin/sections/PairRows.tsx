"use client";

import type { Pair } from "@/lib/types";
import { Field, OrderButtons, move } from "../ui";

/** Editable two-column rows, e.g. opening hours (days / hours) or fees (visitor type / fee). */
export function PairRows({
  rows,
  onChange,
  labels,
  addLabel,
}: {
  rows: Pair[];
  onChange: (rows: Pair[]) => void;
  labels: [string, string];
  addLabel: string;
}) {
  const setCell = (i: number, c: 0 | 1, v: string) => onChange(rows.map((r, j) => (j === i ? ((c === 0 ? [v, r[1]] : [r[0], v]) as Pair) : r)));
  return (
    <>
      <div className="exed">
        {rows.map((r, i) => (
          <div className="exitem" key={i}>
            <div className="fields">
              <Field label={labels[0]} value={r[0]} onChange={(v) => setCell(i, 0, v)} />
              <Field label={labels[1]} value={r[1]} onChange={(v) => setCell(i, 1, v)} />
            </div>
            <div className="item-acts">
              <OrderButtons i={i} count={rows.length} name={r[0] || `row ${i + 1}`} onMove={(d) => onChange(move(rows, i, d))} />
              <button type="button" className="btn btn-outline btn-sm" onClick={() => onChange(rows.filter((_, j) => j !== i))}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="btn btn-primary btn-sm add-btn" onClick={() => onChange([...rows, ["", ""]])}>
        {addLabel}
      </button>
    </>
  );
}
