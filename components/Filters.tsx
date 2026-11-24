"use client";

import { useMemo, useState } from "react";
import type { CollectionArea, Exhibition } from "@/lib/types";
import { CollectionCard, ExhibitionCard } from "./cards";

const EX_FILTERS = ["All", "On now", "Opening soon", "Past"] as const;

export function ExhibitionList({ items }: { items: Exhibition[] }) {
  const [filter, setFilter] = useState<(typeof EX_FILTERS)[number]>("All");
  const shown = items.filter((e) => filter === "All" || e.status === filter);
  return (
    <>
      <div className="filters" role="group" aria-label="Filter exhibitions">
        {EX_FILTERS.map((f) => (
          <button key={f} type="button" className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>
      <div className="grid">
        {shown.length ? shown.map((e) => <ExhibitionCard key={e.id} e={e} />) : <p>No exhibitions in this group.</p>}
      </div>
    </>
  );
}

export function CollectionList({ items }: { items: CollectionArea[] }) {
  const [q, setQ] = useState("");
  const [type, setType] = useState("All types");
  const types = useMemo(() => [...new Set(items.map((c) => c.type).filter(Boolean))], [items]);
  const query = q.trim().toLowerCase();
  const shown = items
    .map((c, i) => ({ c, i }))
    .filter(({ c }) => (type === "All types" || c.type === type) && `${c.name} ${c.text}`.toLowerCase().includes(query));

  return (
    <>
      <div className="filters">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search collections" aria-label="Search collections" />
        <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Type">
          <option>All types</option>
          {types.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="grid">
        {shown.length ? shown.map(({ c, i }) => <CollectionCard key={c.id} c={c} i={i} />) : <p>No collection areas match.</p>}
      </div>
    </>
  );
}
