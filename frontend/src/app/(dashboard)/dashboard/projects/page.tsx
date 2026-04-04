"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, ProjectFormValues } from "@/lib/validations/project";
import { projectsService } from "@/services/projects.service";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaGithub,
  FaPlus,
  FaRegEdit,
  FaTrashAlt,
  FaCloudUploadAlt,
  FaCode,
} from "react-icons/fa";
import {
  MdOutlineGridView,
  MdOutlineClose,
  MdReportProblem,
} from "react-icons/md";
import { HiOutlineArrowUpRight } from "react-icons/hi2";
import { VscLoading } from "react-icons/vsc";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema) as unknown as any,
    defaultValues: { techStack: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "techStack",
  });

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsService.getAll,
  });

  useEffect(() => {
    if (files.length === 0) {
      setPreviews([]);
      return;
    }
    const objectUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(objectUrls);
    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  const openEditModal = (project: any) => {
    setSelectedProject(project);
    reset({
      title: project.title,
      description: project.description,
      techStack: project.techStack?.map((t: string) => ({ value: t })) || [],
      link: project.link || "",
      github: project.github || "",
    });
    setFiles([]);
    setIsModalOpen(true);
  };

  const openDeleteModal = (project: any) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedProject) return;
    const t = toast.loading("Purging data from server...");
    try {
      await projectsService.delete(selectedProject.id);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted successfully", { id: t });
      setIsDeleteModalOpen(false);
    } catch (err) {
      toast.error("Operation failed", { id: t });
    }
  };

  const onSubmit = async (data: ProjectFormValues) => {
    const t = toast.loading(
      selectedProject
        ? "Updating architecture..."
        : "Deploying new masterpiece...",
    );
    try {
      const fd = new FormData();
      fd.append("title", data.title);
      fd.append("description", data.description);
      if (data.link) fd.append("link", data.link);
      if (data.github) fd.append("github", data.github);

      data.techStack.forEach((tech) => {
        if (tech.value.trim()) {
          fd.append("techStack", tech.value.trim());
        }
      });
      files.forEach((file) => fd.append("images", file));

      if (selectedProject) {
        await projectsService.update(selectedProject.id, fd);
      } else {
        await projectsService.create(fd);
      }

      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Changes deployed!", { id: t });
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message?.[0] || "Execution error", {
        id: t,
      });
    }
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-slate-950">
        <VscLoading
          className="animate-spin text-indigo-600 dark:text-sky-500"
          size={50}
        />
      </div>
    );

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen transition-colors duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
            <MdOutlineGridView
              className="text-indigo-600 dark:text-sky-500"
              size={40}
            />{" "}
            Projects
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium italic">
            "Every project is a story of architecture & logic" 🚀
          </p>
        </motion.div>

        <button
          onClick={() => {
            setSelectedProject(null);
            reset({
              title: "",
              description: "",
              techStack: [],
              link: "",
              github: "",
            });
            setFiles([]);
            setIsModalOpen(true);
          }}
          className="bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-8 py-4 rounded-[1.5rem] font-bold flex items-center gap-2 transition-all shadow-xl hover:-translate-y-1 active:scale-95 group"
        >
          <FaPlus
            size={16}
            className="group-hover:rotate-90 transition-transform"
          />{" "}
          New Project
        </button>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {projects?.map((p: any, idx: number) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-sky-500/5 transition-all duration-500 relative flex flex-col h-full"
          >
            {/* Image Section with Overlay Actions */}
            <div className="relative h-60 overflow-hidden">
              <img
                src={
                  p.images?.[0]
                    ? p.images[0].startsWith("http")
                      ? p.images[0]
                      : `${API_BASE}${p.images[0]}`
                    : "/placeholder.png"
                }
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt={p.title}
              />

              {/* Dark Overlay on Hover */}
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]" />

              {/* Admin Actions - Floating Style */}
              <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                <button
                  onClick={() => openEditModal(p)}
                  className="p-3 bg-white dark:bg-slate-800 text-indigo-600 dark:text-sky-400 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all"
                  title="Edit Project"
                >
                  <FaRegEdit size={18} />
                </button>
                <button
                  onClick={() => openDeleteModal(p)}
                  className="p-3 bg-white dark:bg-slate-800 text-red-500 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all"
                  title="Delete Project"
                >
                  <FaTrashAlt size={18} />
                </button>
              </div>

              {/* Tech Stack Floating Badges (Bottom of Image) */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                {p.techStack?.slice(0, 3).map((t: string) => (
                  <span
                    key={t}
                    className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded-lg uppercase tracking-tight border border-white/20"
                  >
                    {t}
                  </span>
                ))}
                {p.techStack?.length > 3 && (
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded-lg border border-white/20">
                    +{p.techStack.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="p-7 flex flex-col flex-1">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-black text-xl text-slate-800 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors">
                    {p.title}
                  </h3>
                </div>

                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-6 line-clamp-2">
                  {p.description}
                </p>
              </div>

              {/* Footer Links - Clean Minimal Style */}
              <div className="flex items-center gap-3 pt-5 border-t border-slate-50 dark:border-slate-800/50">
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest bg-indigo-50 dark:bg-sky-500/10 text-indigo-600 dark:text-sky-400 py-3 rounded-xl hover:bg-indigo-600 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white transition-all"
                  >
                    Preview <HiOutlineArrowUpRight size={14} />
                  </a>
                )}
                {p.github && (
                  <a
                    href={p.github}
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 py-3 rounded-xl hover:bg-slate-900 hover:text-white dark:hover:bg-slate-700 dark:hover:text-white transition-all"
                  >
                    Source <FaGithub size={14} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modern Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xl flex items-start justify-center z-[70] p-4 overflow-y-auto">
            <motion.form
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-12 w-full max-w-5xl shadow-2xl relative my-8 border border-transparent dark:border-slate-800"
            >
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                    {selectedProject ? "Edit Architecture" : "Deploy Project"}
                  </h2>
                  <p className="text-slate-400 dark:text-slate-500 font-bold mt-1 text-sm uppercase tracking-widest">
                    Workspace / Project Lab
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-3xl transition-all text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <MdOutlineClose size={32} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="space-y-8">
                  <div className="group">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block group-focus-within:text-indigo-600">
                      Project Title
                    </label>
                    <input
                      {...register("title")}
                      className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-100 dark:focus:border-indigo-900 focus:bg-white dark:focus:bg-slate-950 rounded-[1.5rem] outline-none font-bold text-slate-800 dark:text-white transition-all text-xl"
                      placeholder="E.g. FinTech Ledger System"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                      System Logic / Description
                    </label>
                    <textarea
                      {...register("description")}
                      rows={6}
                      className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-100 dark:focus:border-indigo-900 focus:bg-white dark:focus:bg-slate-950 rounded-[1.5rem] outline-none font-medium text-slate-600 dark:text-slate-300 transition-all leading-relaxed"
                      placeholder="Detailed architectural breakdown..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                        Live URL
                      </label>
                      <input
                        {...register("link")}
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-sky-400 border-none rounded-2xl text-sm font-bold text-indigo-600"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                        Git Repo
                      </label>
                      <input
                        {...register("github")}
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 dark:text-slate-300 border-none rounded-2xl text-sm font-bold text-slate-600"
                        placeholder="github.com/..."
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase flex items-center gap-2">
                        <FaCode
                          className="text-indigo-600 dark:text-sky-500"
                          size={18}
                        />{" "}
                        Tech Stack
                      </h4>
                      <button
                        type="button"
                        onClick={() => append({ value: "" })}
                        className="text-[10px] font-black bg-white dark:bg-slate-700 px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-all uppercase tracking-tighter text-indigo-600 dark:text-sky-400 border border-slate-100 dark:border-slate-600"
                      >
                        + Add Engine
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="flex items-center gap-2 bg-white dark:bg-slate-700 pl-4 pr-2 py-2 rounded-xl shadow-sm border border-indigo-50 dark:border-slate-600 group/tag transition-all hover:border-indigo-300"
                        >
                          <input
                            {...register(`techStack.${index}.value` as const)}
                            className="w-20 text-[11px] font-black outline-none bg-transparent uppercase dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-slate-300 hover:text-red-500 p-1"
                          >
                            <MdOutlineClose size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-1 block">
                      Visual Assets
                    </label>
                    <div className="relative group border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-12 text-center hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 hover:border-indigo-200 dark:hover:border-sky-900 transition-all cursor-pointer">
                      <input
                        type="file"
                        multiple
                        onChange={(e) =>
                          setFiles(Array.from(e.target.files || []))
                        }
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <FaCloudUploadAlt
                        className="mx-auto text-indigo-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-sky-500 mb-4 transition-all group-hover:scale-110"
                        size={48}
                      />
                      <p className="text-sm font-black text-slate-400 tracking-tight">
                        Drop project screenshots <br />
                        <span className="text-indigo-500/60 dark:text-sky-500/60 font-medium">
                          Click to browse files
                        </span>
                      </p>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      {previews.map((url, i) => (
                        <div
                          key={i}
                          className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-white dark:border-slate-700 shadow-xl rotate-3"
                        >
                          <img
                            src={url}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {selectedProject &&
                        files.length === 0 &&
                        selectedProject.images?.map(
                          (img: string, i: number) => (
                            <div
                              key={i}
                              className="relative w-20 h-20 rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all border border-slate-100 dark:border-slate-800 shadow-sm"
                            >
                              <img
                                src={
                                  img.startsWith("http")
                                    ? img
                                    : `${API_BASE}${img}`
                                }
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ),
                        )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-16">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-700 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 group"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <VscLoading className="animate-spin" size={24} />
                      <span>Uploading Assets...</span>
                    </div>
                  ) : (
                    <>
                      {selectedProject ? "Commit Changes" : "Deploy Project"}
                      <HiOutlineArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-slate-900/80 dark:bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 w-full max-w-md shadow-2xl border border-transparent dark:border-red-900/20"
            >
              <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-center justify-center text-red-500 mb-8 mx-auto">
                <MdReportProblem size={48} className="animate-pulse" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3 text-center tracking-tight">
                Destructive Action
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-10 text-center font-medium leading-relaxed">
                You are about to remove{" "}
                <span className="font-black text-red-600 dark:text-red-400">
                  "{selectedProject?.title}"
                </span>
                . This will purge all associated media and data.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDelete}
                  className="w-full py-5 bg-red-500 hover:bg-red-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-red-100 dark:shadow-none transition-all active:scale-95"
                >
                  Yes, Delete Permanently
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="w-full py-5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 rounded-[1.5rem] font-bold transition-all"
                >
                  Cancel, Keep Project
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
