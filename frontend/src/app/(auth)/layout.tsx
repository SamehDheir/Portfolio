"use client";

import "../globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "react-hot-toast";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 antialiased">
        <ThemeProvider>
          <QueryProvider>
            <Toaster
              toastOptions={{
                className:
                  "dark:bg-slate-800 dark:text-slate-200 bg-white text-slate-900 border border-slate-200 dark:border-slate-700 font-bold rounded-2xl shadow-xl",
                duration: 4000,
                style: {
                  padding: "12px 24px",
                },
                success: {
                  iconTheme: {
                    primary: "#4f46e5", 
                    secondary: "#fff",
                  },
                },
              }}
            />
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
