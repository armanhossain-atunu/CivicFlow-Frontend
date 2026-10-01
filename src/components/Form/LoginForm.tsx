
/** biome-ignore-all lint/a11y/noSvgWithoutTitle: GitHub icon is decorative */
"use client";

import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { LoginZodSchema } from "@/validation";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "cn";
import { useGoogleOAuth, useLogin } from "@/hooks";
import { toast } from "../ui/toast";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const { mutate: login, isPending: loginPending } = useLogin();

  const {
    mutate: googleLogin,
    isPending: googleLoginPending,
  } = useGoogleOAuth();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },

    validators: {
      onSubmit: LoginZodSchema,
    },

    onSubmit: ({ value }) => {
      const loginData = {
        email: value.email,
        password: value.password,
      };

      login(loginData, {
        onSuccess: (res) => {
          console.log(res);

          toast.add({
            title: "Login successful",
            description: "Welcome back CivicFlow!",
            type: "success",
          });

          router.push("/");
        },

        onError: (err) => {
          toast.add({
            title: "Login failed",
            description:
              err instanceof Error
                ? err.message
                : "Invalid email or password.",
            type: "error",
          });
        },
      });
    },
  });

  // ------------------------------------------
  // Google OAuth Success
  // ------------------------------------------

  const handleGoogleLoginSuccess = (credentialResponse: {
    credential?: string;
  }) => {
    const idToken = credentialResponse.credential;

    if (!idToken) {
      handleGoogleLoginError();
      return;
    }

    googleLogin(
      { idToken },
      {
        onSuccess: (res) => {
          console.log(res);

          toast.add({
            title: "Google login successful",
            description: "Welcome to CivicFlow!",
            type: "success",
          });

          router.push("/");
        },

        onError: (err) => {
          toast.add({
            title: "Google login failed",
            description:
              err instanceof Error
                ? err.message
                : "Google login failed. Please try again.",
            type: "error",
          });
        },
      },
    );
  };

  // ------------------------------------------
  // Google OAuth Error
  // ------------------------------------------

  const handleGoogleLoginError = () => {
    toast.add({
      title: "Google OAuth failed",
      description: "Please try again.",
      type: "error",
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className={cn("flex flex-col gap-6")}
    >
      <FieldGroup>
        {/* Header */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to CivicFlow</h1>

          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to access your account
          </p>
        </div>

        {/* Email */}
        <form.Field name="email">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>

                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  placeholder="m@example.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  required
                />

                {isInvalid && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </Field>
            );
          }}
        </form.Field>

        {/* Password */}
        <form.Field name="password">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor={field.name}>
                    Password
                  </FieldLabel>

                  <Link
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>

                <div className="relative">
                  <Input
                    id={field.name}
                    name={field.name}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className="pr-10"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((visible) => !visible)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    aria-pressed={showPassword}
                    className="absolute top-1/2 right-1 flex size-6 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff
                        aria-hidden="true"
                        className="size-4"
                      />
                    ) : (
                      <Eye
                        aria-hidden="true"
                        className="size-4"
                      />
                    )}
                  </button>
                </div>

                {isInvalid && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </Field>
            );
          }}
        </form.Field>

        {/* Login */}
        <Field>
          <Button
            type="submit"
            className="w-full"
            disabled={loginPending || googleLoginPending}
          >
            {loginPending ? "Logging in..." : "Login"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        {/* Google OAuth */}
        <Field>
          <div className="flex w-full justify-center">
            <GoogleLogin
              text="continue_with"
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
              useOneTap={false}
            />
          </div>

          {googleLoginPending && (
            <p className="text-center text-sm text-muted-foreground">
              Signing in with Google...
            </p>
          )}

          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="underline underline-offset-4"
            >
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}

