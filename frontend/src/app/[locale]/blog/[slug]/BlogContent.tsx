"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
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

export default function BlogContent({ slug }: { slug: string }) {
  const t = useTranslations("BlogContent");
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === "ar";

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["post", slug, locale],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:3000/api/v1/posts/${slug}`,
      );
      return data;
    },
  });

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center font-black text-slate-200 animate-pulse text-2xl uppercase tracking-widest">
        {t("loading")}
      </div>
    );

  if (error || !post) return <div className="min-h-screen flex items-center justify-center font-bold text-red-500">{t("notFound")}</div>;

  return (
    <div className="bg-white min-h-screen">
      {/* 🚀 Top Scroll Progress Bar */}
      <motion.div
        className={`fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 to-sky-600 z-50 ${isAr ? 'origin-right' : 'origin-left'}`}
        style={{ scaleX }}
      />

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`pt-32 pb-24 ${isAr ? 'text-right' : 'text-left'}`}
      >
        <div className="max-w-4xl mx-auto px-6">
          {/* Navigation & Actions */}
          <div className="flex justify-between items-center mb-12">
            <Link
              href={`/${locale}/#blog`}
              className={`inline-flex items-center gap-2 text-slate-400 hover:text-sky-600 font-black uppercase tracking-widest transition-all group ${isAr ? 'flex-row-reverse text-[13px]' : 'text-xs'}`}
            >
              <FaChevronLeft className={`transition-transform ${isAr ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`} />{" "}
              {t("backToFeed")}
            </Link>
            <button 
              onClick={() => {
                navigator.share({ title: post.title, url: window.location.href });
              }}
              className="text-slate-400 hover:text-red-500 transition-colors"
            >
              <FaShareAlt size={18} />
            </button>
          </div>

          {/* Article Header */}
          <header className="mb-16 text-center space-y-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-3 px-5 py-2 bg-slate-50 border border-slate-100 rounded-full"
            >
              <span className={`text-sky-600 font-black uppercase tracking-[0.2em] flex items-center gap-1.5 ${isAr ? 'text-[12px]' : 'text-[10px]'}`}>
                <FaHashtag /> {post.category || "Engineering"}
              </span>
              <div className="w-[1px] h-3 bg-slate-200" />
              <span className={`text-slate-400 font-bold uppercase tracking-[0.2em] flex items-center gap-1.5 ${isAr ? 'text-[12px]' : 'text-[10px]'}`}>
                <FaCalendarAlt className="text-red-400" />
                {new Date(post.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </motion.div>

            <h1 className={`font-black text-slate-900 leading-[1.15] tracking-tight max-w-3xl mx-auto text-balance ${isAr ? 'text-4xl lg:text-6xl' : 'text-5xl lg:text-7xl'}`}>
              {post.title}
            </h1>
          </header>

          {/* Featured Image */}
          {post.coverImg && (
            <div className="relative group mb-20">
              <div className="absolute -inset-4 bg-gradient-to-r from-sky-100 to-red-100 rounded-[3rem] blur-2xl opacity-30 group-hover:opacity-50 transition-opacity -z-10" />
              <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden border-[12px] border-white shadow-2xl">
                <img
                  src={`http://localhost:3000${post.coverImg}`}
                  alt={post.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                />
              </div>
            </div>
          )}

          {/* Article Content with Dynamic Typography */}
          <div
            className={`prose max-w-none 
            prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-900
            prose-p:text-slate-600 prose-strong:text-slate-900 prose-strong:font-black
            prose-blockquote:border-sky-600 prose-blockquote:bg-sky-50/50 prose-blockquote:py-2 prose-blockquote:rounded-2xl
            prose-code:text-red-500 prose-code:bg-red-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
            prose-img:rounded-[2rem] prose-img:shadow-lg
            ${isAr 
              ? 'prose-xl !text-right leading-[2] text-[1.15rem] prose-blockquote:border-r-4 prose-blockquote:border-l-0' 
              : 'prose-xl text-left leading-[1.8] prose-blockquote:border-l-4'
            }`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Author Footer */}
          <footer className="mt-24 p-10 bg-slate-50 rounded-[3rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className={`flex items-center gap-6 text-center md:text-start ${isAr ? 'md:flex-row-reverse md:text-right' : 'md:flex-row'}`}>
              <div className="w-20 h-20 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl rotate-3 bg-white flex items-center justify-center">
                {post.author?.profileImage ? (
                  <img
                    src={`http://localhost:3000${post.author.profileImage}`}
                    className="w-full h-full object-cover"
                    alt="Author"
                  />
                ) : (
                  <FaUserCircle size={60} className="text-slate-200" />
                )}
              </div>
              <div className="flex flex-col">
                <p className={`font-black text-sky-600 uppercase tracking-[0.3em] mb-1 ${isAr ? 'text-[12px]' : 'text-[10px]'}`}>
                  {t("writtenBy")}
                </p>
                <p className={`font-black text-slate-900 leading-tight ${isAr ? 'text-3xl' : 'text-2xl'}`}>
                  {post.author?.name || "Sameh Dheir"}
                </p>
                <p className={`font-bold text-slate-400 italic mt-1 ${isAr ? 'text-[15px]' : 'text-sm'}`}>
                  {post.author?.title || (isAr ? "مطور برمجيات متكامل أقدم" : "Senior Full-stack Developer")}
                </p>
              </div>
            </div>

            <button className={`px-8 py-4 bg-white border border-slate-200 text-slate-900 font-black rounded-2xl hover:bg-sky-600 hover:text-white hover:border-sky-600 transition-all shadow-sm ${isAr ? 'text-[15px]' : 'text-sm'}`}>
              {t("followInsights")}
            </button>
          </footer>
        </div>
      </motion.article>
    </div>
  );
}