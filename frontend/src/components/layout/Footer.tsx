export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-12 mt-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <p className="text-slate-900 font-black text-xl tracking-tight">SAMEH.DEV</p>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
            Built with NestJS & Next.js 🚀
          </p>
        </div>
        
        <div className="text-slate-500 text-sm font-medium">
          © {new Date().getFullYear()} Sameh Dheir. All rights reserved.
        </div>
        
        <div className="flex gap-6">
            <a href="#projects" className="text-sm font-bold hover:text-indigo-600 transition-colors">Projects</a>
            <a href="#skills" className="text-sm font-bold hover:text-indigo-600 transition-colors">Skills</a>
            <a href="/login" className="text-sm font-bold hover:text-indigo-600 transition-colors underline">Admin Portal</a>
        </div>
      </div>
    </footer>
  );
}