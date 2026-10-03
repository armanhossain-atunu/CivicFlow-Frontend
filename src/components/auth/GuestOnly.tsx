"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { useGetme } from "@/hooks";

export function GuestOnly({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, isLoading } = useGetme();
  const isAuthenticated = Boolean(data?.data);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/profile");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) {
    return (
      <output className="flex min-h-svh items-center justify-center">
        Checking your session...
      </output>
    );
  }

  return children;
}
