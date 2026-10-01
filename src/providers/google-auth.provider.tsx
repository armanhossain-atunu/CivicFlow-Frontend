/** biome-ignore-all lint/style/useImportType: <explanation> */
"use client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ReactNode } from "react";

export const GoogleAuthProvider = ({ children }: { children: ReactNode }) => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return <>{children}</>;
    //   throw new Error("GOOGLE_CLIENT_ID is not defined");
  }
  return (
    <GoogleOAuthProvider clientId={clientId}>
      {}{children}
    </GoogleOAuthProvider>
  );
};
