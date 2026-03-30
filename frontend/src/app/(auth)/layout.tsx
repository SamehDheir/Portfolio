"use client";

import "../globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "react-hot-toast";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 antialiased">
        <QueryProvider>
          <Toaster position="top-center" />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
