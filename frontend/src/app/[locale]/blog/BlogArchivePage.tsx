"use client";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaHashtag,
  FaCalendarAlt,
  FaArrowRight,
} from "react-icons/fa";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { postsService } from "@/services/posts.service";

export default function BlogArchivePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const t = useTranslations("Archive");
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const isAr = locale === "ar";

  // Fetching Posts
  const {
    data: posts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts", locale],
    queryFn: () => postsService.getAll(),
  });

  // Filtering Logic
  const filteredPosts = useMemo(() => {
    return posts?.filter((post: any) => {
      const matchesSearch = post.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || post.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [posts, search, activeCategory]);

  const categories = [
    "All",
    ...new Set(posts?.map((p: any) => p.category).filter(Boolean) as string[]),
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-32 pb-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        {/* --- Header Section --- */}
        <header
          className={`mb-20 space-y-6 ${isAr ? "text-right" : "text-left"}`}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className={`font-black text-slate-900 dark:text-white tracking-tighter ${isAr ? "text-6xl lg:text-8xl" : "text-8xl"}`}
            >
              {t("title")}
              <span className="text-sky-600">.</span>
            </h1>
            <p
              className={`text-slate-400 dark:text-slate-500 font-bold mt-4 max-w-2xl ${isAr ? "mr-0 ml-auto text-xl" : "text-lg"}`}
            >
              {t("subtitle")}
            </p>
          </motion.div>
        </header>

        {/* --- Toolbar: Search & Filters --- */}
        <div
          className={`flex flex-col md:flex-row gap-6 items-center justify-between mb-16 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 backdrop-blur-sm transition-all ${isAr ? "md:flex-row-reverse" : ""}`}
        >
          <div className="relative w-full md:w-96 group">
            <FaSearch
              className={`absolute top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-sky-600 transition-colors ${isAr ? "right-6" : "left-6"}`}
            />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              className={`w-full py-4 bg-white dark:bg-slate-800 rounded-2xl border-none ring-0 shadow-sm font-bold text-slate-800 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-sky-500/20 transition-all ${isAr ? "pr-14 pl-6 text-right" : "pl-14 pr-6"}`}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div
            className={`flex gap-3 overflow-x-auto no-scrollbar py-2 px-2 ${isAr ? "flex-row-reverse" : ""}`}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-xl font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-slate-900 dark:bg-sky-600 text-white shadow-lg scale-105"
                    : "bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-100 dark:border-slate-700"
                } ${isAr ? "text-[12px]" : "text-[10px]"}`}
              >
                {cat === "All" ? t("allCategories") : cat}
              </button>
            ))}
          </div>
        </div>

        {/* --- Content Grid --- */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20"
        >
          <AnimatePresence mode="popLayout">
            {isLoading
              ? [1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-[500px] bg-slate-50 dark:bg-slate-900 animate-pulse rounded-[3.5rem]"
                  />
                ))
              : filteredPosts?.map((post: any) => (
                  <motion.article
                    layout
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`group flex flex-col ${isAr ? "text-right" : "text-left"}`}
                  >
                    {/* 🖼️ Cover Image */}
                    <Link
                      href={`/${locale}/blog/${post.slug}`}
                      className="relative aspect-[16/11] rounded-[3rem] overflow-hidden bg-slate-100 dark:bg-slate-900 mb-8 block shadow-2xl shadow-slate-200/50 dark:shadow-none"
                    >
                      <motion.img
                        src={
                          post.coverImg
                            ? `http://localhost:3000${post.coverImg}`
                            : "/blog-placeholder.jpg"
                        }
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div
                        className={`absolute top-6 ${isAr ? "right-6" : "left-6"}`}
                      >
                        <span className="px-5 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl text-slate-900 dark:text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl flex items-center gap-2 text-[9px]">
                          <FaHashtag className="text-sky-600" /> {post.category}
                        </span>
                      </div>
                    </Link>

                    {/* Metadata & Title */}
                    <div className="px-4">
                      <div
                        className={`flex items-center gap-3 mb-4 text-[11px] font-black uppercase tracking-widest text-slate-400 ${isAr ? "flex-row-reverse" : ""}`}
                      >
                        <FaCalendarAlt className="text-sky-500" />
                        {new Date(post.createdAt).toLocaleDateString(
                          isAr ? "ar-EG" : "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </div>

                      <Link href={`/${locale}/blog/${post.slug}`}>
                        <h3
                          className={`font-black text-slate-900 dark:text-white leading-tight mb-4 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors tracking-tighter ${isAr ? "text-3xl" : "text-3xl"}`}
                        >
                          {post.title}
                        </h3>
                      </Link>

                      <p
                        className={`text-slate-500 dark:text-slate-400 font-medium line-clamp-3 leading-relaxed mb-8 ${isAr ? "text-lg" : "text-base"}`}
                      >
                        {post.description}
                      </p>

                      <Link
                        href={`/${locale}/blog/${post.slug}`}
                        className={`group/btn inline-flex items-center gap-3 font-black uppercase tracking-[0.3em] text-[10px] text-slate-900 dark:text-white hover:tracking-[0.4em] transition-all ${isAr ? "flex-row-reverse" : ""}`}
                      >
                        {t("readMore")}
                        <FaArrowRight
                          className={`text-sky-600 transition-transform ${isAr ? "rotate-180 group-hover/btn:-translate-x-2" : "group-hover/btn:translate-x-2"}`}
                        />
                      </Link>
                    </div>
                  </motion.article>
                ))}
          </AnimatePresence>
        </motion.div>

        {/* --- Empty State --- */}
        {!isLoading && filteredPosts?.length === 0 && (
          <div className="py-40 text-center">
            <p className="text-4xl font-black text-slate-200 dark:text-slate-800 uppercase tracking-widest italic">
              No insights found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
