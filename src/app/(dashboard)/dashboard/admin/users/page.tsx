
"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Loader2, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CommonPagination } from "@/components/common/CommonPagination";
import { CommonSearch } from "@/components/common/CommonSearch";
import { CommonStatusFilter } from "@/components/common/CommonStatusFilter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useAdminUsers } from "@/hooks/admin.hook";
import type { IUser } from "@/types/user.type";
import { AdminPage } from "../AdminPage";

const PAGE_SIZE = 10;

const ROLE_OPTIONS = [
  { value: "ALL", label: "All roles" },
  { value: "CITIZEN", label: "Citizens" },
  { value: "TECHNICIAN", label: "Technicians" },
  { value: "MANAGER", label: "Managers" },
  { value: "ADMIN", label: "Admins" },
];

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-BD", {
    dateStyle: "medium",
  });
}

function getStatusVariant(status?: string) {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
      return "default" as const;

    case "BLOCKED":
    case "SUSPENDED":
    case "DELETED":
      return "destructive" as const;

    default:
      return "secondary" as const;
  }
}

function getUsersFromResponse(response: unknown): IUser[] {
  if (Array.isArray(response)) {
    return response as IUser[];
  }

  if (!response || typeof response !== "object") {
    return [];
  }

  const result = response as Record<string, unknown>;
  const data = result.data;

  if (Array.isArray(data)) {
    return data as IUser[];
  }

  if (data && typeof data === "object") {
    const nested = data as Record<string, unknown>;

    if (Array.isArray(nested.data)) {
      return nested.data as IUser[];
    }

    if (Array.isArray(nested.users)) {
      return nested.users as IUser[];
    }
  }

  if (Array.isArray(result.users)) {
    return result.users as IUser[];
  }

  return [];
}

export default function AdminUsersPage() {
  const { data, isLoading, isError, error } = useAdminUsers();

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("ALL");
  const [page, setPage] = useState(1);

  const users = useMemo(() => getUsersFromResponse(data), [data]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        [user.name, user.email, user.id].some((value) =>
          (value ?? "").toLowerCase().includes(query),
        );

      const matchesRole = role === "ALL" || user.role === role;

      return matchesSearch && matchesRole;
    });
  }, [users, search, role]);

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(totalPages, 1));

  const pageUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function changeSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function changeRole(value: string) {
    setRole(value);
    setPage(1);
  }

  return (
    <AdminPage
      title="Users"
      description="Manage registered citizens and CivicFlow staff accounts."
    >
      {isLoading ? (
        <div className="flex items-center gap-2 py-10 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          Loading users...
        </div>
      ) : isError ? (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 p-4 text-sm text-destructive">
          <AlertCircle className="size-5 shrink-0" />
          {error instanceof Error
            ? error.message
            : "Failed to load users."}
        </div>
      ) : (
        <Card>
          <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-5" />
                All Users
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                {filteredUsers.length} matching accounts
              </p>
            </div>

            <CommonSearch
              value={search}
              onChange={changeSearch}
              placeholder="Search name, email, or ID..."
            />
          </CardHeader>

          <CardContent className="space-y-4">
            <CommonStatusFilter
              value={role}
              options={ROLE_OPTIONS}
              onChange={changeRole}
            />

            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Account Status</TableHead>
                    <TableHead>Email Verified</TableHead>
                    <TableHead>Auth Provider</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {pageUsers.length > 0 ? (
                    pageUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex min-w-48 items-center gap-3">
                            {user.imageUrl ? (
                              <img
                                src={user.imageUrl}
                                alt={user.name || "User"}
                                className="size-10 shrink-0 rounded-full border object-cover"
                              />
                            ) : (
                              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted font-semibold">
                                {user.name?.charAt(0).toUpperCase() || "U"}
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {user.name || "Unnamed User"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {user.id.slice(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="whitespace-nowrap">
                          {user.email || "—"}
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline">
                            {user.role || "UNKNOWN"}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <Badge variant={getStatusVariant(user.status)}>
                            {user.status || "UNKNOWN"}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant={
                              user.emailVerified
                                ? "default"
                                : "secondary"
                            }
                          >
                            {user.emailVerified
                              ? "Verified"
                              : "Not verified"}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          {user.authProvider || "—"}
                        </TableCell>

                        <TableCell className="whitespace-nowrap">
                          {formatDate(user.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-28 text-center text-muted-foreground"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Users className="size-6" />
                          <p>No users found.</p>
                          <p className="text-xs">
                            Try changing your search or role filter.
                          </p>
                        </div>
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