"use client";
import { motion } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaBriefcase,
  FaCode,
  FaDownload,
} from "react-icons/fa";

export default function Hero() {
  const { user } = useProfile();
  const t = useTranslations("Hero");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Defer animation initialization until after FCP
    const timer = requestAnimationFrame(() => {
      setIsLoaded(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden transition-colors duration-500">
      {/* Background Decorative Elements - Less blur for better performance */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-sky-100 dark:bg-sky-900/20 rounded-full blur-[80px] -z-10 opacity-40 dark:opacity-20 will-change-transform" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-red-100 dark:bg-red-900/20 rounded-full blur-[80px] -z-10 opacity-40 dark:opacity-20 will-change-transform" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-4 items-center relative z-10">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.6, ease: "circOut" }}
          className="space-y-10 order-2 lg:order-1 text-start"
        >
          {/* Architecture Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-slate-900 dark:bg-slate-800 border border-slate-800 dark:border-slate-700 shadow-xl shadow-slate-200 dark:shadow-none"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            <span className="text-white font-black text-[10px] uppercase tracking-[0.3em]">
              {t("badge")}
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-6xl md:text-7xl lg:text-[110px] font-black tracking-tighter text-slate-900 dark:text-white leading-[0.85]">
            {t("titleStart")} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-indigo-600 drop-shadow-sm">
              {t("titleMiddle")}
            </span>
            <br /> {t("titleEnd")}
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-lg leading-relaxed border-l-4 border-slate-100 dark:border-slate-800 rtl:border-l-0 rtl:border-r-4 pl-6 rtl:pl-0 rtl:pr-6">
            {t("description")}
          </p>

          {/* Buttons Group */}
          <div className="flex flex-wrap gap-5 items-center">
            <a
              href="#projects"
              className="bg-slate-900 dark:bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-sky-600 dark:hover:bg-indigo-500 transition-colors shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] dark:shadow-none flex items-center gap-3"
            >
              <FaCode size={18} /> {t("seeProjects")}
            </a>

            <a
              href={user?.cvUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-colors flex items-center gap-3 
              ${!user?.cvUrl ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50 dark:hover:bg-slate-800"}`}
              onClick={(e) => {
                if (!user?.cvUrl) {
                  e.preventDefault();
                  alert("CV file not yet uploaded");
                }
              }}
              aria-label="Download my CV"
            >
              <FaDownload size={16} aria-hidden="true" />
              {t("downloadCV")}
            </a>

            {/* Socials */}
            <div className="flex gap-5 ml-2 rtl:ml-0 rtl:mr-2">
              <a
                href="https://github.com/SamehDheir"
                target="_blank"
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                aria-label="Visit my GitHub profile"
              >
                <FaGithub size={24} aria-hidden="true" />
              </a>
              <a
                href="https://linkedin.com/in/sameh-dheir"
                target="_blank"
                className="text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                aria-label="Visit my LinkedIn profile"
              >
                <FaLinkedin size={24} aria-hidden="true" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right Content: Image & Experience Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={
            isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }
          }
          transition={{ duration: 0.8, ease: "circOut" }}
          className="relative order-1 lg:order-2 flex justify-center lg:justify-end"
        >
          <div className="relative z-10 w-full max-w-[480px] rounded-[3.5rem] overflow-hidden border-[12px] border-white dark:border-slate-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] dark:shadow-none aspect-[4/5] bg-slate-100 dark:bg-slate-800">
            <img
              src={user?.profileImage}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              alt="Sameh Dheir"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 dark:from-slate-950/40 to-transparent" />
          </div>

          {/* Floating Experience Badge */}
          <motion.div
            animate={isLoaded ? { y: [0, -12, 0] } : {}}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-6 rtl:-left-auto rtl:-right-6 md:-bottom-10 md:-left-10 rtl:md:-right-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl border border-white/50 dark:border-slate-800 z-20 flex items-center gap-5 will-change-transform"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-red-200 dark:shadow-none flex-shrink-0">
              <FaBriefcase size={22} />
            </div>
            <div className="text-start">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">
                {t("expertBadge")}
              </p>
              <p className="font-black text-slate-900 dark:text-white text-lg leading-none">
                {t("expertTitle")}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
