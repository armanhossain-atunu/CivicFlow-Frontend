"use client";
import type { ReactNode } from "react";
import QueryProvider from "./query.provider";
import { GoogleAuthProvider } from "./google-auth.provider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <GoogleAuthProvider>
      <QueryProvider>{children}</QueryProvider>
    </GoogleAuthProvider>
  );
}
