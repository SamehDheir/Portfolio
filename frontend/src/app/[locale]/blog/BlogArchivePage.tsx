"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaHashtag,
  FaCalendarAlt,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { postsService } from "@/services/posts.service";
import { useDebounce } from "@/hooks/useDebounce";

export default function BlogArchivePage() {
  const t = useTranslations("Archive");
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const isAr = locale === "ar";
  const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

  // --- States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 6;

  // Debounce search to avoid spamming the API
  const debouncedSearch = useDebounce(searchTerm, 500);

  // --- Fetching Data from Backend (Paginated) ---
  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["posts", locale, debouncedSearch, activeCategory, page],
    queryFn: () =>
      postsService.getAll({
        search: debouncedSearch,
        category: activeCategory === "All" ? undefined : activeCategory,
        page,
        limit,
      }),
  });

  const posts = data?.data || [];
  const meta = data?.meta;

  // Reset page when filtering
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, activeCategory]);

  const categories = ["All", "Backend", "Frontend", "AI", "DevOps", "Others"];

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
          className={`flex flex-col md:flex-row gap-6 items-center justify-between mb-16 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 backdrop-blur-sm ${isAr ? "md:flex-row-reverse" : ""}`}
        >
          <div className="relative w-full md:w-96 group">
            <FaSearch
              className={`absolute top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-sky-600 transition-colors ${isAr ? "right-6" : "left-6"}`}
            />
            <input
              type="text"
              value={searchTerm}
              placeholder={t("searchPlaceholder")}
              className={`w-full py-4 bg-white dark:bg-slate-800 rounded-2xl border-none ring-0 shadow-sm font-bold text-slate-800 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-sky-500/20 transition-all ${isAr ? "pr-14 pl-6 text-right" : "pl-14 pr-6"}`}
              onChange={(e) => setSearchTerm(e.target.value)}
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
        <div className="relative min-h-[400px]">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20"
          >
            <AnimatePresence mode="popLayout">
              {posts.map((post: any) => (
                <motion.article
                  layout
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`group flex flex-col p-4 rounded-[2.5rem] transition-all duration-500
            bg-white dark:bg-slate-900/40 
            border border-slate-100 dark:border-slate-800/50
            hover:border-sky-500/30 hover:shadow-2xl hover:shadow-sky-500/10
            ${isAr ? "text-right" : "text-left"}`}
                >
                  {/* IMAGE SECTION */}
                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className="relative aspect-[16/10] rounded-[2rem] overflow-hidden bg-slate-200 dark:bg-slate-800 mb-6 block shadow-sm"
                  >
                    <motion.img
                      src={
                        post.coverImage
                          ? `${post.coverImage}`
                          : "/blog-placeholder.jpg"
                      }
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    {/* CATEGORY TAG */}
                    <div
                      className={`absolute top-4 ${isAr ? "right-4" : "left-4"}`}
                    >
                      <span className="px-4 py-1.5 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md text-sky-600 dark:text-sky-400 font-black uppercase tracking-[0.15em] rounded-xl shadow-lg text-[9px] border border-white/20 dark:border-slate-800">
                        {post.category}
                      </span>
                    </div>
                  </Link>

                  {/* TEXT CONTENT*/}
                  <div className="px-2 flex flex-col flex-grow">
                    {/* META INFO: Date */}
                    <div
                      className={`flex items-center gap-2 mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ${isAr ? "flex-row-reverse" : ""}`}
                    >
                      <FaCalendarAlt className="text-sky-500/60" />
                      {new Date(post.createdAt).toLocaleDateString(
                        isAr ? "ar-EG" : "en-US",
                        { month: "short", day: "numeric", year: "numeric" },
                      )}
                    </div>

                    {/* TITLE */}
                    <Link href={`/${locale}/blog/${post.slug}`}>
                      <h3 className="font-black text-slate-900 dark:text-white leading-tight mb-3 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors tracking-tight text-2xl">
                        {post.title}
                      </h3>
                    </Link>

                    {/* DESCRIPTION */}
                    <p
                      className={`text-slate-500 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed mb-6 ${isAr ? "text-lg" : "text-sm"}`}
                    >
                      {post.description}
                    </p>

                    {/* ACTION BUTTON */}
                    <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800/50">
                      <Link
                        href={`/${locale}/blog/${post.slug}`}
                        className={`group/btn inline-flex items-center gap-2 font-black uppercase tracking-[0.2em] text-[10px] text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition-all ${isAr ? "flex-row-reverse" : ""}`}
                      >
                        {t("readMore")}
                        <FaArrowRight
                          className={`text-sky-600 transition-transform duration-300 ${isAr ? "rotate-180 group-hover/btn:-translate-x-2" : "group-hover/btn:translate-x-2"}`}
                        />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* --- Pagination Controls --- */}
        {meta && meta.lastPage > 1 && (
          <div
            className={`flex justify-center items-center gap-4 mt-32 ${isAr ? "flex-row-reverse" : ""}`}
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-5 rounded-[1.5rem] bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-600 hover:text-sky-600 disabled:opacity-20 transition-all border border-slate-100 dark:border-slate-800"
            >
              {isAr ? <FaChevronRight /> : <FaChevronLeft />}
            </button>

            <div className="flex gap-2">
              {Array.from({ length: meta.lastPage }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-14 h-14 rounded-[1.5rem] font-black transition-all ${
                      page === p
                        ? "bg-slate-900 dark:bg-sky-600 text-white shadow-2xl scale-110"
                        : "bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-100 dark:border-slate-800"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(meta.lastPage, p + 1))}
              disabled={page === meta.lastPage}
              className="p-5 rounded-[1.5rem] bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-600 hover:text-sky-600 disabled:opacity-20 transition-all border border-slate-100 dark:border-slate-800"
            >
              {isAr ? <FaChevronLeft /> : <FaChevronRight />}
            </button>
          </div>
        )}

        {/* --- Empty State --- */}
        {!isLoading && posts.length === 0 && (
          <div className="py-40 text-center">
            <p className="text-4xl font-black text-slate-200 dark:text-slate-800 uppercase tracking-widest italic">
              {t("noPostsFound") || "No Posts found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
