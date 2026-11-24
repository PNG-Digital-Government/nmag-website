/** Staff roles (Cognito groups) and which Admin sections each can open. */

export type Role = "ADMINISTRATOR" | "EDITOR" | "CONTRIBUTOR";

export const ROLE_NAMES: Record<Role, string> = {
  ADMINISTRATOR: "Administrator",
  EDITOR: "Editor",
  CONTRIBUTOR: "Contributor",
};

export type SectionId = "homepage" | "content" | "pages" | "identity" | "header" | "footer" | "widgets" | "mode" | "backup";

export interface AdminSection {
  id: SectionId;
  group: "Site" | "Design" | "System";
  label: string;
  roles: Role[];
}

/** Same sections, order and role access as the approved demo. */
export const ADMIN_SECTIONS: AdminSection[] = [
  { id: "homepage", group: "Site", label: "Homepage", roles: ["ADMINISTRATOR", "EDITOR"] },
  { id: "content", group: "Site", label: "Content", roles: ["ADMINISTRATOR", "EDITOR", "CONTRIBUTOR"] },
  { id: "pages", group: "Site", label: "Pages & Visit Info", roles: ["ADMINISTRATOR", "EDITOR"] },
  { id: "identity", group: "Design", label: "Identity & Colors", roles: ["ADMINISTRATOR"] },
  { id: "header", group: "Design", label: "Header & Menu", roles: ["ADMINISTRATOR"] },
  { id: "footer", group: "Design", label: "Footer", roles: ["ADMINISTRATOR"] },
  { id: "widgets", group: "Design", label: "Widgets", roles: ["ADMINISTRATOR", "EDITOR"] },
  { id: "mode", group: "Design", label: "Site Mode", roles: ["ADMINISTRATOR"] },
  { id: "backup", group: "System", label: "Backup", roles: ["ADMINISTRATOR"] },
];

const RANK: Role[] = ["ADMINISTRATOR", "EDITOR", "CONTRIBUTOR"];

/** The strongest role among a person's Cognito groups, or null if they have none. */
export function topRole(groups: readonly string[]): Role | null {
  return RANK.find((r) => groups.includes(r)) ?? null;
}

export function canOpen(role: Role, id: SectionId): boolean {
  return ADMIN_SECTIONS.some((s) => s.id === id && s.roles.includes(role));
}
