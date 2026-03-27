"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { usePathname, useParams } from "next/navigation";
import ChatAI from "@/components/layout/ChatAI";
import { NextIntlClientProvider, AbstractIntlMessages } from "next-intl";
import { useState, useEffect } from "react";

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
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const [messages, setMessages] = useState<AbstractIntlMessages | null>(null);

  useEffect(() => {
    import(`../../../messages/${locale}.json`).then((m) => {
      setMessages(m.default);
    });
  }, [locale]);

  const isDashboard =
    pathname.startsWith(`/${locale}/dashboard`) ||
    pathname.startsWith("/dashboard");
  const isLoginPage = pathname === `/${locale}/login` || pathname === "/login";
  const hideLayout = isDashboard || isLoginPage;

  const direction = locale === "ar" ? "rtl" : "ltr";

  if (!messages) return null;

  return (
    <html lang={locale} dir={direction} className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <QueryProvider>
            {!hideLayout && <Navbar />}

            <main className={!hideLayout ? "min-h-screen" : ""}>
              {children}
            </main>

            {!hideLayout && <Footer />}

            <Toaster position="top-center" reverseOrder={false} />
            <ChatAI />
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
