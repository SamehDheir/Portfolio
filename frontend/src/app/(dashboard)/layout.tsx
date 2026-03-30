"use client";

import "../globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "react-hot-toast";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { ThemeProvider } from "@/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
            />{" "}
            <DashboardShell>{children}</DashboardShell>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
