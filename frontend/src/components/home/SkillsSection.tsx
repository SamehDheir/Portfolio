"use client";
import { motion } from "framer-motion";
import { useSkills } from "@/hooks/useSkills";
import { FaServer, FaLayerGroup, FaTerminal, FaTools } from "react-icons/fa";
import { useTranslations } from "next-intl";

export default function SkillsSection() {
  const { data: skills, isLoading } = useSkills();
  const t = useTranslations("Skills");

  const categories = [
    { key: "Backend", label: t("backend"), icon: <FaServer className="text-sky-600" /> },
    { key: "Frontend", label: t("frontend"), icon: <FaLayerGroup className="text-red-500" /> },
    { key: "DevOps", label: t("devops"), icon: <FaTerminal className="text-slate-700" /> },
    { key: "Tools", label: t("tools"), icon: <FaTools className="text-amber-500" /> },
  ];

  return (
    <section id="skills" className="py-10 bg-white relative text-start">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="mb-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-[2px] bg-sky-600"></span>
            <span className="text-sky-600 font-black text-xs uppercase tracking-widest">
              {t("badge")}
            </span>
          </div>
          <h2 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter">
            {t("title")} <span className="text-red-500">{t("titleAccent")}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, idx) => {
            const list = skills?.filter((s: any) => s.category === cat.key) || [];
            return (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-sky-200 transition-colors group"
              >
                <div className="text-3xl mb-6 p-4 bg-white rounded-2xl w-fit shadow-sm group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-6">{cat.label}</h3>
                <div className="flex flex-wrap gap-2">
                  {list.length > 0 ? list.map((skill: any) => (
                    <span key={skill.id} className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:text-sky-600 hover:shadow-md transition-all cursor-default">
                      {skill.name}
                    </span>
                  )) : (
                    <p className="text-xs text-slate-400 italic font-medium">{t("noSkills")}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}