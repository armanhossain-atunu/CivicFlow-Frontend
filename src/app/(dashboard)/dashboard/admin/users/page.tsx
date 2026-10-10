"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Trash2, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/toast";

import {
  useAdminUsers,
  useDeleteAdminUser,
  useUpdateAdminUserRole,
  useUpdateAdminUserStatus,
} from "@/hooks/admin.hook";
import type { IUser, UserRole, UserStatus } from "@/types/user.type";
import { AdminPage } from "../AdminPage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAGE_SIZE = 10;

const ROLE_OPTIONS = [
  { value: "ALL", label: "All roles" },
  { value: "CITIZEN", label: "Citizens" },
  { value: "TECHNICIAN", label: "Technicians" },
  { value: "MANAGER", label: "Managers" },
  { value: "ADMIN", label: "Admins" },
];

const USER_ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "CITIZEN", label: "Citizen" },
  { value: "TECHNICIAN", label: "Technician" },
  { value: "MANAGER", label: "Manager" },
  { value: "ADMIN", label: "Admin" },
];

const USER_STATUS_OPTIONS: { value: UserStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "BLOCKED", label: "Blocked" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "DELETED", label: "Deleted" },
];

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-BD", {
    dateStyle: "medium",
  });
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
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteAdminUser();
  const { mutate: updateUserRole, isPending: isUpdatingRole } =
    useUpdateAdminUserRole();
  const { mutate: updateUserStatus, isPending: isUpdatingStatus } =
    useUpdateAdminUserStatus();

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("ALL");
  const [page, setPage] = useState(1);
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);

  const users = useMemo(() => getUsersFromResponse(data), [data]);

  function handleRoleChange(user: IUser, nextRole: string | null) {
    const selectedRole = USER_ROLE_OPTIONS.find(
      (option) => option.value === nextRole,
    )?.value;
    if (!selectedRole || selectedRole === user.role) return;

    updateUserRole(
      { userId: user.id, role: selectedRole },
      {
        onSuccess: () => {
          toast.add({
            title: "User role updated",
            description: `${user.name || user.email} is now a ${selectedRole.toLowerCase()}.`,
            type: "success",
          });
        },
        onError: (updateError) => {
          toast.add({
            title: "Failed to update user role",
            description:
              updateError instanceof Error
                ? updateError.message
                : "Unable to update this user's role.",
            type: "error",
          });
        },
      },
    );
  }

  function handleStatusChange(user: IUser, nextStatus: string | null) {
    const selectedStatus = USER_STATUS_OPTIONS.find(
      (option) => option.value === nextStatus,
    )?.value;
    if (!selectedStatus || selectedStatus === user.status) return;

    updateUserStatus(
      { userId: user.id, status: selectedStatus },
      {
        onSuccess: () => {
          toast.add({
            title: "User status updated",
            description: `${user.name || user.email} is now ${selectedStatus.toLowerCase()}.`,
            type: "success",
          });
        },
        onError: (updateError) => {
          toast.add({
            title: "Failed to update user status",
            description:
              updateError instanceof Error
                ? updateError.message
                : "Unable to update this user's status.",
            type: "error",
          });
        },
      },
    );
  }

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

  function handleDeleteUser() {
    if (!userToDelete) return;

    const deletedUser = userToDelete;
    deleteUser(deletedUser.id, {
      onSuccess: () => {
        toast.add({
          title: "User deleted",
          description: `${deletedUser.name || deletedUser.email} was deleted.`,
          type: "success",
        });
        setUserToDelete(null);
      },
      onError: (deleteError) => {
        toast.add({
          title: "Failed to delete user",
          description:
            deleteError instanceof Error
              ? deleteError.message
              : "Unable to delete this user.",
          type: "error",
        });
      },
    });
  }

  return (
    <>
      <AdminPage
        title="Users"
        description="Manage registered citizens and CivicFlow staff accounts."
      >
        {isLoading ? (
          <div
            className="space-y-4 rounded-xl border bg-card p-5"
            aria-busy="true"
          >
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-9 w-64" />
            </div>
            <Skeleton className="h-9 w-48" />
            <div className="space-y-2">
              {[
                "user-one",
                "user-two",
                "user-three",
                "user-four",
                "user-five",
              ].map((row) => (
                <Skeleton key={row} className="h-12 w-full" />
              ))}
            </div>
          </div>
        ) : isError ? (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 p-4 text-sm text-destructive">
            <AlertCircle className="size-5 shrink-0" />
            {error instanceof Error ? error.message : "Failed to load users."}
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
                      <TableHead className="text-right">Actions</TableHead>
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
                            <Select
                              value={user.role}
                              onValueChange={(value) =>
                                handleRoleChange(user, value)
                              }
                              disabled={isUpdatingRole}
                            >
                              <SelectTrigger
                                className="w-36"
                                aria-label={`Update role for ${user.name || user.email}`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {USER_ROLE_OPTIONS.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>

                          <TableCell>
                            <Select
                              value={user.status}
                              onValueChange={(value) =>
                                handleStatusChange(user, value)
                              }
                              disabled={isUpdatingStatus}
                            >
                              <SelectTrigger
                                className="w-36"
                                aria-label={`Update status for ${user.name || user.email}`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {USER_STATUS_OPTIONS.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>

                          <TableCell>
                            <Badge
                              variant={
                                user.emailVerified ? "default" : "secondary"
                              }
                            >
                              {user.emailVerified ? "Verified" : "Not verified"}
                            </Badge>
                          </TableCell>

                          <TableCell>{user.authProvider || "—"}</TableCell>

                          <TableCell className="whitespace-nowrap">
                            {formatDate(user.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label={`Delete ${user.name || user.email}`}
                              title="Delete user"
                              onClick={() => setUserToDelete(user)}
                            >
                              <Trash2 className="size-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={8}
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
      <AlertDialog
        open={Boolean(userToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setUserToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                {userToDelete?.name || userToDelete?.email || "this user"}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete user"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
