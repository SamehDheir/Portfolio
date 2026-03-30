"use client";
import { motion } from "framer-motion";
import { useSkills } from "@/hooks/useSkills";
import { FaServer, FaLayerGroup, FaTerminal, FaTools } from "react-icons/fa";
import { useTranslations } from "next-intl";

export default function SkillsSection() {
  const { data: skills, isLoading } = useSkills();
  const t = useTranslations("Skills");

  const categories = [
    { key: "Backend", label: t("backend"), icon: <FaServer className="text-sky-600 dark:text-sky-400" /> },
    { key: "Frontend", label: t("frontend"), icon: <FaLayerGroup className="text-red-500 dark:text-red-400" /> },
    { key: "DevOps", label: t("devops"), icon: <FaTerminal className="text-slate-700 dark:text-slate-300" /> },
    { key: "Tools", label: t("tools"), icon: <FaTools className="text-amber-500 dark:text-amber-400" /> },
  ];

  return (
    <section id="skills" className="py-24 bg-transparent relative text-start transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-[2px] bg-sky-600"></span>
            <span className="text-sky-600 font-black text-xs uppercase tracking-widest">
              {t("badge")}
            </span>
          </div>
          <h2 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter">
            {t("title")} <span className="text-red-500 dark:text-red-400">{t("titleAccent")}</span>
          </h2>
        </div>

        {/* Categories Grid */}
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
                className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-sky-200 dark:hover:border-sky-900 transition-all group shadow-sm dark:shadow-none"
              >
                <div className="text-3xl mb-6 p-4 bg-white dark:bg-slate-800 rounded-2xl w-fit shadow-sm dark:shadow-none group-hover:scale-110 transition-transform border border-transparent dark:border-slate-700">
                  {cat.icon}
                </div>
                
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">
                  {cat.label}
                </h3>

                <div className="flex flex-wrap gap-2">
                  {list.length > 0 ? list.map((skill: any) => (
                    <span 
                      key={skill.id} 
                      className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:shadow-md dark:hover:shadow-sky-900/20 transition-all cursor-default"
                    >
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