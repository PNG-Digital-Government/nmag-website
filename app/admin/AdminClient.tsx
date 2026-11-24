"use client";

import { Amplify } from "aws-amplify";
import { fetchAuthSession, fetchMFAPreference } from "aws-amplify/auth";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { amplifyOutputs } from "@/lib/amplify-outputs";
import { topRole, type Role } from "@/lib/roles";
import { AdminShell } from "./AdminShell";
import { MfaSetup } from "./MfaSetup";
import { useIdleSignOut } from "./useIdleSignOut";

if (amplifyOutputs) Amplify.configure(amplifyOutputs, { ssr: true });

/** Name shown in each person's authenticator app next to the 6-digit code. */
const TOTP_ISSUER = "NMAG Admin";

const formFields = {
  signIn: {
    username: { label: "Staff email", placeholder: "you@museum.gov.pg" },
  },
  forceNewPassword: {
    password: {
      label: "Choose a new password",
      placeholder: "At least 12 characters",
    },
  },
  setupTotp: {
    QR: { totpIssuer: TOTP_ISSUER },
    confirmation_code: {
      label: "6-digit code from your authenticator app",
      placeholder: "123456",
    },
  },
  confirmSignIn: {
    confirmation_code: {
      label: "6-digit code from your authenticator app",
      placeholder: "123456",
    },
  },
};

function SignInHeader() {
  return (
    <div className="auth-head">
      <img src="/images/nmag-seal.webp" alt="" width={64} height={64} />
      <div>
        <div className="eyebrow">Staff only</div>
        <h1>NMAG Admin sign-in</h1>
        <p>Sign in with your staff email and password, then the 6-digit code from your authenticator app.</p>
      </div>
    </div>
  );
}

function SignInFooter() {
  return (
    <p className="auth-foot">
      No account? Ask an NMAG website Administrator to invite you. · <Link href="/">Back to the website</Link>
    </p>
  );
}

type Status =
  | { state: "checking" }
  | { state: "needs-mfa" }
  | { state: "ready"; role: Role | null }
  | { state: "error"; message: string };

function SignedIn({ email, signOut }: { email: string; signOut: () => void }) {
  const [status, setStatus] = useState<Status>({ state: "checking" });

  const check = useCallback(async () => {
    setStatus({ state: "checking" });
    try {
      const [session, mfa] = await Promise.all([fetchAuthSession({ forceRefresh: true }), fetchMFAPreference()]);
      // Cognito requires MFA for every account. This is a second check in case
      // the user pool was set to optional MFA (see README): nobody reaches the
      // dashboard until their authenticator app is linked.
      if (!mfa.enabled?.includes("TOTP")) {
        setStatus({ state: "needs-mfa" });
        return;
      }
      const groups = session.tokens?.accessToken.payload["cognito:groups"];
      setStatus({ state: "ready", role: topRole(Array.isArray(groups) ? groups.map(String) : []) });
    } catch (err) {
      setStatus({ state: "error", message: err instanceof Error ? err.message : "Could not check your account." });
    }
  }, []);

  useEffect(() => {
    void check();
  }, [check]);

  useIdleSignOut(signOut);

  if (status.state === "checking") {
    return (
      <div className="admin-wrap">
        <div className="panel" role="status">
          Checking your account…
        </div>
      </div>
    );
  }

  if (status.state === "error") {
    return (
      <div className="admin-wrap">
        <div className="panel">
          <h1 className="admin-h1">Something went wrong</h1>
          <p>{status.message}</p>
          <div className="acts">
            <button className="btn btn-primary" type="button" onClick={() => void check()}>
              Try again
            </button>
            <button className="btn btn-outline" type="button" onClick={signOut}>
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status.state === "needs-mfa") {
    return <MfaSetup email={email} issuer={TOTP_ISSUER} onDone={() => void check()} signOut={signOut} />;
  }

  if (!status.role) {
    return (
      <div className="admin-wrap">
        <div className="panel">
          <div className="eyebrow">NMAG Admin</div>
          <h1 className="admin-h1">No role yet</h1>
          <p>
            You're signed in as {email}, but you haven't been given a role. Ask an Administrator to add you to the Administrator, Editor or
            Contributor group, then sign in again.
          </p>
          <div className="acts">
            <Link className="btn btn-outline" href="/">
              View the website
            </Link>
            <button className="btn btn-primary" type="button" onClick={signOut}>
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <AdminShell email={email} role={status.role} signOut={signOut} />;
}

export function AdminClient() {
  if (!amplifyOutputs) {
    return (
      <div className="admin-wrap">
        <div className="panel">
          <div className="eyebrow">NMAG Admin</div>
          <h1 className="admin-h1">Backend not connected yet</h1>
          <p>
            Staff sign-in needs the Amplify backend. Deploy it on AWS Amplify Hosting, or run <code>npx ampx sandbox</code> locally, then reload
            this page. Until then the website shows its sample content.
          </p>
          <Link className="btn btn-outline" href="/">
            View the website
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-auth">
      <Authenticator hideSignUp formFields={formFields} components={{ Header: SignInHeader, Footer: SignInFooter }}>
        {({ user, signOut }) => (
          <SignedIn email={user?.signInDetails?.loginId ?? user?.username ?? ""} signOut={() => signOut?.()} />
        )}
      </Authenticator>
    </div>
  );
}
