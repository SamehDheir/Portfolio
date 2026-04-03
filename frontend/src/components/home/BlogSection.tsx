"use client";
import { motion, Variants } from "framer-motion";
import { usePosts } from "@/hooks/usePosts";
import Link from "next/link";
import { FaArrowRight, FaRegCalendarAlt, FaHashtag } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

// Animation variants for the grid container
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

// Animation variants for individual blog cards
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 80, damping: 20 },
  },
};

export default function BlogSection() {
  const t = useTranslations("Blog");
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const isAr = locale === "ar";
  const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

  const { data: response, isLoading } = usePosts({
    limit: 3,
  });
  const featuredPosts = response?.data || [];

  return (
    <section
      id="blog"
      className="py-32 bg-transparent overflow-hidden transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* --- Section Header --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 ${
            isAr ? "md:flex-row-reverse text-right" : "text-left"
          }`}
        >
          <div className="space-y-4">
            <div
              className={`flex items-center gap-3 ${
                isAr ? "flex-row-reverse" : ""
              }`}
            >
              <span className="w-10 h-[2px] bg-sky-600"></span>
              <span className="text-sky-600 font-black text-[10px] uppercase tracking-[0.3em]">
                {t("badge")}
              </span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
              {t("title")}{" "}
              <span className="text-sky-600">{t("titleAccent")}</span>
            </h2>
          </div>

          <Link
            href={`/${locale}/blog`}
            className={`group text-slate-900 dark:text-slate-300 font-black flex items-center gap-3 hover:text-sky-600 dark:hover:text-sky-400 transition-all uppercase tracking-widest text-xs ${
              isAr ? "flex-row-reverse" : ""
            }`}
          >
            {t("viewArchive")}
            <FaArrowRight
              className={`transition-transform duration-300 ${
                isAr
                  ? "rotate-180 group-hover:-translate-x-2"
                  : "group-hover:translate-x-2"
              }`}
            />
          </Link>
        </motion.div>

        {/* --- Content Logic --- */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-[450px] bg-slate-100 dark:bg-slate-900/50 animate-pulse rounded-[3rem] border border-slate-200 dark:border-slate-800"
              />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {featuredPosts.map((post: any) => (
              <motion.article
                key={post.id}
                variants={itemVariants}
                className={`group flex flex-col bg-white dark:bg-slate-900/40 p-5 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 hover:border-sky-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-sky-500/5 ${
                  isAr ? "text-right" : "text-left"
                }`}
              >
                {/* --- Post Image --- */}
                <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-6 bg-slate-100 dark:bg-slate-800">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.8 }}
                    src={
                      post.coverImage
                        ? `${post.coverImage}`
                        : "/blog-placeholder.jpg"
                    }
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute top-4 ${
                      isAr ? "right-4" : "left-4"
                    } px-3 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl text-[9px] font-black text-sky-600 dark:text-sky-400 uppercase flex items-center gap-1.5 shadow-sm border border-white/20 dark:border-slate-800`}
                  >
                    <FaHashtag size={8} /> {post.category || "General"}
                  </div>
                </div>

                {/* --- Post Info --- */}
                <div className="px-2 flex flex-col flex-1">
                  <div
                    className={`flex items-center gap-2 text-slate-400 dark:text-slate-500 text-[10px] font-black mb-3 tracking-[0.15em] uppercase ${
                      isAr ? "flex-row-reverse" : ""
                    }`}
                  >
                    <FaRegCalendarAlt className="text-sky-500/50" />
                    {new Date(post.createdAt).toLocaleDateString(
                      isAr ? "ar-EG" : "en-US",
                      { month: "short", day: "numeric", year: "numeric" },
                    )}
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight mb-4 group-hover:text-sky-600 transition-colors tracking-tight line-clamp-2">
                    {post.title}
                  </h3>

                  <p
                    className={`text-slate-500 dark:text-slate-400 text-sm font-medium line-clamp-2 mb-8 leading-relaxed ${
                      isAr ? "text-[16px]" : "text-sm"
                    }`}
                  >
                    {post.description ||
                      "Explore this technical insight and dive deep into the implementation details."}
                  </p>

                  {/* --- Action Button --- */}
                  <div
                    className={`mt-auto pt-5 border-t border-slate-50 dark:border-slate-800/50 ${
                      isAr ? "text-right" : "text-left"
                    }`}
                  >
                    <Link
                      href={`/${locale}/blog/${post.slug}`}
                      className={`inline-flex items-center gap-2 text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-[0.2em] group/btn ${
                        isAr ? "flex-row-reverse" : ""
                      }`}
                    >
                      {t("continueReading")}
                      <FaArrowRight
                        className={`text-sky-600 transition-transform duration-300 ${
                          isAr
                            ? "rotate-180 group-hover/btn:-translate-x-2"
                            : "group-hover/btn:translate-x-2"
                        }`}
                      />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}

        {/* Not found data*/}
        {!isLoading && featuredPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-500 font-medium">
              No featured articles available at the moment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
