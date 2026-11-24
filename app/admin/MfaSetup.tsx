"use client";

import { setUpTOTP, updateMFAPreference, verifyTOTPSetup } from "aws-amplify/auth";
import { useEffect, useState, type FormEvent } from "react";

/**
 * Links an authenticator app to the signed-in account.
 *
 * With MFA "REQUIRED" in Cognito the sign-in screen does this itself (with a
 * QR code) and this screen never shows. It is the fallback for a user pool
 * that had to stay on optional MFA: staff still can't reach the dashboard
 * until they've set it up.
 */
export function MfaSetup({ email, issuer, onDone, signOut }: { email: string; issuer: string; onDone: () => void; signOut: () => void }) {
  const [secret, setSecret] = useState<string | null>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUpTOTP()
      .then((details) => {
        setSecret(details.sharedSecret);
        setUri(details.getSetupUri(issuer, email).toString());
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Could not start two-step sign-in set-up."));
  }, [email, issuer]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await verifyTOTPSetup({ code: code.trim() });
      await updateMFAPreference({ totp: "PREFERRED" });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "That code didn't work. Check the time on your phone and try the newest code.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-wrap">
      <div className="panel">
        <div className="eyebrow">Two-step sign-in</div>
        <h1 className="admin-h1">Link your authenticator app</h1>
        <p>Every staff account needs two-step sign-in before it can use the Admin.</p>
        <ol className="steps">
          <li>Install an authenticator app on your phone (Google Authenticator, Microsoft Authenticator or Authy).</li>
          <li>
            In the app, add an account and choose <b>Enter a setup key</b>. Use the account name <b>{issuer}</b> and this key:
            <div className="secret">{secret ? <code>{secret.replace(/(.{4})/g, "$1 ").trim()}</code> : "Loading…"}</div>
            {uri && (
              <small>
                On the phone itself, you can tap <a href={uri}>open in authenticator app</a> instead.
              </small>
            )}
          </li>
          <li>Type the 6-digit code the app shows.</li>
        </ol>
        <form onSubmit={submit} className="fields one">
          <label>
            6-digit code
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            />
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="acts">
            <button className="btn btn-primary" disabled={busy || !secret}>
              {busy ? "Checking…" : "Turn on two-step sign-in"}
            </button>
            <button className="btn btn-outline" type="button" onClick={signOut}>
              Sign out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
