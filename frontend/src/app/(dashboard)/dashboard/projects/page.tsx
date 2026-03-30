"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, ProjectFormValues } from "@/lib/validations/project";
import { projectsService } from "@/services/projects.service";
import { toast } from "react-hot-toast";

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

const API_BASE = "http://localhost:3000";

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
    formState: { errors },
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
      techStack: project.techStack || [],
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
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <VscLoading className="animate-spin text-indigo-600" size={50} />
      </div>
    );

  return (
    <div className="p-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
            <MdOutlineGridView className="text-indigo-600" size={40} /> Showcase
          </h1>
          <p className="text-slate-500 mt-2 font-medium italic">
            "Every project is a story of architecture & logic" 🚀
          </p>
        </div>

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
          className="bg-slate-900 hover:bg-indigo-600 text-white px-8 py-4 rounded-[1.5rem] font-bold flex items-center gap-2 transition-all shadow-xl hover:-translate-y-1 active:scale-95 group"
        >
          <FaPlus
            size={16}
            className="group-hover:rotate-90 transition-transform"
          />{" "}
          New Masterpiece
        </button>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {projects?.map((p: any) => (
          <div
            key={p.id}
            className="group bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 relative flex flex-col h-full"
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={
                  p.images?.[0]
                    ? p.images[0].startsWith("http")
                      ? p.images[0]
                      : `${API_BASE}${p.images[0]}`
                    : "/placeholder.png"
                }
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                alt={p.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute top-6 right-6 flex gap-3 translate-y-[-20px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <button
                  onClick={() => openEditModal(p)}
                  className="p-4 bg-white/90 backdrop-blur-xl rounded-2xl text-indigo-600 shadow-2xl hover:bg-white active:scale-90 transition-all border border-white/20"
                >
                  <FaRegEdit size={20} />
                </button>
                <button
                  onClick={() => openDeleteModal(p)}
                  className="p-4 bg-white/90 backdrop-blur-xl rounded-2xl text-red-500 shadow-2xl hover:bg-white active:scale-90 transition-all border border-white/20"
                >
                  <FaTrashAlt size={20} />
                </button>
              </div>
            </div>

            <div className="p-8 flex flex-col flex-1">
              <div className="flex-1">
                <h3 className="font-black text-2xl text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">
                  {p.title}
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 line-clamp-3">
                  {p.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {p.techStack?.map((t: string) => (
                    <span
                      key={t}
                      className="px-4 py-1.5 bg-slate-50 text-slate-600 text-[11px] font-black rounded-xl border border-slate-100 uppercase tracking-wider"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 border-t border-slate-50 pt-6">
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all"
                  >
                    Live Demo <HiOutlineArrowUpRight size={18} />
                  </a>
                )}
                {p.github && (
                  <a
                    href={p.github}
                    target="_blank"
                    className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-xl transition-all"
                  >
                    Code <FaGithub size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modern Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl flex items-start justify-center z-[70] p-4 overflow-y-auto">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-[3.5rem] p-12 w-full max-w-5xl shadow-2xl animate-in zoom-in duration-300 relative"
          >
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                  {selectedProject ? "Edit Architecture" : "Deploy Project"}
                </h2>
                <p className="text-slate-400 font-bold mt-1 text-sm uppercase tracking-widest">
                  Workspace / Project Lab
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-4 hover:bg-slate-100 rounded-3xl transition-all text-slate-400 hover:text-slate-900"
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
                    className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.5rem] outline-none font-bold text-slate-800 transition-all text-xl"
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
                    className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.5rem] outline-none font-medium text-slate-600 transition-all leading-relaxed"
                    placeholder="Detailed architectural breakdown..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                      Live URL
                    </label>
                    <input
                      {...register("link")}
                      className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-indigo-600"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                      Git Repo
                    </label>
                    <input
                      {...register("github")}
                      className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-600"
                      placeholder="github.com/..."
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
                      <FaCode className="text-indigo-600" size={18} /> Tech
                      Stack
                    </h4>
                    <button
                      type="button"
                      onClick={() => append({ value: "" })}
                      className="text-[10px] font-black bg-white px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-all uppercase tracking-tighter text-indigo-600 border border-slate-100"
                    >
                      + Add Engine
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-center gap-2 bg-white pl-4 pr-2 py-2 rounded-xl shadow-sm border border-indigo-50 group/tag transition-all hover:border-indigo-300"
                      >
                        <input
                          {...register(`techStack.${index}` as const)}
                          className="w-20 text-[11px] font-black outline-none bg-transparent uppercase"
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
                  <div className="relative group border-4 border-dashed border-slate-100 rounded-[2.5rem] p-12 text-center hover:bg-indigo-50/50 hover:border-indigo-200 transition-all cursor-pointer">
                    <input
                      type="file"
                      multiple
                      onChange={(e) =>
                        setFiles(Array.from(e.target.files || []))
                      }
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <FaCloudUploadAlt
                      className="mx-auto text-indigo-300 group-hover:text-indigo-600 mb-4 transition-all group-hover:scale-110"
                      size={48}
                    />
                    <p className="text-sm font-black text-slate-400 tracking-tight">
                      Drop project screenshots <br />
                      <span className="text-indigo-500/60 font-medium">
                        Click to browse files
                      </span>
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {previews.map((url, i) => (
                      <div
                        key={i}
                        className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-xl rotate-3"
                      >
                        <img src={url} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {selectedProject &&
                      files.length === 0 &&
                      selectedProject.images?.map((img: string, i: number) => (
                        <div
                          key={i}
                          className="relative w-20 h-20 rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all border border-slate-100"
                        >
                          <img
                            src={
                              img.startsWith("http") ? img : `${API_BASE}${img}`
                            }
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-16">
              <button
                type="submit"
                className="flex-1 bg-slate-900 hover:bg-indigo-600 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 group"
              >
                {selectedProject ? "Commit Changes" : "Deploy Project"}
                <HiOutlineArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Senior Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-md shadow-2xl animate-in fade-in slide-in-from-bottom-8">
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mb-8 mx-auto">
              <MdReportProblem size={48} className="animate-pulse" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-3 text-center tracking-tight">
              Destructive Action
            </h2>
            <p className="text-slate-500 mb-10 text-center font-medium leading-relaxed">
              You are about to remove{" "}
              <span className="font-black text-red-600">
                "{selectedProject?.title}"
              </span>
              . This will purge all associated media and data.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDelete}
                className="w-full py-5 bg-red-500 hover:bg-red-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-red-100 transition-all active:scale-95"
              >
                Yes, Delete Permanently
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full py-5 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-[1.5rem] font-bold transition-all"
              >
                Cancel, Keep Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
