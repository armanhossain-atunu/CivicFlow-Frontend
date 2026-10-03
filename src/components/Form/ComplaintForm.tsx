"use client";

import { useForm } from "@tanstack/react-form";
import { cn } from "cn";

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
import { useCreateComplaint } from "@/hooks/complain.hook";
import { createComplaintSchema } from "@/validation";

const categoryOptions = [
  { label: "Select a category", value: "" },
  { label: "Water & Utilities", value: "water-utilities" },
  { label: "Roads & Traffic", value: "roads-traffic" },
  { label: "Waste Management", value: "waste-management" },
  { label: "Street Lighting", value: "street-lighting" },
  { label: "Public Safety", value: "public-safety" },
  { label: "Other", value: "other" },
];

export function ComplaintForm() {
  const { mutate: createComplaint, isPending: complaintPending } =
    useCreateComplaint();

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      department: "",
      location: "",
    },
    validators: {
      onSubmit: createComplaintSchema,
    },
    onSubmit: ({ value }) => {
      createComplaint(value, {
        onSuccess: () => {
          toast.add({
            title: "Complaint submitted",
            description: "Your complaint has been received and is being reviewed.",
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
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-2xl font-bold">Report a civic issue</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Share the details so the relevant team can follow up quickly.
          </p>
        </div>

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

        <form.Field name="categoryId">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                <select
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {isInvalid && field.state.meta.errors.length > 0 && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            );
          }}
        </form.Field>

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
                  placeholder="Public Works"
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

        <Field>
          <Button type="submit" className="w-full" disabled={complaintPending}>
            {complaintPending ? "Submitting..." : "Submit complaint"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
