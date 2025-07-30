import { auth } from "@/lib/auth";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { cache } from "react";

export const getSession = createServerFn({ method: "GET" }).handler(
  cache(async () => {
    const { headers } = getWebRequest();
    const session = await auth.api.getSession({ headers });

    return session || null;
  }),
);
