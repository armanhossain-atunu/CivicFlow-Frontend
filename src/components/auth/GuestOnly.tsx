import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { GuestOnlyClient } from "@/components/auth/GuestOnlyClient";

export async function GuestOnly({ children }: { children: ReactNode }) {
  const hasSession = (await cookies()).has("accessToken");

  return (
    <GuestOnlyClient hasSession={hasSession}>{children}</GuestOnlyClient>
  );
}
