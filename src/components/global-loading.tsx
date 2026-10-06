"use client";

import { Loader2 } from "lucide-react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

export function GlobalLoading() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const isLoading = isFetching > 0 || isMutating > 0;

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 `z-[9999]` flex items-center justify-center bg-background/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 rounded-xl bg-background p-6 shadow-lg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />

        <p className="text-sm font-medium">Please wait...</p>
      </div>
    </div>
  );
}
