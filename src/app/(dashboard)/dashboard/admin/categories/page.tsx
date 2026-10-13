"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommonPagination } from "@/components/common/CommonPagination";
import { CommonSearch } from "@/components/common/CommonSearch";
import { CommonStatusFilter } from "@/components/common/CommonStatusFilter";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetAllCategories } from "@/hooks/complain.hook";
import { useCreateAdminCategory } from "@/hooks/admin.hook";

import { useUpdateAdminCategory } from "@/hooks/admin.hook";

import { AdminPage } from "../AdminPage";

const PAGE_SIZE = 10;

const CATEGORY_FILTERS = [
  { value: "ALL", label: "All categories" },
  { value: "PAID", label: "Payment required" },
  { value: "FREE", label: "No payment" },
];

type Category = {
  id: string;
  name: string;
  description?: string;
  department?: string;
  isActive?: boolean;
  paymentRequired?: boolean;
  paymentAmount?: number | string | null;
};

type CreateCategoryDialogProps = {
  onCreated: () => void;
};

function CreateCategoryDialog({ onCreated }: CreateCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [paymentRequired, setPaymentRequired] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");

  const { mutate: createCategory, isPending } = useCreateAdminCategory();

  const resetForm = () => {
    setName("");
    setDescription("");
    setDepartment("");
    setPaymentRequired(false);
    setPaymentAmount("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const trimmedDepartment = department.trim();
    const amount = Number(paymentAmount);

    if (!trimmedName || !trimmedDescription || !trimmedDepartment) {
      toast.add({
        title: "Required fields missing",
        description: "Enter a category name, description, and department.",
        type: "error",
      });
      return;
    }

    if (
      paymentRequired &&
      (!paymentAmount.trim() || !Number.isFinite(amount) || amount <= 0)
    ) {
      toast.add({
        title: "Invalid payment amount",
        description: "Enter a payment amount greater than zero.",
        type: "error",
      });
      return;
    }

    const payload = {
      name: trimmedName,
      description: trimmedDescription,
      department: trimmedDepartment,
      isActive: true,
      paymentRequired,
      ...(paymentRequired ? { paymentAmount: amount } : {}),
    };

    createCategory(payload, {
      onSuccess: () => {
        toast.add({
          title: "Category created",
          description: `${trimmedName} was added successfully.`,
          type: "success",
        });

        resetForm();
        setOpen(false);

        // Tell the parent to refresh the categories list.
        onCreated();
      },

      onError: (error) => {
        toast.add({
          title: "Category creation failed",
          description:
            error instanceof Error
              ? error.message
              : "Unable to create the category.",
          type: "error",
        });
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isPending) return;

        setOpen(nextOpen);

        if (!nextOpen) {
          resetForm();
        }
      }}
    >
      <DialogTrigger render={<Button type="button">Create category</Button>} />

      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create category</DialogTitle>
            <DialogDescription>
              Add a service category and configure its payment requirements.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor="category-name">Name</FieldLabel>
              <input
                id="category-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                disabled={isPending}
                maxLength={100}
                placeholder="e.g. Road Damage"
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="category-description">
                Description
              </FieldLabel>
              <textarea
                id="category-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
                disabled={isPending}
                rows={3}
                placeholder="Describe this service category"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="category-department">Department</FieldLabel>
              <input
                id="category-department"
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                required
                disabled={isPending}
                placeholder="e.g. Public Works"
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="category-payment">
                Payment requirement
              </FieldLabel>
              <select
                id="category-payment"
                value={paymentRequired ? "PAID" : "FREE"}
                onChange={(event) => {
                  const isPaid = event.target.value === "PAID";

                  setPaymentRequired(isPaid);

                  if (!isPaid) {
                    setPaymentAmount("");
                  }
                }}
                disabled={isPending}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="FREE">No payment</option>
                <option value="PAID">Payment required</option>
              </select>
            </Field>

            {paymentRequired && (
              <Field>
                <FieldLabel htmlFor="category-payment-amount">
                  Payment amount (৳)
                </FieldLabel>
                <input
                  id="category-payment-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(event) => setPaymentAmount(event.target.value)}
                  required
                  disabled={isPending}
                  placeholder="e.g. 500"
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </Field>
            )}
          </FieldGroup>

          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="outline" disabled={isPending}>
                  Cancel
                </Button>
              }
            />

            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {isPending ? "Creating..." : "Create category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getCategories(value: unknown): Category[] {
  let current = value;

  for (let depth = 0; depth < 5; depth += 1) {
    if (Array.isArray(current)) {
      return current.flatMap((item): Category[] => {
        if (!isRecord(item)) return [];

        const {
          id,
          name,
          description,
          department,
          isActive,
          paymentRequired,
          paymentAmount,
        } = item;

        if (
          (typeof id !== "string" && typeof id !== "number") ||
          typeof name !== "string"
        ) {
          return [];
        }

        return [
          {
            id: String(id),
            name,
            description:
              typeof description === "string" ? description : undefined,
            department: typeof department === "string" ? department : undefined,
            isActive: typeof isActive === "boolean" ? isActive : undefined,
            paymentRequired:
              typeof paymentRequired === "boolean"
                ? paymentRequired
                : undefined,
            paymentAmount:
              typeof paymentAmount === "number" ||
              typeof paymentAmount === "string" ||
              paymentAmount === null
                ? paymentAmount
                : undefined,
          },
        ];
      });
    }

    if (!isRecord(current)) return [];

    if (Array.isArray(current.categories)) {
      current = current.categories;
    } else if ("data" in current) {
      current = current.data;
    } else if ("result" in current) {
      current = current.result;
    } else {
      return [];
    }
  }

  return [];
}

export default function AdminCategoriesPage() {
  const { data, isLoading, isError, error, refetch } = useGetAllCategories();

  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const categories = useMemo(() => getCategories(data), [data]);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return categories.filter((category) => {
      // Search is controlled only by the user's input.
      const matchesSearch =
        !query ||
        [category.name, category.department].some((value) =>
          value?.toLowerCase().includes(query),
        );

      const matchesPayment =
        paymentFilter === "ALL" ||
        (paymentFilter === "PAID" && category.paymentRequired === true) ||
        (paymentFilter === "FREE" && category.paymentRequired === false);

      return matchesSearch && matchesPayment;
    });
  }, [categories, search, paymentFilter]);

  const totalPages = Math.ceil(filteredCategories.length / PAGE_SIZE);

  const currentPage = Math.min(page, Math.max(totalPages, 1));

  const pageCategories = filteredCategories.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleCategoryCreated = () => {
    // Never place the newly created category name in search.
    setSearch("");
    setPaymentFilter("ALL");
    setPage(1);

    // Fetch the latest categories without reloading the page.
    void refetch();
  };

  return (
    <AdminPage
      title="Categories"
      description="Review service categories and their current payment requirements."
    >
      {isLoading ? (
        <div
          className="space-y-4 rounded-xl border bg-card p-5"
          aria-busy="true"
        >
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-9 w-64" />
          </div>

          <Skeleton className="h-9 w-48" />

          <div className="space-y-2">
            {[
              "category-one",
              "category-two",
              "category-three",
              "category-four",
              "category-five",
            ].map((row) => (
              <Skeleton key={row} className="h-12 w-full" />
            ))}
          </div>
        </div>
      ) : isError ? (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 p-4 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />

          <span>
            {error instanceof Error
              ? error.message
              : "Failed to load categories."}
          </span>

          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={() => void refetch()}
          >
            Retry
          </Button>
        </div>
      ) : (
        <Card>
          <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Service categories</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {filteredCategories.length} matching categories
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <CommonSearch
                value={search}
                onChange={(value) => {
                  setSearch(value);
                  setPage(1);
                }}
                placeholder="Search categories..."
              />

              <CreateCategoryDialog onCreated={handleCategoryCreated} />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <CommonStatusFilter
              value={paymentFilter}
              options={CATEGORY_FILTERS}
              onChange={(value) => {
                setPaymentFilter(value);
                setPage(1);
              }}
            />

            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>Payment requirement</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {pageCategories.length > 0 ? (
                    pageCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">
                          {category.name}
                        </TableCell>

                        <TableCell>{category.description || "—"}</TableCell>

                        <TableCell>{category.department || "—"}</TableCell>

                        <TableCell>
                          <Badge
                            variant={category.isActive ? "default" : "outline"}
                          >
                            {category.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant={
                              category.paymentRequired ? "secondary" : "outline"
                            }
                          >
                            {category.paymentRequired
                              ? "Payment required"
                              : "No payment"}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          {category.paymentRequired &&
                          category.paymentAmount != null
                            ? `৳${Number(category.paymentAmount).toLocaleString(
                                "en-BD",
                              )}`
                            : "—"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No categories match these filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <CommonPagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </CardContent>
        </Card>
      )}
    </AdminPage>
  );
}
