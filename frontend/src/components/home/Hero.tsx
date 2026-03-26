"use client";
import { motion } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { FaGithub, FaLinkedin, FaTerminal } from "react-icons/fa";

export default function Hero() {
  const { user } = useProfile();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[120px] -z-10 opacity-60" />

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="w-10 h-[2px] bg-indigo-600"></span>
            <span className="text-indigo-600 font-black text-xs uppercase tracking-[0.3em]">Engineering the Future</span>
          </div>
          <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8">
            Hello, I'm <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              {user?.name || "Sameh Dheir"}
            </span>
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-lg mb-10 leading-relaxed">
            {user?.bio || "Senior Full-stack Developer specializing in high-performance backends and interactive web experiences."}
          </p>
          
          <div className="flex flex-wrap gap-6 items-center">
            <button className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-indigo-200 hover:-translate-y-1 transition-all">
              Explore Projects
            </button>
            <div className="flex gap-4 text-slate-400">
              <a href="#" className="hover:text-indigo-600 transition-colors"><FaGithub size={24}/></a>
              <a href="#" className="hover:text-indigo-600 transition-colors"><FaLinkedin size={24}/></a>
            </div>
          </div>
        </motion.div>

        {/* User Image Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative group"
        >
          <div className="relative z-10 rounded-[4rem] overflow-hidden border-8 border-white shadow-2xl aspect-square">
            <img 
              src={user?.profileImage ? `http://localhost:3000${user.profileImage}` : "/placeholder.jpg"} 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
            />
          </div>
          {/* Floating Element */}
          <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-3xl shadow-xl border border-slate-50 z-20 flex items-center gap-4 animate-bounce">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
              <FaTerminal />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">Coding Level</p>
              <p className="font-bold text-slate-900 italic">Senior Architect</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}