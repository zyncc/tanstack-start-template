import { auth } from "@/lib/auth";
import { createMiddleware } from "@tanstack/react-start";
import { getWebRequest, setResponseStatus } from "@tanstack/react-start/server";

export const AuthOnly = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const { headers } = getWebRequest();

    const session = await auth.api.getSession({
      headers,
      query: {
        disableCookieCache: true,
      },
    });

    if (!session) {
      setResponseStatus(401);
      throw new Error("Unauthorized");
    }

    return next({ context: { session } });
  },
);

export const AdminOnly = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const { headers } = getWebRequest();

    const session = await auth.api.getSession({
      headers,
      query: {
        disableCookieCache: true,
      },
    });

    if (session?.user.role !== "admin") {
      setResponseStatus(403);
      throw new Error("Forbidden");
    }

    return next({ context: { session } });
  },
);
