"use client";

import "../globals.css"; 
import { Geist, Geist_Mono } from "next/font/google";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "react-hot-toast";
import DashboardShell from "@/components/dashboard/DashboardShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"> 
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <DashboardShell>
            {children}
          </DashboardShell>
        </QueryProvider>
      </body>
    </html>
  );
}