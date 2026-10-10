"use client";

import { AlertCircle, ShieldCheck, UserRound } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetme } from "@/hooks/auth.hook";
import { AdminPage } from "../AdminPage";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getCurrentUser(value: unknown): Record<string, unknown> | undefined {
  let current = value;

  for (let depth = 0; depth < 4; depth += 1) {
    if (!isRecord(current)) return undefined;
    if (typeof current.email === "string" || typeof current.role === "string") {
      return current;
    }
    current = current.user ?? current.data;
  }

  return undefined;
}

export default function AdminSettingsPage() {
  const { data, isLoading, isError, error } = useGetme();
  const user = getCurrentUser(data);

  return (
    <AdminPage
      title="Settings"
      description="Review your administrator account and access information."
    >
      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2" aria-busy="true">
          {["account", "security"].map((section) => (
            <Card key={section}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                {["first", "second", "third"].map((row) => (
                  <div key={row} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 p-4 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {error instanceof Error
            ? error.message
            : "Failed to load administrator account."}
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound aria-hidden="true" className="size-5 text-primary" />
                Administrator account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">
                  {typeof user?.name === "string" ? user.name : "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">
                  {typeof user?.email === "string" ? user.email : "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium">
                  {typeof user?.role === "string" ? user.role : "—"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck
                  aria-hidden="true"
                  className="size-5 text-primary"
                />
                Access and security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Administrator pages are restricted to accounts with the admin
                role.
              </p>
              <p>
                Profile and authentication changes are managed through the
                existing account flows.
              </p>
              <p>
                The current API does not provide system-wide settings
                operations, so this page does not display unsaved controls.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </AdminPage>
  );
}
