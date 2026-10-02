"use client";

import { useForm } from "@tanstack/react-form";
import { cn } from "cn";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useForgotPassword } from "@/hooks";

export function ForgotPasswordForm() {
  const router = useRouter();

  const { mutate: forgotPassword, isPending: forgotPasswordPending } =
    useForgotPassword();

  const form = useForm({
    defaultValues: {
      email: "",
    },

    onSubmit: ({ value }) => {
      const forgotPasswordData = {
        email: value.email.trim(),
      };

      forgotPassword(forgotPasswordData, {
        onSuccess: () => {
          toast.add({
            title: "Verification OTP Sent",
            description:
              "Please check your email and enter the verification code.",
            type: "success",
          });

          router.push(
            `/reset-password?email=${encodeURIComponent(value.email.trim())}`,
          );
        },

        onError: (error) => {
          console.error("Forgot password error:", error);

          toast.add({
            title: "Failed to send OTP",
            description:
              error instanceof Error
                ? error.message
                : "Something went wrong. Please try again.",
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
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Forgot your password?</h1>

          <p className="max-w-sm text-sm text-muted-foreground">
            Enter your email address and we&apos;ll send you a verification code
            to reset your password.
          </p>
        </div>

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
            </Field>
          )}
        </form.Field>

        {/* Submit */}
        <form.Subscribe
          selector={(state) => ({
            email: state.values.email,
            isSubmitting: state.isSubmitting,
          })}
        >
          {({ email, isSubmitting }) => (
            <Field>
              <Button
                type="submit"
                className="w-full"
                disabled={
                  forgotPasswordPending || isSubmitting || !email.trim()
                }
              >
                {forgotPasswordPending || isSubmitting
                  ? "Sending..."
                  : "Send Verification Code"}
              </Button>
            </Field>
          )}
        </form.Subscribe>

        {/* Back to Login */}
        <FieldDescription className="text-center">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-medium underline underline-offset-4"
          >
            Back to Login
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
