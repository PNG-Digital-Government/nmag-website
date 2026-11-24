import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";

const backend = defineBackend({
  auth,
  data,
  storage,
});

// Staff accounts: invite only, with strong passwords.
const { cfnUserPool } = backend.auth.resources.cfnResources;

// Nobody can create their own account; an Administrator invites each person.
cfnUserPool.adminCreateUserConfig = {
  allowAdminCreateUserOnly: true,
};

cfnUserPool.policies = {
  passwordPolicy: {
    minimumLength: 12,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true,
    // Invitations (temporary passwords) expire after 3 days.
    temporaryPasswordValidityDays: 3,
  },
};
