/** Escapes text, then allows only <em> and </em> back (used in hero headlines). */
export function emOnly(input: string): string {
  const escaped = input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  return escaped.replace(/&lt;(\/?)em&gt;/g, "<$1em>");
}

/** "home" -> "/", "about" -> "/about" */
export const routeFor = (id: string) => (id === "home" ? "/" : `/${id}`);

/** Cover pattern class for cards without a picture. */
export const coverClass = (n: number) => `cv${((n % 6) + 6) % 6}`;
