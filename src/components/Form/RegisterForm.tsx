/** biome-ignore-all lint/a11y/noSvgWithoutTitle: GitHub icon is decorative */
/** biome-ignore-all lint/style/useImportType: <explanation> */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { cn } from "cn";
import { Eye, EyeOff } from "lucide-react";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRegister } from "@/hooks";
import { RegisterZodSchema } from "@/validation";
import GoogleLoginComponent from "../modules/google-login/GoogleLogin";
import { toast } from "../ui/toast";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { mutate: register, isPending: registerPending } = useRegister();

  type RegisterDefaultValues = z.infer<typeof RegisterZodSchema>;
  const defaultValues: RegisterDefaultValues = {
    name: "",
    contactNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: RegisterZodSchema,
    },
    onSubmit: ({ value }) => {
      const registerData = {
        name: value.name,
        contactNumber: value.contactNumber,
        email: value.email,
        password: value.password,
        confirmPassword: value.confirmPassword,
      };

      register(registerData, {
        onSuccess: (res) => {
          console.log(res);
          toast.add({
            title: "Verification OTP Sent to your email",
            description:
              "Welcome to CivicFlow! Please verify your email to continue.",
            type: "success",
          });

          router.push(`/verify-email?email=${encodeURIComponent(value.email)}`);
        },

        onError: (err) => {
          toast.add({
            title: "Register failed",
            description: err.message || "Something went wrong.",
            type: "error",
          });
        },
      });
    },
  });

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
          <h1 className="text-2xl font-bold">Create your account</h1>

          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>

        {/* Name */}
        <form.Field name="name">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>

              <Input
                id={field.name}
                name={field.name}
                type="text"
                placeholder="John Doe"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                autoComplete="name"
                required
              />
            </Field>
          )}
        </form.Field>

        {/* Contact Number */}
        <form.Field name="contactNumber">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Contact Number</FieldLabel>

              <Input
                id={field.name}
                name={field.name}
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                autoComplete="tel"
                required
              />
            </Field>
          )}
        </form.Field>

        {/* Email */}
        <form.Field name="email">
          {(field) => (
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
                autoComplete="email"
                required
              />

              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
          )}
        </form.Field>

        {/* Password */}
        <form.Field name="password">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>

              <div className="relative">
                <Input
                  id={field.name}
                  name={field.name}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  autoComplete="new-password"
                  className="pr-10"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
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

              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
          )}
        </form.Field>

        {/* Confirm Password */}
        <form.Field name="confirmPassword">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>

              <div className="relative">
                <Input
                  id={field.name}
                  name={field.name}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  autoComplete="new-password"
                  className="pr-10"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((visible) => !visible)}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirmed password"
                      : "Show confirmed password"
                  }
                  aria-pressed={showConfirmPassword}
                  className="absolute top-1/2 right-1 flex size-6 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff aria-hidden="true" className="size-4" />
                  ) : (
                    <Eye aria-hidden="true" className="size-4" />
                  )}
                </button>
              </div>

              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
          )}
        </form.Field>

        {/* Register Button */}
        <Field>
          <Button type="submit" className="w-full" disabled={registerPending}>
            {registerPending ? "Creating account..." : "Create Account"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        {/* Google OAuth */}
        <Field>
          <GoogleLoginComponent />
          <FieldDescription className="px-6 text-center">
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-4">
              Sign in
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
