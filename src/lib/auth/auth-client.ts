import { env } from "@/env/client";
import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL: env.VITE_BASE_URL,
  plugins: [adminClient()],
});

export default authClient;
