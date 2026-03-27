"use client";
import { motion, Variants } from "framer-motion"; 
import { usePosts } from "@/hooks/usePosts";
import Link from "next/link";
import { FaArrowRight, FaRegCalendarAlt, FaHashtag } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } },
};

export default function BlogSection() {
  const t = useTranslations("Blog");
  const { data: posts, isLoading } = usePosts();
  const params = useParams();
  const locale = params.locale as string;
  const featuredPosts = (posts || []).slice(0, 3);

  return (
    <section id="blog" className="py-10 bg-[#FBFDFF] overflow-hidden text-start">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-[2px] bg-sky-600"></span>
              <span className="text-sky-600 font-black text-xs uppercase tracking-widest">{t("badge")}</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter">
              {t("title")}{" "}
              <span className="text-red-500 underline decoration-sky-100 underline-offset-[10px]">{t("titleAccent")}</span>
            </h2>
          </div>
          <Link href={`/${locale}/blog`} className="group text-slate-900 font-black flex items-center gap-2 hover:text-sky-600 transition-colors rtl:flex-row-reverse">
            {t("viewArchive")}
            <FaArrowRight className="group-hover:translate-x-2 rtl:group-hover:-translate-x-2 transition-transform duration-300 rtl:rotate-180" />
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => <div key={n} className="h-[400px] bg-slate-100 animate-pulse rounded-[2.5rem]" />)}
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPosts.map((post: any) => (
              <motion.article key={post.id} variants={itemVariants} whileHover={{ y: -10 }} className="group flex flex-col bg-white p-6 rounded-[2.5rem] border border-slate-100 hover:border-sky-200 hover:shadow-[0_20px_50px_rgba(14,165,233,0.1)] transition-all duration-500">
                <div className="relative aspect-[16/11] rounded-3xl overflow-hidden mb-6 bg-slate-50">
                  <motion.img whileHover={{ scale: 1.1 }} transition={{ duration: 0.6 }} src={post.coverImg ? `http://localhost:3000${post.coverImg}` : "/blog-placeholder.jpg"} alt={post.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-xl text-[10px] font-black text-sky-600 uppercase flex items-center gap-1 shadow-sm">
                    <FaHashtag /> {post.category || "Tech"}
                  </div>
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-3 tracking-widest uppercase">
                    <FaRegCalendarAlt className="text-red-400" />
                    {new Date(post.createdAt).toLocaleDateString(locale === "en" ? "en-US" : "ar-EG", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 leading-tight mb-4 group-hover:text-sky-600 transition-colors">{post.title}</h3>
                  <p className="text-slate-500 text-sm font-medium line-clamp-3 mb-6 leading-relaxed">{post.content.replace(/<[^>]*>?/gm, "")}</p>
                  <Link href={`/${locale}/blog/${post.slug}`} className="mt-auto inline-flex items-center gap-2 text-slate-900 font-black text-sm group/btn rtl:flex-row-reverse">
                    {t("continueReading")}
                    <motion.span animate={{ x: locale === "en" ? [0, 5, 0] : [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                      <FaArrowRight className="text-red-500 rtl:rotate-180" />
                    </motion.span>
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}