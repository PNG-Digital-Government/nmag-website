import type { ResourcesConfig } from "aws-amplify";

/**
 * The Amplify backend settings, or null when no backend has been deployed
 * yet. next.config.ts reads amplify_outputs.json at build time and passes it
 * in as AMPLIFY_OUTPUTS, so this works on the server and in the browser.
 */
export const amplifyOutputs: ResourcesConfig | null = (() => {
  const raw = process.env.AMPLIFY_OUTPUTS;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ResourcesConfig;
  } catch {
    return null;
  }
})();
