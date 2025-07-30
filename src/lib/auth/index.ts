import { env } from "@/env/server";
import { db } from "@/lib/db";
import { serverOnly } from "@tanstack/react-start";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { reactStartCookies } from "better-auth/react-start";
import { uuid } from "../utils";

const getAuthConfig = serverOnly(() =>
  betterAuth({
    appName: "React TanStack Starter",
    baseURL: env.VITE_BASE_URL,
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    emailAndPassword: {
      enabled: true,
      revokeSessionsOnPasswordReset: true,
    },
    account: {
      accountLinking: {
        enabled: true,
      },
    },
    session: {
      cookieCache: {
        enabled: false,
        maxAge: 5 * 60, // 5 minutes
      },
    },
    advanced: {
      database: {
        generateId: () => uuid(),
      },
    },
    socialProviders: {
      github: {
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      },
      google: {
        clientId: env.GOOGLE_CLIENT_ID!,
        clientSecret: env.GOOGLE_CLIENT_SECRET!,
      },
    },
    plugins: [admin(), reactStartCookies()],
  }),
);

export const auth = getAuthConfig();
