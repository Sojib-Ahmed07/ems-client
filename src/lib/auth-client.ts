import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  // Add this block to tell TypeScript your User schema has a role string property
  user: {
    additionalFields: {
      role: {
        type: "string",
      },
    },
  },
});
