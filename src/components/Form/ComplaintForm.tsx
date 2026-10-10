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

import { useCreateComplaint, useGetAllCategories } from "@/hooks/complain.hook";

import { createComplaintSchema } from "@/validation";

type Category = {
  id: string;
  name: string;
  department: string;
  paymentRequired: boolean;
  paymentAmount?: number | null;
};

type ComplaintFormValues = {
  title: string;
  description: string;
  categoryId: string;
  department: string;
  location: string;
};

type CreateComplaintResponse = {
  data: {
    id: string;
  };
};

export function ComplaintForm() {
  const router = useRouter();

  const { mutate: createComplaint, isPending: complaintPending } =
    useCreateComplaint();

  const { data: categories, isLoading: categoriesLoading } =
    useGetAllCategories();

  const categoryList: Category[] = categories?.data ?? [];

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

  const submitComplaint = (value: ComplaintFormValues, category: Category) => {
    createComplaint(value, {
      onSuccess: (response: CreateComplaintResponse) => {
        // Complaint ID from backend
        const complaintId = response.data.id;

        // Payment amount from selected category
        const price = category.paymentAmount;

        /*
         * Payment is required
         */
        if (category.paymentRequired) {
          if (!price) {
            toast.add({
              title: "Payment amount unavailable",
              description:
                "This category requires payment, but no payment amount was found.",
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

          // Go to billing page
          router.push(
            `/billing?complaintId=${encodeURIComponent(
              complaintId,
            )}&price=${encodeURIComponent(price)}`,
          );

          return;
        }

        /*
         * No payment required
         */
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
          description: error.message || "Please try again after a few moments.",
          type: "error",
        });
      },
    });
  };

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
        {/* HEADER */}
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-2xl font-bold">Report a civic issue</h1>

          <p className="text-sm text-balance text-muted-foreground">
            Share the details so the relevant team can follow up quickly.
          </p>
        </div>

        {/* TITLE */}
        <form.Field name="title">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Complaint title</FieldLabel>

                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="Broken water main near the market"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
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

        {/* CATEGORY */}
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
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

                {/* Payment information */}
                {selectedCategory?.paymentRequired && (
                  <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
                    <p className="font-medium">Payment required</p>

                    <p>
                      This category requires a payment
                      {selectedCategory.paymentAmount
                        ? ` of ৳${selectedCategory.paymentAmount}`
                        : "."}
                    </p>
                  </div>
                )}

                {!selectedCategory?.paymentRequired && selectedCategory && (
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

        {/* DESCRIPTION */}
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
                  placeholder="Describe the issue, when it started, and any immediate impact."
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                />

                <FieldDescription>
                  Include the impact, location details, and any urgency.
                </FieldDescription>

                {isInvalid && field.state.meta.errors.length > 0 && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            );
          }}
        </form.Field>

        {/* DEPARTMENT */}
        <form.Field name="department">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Department</FieldLabel>

                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="Automatically selected"
                  value={field.state.value}
                  readOnly
                  aria-invalid={isInvalid}
                />

                <FieldDescription>
                  Department is automatically selected based on the category.
                </FieldDescription>

                {isInvalid && field.state.meta.errors.length > 0 && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            );
          }}
        </form.Field>

        {/* LOCATION */}
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
                  onChange={(event) => field.handleChange(event.target.value)}
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

        {/* SUBMIT */}
        <Field>
          <form.Subscribe
            selector={(state) => [state.values.categoryId, state.isSubmitting]}
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
                    categoriesLoading
                  }
                >
                  {complaintPending || isSubmitting
                    ? "Processing..."
                    : paymentRequired
                      ? `Pay & Submit${
                          selectedCategory?.paymentAmount
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
