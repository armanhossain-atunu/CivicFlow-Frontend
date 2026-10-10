"use client";

import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function GlobalLoading() {
  const [isHydrated, setIsHydrated] = useState(false);
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated || (isFetching === 0 && isMutating === 0)) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />

        <p className="text-sm font-medium text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
