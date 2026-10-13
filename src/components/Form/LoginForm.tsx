/** biome-ignore-all lint/a11y/noSvgWithoutTitle: GitHub icon is decorative */
/** biome-ignore-all lint/correctness/noUnusedImports: <explanation> */
"use client";

import { useForm } from "@tanstack/react-form";
import { cn } from "cn";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { getme } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks";
import { LoginZodSchema } from "@/validation";
import GoogleLoginComponent from "../modules/google-login/GoogleLogin";
import { toast } from "../ui/toast";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getRole(value: unknown): string | undefined {
  let current = value;

  for (let depth = 0; depth < 4; depth += 1) {
    if (!isRecord(current)) {
      return undefined;
    }

    if (typeof current.role === "string") {
      return current.role.trim().toLowerCase();
    }

    current = current.user ?? current.data;
  }

  return undefined;
}

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: login, isPending: loginPending } = useLogin();

  const authenticate = (loginData: { email: string; password: string }) => {
    login(loginData, {
      onSuccess: async () => {
        try {
          const userResponse = await getme();
          const role = getRole(userResponse);
          const dashboardPathByRole: Record<string, string> = {
            admin: "/dashboard/admin",
            citizen: "/dashboard/citizen",
            staff: "/dashboard/citizen",
            manager: "/dashboard/manager",
            technician: "/dashboard/technician",
          };
          const dashboardPath = role ? dashboardPathByRole[role] : undefined;

          if (!dashboardPath) {
            throw new Error("Your account role has no dashboard.");
          }

          toast.add({
            title: "Login successful",
            description: "Welcome back CivicFlow!",
            type: "success",
          });

          window.location.href = dashboardPath;
        } catch (error) {
          toast.add({
            title: "Could not open your dashboard",
            description:
              error instanceof Error
                ? error.message
                : "Your account role could not be determined.",
            type: "error",
          });
        }
      },

      onError: (err) => {
        console.error("Login error:", err);

        toast.add({
          title: "Login failed",
          description:
            "Invalid credentials. Please check your email and password.",
          type: "error",
        });
      },
    });
  };

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },

    validators: {
      onSubmit: LoginZodSchema,
    },

    onSubmit: ({ value }) => {
      authenticate(value);
    },
  });

  const demoAccounts = [
    {
      label: "Admin",
      email: "admin@gmail.com",
      password: "A@dmin12345",
    },
    {
      label: "Manager",
      email: "manager@gmail.com",
      password: "Manager@admin12345",
    },
    {
      label: "Technician",
      email: "technician@gmail.com",
      password: "Technician@12345",
    },
  ];

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
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>

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
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    className="absolute top-1/2 right-1 flex size-6 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff aria-hidden="true" className="size-4" />
                    ) : (
                      <Eye aria-hidden="true" className="size-4" />
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
          <Button type="submit" className="w-full" disabled={loginPending}>
            {loginPending ? "Logging in..." : "Login"}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center">
            Quick demo login
          </FieldDescription>
          <div className="grid grid-cols-3 gap-2">
            {demoAccounts.map((account) => (
              <Button
                key={account.email}
                type="button"
                variant="outline"
                className="w-full"
                disabled={loginPending}
                onClick={() => authenticate(account)}
              >
                {account.label}
              </Button>
            ))}
          </div>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>
      </FieldGroup>

      {/* Google OAuth */}
      <Field>
        <GoogleLoginComponent />

        <FieldDescription className="text-center">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline underline-offset-4">
            Sign up
          </Link>
        </FieldDescription>
      </Field>
    </form>
  );
}
