import { createEnv } from "@t3-oss/env-core";
import { config } from "dotenv";
import * as z from "zod";

config();

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    VITE_BASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(1),

    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
  },

  emptyStringAsUndefined: true,
  runtimeEnv: process.env,
});
