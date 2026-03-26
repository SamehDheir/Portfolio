"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { motion, useScroll, useSpring } from "framer-motion";
import { FaCalendarAlt, FaChevronLeft, FaHashtag, FaUserCircle, FaShareAlt } from "react-icons/fa";
import Link from "next/link";

export default function BlogPostPage() {
  const { slug } = useParams();
  
  // 🔥 Scroll Progress Bar Setup
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:3000/api/v1/posts/${slug}`);
      return data;
    },
  });

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Loading Insight...</p>
      </div>
    </div>
  );

  if (error || !post) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-5xl font-black text-slate-200 mb-4 tracking-tighter italic">404</h1>
      <p className="text-slate-500 font-bold mb-8">Article vanished into the void.</p>
      <Link href="/#blog" className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-sky-600 transition-all">
        Back to Library
      </Link>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* 🚀 Top Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 to-sky-600 origin-left z-50"
        style={{ scaleX }}
      />

      <motion.article 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-32 pb-24"
      >
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Navigation & Actions */}
          <div className="flex justify-between items-center mb-12">
            <Link href="/#blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-sky-600 font-black text-xs uppercase tracking-widest transition-all group">
              <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Feed
            </Link>
            <button className="text-slate-400 hover:text-red-500 transition-colors">
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
              <span className="text-sky-600 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5">
                <FaHashtag /> {post.category || "Engineering"}
              </span>
              <div className="w-[1px] h-3 bg-slate-200" />
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5">
                <FaCalendarAlt className="text-red-400" />
                {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </motion.div>

            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[0.95] tracking-[ -0.05em] max-w-3xl mx-auto text-balance">
              {post.title}
            </h1>
          </header>

          {/* Featured Image with Shadow Effect */}
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

          {/* Article Content with Enhanced Typography */}
          <div 
            className="prose prose-xl prose-slate max-w-none 
            prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-900
            prose-p:text-slate-600 prose-p:leading-[1.8] prose-p:text-lg
            prose-strong:text-slate-900 prose-strong:font-black
            prose-blockquote:border-l-sky-600 prose-blockquote:bg-sky-50/50 prose-blockquote:py-2 prose-blockquote:rounded-r-2xl
            prose-code:text-red-500 prose-code:bg-red-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
            prose-img:rounded-[2rem] prose-img:shadow-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Professional Author Card Footer */}
          <footer className="mt-24 p-10 bg-slate-50 rounded-[3rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6 text-center md:text-left">
              <div className="w-20 h-20 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl rotate-3 bg-white flex items-center justify-center">
                {post.author?.profileImage ? (
                  <img src={`http://localhost:3000${post.author.profileImage}`} className="w-full h-full object-cover" alt="Author" />
                ) : (
                  <FaUserCircle size={60} className="text-slate-200" />
                )}
              </div>
              <div>
                <p className="text-[10px] font-black text-sky-600 uppercase tracking-[0.3em] mb-1">Written By</p>
                <p className="text-2xl font-black text-slate-900 leading-tight">{post.author?.name || "Sameh Dheir"}</p>
                <p className="text-sm font-bold text-slate-400 italic mt-1">{post.author?.title || "Senior Full-stack Developer"}</p>
              </div>
            </div>
            
            <button className="px-8 py-4 bg-white border border-slate-200 text-slate-900 font-black text-sm rounded-2xl hover:bg-sky-600 hover:text-white hover:border-sky-600 transition-all shadow-sm">
              Follow Insights
            </button>
          </footer>
        </div>
      </motion.article>
    </div>
  );
}