
"use client";

import { useForm } from "@tanstack/react-form";
import { cn } from "cn";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

import {
  useCreateComplaint,
  useGetAllCategories,
} from "@/hooks/complain.hook";


import { createComplaintSchema } from "@/validation";

import type {
  Category,
  ComplaintFormValues,
  CreateComplaintResponse,
} from "@/types/complaints.type";
import { useGetme } from "@/hooks";

export function ComplaintForm() {
  const router = useRouter();

  // Logged-in user
  const {
    data: userResponse,
    isLoading: authLoading,
    isError: authError,
  } = useGetme();

  // Assumed response: { data: { role: "CITIZEN" } }
  const user = userResponse?.data;
  const isCitizen = user?.role === "CITIZEN";

  // Complaint mutation
  const {
    mutate: createComplaint,
    isPending: complaintPending,
  } = useCreateComplaint();

  // Categories
  const {
    data: categoriesResponse,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetAllCategories();

  const categoryList: Category[] = categoriesResponse?.data ?? [];

  const submitComplaint = (
    value: ComplaintFormValues,
    category: Category,
  ) => {
    // Frontend permission check
    if (!isCitizen) {
      toast.add({
        title: "Access denied",
        description: "Only citizens can create complaints.",
        type: "error",
      });
      return;
    }

    createComplaint(value, {
      onSuccess: (response: CreateComplaintResponse) => {
        const complaintId = response.data.id;
        const price = category.paymentAmount;

        // Payment required
        if (category.paymentRequired) {
          if (price == null || price <= 0) {
            toast.add({
              title: "Payment amount unavailable",
              description:
                "This category requires payment, but the payment amount is invalid.",
              type: "error",
            });
            return;
          }

          toast.add({
            title: "Complaint created",
            description:
              "Your complaint was created. Please complete the payment.",
            type: "success",
          });

          router.push(
            `/billing?complaintId=${encodeURIComponent(complaintId)}&price=${encodeURIComponent(String(price))}`,
          );

          return;
        }

        // No payment required
        toast.add({
          title: "Complaint submitted",
          description:
            "Your complaint has been received and is being reviewed.",
          type: "success",
        });

        form.reset();
      },

      onError: (error) => {
        toast.add({
          title: "Submission failed",
          description:
            error.message || "Please try again after a few moments.",
          type: "error",
        });
      },
    });
  };

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      department: "",
      location: "",
    } satisfies ComplaintFormValues,

    validators: {
      onSubmit: createComplaintSchema,
    },

    onSubmit: ({ value }) => {
      if (!isCitizen) {
        toast.add({
          title: "Access denied",
          description: "Only citizens can create complaints.",
          type: "error",
        });
        return;
      }

      const selectedCategory = categoryList.find(
        (category) => category.id === value.categoryId,
      );

      if (!selectedCategory) {
        toast.add({
          title: "Category required",
          description: "Please select a valid complaint category.",
          type: "error",
        });
        return;
      }

      submitComplaint(value, selectedCategory);
    },
  });

  // Authentication loading
  if (authLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="mx-auto h-8 w-56" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  // Authentication failed or user unavailable
  if (authError || !user) {
    return (
      <div className="rounded-xl border p-6 text-center">
        <h2 className="text-lg font-semibold">Authentication required</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Please log in with a citizen account to submit a complaint.
        </p>
        <Button
          className="mt-4"
          onClick={() => router.push("/login")}
        >
          Go to login
        </Button>
      </div>
    );
  }

  // Only CITIZEN can create complaints
  if (!isCitizen) {
    return (
      <div className="rounded-xl border bg-card p-6 text-center">
        <h2 className="text-lg font-semibold">Access restricted</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Only citizens can create complaints. Your current role does not
          have permission to submit a complaint.
        </p>
      </div>
    );
  }

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
        {/* Header */}
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-2xl font-bold">Report a civic issue</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Share the details so the relevant team can follow up quickly.
          </p>
        </div>

        {/* Title */}
        <form.Field name="title">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  Complaint title
                </FieldLabel>

                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="Broken water main near the market"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(event.target.value)
                  }
                  aria-invalid={isInvalid}
                  required
                />

                {isInvalid && field.state.meta.errors.length > 0 && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            );
          }}
        </form.Field>

        {/* Category */}
        <form.Field name="categoryId">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            const selectedCategory = categoryList.find(
              (category) => category.id === field.state.value,
            );

            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Category</FieldLabel>

                {categoriesLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : categoriesError ? (
                  <p className="text-sm text-destructive">
                    Failed to load categories. Please try again.
                  </p>
                ) : (
                  <select
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      const categoryId = event.target.value;

                      field.handleChange(categoryId);

                      const category = categoryList.find(
                        (item) => item.id === categoryId,
                      );

                      form.setFieldValue(
                        "department",
                        category?.department ?? "",
                      );
                    }}
                    aria-invalid={isInvalid}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  >
                    <option value="">Select a category</option>

                    {categoryList.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}

                {selectedCategory?.paymentRequired && (
                  <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
                    <p className="font-medium">Payment required</p>
                    <p>
                      This category requires a payment
                      {selectedCategory.paymentAmount != null
                        ? ` of ৳${selectedCategory.paymentAmount}`
                        : "."}
                    </p>
                  </div>
                )}

                {selectedCategory &&
                  !selectedCategory.paymentRequired && (
                    <FieldDescription>
                      No payment is required for this category.
                    </FieldDescription>
                  )}

                {isInvalid && field.state.meta.errors.length > 0 && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            );
          }}
        </form.Field>

        {/* Description */}
        <form.Field name="description">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>

                <textarea
                  id={field.name}
                  name={field.name}
                  rows={5}
                  placeholder="Describe the issue, when it started, and its impact."
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(event.target.value)
                  }
                  aria-invalid={isInvalid}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                />

                <FieldDescription>
                  Include the impact, location details, and urgency.
                </FieldDescription>

                {isInvalid && field.state.meta.errors.length > 0 && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            );
          }}
        </form.Field>

        {/* Department */}
        <form.Field name="department">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Department</FieldLabel>

              <Input
                id={field.name}
                name={field.name}
                placeholder="Automatically selected"
                value={field.state.value}
                readOnly
              />

              <FieldDescription>
                Department is automatically selected based on the category.
              </FieldDescription>
            </Field>
          )}
        </form.Field>

        {/* Location */}
        <form.Field name="location">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Location</FieldLabel>

                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="123 Main Street, Downtown"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(event.target.value)
                  }
                  aria-invalid={isInvalid}
                  required
                />

                {isInvalid && field.state.meta.errors.length > 0 && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            );
          }}
        </form.Field>

        {/* Submit */}
        <Field>
          <form.Subscribe
            selector={(state) => [
              state.values.categoryId,
              state.isSubmitting,
            ]}
          >
            {([categoryId, isSubmitting]) => {
              const selectedCategory = categoryList.find(
                (category) => category.id === categoryId,
              );

              const paymentRequired =
                selectedCategory?.paymentRequired ?? false;

              return (
                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    complaintPending ||
                    Boolean(isSubmitting) ||
                    categoriesLoading ||
                    categoriesError ||
                    !categoryId
                  }
                >
                  {complaintPending || isSubmitting
                    ? "Processing..."
                    : paymentRequired
                      ? `Pay & Submit${
                          selectedCategory?.paymentAmount != null
                            ? ` ৳${selectedCategory.paymentAmount}`
                            : ""
                        }`
                      : "Submit complaint"}
                </Button>
              );
            }}
          </form.Subscribe>
        </Field>
      </FieldGroup>
    </form>
  );
}