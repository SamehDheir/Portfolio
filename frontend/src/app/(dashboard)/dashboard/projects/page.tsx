"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, ProjectFormValues } from "@/lib/validations/project";
import { projectsService } from "@/services/projects.service";
import { toast } from "react-hot-toast";
import { 
  Plus, X, UploadCloud, Loader2, Trash2, Edit, 
  ExternalLink, AlertTriangle, ImageIcon 
} from "lucide-react";

const API_BASE = 'http://localhost:3000';

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: { techStack: [] }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "techStack" });

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsService.getAll,
  });

  // معالجة عرض الصور المختارة (Previews)
  useEffect(() => {
    if (files.length === 0) {
      setPreviews([]);
      return;
    }
    const objectUrls = files.map(file => URL.createObjectURL(file));
    setPreviews(objectUrls);
    return () => objectUrls.forEach(url => URL.revokeObjectURL(url));
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
    const t = toast.loading("Deleting project...");
    try {
      await projectsService.delete(selectedProject.id);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted", { id: t });
      setIsDeleteModalOpen(false);
    } catch (err) {
      toast.error("Delete failed", { id: t });
    }
  };

  const onSubmit = async (data: ProjectFormValues) => {
    const t = toast.loading(selectedProject ? "Updating..." : "Creating...");
    try {
      const fd = new FormData();
      fd.append("title", data.title);
      fd.append("description", data.description);
      if (data.link) fd.append("link", data.link);
      if (data.github) fd.append("github", data.github);
      
      data.techStack.forEach(tech => fd.append("techStack", tech.trim()));
      files.forEach(file => fd.append("images", file));

      if (selectedProject) {
        await projectsService.update(selectedProject.id, fd);
      } else {
        await projectsService.create(fd);
      }

      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Success!", { id: t });
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message?.[0] || "Save failed", { id: t });
    }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={40}/></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Portfolio Manager</h1>
          <p className="text-slate-500">Manage your projects and technical stack</p>
        </div>
        <button 
          onClick={() => { setSelectedProject(null); reset({ title: "", description: "", techStack: ["React"], link: "", github: "" }); setFiles([]); setIsModalOpen(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-200 active:scale-95"
        >
          <Plus size={20} /> New Project
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects?.map((p: any) => (
          <div key={p.id} className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
            <div className="relative h-56">
              <img 
                src={p.images?.[0] ? (p.images[0].startsWith('http') ? p.images[0] : `${API_BASE}${p.images[0]}`) : "/placeholder.png"} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={() => openEditModal(p)} className="p-3 bg-white/90 backdrop-blur rounded-full text-indigo-600 shadow-xl hover:bg-white active:scale-90 transition-all"><Edit size={18}/></button>
                <button onClick={() => openDeleteModal(p)} className="p-3 bg-white/90 backdrop-blur rounded-full text-red-500 shadow-xl hover:bg-white active:scale-90 transition-all"><Trash2 size={18}/></button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-black text-xl text-slate-800 mb-2 line-clamp-1">{p.title}</h3>
              <p className="text-slate-500 text-sm line-clamp-2 mb-4 h-10">{p.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {p.techStack?.slice(0, 3).map((t: string) => (
                  <span key={t} className="px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-100">{t}</span>
                ))}
              </div>
              <div className="flex gap-4 border-t pt-4">
                {p.link && <a href={p.link} target="_blank" className="text-slate-400 hover:text-indigo-600 transition-colors"><ExternalLink size={18}/></a>}
                {p.github && <a href={p.github} target="_blank" className="text-slate-400 hover:text-slate-900 transition-colors"><ExternalLink size={18}/></a>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-[3rem] p-8 w-full max-w-4xl shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-slate-800">{selectedProject ? "Edit Project" : "Create Project"}</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={28}/></button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                  <input {...register("title")} className="w-full mt-2 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" placeholder="Project name" />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea {...register("description")} rows={5} className="w-full mt-2 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" placeholder="Describe your work..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input {...register("link")} className="p-4 bg-slate-50 border-none rounded-2xl text-sm" placeholder="Live Link" />
                  <input {...register("github")} className="p-4 bg-slate-50 border-none rounded-2xl text-sm" placeholder="GitHub Link" />
                </div>
              </div>

              <div className="space-y-6">
                {/* Tech Tags */}
                <div>
                  <label className="flex justify-between items-center text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                    Technologies <button type="button" onClick={() => append("")} className="text-indigo-600 hover:underline">+ Add Tag</button>
                  </label>
                  <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-[2rem] min-h-[100px]">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                        <input {...register(`techStack.${index}` as const)} className="w-16 text-xs font-bold outline-none" />
                        <button type="button" onClick={() => remove(index)} className="text-red-400 hover:text-red-600"><X size={14}/></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upload & Preview */}
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1 block">Project Media</label>
                  <div className="relative group border-2 border-dashed border-slate-200 rounded-[2rem] p-8 text-center hover:bg-indigo-50/30 hover:border-indigo-300 transition-all cursor-pointer">
                    <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <UploadCloud className="mx-auto text-slate-300 group-hover:text-indigo-500 mb-2 transition-colors" size={32}/>
                    <p className="text-xs font-bold text-slate-400 italic">Drop images here</p>
                  </div>
                  
                  {/* Image Previews */}
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {previews.map((url, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-indigo-100">
                        <img src={url} className="w-full h-full object-cover" />
                        <div className="absolute top-0 right-0 p-1 bg-indigo-500 text-white text-[8px] font-bold uppercase">New</div>
                      </div>
                    ))}
                    {selectedProject && files.length === 0 && selectedProject.images?.map((img: string, i: number) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 opacity-60">
                        <img src={img.startsWith('http') ? img : `${API_BASE}${img}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full mt-10 bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-[2rem] font-black text-xl shadow-xl shadow-indigo-100 transition-all active:scale-95">
              {selectedProject ? "Update Project" : "Publish Project"}
            </button>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6">
              <AlertTriangle size={32}/>
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Delete Project?</h2>
            <p className="text-slate-500 mb-8 font-medium">This action cannot be undone. Are you sure you want to delete <span className="font-bold text-slate-800">"{selectedProject?.title}"</span>?</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-colors">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-100 transition-colors">Delete Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}