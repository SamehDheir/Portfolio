"use client";
import { useProfile } from "@/hooks/useProfile";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope, FaDownload } from "react-icons/fa";
import { VscLoading } from "react-icons/vsc";

export default function HomePage() {
  const { user, isLoading } = useProfile();

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <VscLoading className="animate-spin text-4xl text-indigo-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100">
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:pt-48 lg:pb-32">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest">
              Available for new opportunities
            </div>
            <h1 className="text-5xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
              I'm <span className="text-indigo-600">{user?.name?.split(' ')[0]}</span>.
              <br /> {user?.title}
            </h1>
            <p className="text-lg lg:text-xl text-slate-500 max-w-xl leading-relaxed font-medium">
              {user?.bio}
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">
                View Projects
              </button>
              <button className="border-2 border-slate-100 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
                <FaDownload /> Download CV
              </button>
            </div>
          </motion.div>

          {/* Identity Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-5 relative"
          >
            <div className="aspect-square rounded-[3rem] overflow-hidden border-[12px] border-slate-50 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                src={`http://localhost:3000${user?.profileImage}`} 
                alt={user?.name}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Based in</p>
              <p className="font-bold text-slate-900">Gaza, Palestine 🇵🇸</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Social Links Footer Bar */}
      <footer className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-slate-900/90 backdrop-blur-md px-8 py-4 rounded-3xl flex items-center gap-8 text-white shadow-2xl border border-white/10">
          <a href="#" className="hover:text-indigo-400 transition-colors"><FaGithub size={22}/></a>
          <a href="#" className="hover:text-indigo-400 transition-colors"><FaLinkedin size={22}/></a>
          <a href={`mailto:${user?.email}`} className="hover:text-indigo-400 transition-colors"><FaEnvelope size={22}/></a>
        </div>
      </footer>
    </div>
  );
}