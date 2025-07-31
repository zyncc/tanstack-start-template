import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import authClient from "@/lib/auth/auth-client";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
  loader: ({ context }) => {
    return { session: context.session };
  },
});

function Home() {
  const { session } = Route.useLoaderData();
  const queryClient = useQueryClient();
  const router = useRouter();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-10 p-2">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold sm:text-4xl">React TanStarter</h1>
        <div className="flex items-center gap-2 max-sm:flex-col">
          This is an unprotected page:
          <pre className="bg-card text-card-foreground rounded-md border p-1">
            routes/index.tsx
          </pre>
        </div>
      </div>

      {session?.user ? (
        <div className="flex flex-col items-center gap-2">
          <p>Welcome back, {session?.user.name}!</p>
          <div className="flex gap-x-4">
            <Button type="button" asChild className="mb-2 w-fit" size="lg">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button type="button" asChild className="mb-2 w-fit" size="lg">
              <Link to="/todos">Go to Todos</Link>
            </Button>
          </div>
          <div className="text-center text-xs sm:text-sm">
            Session user:
            <pre className="max-w-screen overflow-x-auto px-2 text-start">
              {JSON.stringify(session?.user, null, 2)}
            </pre>
          </div>

          <Button
            onClick={async () => {
              await authClient.signOut();
              await queryClient.invalidateQueries({ queryKey: ["session"] });
              await router.invalidate();
            }}
            type="button"
            className="w-fit"
            variant="destructive"
            size="lg"
          >
            Sign out
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <p>You are not signed in.</p>
          <Button type="button" asChild className="w-fit" size="lg">
            <Link to="/login">Log in</Link>
          </Button>
        </div>
      )}

      <div className="flex flex-col items-center gap-2">
        <ThemeToggle />
      </div>
    </div>
  );
}
