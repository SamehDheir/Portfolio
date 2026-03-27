"use client";
import { motion } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { 
  FaGithub, 
  FaLinkedin, 
  FaBriefcase, 
  FaCode, 
  FaDownload 
} from "react-icons/fa";

export default function Hero() {
  const { user } = useProfile();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden bg-white">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-sky-50 rounded-full blur-[120px] -z-10 opacity-50" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-red-50 rounded-full blur-[120px] -z-10 opacity-50" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-4 items-center relative z-10">
        
        {/* Left Content: Text & CTA */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="space-y-10 order-2 lg:order-1"
        >
          {/* Architecture Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-slate-900 border border-slate-800 shadow-xl shadow-slate-200"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            <span className="text-white font-black text-[10px] uppercase tracking-[0.3em]">
              Architecture & Scale
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-6xl md:text-7xl lg:text-[110px] font-black tracking-tighter text-slate-900 leading-[0.85]">
            Building <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-indigo-600 drop-shadow-sm">
              Interactive
            </span>
            <br /> Experiences.
          </h1>

          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-lg leading-relaxed border-l-4 border-slate-100 pl-6">
            I&apos;m <span className="text-slate-900 font-bold underline decoration-sky-500/30 decoration-4 underline-offset-4">{user?.name || "Sameh Dheir"}</span>, 
            a {user?.title || "Senior Full-Stack Developer"} focused on building 
            <span className="text-slate-900"> robust backend architectures</span> and seamless user interfaces.
          </p>

          {/* Buttons Group */}
          <div className="flex flex-wrap gap-5 items-center">
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="#projects"
              className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-sky-600 transition-all shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] flex items-center gap-3"
            >
              <FaCode size={18} /> See Projects
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.02, backgroundColor: "#f8fafc" }}
              whileTap={{ scale: 0.98 }}
              href="/cv.pdf"
              target="_blank"
              className="border-2 border-slate-200 text-slate-900 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center gap-3"
            >
              <FaDownload size={16} /> CV
            </motion.a>

            {/* Socials */}
            <div className="flex gap-5 ml-2">
              <a href="https://github.com/SamehDheir" target="_blank" className="text-slate-400 hover:text-slate-900 transition-colors">
                <FaGithub size={24} />
              </a>
              <a href="https://linkedin.com/in/sameh-dheir" target="_blank" className="text-slate-400 hover:text-sky-600 transition-colors">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </motion.div>

        {/* 📸 Right Content: Image & Experience Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "circOut" }}
          className="relative order-1 lg:order-2 flex justify-center lg:justify-end"
        >
          {/* Main Image Container */}
          <div className="relative z-10 w-full max-w-[480px] rounded-[3.5rem] overflow-hidden border-[12px] border-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] aspect-[4/5] bg-slate-100">
            <img
              src={`http://localhost:3000${user?.profileImage}`}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              alt="Sameh Dheir"
            />
            {/* Overlay Gradient for Image depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
          </div>

          {/* ✨ Floating Experience Badge (Redesigned) */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-6 md:-bottom-10 md:-left-10 bg-white/90 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl border border-white/50 z-20 flex items-center gap-5"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-red-200">
              <FaBriefcase size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                Industry Expert
              </p>
              <p className="font-black text-slate-900 text-lg leading-none">
                Senior Architect
              </p>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}