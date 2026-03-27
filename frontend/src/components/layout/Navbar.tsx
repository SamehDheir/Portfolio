"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Blog", href: "/blog" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-500 ${
      scrolled ? "top-4 px-4" : "top-0 px-0"
    }`}>
      <div className={`max-w-6xl mx-auto transition-all duration-500 ${
        scrolled 
        ? "bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] px-8 py-3" 
        : "bg-white/50 backdrop-blur-sm border-b border-slate-100 py-5 px-8"
      }`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-black tracking-tighter text-slate-900 group">
            SAMEH<span className="text-indigo-600 group-hover:animate-pulse">.</span>DEV
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link 
              href="#contact" 
              className="bg-slate-900 text-white px-7 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
            >
              Contact Me
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-slate-900 p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-24 left-4 right-4 bg-white/95 backdrop-blur-2xl border border-slate-100 rounded-[2.5rem] shadow-2xl p-8 md:hidden z-50"
          >
            <div className="flex flex-col gap-6 text-center">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)} 
                  className="text-xl font-black text-slate-900 hover:text-indigo-600 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                href="#contact" 
                onClick={() => setIsOpen(false)}
                className="bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest"
              >
                Contact Me
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}