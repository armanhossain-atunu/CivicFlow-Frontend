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
import { useGetAllCategories } from "@/hooks/complain.hook";
import { useCreateAdminCategory } from "@/hooks/admin.hook";
import { AdminPage } from "../AdminPage";
import { Skeleton } from "@/components/ui/skeleton";

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

function CreateCategoryDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const { mutate: createCategory, isPending } = useCreateAdminCategory();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const trimmedDepartment = department.trim();

    if (!trimmedName || !trimmedDescription || !trimmedDepartment) {
      toast.add({
        title: "Required fields missing",
        description: "Enter a name, description, and department.",
        type: "error",
      });
      return;
    }

    createCategory(
      {
        name: trimmedName,
        description: trimmedDescription,
        department: trimmedDepartment,
        isActive: true,
        paymentRequired: false,
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Category created",
            description: `${trimmedName} was added successfully.`,
            type: "success",
          });
          setName("");
          setDescription("");
          setDepartment("");
          setOpen(false);
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
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isPending) setOpen(nextOpen);
      }}
    >
      <DialogTrigger render={<Button type="button">Create category</Button>} />
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create category</DialogTitle>
            <DialogDescription>
              Add a service category. New categories are active and do not
              require payment.
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
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </Field>
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

  for (let depth = 0; depth < 4; depth += 1) {
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
        if (typeof id !== "string" || typeof name !== "string") return [];

        return [
          {
            id,
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
    } else {
      return [];
    }
  }

  return [];
}

export default function AdminCategoriesPage() {
  const { data, isLoading, isError, error } = useGetAllCategories();
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const categories = getCategories(data);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    return categories.filter((category) => {
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
          {error instanceof Error
            ? error.message
            : "Failed to load categories."}
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
              <CreateCategoryDialog />
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
                  {pageCategories.length ? (
                    pageCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">
                          {category.name}
                        </TableCell>
                        <TableCell>{category.description ?? "—"}</TableCell>
                        <TableCell>{category.department ?? "—"}</TableCell>
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
                            ? `৳${Number(category.paymentAmount).toLocaleString("en-BD")}`
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
