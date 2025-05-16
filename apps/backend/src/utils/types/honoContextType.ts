import type { User, Session } from "@repo/types";
declare module "hono" {
  interface ContextVariableMap {
    user: Omit<User, "password">;
    session: Session;
  }
}
