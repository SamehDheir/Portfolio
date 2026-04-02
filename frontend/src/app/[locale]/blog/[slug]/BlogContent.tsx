"use client";
import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  FaCalendarAlt,
  FaChevronLeft,
  FaHashtag,
  FaUserCircle,
  FaShareAlt,
} from "react-icons/fa";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import api from "@/lib/axios";

export default function BlogContent({ slug }: { slug: string }) {
  const t = useTranslations("BlogContent");
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === "ar";
  const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

  // Scroll Progress Logic
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["post", slug, locale],
    queryFn: async () => {
      const { data } = await api.get(`/posts/${slug}`);
      return data;
    },
  });

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center font-black text-slate-200 dark:text-slate-800 animate-pulse text-2xl uppercase tracking-[0.3em]">
        {t("loading")}...
      </div>
    );

  if (error || !post)
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-red-500">
        {t("notFound")}
      </div>
    );

  return (
    <div className="bg-transparent min-h-screen transition-colors duration-500">
      {/* 🚀 Top Scroll Progress Bar */}
      <motion.div
        className={`fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-500 via-sky-400 to-red-500 z-[100] ${isAr ? "origin-right" : "origin-left"}`}
        style={{ scaleX }}
      />

      <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`pt-40 pb-24 ${isAr ? "text-right" : "text-left"}`}
      >
        <div className="max-w-4xl mx-auto px-6">
          
          {/* --- Navigation & Social Actions --- */}
          <div className={`flex justify-between items-center mb-12 ${isAr ? "flex-row-reverse" : ""}`}>
            <Link
              href={`/${locale}/blog`}
              className={`inline-flex items-center gap-2 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 font-black uppercase tracking-widest transition-all group ${isAr ? "text-[13px]" : "text-xs"}`}
            >
              <FaChevronLeft className={`transition-transform ${isAr ? "rotate-180 group-hover:translate-x-1" : "group-hover:-translate-x-1"}`} />
              {t("backToFeed")}
            </Link>
            
            <button
              onClick={() => navigator.share({ title: post.title, url: window.location.href })}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-sky-500 transition-all hover:scale-110"
            >
              <FaShareAlt size={16} />
            </button>
          </div>

          {/* --- Header Section --- */}
          <header className="mb-16 space-y-8">
            <div className={`flex ${isAr ? "justify-end" : "justify-start"}`}>
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-4 px-6 py-2.5 bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm"
              >
                <span className="text-sky-600 dark:text-sky-400 font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
                  <FaHashtag /> {post.category || "Engineering"}
                </span>
                <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700" />
                <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.1em] text-[10px] flex items-center gap-2">
                  <FaCalendarAlt className="text-red-500/70" />
                  {new Date(post.createdAt).toLocaleDateString(isAr ? "ar-EG" : "en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
              </motion.div>
            </div>

            <h1 className={`font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight text-balance ${isAr ? "text-5xl lg:text-7xl" : "text-6xl lg:text-8xl"}`}>
              {post.title}
            </h1>
          </header>

          {/* --- Featured Image Section --- */}
          {post.coverImage && (
            <div className="relative group mb-24">
              <div className="absolute -inset-6 bg-gradient-to-tr from-sky-500/20 to-red-500/10 rounded-[4rem] blur-3xl opacity-30 -z-10 group-hover:opacity-50 transition-opacity" />
              <div className="relative aspect-[21/10] rounded-[3rem] overflow-hidden border-8 border-white dark:border-slate-900 shadow-2xl transition-all duration-700">
                <img
                  src={`${IMAGE_BASE}${post.coverImage}`}
                  alt={post.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[1.5s]"
                />
              </div>
            </div>
          )}

          {/* --- Main Content (Prose) --- */}
          <div
            className={`prose max-w-none transition-all duration-500
            dark:prose-invert
            prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-900 dark:prose-headings:text-white
            prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:font-medium
            prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-black
            prose-blockquote:border-sky-600 prose-blockquote:bg-sky-50/50 dark:prose-blockquote:bg-sky-900/10 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-3xl prose-blockquote:not-italic
            prose-pre:bg-slate-950 prose-pre:rounded-[2rem] prose-pre:border prose-pre:border-slate-800 prose-pre:shadow-2xl
            prose-code:text-sky-500 dark:prose-code:text-sky-400 prose-code:font-black
            prose-img:rounded-[2.5rem] prose-img:shadow-2xl prose-img:mx-auto
            ${isAr 
                ? "prose-xl !text-right leading-[2.2] text-[1.2rem] prose-blockquote:border-r-8 prose-blockquote:border-l-0" 
                : "prose-xl text-left leading-[1.9] prose-blockquote:border-l-8"
            }`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* --- Author Footer Card --- */}
          <footer className="mt-32 relative">
             <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 to-red-500/5 rounded-[3.5rem] blur-xl -z-10" />
             <div className="p-12 bg-white/50 dark:bg-slate-900/50 backdrop-blur-2xl rounded-[3.5rem] border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-10 transition-all">
              <div className={`flex items-center gap-8 text-center md:text-start ${isAr ? "md:flex-row-reverse md:text-right" : "md:flex-row"}`}>
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-sky-500 to-red-500 rounded-[2.2rem] opacity-20 group-hover:opacity-40 transition-opacity blur-md" />
                  <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl rotate-3 bg-white dark:bg-slate-800 relative z-10">
                    {post.author?.profileImage ? (
                      <img src={`${IMAGE_BASE}${post.author.profileImage}`} className="w-full h-full object-cover" alt="Author" />
                    ) : (
                      <FaUserCircle size={96} className="text-slate-200 dark:text-slate-800" />
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <p className="font-black text-sky-600 dark:text-sky-500 uppercase tracking-[0.4em] text-[10px]">
                    {t("writtenBy")}
                  </p>
                  <p className="font-black text-slate-900 dark:text-white text-3xl tracking-tight">
                    {post.author?.name || "Sameh Dheir"}
                  </p>
                  <p className="font-bold text-slate-400 dark:text-slate-500 italic text-sm">
                    {post.author?.title || "Senior Backend & AI Engineer"}
                  </p>
                </div>
              </div>

              <button className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-sky-500/10">
                {t("followInsights")}
              </button>
            </div>
          </footer>
        </div>
      </motion.article>
    </div>
  );
}