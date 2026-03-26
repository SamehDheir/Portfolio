"use client";
import { motion } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { FaGithub, FaLinkedin, FaBriefcase, FaCode, FaDownload } from "react-icons/fa";

export default function Hero() {
  const { user } = useProfile();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 lg:pt-20 overflow-hidden bg-white">
      
      {/* Background Decorative Elements (Gradients & Blobs) */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-sky-100 rounded-full blur-[140px] -z-10 opacity-60" />
      <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-red-100 rounded-full blur-[140px] -z-10 opacity-60" />

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Text Content Block */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-sky-100 border border-sky-200">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600 animate-pulse"></span>
            <span className="text-sky-950 font-black text-xs uppercase tracking-[0.2em]">Architecture & Scale</span>
          </div>
          
          {/* Main Headline with Gradient Text */}
          <h1 className="text-6xl lg:text-[100px] font-black tracking-tighter text-slate-900 leading-[0.9]">
            Building <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-sky-600">
              Interactive
            </span>
            <br /> Experiences.
          </h1>

          {/* User Bio / Description */}
          <p className="text-xl text-slate-600 font-medium max-w-lg leading-relaxed">
            I'm <span className="font-bold text-slate-800">{user?.name}</span>, a {user?.title} specializing in crafting high-performance systems and intuitive interfaces.
          </p>
          
          {/* CTA Buttons & Social Links */}
          <div className="flex flex-wrap gap-5 items-center pt-4">
            {/* Primary Action Button */}
            <button className="bg-sky-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-sky-700 hover:shadow-2xl hover:shadow-sky-200 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-3">
              <FaCode /> See Projects
            </button>
            
            {/* Secondary Action Button */}
            <button className="border-2 border-slate-200 text-slate-600 px-8 py-5 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all flex items-center gap-3">
              <FaDownload /> Download CV
            </button>
            
            {/* Social Icons Group */}
            <div className="flex gap-4 text-slate-400 pl-4 border-l-2 border-slate-100">
              <a href="#" className="hover:text-red-600 transition-colors" aria-label="GitHub"><FaGithub size={24}/></a>
              <a href="#" className="hover:text-red-600 transition-colors" aria-label="LinkedIn"><FaLinkedin size={24}/></a>
            </div>
          </div>
        </motion.div>

        {/* User Profile Image Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 3 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
          className="relative group lg:justify-self-center"
        >
          {/* Styled Image Wrapper */}
          <div className="relative z-10 rounded-[4rem] overflow-hidden border-[16px] border-white shadow-[0_48px_100px_-20px_rgba(239,68,68,0.15)] aspect-square max-w-md mx-auto bg-slate-50">
            <img 
              src={`http://localhost:3000${user?.profileImage}`} 
              className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0"
              alt={user?.name || "Profile Image"}
            />
          </div>

          {/* Floating Experience Badge */}
          <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-xl border border-slate-50 z-20 flex items-center gap-4 animate-bounce">
            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200">
              <FaBriefcase />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Industry Expert</p>
              <p className="font-bold text-slate-900 italic">Senior Architect</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}