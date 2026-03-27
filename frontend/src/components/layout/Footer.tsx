"use client";
import Link from "next/link";
import { FaLock } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-50 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          
          {/* Brand & Tagline */}
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-lg font-black tracking-tighter text-slate-900">
              SAMEH<span className="text-sky-600">.DEV</span>
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Full-Stack Architecture & AI Integration
            </p>
          </div>

          {/* Minimal Navigation */}
          <nav className="flex items-center gap-8">
            <Link href="#projects" className="text-xs font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Projects</Link>
            <Link href="#blog" className="text-xs font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Blog</Link>
            <Link href="/login" className="flex items-center gap-1.5 text-xs font-black text-slate-900 group uppercase tracking-widest">
              <FaLock className="text-red-500 text-[10px]" />
              Admin
            </Link>
          </nav>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-[11px] font-bold text-slate-400">
              © {currentYear} — ALL RIGHTS RESERVED
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}