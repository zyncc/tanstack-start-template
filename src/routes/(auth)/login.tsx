import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import authClient from "@/lib/auth/auth-client";
import { signInSchema } from "@/lib/db/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { GalleryVerticalEnd, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { IoLogoGithub } from "react-icons/io5";
import { toast } from "sonner";
import z from "zod";

export const Route = createFileRoute("/(auth)/login")({
  component: LoginForm,
});

function LoginForm() {
  const { redirectUrl } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const [signInLoading, setSignInLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  function onSubmit({ email, password, rememberMe }: z.infer<typeof signInSchema>) {
    setSignInLoading(true);
    authClient.signIn.email({
      email,
      password,
      rememberMe,
      callbackURL: redirectUrl,
      fetchOptions: {
        onError(context) {
          setSignInLoading(false);
          toast.error(context.error.message);
        },
      },
    });
    queryClient.invalidateQueries({ queryKey: ["session"] });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center justify-center space-y-4">
        <GalleryVerticalEnd />
        <h1 className="text-2xl font-bold">Welcome back to Tanstarter</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="hello@example.com"
                    readOnly={signInLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password here"
                    readOnly={signInLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex items-center gap-x-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={signInLoading}
                  />
                </FormControl>
                <FormLabel>Remember me</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={signInLoading || githubLoading || googleLoading}
            className="w-full"
            type="submit"
          >
            {signInLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Sign in
          </Button>
        </form>
      </Form>
      <div className="flex items-center justify-center gap-2">
        <Button
          type="button"
          variant={"secondary"}
          className="flex-1"
          disabled={signInLoading || googleLoading || githubLoading}
          onClick={() => {
            setGithubLoading(true);
            authClient.signIn.social({
              provider: "github",
              callbackURL: redirectUrl,
              newUserCallbackURL: "/onboarding",
              fetchOptions: {
                onSuccess: async () =>
                  await queryClient.invalidateQueries({ queryKey: ["session"] }),
                onError(context) {
                  toast.error(context.error.message);
                },
              },
            });
          }}
        >
          {githubLoading ? <Loader2 className="animate-spin" /> : <IoLogoGithub />}
        </Button>
        <Button
          type="button"
          variant={"secondary"}
          disabled={signInLoading || googleLoading || githubLoading}
          className="flex-1"
          onClick={() => {
            setGoogleLoading(true);
            authClient.signIn.social({
              provider: "google",
              callbackURL: redirectUrl,
              newUserCallbackURL: "/onboarding",
              fetchOptions: {
                onSuccess: async () =>
                  await queryClient.invalidateQueries({ queryKey: ["session"] }),
                onError(context) {
                  toast.error(context.error.message);
                },
              },
            });
          }}
        >
          {googleLoading ? <Loader2 className="animate-spin" /> : <FcGoogle />}
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link
          to="/signup"
          disabled={signInLoading || googleLoading || githubLoading}
          className="underline underline-offset-4"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
