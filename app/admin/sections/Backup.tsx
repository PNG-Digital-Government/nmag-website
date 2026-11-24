"use client";

import { useState } from "react";
import { staffClient, useSettings } from "../settings";
import { Panel } from "../ui";

export function BackupSection() {
  const { settings, exists } = useSettings();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function download() {
    setBusy(true);
    setError(null);
    try {
      const m = staffClient().models;
      const opts = { limit: 1000 };
      const [hero, ex, col, learn, news] = await Promise.all([
        m.HeroSlide.list(opts),
        m.Exhibition.list(opts),
        m.CollectionArea.list(opts),
        m.LearningItem.list(opts),
        m.NewsPost.list(opts),
      ]);
      const failed = [hero, ex, col, learn, news].find((r) => r.errors?.length);
      if (failed) throw new Error(failed.errors?.map((e) => e.message).join(" "));

      const backup = {
        kind: "nmag-website-backup",
        version: 1,
        exportedAt: new Date().toISOString(),
        settingsSaved: exists,
        settings,
        heroSlides: hero.data,
        exhibitions: ex.data,
        collections: col.data,
        learning: learn.data,
        news: news.data,
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nmag-website-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The backup couldn't be made.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Panel title="Download a backup" intro="Saves all settings and content (text, order and picture file names) as one file. Keep it somewhere safe.">
        <button className="btn btn-primary btn-sm" type="button" disabled={busy} onClick={() => void download()}>
          {busy ? "Preparing…" : "Download backup"}
        </button>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </Panel>
      <Panel title="Restore from a backup">
        <p className="soon-note">Coming next: restore settings and content from a backup file, with a preview before anything changes.</p>
      </Panel>
    </>
  );
}
