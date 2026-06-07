import { authClient } from "@/lib/auth-client";

declare module "better-auth" {
  interface User {
    role: "ADMIN" | "HR" | "MANAGER" | "EMPLOYEE";
    departmentId?: string | null;
  }
}
