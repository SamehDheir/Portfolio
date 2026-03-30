"use client";
import Link from "next/link";
import { FaLock } from "react-icons/fa";
import { useTranslations, useLocale } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const isAr = locale === "ar";
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-50 dark:border-slate-900 py-16 transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          
          {/* Brand & Tagline */}
          <div className="space-y-1 text-center md:text-start">
            <h2 className="text-lg font-black tracking-tighter text-slate-900 dark:text-white">
              SAMEH<span className="text-sky-600 dark:text-sky-400">.DEV</span>
            </h2>
            <p
              className={`font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-relaxed ${isAr ? "text-[12px]" : "text-[10px]"}`}
            >
              {t("tagline")}
            </p>
          </div>

          {/* Minimal Navigation */}
          <nav className="flex items-center gap-8">
            <Link
              href="/#projects"
              className={`font-black text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-widest ${isAr ? "text-[13px]" : "text-xs"}`}
            >
              {t("projectsLink")}
            </Link>
            <Link
              href="/blog"
              className={`font-black text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-widest ${isAr ? "text-[13px]" : "text-xs"}`}
            >
              {t("blogLink")}
            </Link>
            <Link
              href="/login"
              className={`flex items-center gap-1.5 font-black text-slate-900 dark:text-slate-100 group uppercase tracking-widest ${isAr ? "text-[13px]" : "text-xs"}`}
            >
              <FaLock className="text-red-500 text-[10px]" />
              {t("admin")}
            </Link>
          </nav>

          {/* Copyright */}
          <div className="text-center md:text-end">
            <p
              className={`font-bold text-slate-400 dark:text-slate-600 uppercase ${isAr ? "text-[12px]" : "text-[11px]"}`}
            >
              © {currentYear} — {t("rights")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}