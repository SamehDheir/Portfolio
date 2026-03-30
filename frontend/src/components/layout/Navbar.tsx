"use client";
import { useState, useEffect } from "react";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Languages } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState("");

  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === "ar";

  const navLinks = [
    { name: t("home"), href: "/" },
    { name: t("projects"), href: "/#projects" },
    { name: t("skills"), href: "/#skills" },
    { name: t("blog"), href: "/blog" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleHashChange = () => setActiveHash(window.location.hash);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "ar" : "en";
    
    // 2. استخدام router.replace مع تحديد الـ locale الجديد
    // الـ Helper هيقوم بتبديل المسار تلقائياً (مثلاً من /en/about لـ /ar/about)
    router.replace(pathname, { locale: nextLocale });
  };

  const getIsActive = (href: string) => {
    if (href.includes("#")) {
      const targetHash = "#" + href.split("#")[1];
      return pathname === "/" && activeHash === targetHash;
    }
    return pathname === href && activeHash === "";
  };

  const isHidden = pathname.includes("/dashboard") || pathname.includes("/login");

  if (isHidden) return null;

  return (
    <nav
      className={`fixed w-full z-[100] transition-all duration-500 ${
        scrolled ? "top-4 px-4" : "top-0 px-0"
      }`}
    >
      <div
        className={`max-w-6xl mx-auto transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] px-8 py-3"
            : "bg-white/50 backdrop-blur-sm border-b border-slate-100 py-5 px-8"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo - الـ Link هنا ذكي، لا يحتاج لـ locale يدوي */}
          <Link
            href="/"
            onClick={() => setActiveHash("")}
            className="text-2xl font-black tracking-tighter text-slate-900 group"
          >
            SAMEH
            <span className="text-indigo-600 group-hover:animate-pulse">.</span>
            DEV
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = getIsActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    if (link.href.includes("#"))
                      setActiveHash("#" + link.href.split("#")[1]);
                    else setActiveHash("");
                  }}
                  className={`relative font-bold transition-colors duration-300 py-1 ${
                    isActive
                      ? "text-indigo-600"
                      : "text-slate-600 hover:text-indigo-600"
                  } ${isAr ? "text-[15px]" : "text-sm"}`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-indigo-600 rounded-full"
                    />
                  )}
                </Link>
              );
            })}

            <div className="h-6 w-[1px] bg-slate-200 mx-2" />

            <button
              onClick={toggleLanguage}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all font-bold uppercase tracking-wider text-slate-700 ${isAr ? "text-[13px]" : "text-[11px]"}`}
            >
              <Languages size={16} className="text-indigo-600" />
              {t("lang")}
            </button>

            <Link
              href="/#contact"
              onClick={() => setActiveHash("#contact")}
              className={`bg-slate-900 text-white px-7 py-2.5 rounded-2xl font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-200 ${isAr ? "text-[13px]" : "text-[11px]"}`}
            >
              {t("contact")}
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={toggleLanguage} className="p-2 text-slate-600">
              <Languages size={20} />
            </button>
            <button
              className="text-slate-900 p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-4 right-4 bg-white/95 backdrop-blur-2xl border border-slate-100 rounded-[2.5rem] shadow-2xl p-8 md:hidden z-50"
          >
            <div className="flex flex-col gap-6 text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`font-black text-slate-900 hover:text-indigo-600 ${isAr ? "text-2xl" : "text-xl"}`}
                >
                  {link.name}
                </Link>
              ))}
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsOpen(false);
                }}
                className={`font-bold text-indigo-600 border-t border-slate-100 pt-6 mt-2 ${isAr ? "text-xl" : "text-lg"}`}
              >
                {locale === "en" ? "العربية" : "English"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}