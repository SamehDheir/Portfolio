"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/#projects" },
  { name: "Skills", href: "/#skills" },
  { name: "Blog", href: "/blog" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    
    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("hashchange", handleHashChange);
    
    handleHashChange();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const getIsActive = (href: string) => {
    if (href.includes("#")) {
      const targetHash = "#" + href.split("#")[1];
      return pathname === "/" && activeHash === targetHash;
    }
    return pathname === href && activeHash === "";
  };

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
          <Link 
            href="/" 
            onClick={() => setActiveHash("")}
            className="text-2xl font-black tracking-tighter text-slate-900 group"
          >
            SAMEH<span className="text-indigo-600 group-hover:animate-pulse">.</span>DEV
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = getIsActive(link.href);
              return (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => {
                    if(link.href.includes("#")) setActiveHash("#" + link.href.split("#")[1]);
                    else setActiveHash("");
                  }}
                  className={`relative text-sm font-bold transition-colors duration-300 py-1 ${
                    isActive ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"
                  }`}
                >
                  {link.name}

                  {/* الخط المتحرك الأنيق */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-indigo-600 rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
            
            <Link 
              href="/#contact" 
              onClick={() => setActiveHash("#contact")}
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
              {navLinks.map((link) => {
                const isActive = getIsActive(link.href);
                return (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => {
                      setIsOpen(false);
                      if(link.href.includes("#")) setActiveHash("#" + link.href.split("#")[1]);
                      else setActiveHash("");
                    }} 
                    className={`text-xl font-black transition-colors ${
                      isActive ? "text-indigo-600" : "text-slate-900 hover:text-indigo-600"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <Link 
                href="/#contact" 
                onClick={() => {
                  setIsOpen(false);
                  setActiveHash("#contact");
                }}
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