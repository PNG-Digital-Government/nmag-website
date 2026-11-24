import { defineAuth } from "@aws-amplify/backend";

/**
 * Staff sign-in for the Admin dashboard.
 *
 * Roles (Cognito groups):
 * - ADMINISTRATOR: everything, including site settings, colours and Site Mode
 * - EDITOR: create, edit and delete content
 * - CONTRIBUTOR: create and edit content, but not delete it
 *
 * Self sign-up should be switched off in the Cognito console (or invite-only)
 * so that only staff added by an Administrator can sign in.
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: ["ADMINISTRATOR", "EDITOR", "CONTRIBUTOR"],
});
