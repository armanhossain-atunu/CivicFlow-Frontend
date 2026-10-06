import z from "zod";
// Login
export const LoginZodSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, "Password Must Minimum 8 Characters Long.")
    .regex(/[a-z]/, "Password must contain atleast 1 Lowercase Letter")
    .regex(/[A-Z]/, "Password must contain atleast 1 Uppercase Letter")
    .regex(/[0-9]/, "Password must contain atleast 1 Number")
    .regex(/[^A-Za-z0-9]/, "Password must contain atleast 1 Special Character"),
});
// Register
export const RegisterZodSchema = z.object({
  name: z.string().min(3, "Name Must Minimum 3 Characters Long."),
  contactNumber: z.string().optional(),
  email: z.email(),
  password: z
    .string()
    .min(8, "Password Must Minimum 8 Characters Long.")
    .regex(/[a-z]/, "Password must contain atleast 1 Lowercase Letter")
    .regex(/[A-Z]/, "Password must contain atleast 1 Uppercase Letter")
    .regex(/[0-9]/, "Password must contain atleast 1 Number")
    .regex(/[^A-Za-z0-9]/, "Password must contain atleast 1 Special Character"),
  confirmPassword: z.string(),
});

export const ResetPasswordZodSchema = z
  .object({
    email: z.email(),
    otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit verification code."),
    newPassword: z
      .string()
      .min(8, "Password Must Minimum 8 Characters Long.")
      .regex(/[a-z]/, "Password must contain atleast 1 Lowercase Letter")
      .regex(/[A-Z]/, "Password must contain atleast 1 Uppercase Letter")
      .regex(/[0-9]/, "Password must contain atleast 1 Number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain atleast 1 Special Character",
      ),
    confirmPassword: z.string(),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

// complain form validation
export const createComplaintSchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),

  categoryId: z.string().trim().min(1, "Please select a category"),

  department: z.string().trim().min(2, "Department is required"),

  location: z.string().trim().min(1, "Location is required"),
});
