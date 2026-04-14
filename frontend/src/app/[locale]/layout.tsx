import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatAIWrapper from "@/components/layout/ChatAIWrapper";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "@/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  fallback: ["system-ui", "-apple-system", "sans-serif"],
  preload: true,
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  fallback: ["monospace"],
  preload: true,
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  metadataBase: new URL("https://sameh-dheir.vercel.app"),
  title: "Sameh Dheir - Backend & Full-Stack Engineer | Node.js & NestJS",
  description:
    "Backend & Full-Stack Engineer specializing in Node.js, NestJS, TypeScript, and scalable architecture. Building high-performance systems and modern software solutions.",
  keywords: [
    "Backend Engineer",
    "Full Stack Engineer",
    "Node.js",
    "NestJS",
    "TypeScript",
    "Backend Development",
    "Frontend",
    "Software Architect",
    "Web Development",
  ],
  authors: [
    {
      name: "Sameh Dheir",
      url: "https://sameh-dheir.vercel.app",
    },
  ],
  creator: "Sameh Dheir",
  publisher: "Sameh Dheir",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ar_SA"],
    url: "https://sameh-dheir.vercel.app",
    siteName: "Sameh Dheir - Portfolio",
    title: "Sameh Dheir | Backend & Full-Stack Engineer",
    description:
      "Backend & Full-Stack Engineer specializing in Node.js, NestJS, and building scalable, high-performance systems",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sameh Dheir Portfolio",
        type: "image/png",
      },
      {
        url: "/og-image-square.png",
        width: 800,
        height: 800,
        alt: "Sameh Dheir",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sameh Dheir | Backend & Full-Stack Engineer",
    description:
      "Node.js & NestJS specialist building robust backend architectures and seamless user interfaces",
    images: ["/og-image.png"],
    creator: "@sameh_dev",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sameh Dheir",
  },
  icons: "/favicon.ico",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(locale);
  const messages = await getMessages();

  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={direction}
      className="scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="theme-color"
          content="#ffffff"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#020617"
          media="(prefers-color-scheme: dark)"
        />

        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://api.sameh-dheir.vercel.app" />
        <link rel="dns-prefetch" href="https://cdn.sameh-dheir.vercel.app" />

        {/* Web Vital Monitoring */}
        <Script
          id="web-vitals"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const vitals = [];
                if ('PerformanceObserver' in window) {
                  try {
                    const observer = new PerformanceObserver((list) => {
                      for (const entry of list.getEntries()) {
                        vitals.push({name: entry.name, value: entry.value});
                      }
                    });
                    observer.observe({entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift']});
                  } catch(e) {}
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground transition-colors duration-300`}
      >
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <QueryProvider>
              <Navbar />
              <main className="min-h-screen" id="main-content">
                {children}
              </main>
              <Footer />
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
              <ChatAIWrapper />
            </QueryProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
