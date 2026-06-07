import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // 🚀 Look for the deployed server URL first, fallback to local port 5000 if developing locally
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  
  user: {
    additionalFields: {
      role: {
        type: "string",
      },
    },
  },
});