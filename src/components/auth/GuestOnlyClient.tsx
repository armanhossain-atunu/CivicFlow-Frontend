"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetme } from "@/hooks";

export function GuestOnlyClient({
  children,
  hasSession,
}: {
  children: ReactNode;
  hasSession: boolean;
}) {
  const router = useRouter();
  const { data, isLoading } = useGetme(hasSession);
  const isAuthenticated = Boolean(data?.data);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/profile");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) {
    return (
      <main
        className="flex min-h-svh items-center justify-center p-4"
        aria-busy="true"
        aria-label="Checking your session"
      >
        <div className="w-full max-w-sm space-y-4 rounded-xl border p-6">
          <Skeleton className="mx-auto size-12 rounded-full" />
          <Skeleton className="mx-auto h-5 w-40" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </main>
    );
  }

  return children;
}
