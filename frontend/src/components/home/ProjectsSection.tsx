"use client";
import { motion } from "framer-motion";
import { useProjects } from "@/hooks/useProjects";
import { FaGithub, FaExternalLinkAlt, FaCode } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function ProjectsSection() {
  const t = useTranslations("Projects");
  const params = useParams();
  const locale = params.locale as string;
  const { data: projects, isLoading } = useProjects();

  return (
    <section id="projects" className="py-10 bg-[#FBFDFF] overflow-hidden text-start">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-[2px] bg-red-500"></span>
              <span className="text-red-500 font-black text-xs uppercase tracking-widest">
                {t("badge")}
              </span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter">
              {t("title")} <span className="text-sky-600">{t("titleAccent")}</span>
            </h2>
          </div>
          <p className="text-slate-500 font-medium max-w-sm text-balance border-l-2 border-slate-100 pl-4 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-4">
            {t("subtitle")}
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {isLoading ? (
            <p className="text-center col-span-full font-bold text-slate-400">Loading Projects...</p>
          ) : (
            projects?.map((project: any, index: number) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm bg-white">
                  <img
                    src={project.images?.[0] ? `http://localhost:3000${project.images[0]}` : "/project-placeholder.jpg"}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
                    <a href={project.github} target="_blank" className="p-4 bg-white rounded-2xl text-slate-900 hover:bg-sky-600 hover:text-white transition-all transform hover:-translate-y-2">
                      <FaGithub size={24} />
                    </a>
                    <a href={project.link} target="_blank" className="p-4 bg-white rounded-2xl text-slate-900 hover:bg-red-500 hover:text-white transition-all transform hover:-translate-y-2">
                      <FaExternalLinkAlt size={22} />
                    </a>
                  </div>
                </div>

                <div className="mt-8 px-2">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack?.map((tech: string) => (
                      <span key={tech} className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-wider rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-sky-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-500 mt-2 font-medium line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <a 
            href="https://github.com/SamehDheir" 
            target="_blank"  
            className="inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-slate-800 hover:bg-slate-50 hover:border-sky-200 transition-all group"
          >
            <FaCode className="group-hover:rotate-12 transition-transform" />
            {t("exploreGithub")}
          </a>
        </div>
      </div>
    </section>
  );
}