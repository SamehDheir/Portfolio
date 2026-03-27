"use client"; 

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const isDashboard = pathname.startsWith("/dashboard");
  const isLoginPage = pathname === "/login";
  const hideLayout = isDashboard || isLoginPage;

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900`}
      >
        <QueryProvider>
          {!hideLayout && <Navbar />}
          
          <main className={!hideLayout ? "min-h-screen" : ""}>
            {children}
          </main>
          
          {!hideLayout && <Footer />}
          
          <Toaster position="top-center" reverseOrder={false} />
        </QueryProvider>
      </body>
    </html>
  );
}