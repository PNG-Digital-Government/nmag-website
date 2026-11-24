"use client";

import { useSettings } from "../settings";
import { Panel } from "../ui";

export function ContentSection() {
  const { role } = useSettings();
  return (
    <Panel title="Exhibitions, collections, learning and news">
      <p className="soon-note">
        Coming next: add, edit and reorder exhibitions, collection areas, learning cards, news stories and hero slides, each with a picture
        upload and a description for screen readers.
        {role === "CONTRIBUTOR" && " As a Contributor you'll be able to add and edit items; deleting is for Editors and Administrators."}
      </p>
    </Panel>
  );
}
