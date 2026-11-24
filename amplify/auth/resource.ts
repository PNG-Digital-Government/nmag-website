import { defineAuth } from "@aws-amplify/backend";

/**
 * Staff sign-in for the Admin dashboard.
 *
 * Roles (Cognito groups):
 * - ADMINISTRATOR: everything, including site settings, colours and Site Mode
 * - EDITOR: create, edit and delete content
 * - CONTRIBUTOR: create and edit content, but not delete it
 *
 * Security:
 * - Invite only. An Administrator adds each staff member in Cognito; there is
 *   no self sign-up (switched off in amplify/backend.ts).
 * - Two-step sign-in (MFA) is required for every account, using an
 *   authenticator app (Google Authenticator, Microsoft Authenticator, Authy...).
 *   On first sign-in each person scans a QR code to link their app.
 * - Password rules and invitation expiry are set in amplify/backend.ts.
 *
 * Note: Cognito only allows "REQUIRED" MFA when the user pool is first
 * created. If this backend was deployed before MFA was added and the deploy
 * fails on this setting, see "Two-step sign-in" in the README.
 */
export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: "CODE",
      verificationEmailSubject: "Your NMAG Admin verification code",
      verificationEmailBody: (createCode) =>
        `Your verification code for the National Museum & Art Gallery Admin is ${createCode()}. It expires in 24 hours.`,
      userInvitation: {
        emailSubject: "You've been invited to the NMAG website Admin",
        emailBody: (user, code) =>
          `You've been added as staff on the National Museum & Art Gallery website.\n\n` +
          `Sign in at the website's /admin page with:\n` +
          `Email: ${user()}\n` +
          `Temporary password: ${code()}\n\n` +
          `You'll be asked to choose a new password, then to set up two-step sign-in with an authenticator app on your phone. ` +
          `The temporary password expires in 3 days.`,
      },
    },
  },
  multifactor: {
    mode: "REQUIRED",
    totp: true,
  },
  accountRecovery: "EMAIL_ONLY",
  groups: ["ADMINISTRATOR", "EDITOR", "CONTRIBUTOR"],
});
