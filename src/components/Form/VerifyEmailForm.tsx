"use client";

import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useVerifyEmail } from "@/hooks";
import { cn } from "cn";

export function VerifyEmailForm() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const emailFromUrl = searchParams.get("email") ?? "";

	const {
		mutate: verifyEmail,
		isPending: verifyEmailPending,
	} = useVerifyEmail();

	const form = useForm({
		defaultValues: {
			email: emailFromUrl,
			otp: "",
		},

		onSubmit: ({ value }) => {
			const verifyData = {
				email: value.email,
				otp: value.otp,
			};

			verifyEmail(verifyData, {
				onSuccess: (res) => {
					console.log("Email verification response:", res);

					toast.add({
						title: "Email verification successful",
						description:
							"Welcome to CivicFlow! Please login to continue.",
						type: "success",
					});

					router.push("/login");
				},

				onError: (err) => {
					console.error("Email verification error:", err);

					toast.add({
						title: "Email verification failed",
						description:
							err instanceof Error
								? err.message
								: "Invalid or expired OTP. Please try again.",
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
					<h1 className="text-2xl font-bold">
						Verify your email
					</h1>

					<p className="max-w-sm text-sm text-muted-foreground">
						Enter the 6-digit verification code sent to your
						email address.
					</p>
				</div>

				{/* Email */}
				<form.Field name="email">
					{(field) => (
						<Field>
							<FieldLabel htmlFor={field.name}>
								Email
							</FieldLabel>

							<Input
								id={field.name}
								name={field.name}
								type="email"
								placeholder="m@example.com"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) =>
									field.handleChange(e.target.value)
								}
								autoComplete="email"
								required
							/>
						</Field>
					)}
				</form.Field>

				{/* OTP */}
				<form.Field name="otp">
					{(field) => (
						<Field>
							<FieldLabel htmlFor={field.name}>
								Verification Code
							</FieldLabel>

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
								onChange={(e) => {
									const value = e.target.value
										.replace(/\D/g, "")
										.slice(0, 6);

									field.handleChange(value);
								}}
								className="text-center text-lg tracking-[0.5em]"
								required
							/>

							<FieldDescription>
								Enter the 6-digit OTP sent to your email.
							</FieldDescription>
						</Field>
					)}
				</form.Field>

				{/* Submit */}
				<form.Subscribe
					selector={(state) => ({
						otp: state.values.otp,
						isSubmitting: state.isSubmitting,
					})}
				>
					{({ otp, isSubmitting }) => (
						<Field>
							<Button
								type="submit"
								className="w-full"
								disabled={
									verifyEmailPending ||
									isSubmitting ||
									otp.length !== 6
								}
							>
								{verifyEmailPending || isSubmitting
									? "Verifying..."
									: "Verify Email"}
							</Button>
						</Field>
					)}
				</form.Subscribe>

				{/* Back to Login */}
				<FieldDescription className="text-center">
					Already verified?{" "}
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