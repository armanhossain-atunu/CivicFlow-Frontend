"use client";

import { useForm } from "@tanstack/react-form";
import { cn } from "cn";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useResetPassword } from "@/hooks";
import { ResetPasswordZodSchema } from "@/validation";

export function ResetPasswordForm({ email }: { email: string }) {
  const router = useRouter();
  const { mutate: resetPassword, isPending: resetPasswordPending } =
    useResetPassword();

  const form = useForm({
    defaultValues: {
      email,
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: ResetPasswordZodSchema,
    },
    onSubmit: ({ value }) => {
      resetPassword(
        {
          email: value.email.trim(),
          otp: value.otp,
          newPassword: value.newPassword,
        },
        {
          onSuccess: () => {
            toast.add({
              title: "Password reset successful",
              description: "You can now log in with your new password.",
              type: "success",
            });
            router.push("/login");
          },
          onError: (error) => {
            toast.add({
              title: "Failed to reset password",
              description:
                error instanceof Error
                  ? error.message
                  : "Something went wrong. Please try again.",
              type: "error",
            });
          },
        },
      );
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
      className={cn("flex flex-col gap-6")}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            Enter the 6-digit code sent to your email and choose a new password.
          </p>
        </div>

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
                onChange={(event) => field.handleChange(event.target.value)}
                autoComplete="email"
                required
              />
              <FieldError>
                {field.state.meta.errors.map(String).join(", ")}
              </FieldError>
            </Field>
          )}
        </form.Field>

        <form.Field name="otp">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Verification code</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="827224"
                maxLength={6}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => {
                  const otp = event.target.value.replace(/\D/g, "").slice(0, 6);
                  field.handleChange(otp);
                }}
                className="text-center text-lg tracking-[0.5em]"
                required
              />
              <FieldError>
                {field.state.meta.errors.map(String).join(", ")}
              </FieldError>
            </Field>
          )}
        </form.Field>

        <form.Field name="newPassword">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>New password</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                required
              />
              <FieldDescription>
                Use at least 8 characters with lowercase, uppercase, a number,
                and a special character.
              </FieldDescription>
              <FieldError>
                {field.state.meta.errors.map(String).join(", ")}
              </FieldError>
            </Field>
          )}
        </form.Field>

        <form.Field name="confirmPassword">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Confirm new password</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                type="password"
                autoComplete="new-password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                required
              />
              <FieldError>
                {field.state.meta.errors.map(String).join(", ")}
              </FieldError>
            </Field>
          )}
        </form.Field>

        <form.Subscribe
          selector={(state) => ({
            email: state.values.email,
            otp: state.values.otp,
            newPassword: state.values.newPassword,
            confirmPassword: state.values.confirmPassword,
            isSubmitting: state.isSubmitting,
          })}
        >
          {({ email, otp, newPassword, confirmPassword, isSubmitting }) => (
            <Field>
              <Button
                type="submit"
                className="w-full"
                disabled={
                  resetPasswordPending ||
                  isSubmitting ||
                  !email.trim() ||
                  otp.length !== 6 ||
                  !newPassword ||
                  !confirmPassword
                }
              >
                {resetPasswordPending || isSubmitting
                  ? "Resetting password..."
                  : "Reset password"}
              </Button>
            </Field>
          )}
        </form.Subscribe>

        <FieldDescription className="text-center">
          Need another code?{" "}
          <Link
            href="/forgot-password"
            className="font-medium underline underline-offset-4"
          >
            Request a new one
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
