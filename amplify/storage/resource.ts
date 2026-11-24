import { defineStorage } from "@aws-amplify/backend";

/**
 * Pictures uploaded through the Admin dashboard (hero slides, Director's
 * portrait, exhibitions, collections, learning cards, news).
 * Visitors can view them; only staff can upload, replace or delete them.
 */
export const storage = defineStorage({
  name: "nmagMedia",
  access: (allow) => ({
    "media/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read"]),
      allow.groups(["ADMINISTRATOR", "EDITOR"]).to(["read", "write", "delete"]),
      allow.groups(["CONTRIBUTOR"]).to(["read", "write"]),
    ],
  }),
});
