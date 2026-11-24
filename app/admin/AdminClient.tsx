"use client";

import { Amplify } from "aws-amplify";
import { fetchAuthSession } from "aws-amplify/auth";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { amplifyOutputs } from "@/lib/amplify-outputs";

if (amplifyOutputs) Amplify.configure(amplifyOutputs, { ssr: true });

const ROLE_NAMES: Record<string, string> = {
  ADMINISTRATOR: "Administrator",
  EDITOR: "Editor",
  CONTRIBUTOR: "Contributor",
};

const SECTIONS = [
  "Homepage: hero slides and pictures, key facts, section order",
  "Director's welcome: message and portrait",
  "Content: exhibitions, collections, learning cards and news, each with a picture",
  "Pages & Visit Info: opening hours, entry fees, address, phone, email",
  "Header & Menu, Footer, Widgets and the help chat's quick questions",
  "Site Mode: Live, Maintenance or Coming Soon",
];

function Dashboard({ email, signOut }: { email: string; signOut?: () => void }) {
  const [roles, setRoles] = useState<string[] | null>(null);

  useEffect(() => {
    fetchAuthSession()
      .then((s) => {
        const groups = s.tokens?.accessToken.payload["cognito:groups"];
        setRoles(Array.isArray(groups) ? groups.map(String) : []);
      })
      .catch(() => setRoles([]));
  }, []);

  return (
    <div>
      <div className="panel">
        <div className="eyebrow">NMAG Admin</div>
        <h1 style={{ fontSize: "1.8rem", margin: ".3rem 0 .5rem" }}>Signed in</h1>
        <p style={{ margin: 0 }}>
          {email}
          {roles && (
            <>
              {" · "}
              {roles.length ? roles.map((r) => ROLE_NAMES[r] ?? r).join(", ") : "No role yet: ask an Administrator to add you to a group."}
            </>
          )}
        </p>
      </div>
      <div className="panel">
        <h2 style={{ fontSize: "1.2rem" }}>Dashboard</h2>
        <p style={{ color: "var(--muted)" }}>The editing screens are the next stage of the build. They will cover:</p>
        <ul>
          {SECTIONS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
      <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
        <Link className="btn btn-outline" href="/">
          View the website
        </Link>
        <button className="btn btn-primary" type="button" onClick={signOut}>
          Sign out
        </button>
      </div>
    </div>
  );
}

export function AdminClient() {
  if (!amplifyOutputs) {
    return (
      <div className="admin-wrap">
        <div className="panel">
          <div className="eyebrow">NMAG Admin</div>
          <h1 style={{ fontSize: "1.8rem", margin: ".3rem 0 .5rem" }}>Backend not connected yet</h1>
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
    <div className="admin-wrap">
      <Authenticator hideSignUp>
        {({ user, signOut }) => <Dashboard email={user?.signInDetails?.loginId ?? user?.username ?? ""} signOut={signOut} />}
      </Authenticator>
    </div>
  );
}
