"use client";
import Link from "next/link";
import { FaLock } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function Footer() {
  const t = useTranslations("Footer");
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === "ar";
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-50 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          
          {/* Brand & Tagline */}
          <div className="space-y-1 text-center md:text-start">
            <h2 className="text-lg font-black tracking-tighter text-slate-900">
              SAMEH<span className="text-sky-600">.DEV</span>
            </h2>
            <p className={`font-bold text-slate-400 uppercase tracking-widest leading-relaxed ${isAr ? 'text-[12px]' : 'text-[10px]'}`}>
              {t("tagline")}
            </p>
          </div>

          {/* Minimal Navigation */}
          <nav className="flex items-center gap-8">
            <Link 
              href={`/${locale}#projects`} 
              className={`font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest ${isAr ? 'text-[13px]' : 'text-xs'}`}
            >
              {isAr ? 'المشاريع' : 'Projects'}
            </Link>
            <Link 
              href={`/${locale}#blog`} 
              className={`font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest ${isAr ? 'text-[13px]' : 'text-xs'}`}
            >
              {isAr ? 'المدونة' : 'Blog'}
            </Link>
            <Link 
              href={`/${locale}/login`} 
              className={`flex items-center gap-1.5 font-black text-slate-900 group uppercase tracking-widest ${isAr ? 'text-[13px]' : 'text-xs'}`}
            >
              <FaLock className="text-red-500 text-[10px]" />
              {t("admin")}
            </Link>
          </nav>

          {/* Copyright */}
          <div className="text-center md:text-end">
            <p className={`font-bold text-slate-400 uppercase ${isAr ? 'text-[12px]' : 'text-[11px]'}`}>
              © {currentYear} — {t("rights")}
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}