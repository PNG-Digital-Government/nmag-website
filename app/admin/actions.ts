"use server";

import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { fetchAuthSession } from "aws-amplify/auth/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { amplifyOutputs } from "@/lib/amplify-outputs";
import { topRole } from "@/lib/roles";

const runner = amplifyOutputs ? createServerRunner({ config: amplifyOutputs }) : null;

/**
 * Refreshes the public site straight after staff save a change, instead of
 * waiting for the 5-minute rebuild. Only signed-in staff with a role can
 * trigger it; the sign-in is read from the session cookies.
 */
export async function publishSite(): Promise<{ ok: boolean }> {
  if (!runner) return { ok: false };
  try {
    const session = await runner.runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (ctx) => fetchAuthSession(ctx),
    });
    const groups = session.tokens?.accessToken.payload["cognito:groups"];
    if (!topRole(Array.isArray(groups) ? groups.map(String) : [])) return { ok: false };
    revalidatePath("/", "layout");
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
