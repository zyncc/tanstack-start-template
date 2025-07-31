import { Button } from "@/components/ui/button";
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
import { signUpSchema } from "@/lib/db/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { GalleryVerticalEnd, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { IoLogoGithub } from "react-icons/io5";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/(auth)/signup")({
  component: SignupForm,
});

function SignupForm() {
  const { redirectUrl } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [signUpLoading, setSignUpLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit({ name, email, password }: z.infer<typeof signUpSchema>) {
    setSignUpLoading(true);
    authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: redirectUrl,
      fetchOptions: {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["session"] });
          navigate({ to: redirectUrl });
        },
        onError(context) {
          setSignUpLoading(false);
          toast.error(context.error.message);
        },
      },
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center justify-center space-y-4">
        <GalleryVerticalEnd />
        <h1 className="text-2xl font-bold">Sign up to Tanstarter</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" readOnly={signUpLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    readOnly={signUpLoading}
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
                    readOnly={signUpLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={signUpLoading || googleLoading || githubLoading}
            className="w-full"
            type="submit"
          >
            {signUpLoading ? <Loader2 className="animate-spin" /> : null} Sign up
          </Button>
        </form>
      </Form>
      <div className="flex items-center justify-center gap-2">
        <Button
          type="button"
          variant={"secondary"}
          className="flex-1"
          disabled={signUpLoading || googleLoading || githubLoading}
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
          disabled={signUpLoading || googleLoading || githubLoading}
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
        Already have an account?{" "}
        <Link
          disabled={signUpLoading || googleLoading || githubLoading}
          to="/login"
          className="underline underline-offset-4"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
