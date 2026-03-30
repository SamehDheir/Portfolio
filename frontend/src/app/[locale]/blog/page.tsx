"use client";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaHashtag, FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function BlogArchivePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const t = useTranslations("Archive");
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === "ar";

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", locale],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:3000/api/v1/posts");
      return data;
    },
  });

  const filteredPosts = useMemo(() => {
    return posts?.filter((post: any) => {
      const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || post.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [posts, search, activeCategory]);

  const categories = ["All", ...new Set(posts?.map((p: any) => p.category).filter(Boolean) as string[])];

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- Header --- */}
        <header className={`mb-16 space-y-4 ${isAr ? 'text-right' : 'text-left'}`}>
          <h1 className={`font-black text-slate-900 tracking-tighter ${isAr ? 'text-5xl lg:text-7xl leading-tight' : 'text-7xl'}`}>
            {t("title")}
          </h1>
          <p className={`text-slate-400 font-medium italic tracking-tight ${isAr ? 'text-xl' : 'text-lg'}`}>
            {t("subtitle")}
          </p>
        </header>

        {/* --- Search & Filter Bar --- */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-16 bg-slate-50 p-3 rounded-[2.5rem] border border-slate-100">
          <div className="relative w-full md:w-80 group">
            <FaSearch className={`absolute top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sky-600 transition-colors ${isAr ? 'right-5' : 'left-5'}`} />
            <input 
              type="text"
              placeholder={t("searchPlaceholder")}
              className={`w-full py-4 bg-white rounded-2xl border-none ring-0 shadow-sm font-bold text-slate-800 placeholder:text-slate-300 focus:ring-2 focus:ring-sky-500/20 transition-all ${isAr ? 'pr-12 pl-6 text-right' : 'pl-12 pr-6'}`}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-xl font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeCategory === cat ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-900"
                } ${isAr ? 'text-[12px]' : 'text-[10px]'}`}
              >
                {cat === "All" ? t("allCategories") : cat}
              </button>
            ))}
          </div>
        </div>

        {/* --- Grid --- */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              [1,2,3].map(i => <div key={i} className="h-[450px] bg-slate-50 animate-pulse rounded-[3rem]" />)
            ) : filteredPosts?.map((post: any) => (
              <motion.div
                layout
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`group flex flex-col ${isAr ? 'text-right' : 'text-left'}`}
              >
                {/* 🖼️ Image Wrapper */}
                <Link href={`/${locale}/blog/${post.slug}`} className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden bg-slate-100 mb-8 border border-slate-50 shadow-sm block">
                  <motion.img 
                    src={post.coverImg ? `http://localhost:3000${post.coverImg}` : "/blog-placeholder.jpg"} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute top-6 ${isAr ? 'right-6' : 'left-6'}`}>
                    <span className={`px-4 py-1.5 bg-white/90 backdrop-blur-md text-slate-900 font-black uppercase tracking-widest rounded-full shadow-sm flex items-center gap-2 ${isAr ? 'text-[11px]' : 'text-[9px]'}`}>
                      <FaHashtag className="text-sky-600" /> {post.category}
                    </span>
                  </div>
                </Link>

                {/* Content */}
                <div className="px-2 flex-grow">
                  <div className={`flex items-center gap-3 mb-4 ${isAr ? 'flex-row-reverse' : ''}`}>
                    <span className={`font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5 ${isAr ? 'text-[12px]' : 'text-[10px]'}`}>
                      <FaCalendarAlt className="text-red-500" />
                      {new Date(post.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  
                  <Link href={`/${locale}/blog/${post.slug}`}>
                    <h3 className={`font-black text-slate-900 leading-[1.2] mb-4 group-hover:text-sky-600 transition-colors tracking-tight ${isAr ? 'text-2xl' : 'text-2xl'}`}>
                      {post.title}
                    </h3>
                  </Link>
                  <p className={`text-slate-400 font-medium line-clamp-2 leading-relaxed mb-8 ${isAr ? 'text-[15px]' : 'text-sm'}`}>
                    {post.description || (isAr ? "تعمق في هندسة الأنظمة وأنماط الويب الحديثة" : "Deep dive into system architecture...")}
                  </p>
                </div>

                <Link 
                  href={`/${locale}/blog/${post.slug}`}
                  className={`mt-auto group/btn inline-flex items-center gap-3 font-black uppercase tracking-[0.2em] text-slate-900 hover:text-sky-600 transition-colors ${isAr ? 'flex-row-reverse text-[12px]' : 'text-[10px]'}`}
                >
                  {t("readMore")} 
                  <FaArrowRight className={`transition-transform ${isAr ? 'rotate-180 group-hover/btn:-translate-x-2' : 'group-hover/btn:translate-x-2'}`} />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}