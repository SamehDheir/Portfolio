"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { skillsService } from "@/services/skills.service";
import { toast } from "react-hot-toast";
import { Trash2, Edit3, Plus, Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";

// Validation Schema
const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  level: z.number().min(0).max(100),
  category: z.string().optional(),
  icon: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type SkillFormValues = z.infer<typeof skillSchema>;

export default function SkillsPage() {
  const queryClient = useQueryClient();
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: { name: "", level: 80, category: "Backend", icon: "" },
  });

  const { data: skills, isLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: skillsService.getAll,
  });

  const upsertMutation = useMutation({
    mutationFn: (data: SkillFormValues) =>
      selectedSkill
        ? skillsService.update(selectedSkill.id, data)
        : skillsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success(selectedSkill ? "Skill updated!" : "Skill added!");
      closeModal();
    },
    onError: () => toast.error("Something went wrong"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => skillsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Skill deleted");
      setIsDeleteModalOpen(false);
    },
  });

  const openModal = (skill: any = null) => {
    setSelectedSkill(skill);
    if (skill) {
      form.reset({
        name: skill.name,
        level: skill.level,
        category: skill.category,
        icon: skill.icon,
      });
    } else {
      form.reset({ name: "", level: 80, category: "Backend", icon: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSkill(null);
  };

  if (isLoading)
    return (
      <div className="flex justify-center mt-20">
        <Loader2 className="animate-spin text-indigo-600 dark:text-sky-500" size={40} />
      </div>
    );

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto min-h-screen transition-colors duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Technical Skills</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            "Your expertise is the engine of every scalable system" ⚙️
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl transition-all shadow-xl active:scale-95 font-bold"
        >
          <Plus size={20} /> Add New Skill
        </button>
      </div>

      {/* Grid of Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {skills?.map((skill: any, idx: number) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group relative"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 p-2.5 flex items-center justify-center border border-slate-100 dark:border-slate-700 transition-colors group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20">
                  {skill.icon ? (
                    <img src={skill.icon} className="w-full h-full object-contain" alt={skill.name} />
                  ) : (
                    <span className="text-indigo-600 dark:text-sky-400 font-black text-xl">{skill.name[0]}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-black text-slate-800 dark:text-white text-lg leading-tight group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors">
                    {skill.name}
                  </h3>
                  <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md uppercase tracking-wider">
                    {skill.category}
                  </span>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                <button onClick={() => openModal(skill)} className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-sky-400 bg-slate-50 dark:bg-slate-800 rounded-lg"><Edit3 size={14} /></button>
                <button onClick={() => { setSelectedSkill(skill); setIsDeleteModalOpen(true); }} className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-slate-800 rounded-lg"><Trash2 size={14} /></button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs font-black uppercase tracking-tighter">
                <span className="text-slate-400">Mastery</span>
                <span className="text-indigo-600 dark:text-sky-400">{skill.level}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-indigo-500 to-sky-400 h-full rounded-full shadow-[0_0_12px_rgba(99,102,241,0.3)]"
                ></motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal: Add/Edit Skill */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-xl p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-md p-10 shadow-2xl border border-transparent dark:border-slate-800 relative"
            >
              <button onClick={closeModal} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><X size={24} /></button>
              
              <h2 className="text-3xl font-black mb-8 text-slate-900 dark:text-white tracking-tight">
                {selectedSkill ? "Modify Skill" : "New Expertise"}
              </h2>
              
              <form onSubmit={form.handleSubmit((data) => upsertMutation.mutate(data))} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Skill Name</label>
                  <input {...form.register("name")} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-100 dark:focus:border-indigo-900 rounded-2xl outline-none text-slate-800 dark:text-white font-bold transition-all" placeholder="e.g. NestJS / Docker" />
                  {form.formState.errors.name && <p className="text-red-500 text-[10px] font-bold ml-1 uppercase">{form.formState.errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                    <input {...form.register("category")} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none text-slate-800 dark:text-white font-bold" placeholder="Backend" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Level (%)</label>
                    <input type="number" {...form.register("level", { valueAsNumber: true })} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none text-indigo-600 dark:text-sky-400 font-black" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Icon URL</label>
                  <input {...form.register("icon")} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none text-slate-500 dark:text-slate-400 text-sm font-medium" placeholder="SVG or PNG direct link" />
                </div>

                <button
                  type="submit"
                  disabled={upsertMutation.isPending}
                  className="w-full py-5 bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl transition-all disabled:opacity-50 mt-4 active:scale-95"
                >
                  {upsertMutation.isPending ? "Executing..." : selectedSkill ? "Commit Changes" : "Add to Tech Stack"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/80 dark:bg-black/90 backdrop-blur-md p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-sm p-10 shadow-2xl text-center border border-transparent dark:border-red-900/20">
              <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse"><Trash2 size={36} /></div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Purge Skill?</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Removing <span className="font-black text-red-600 dark:text-red-400">"{selectedSkill?.name}"</span> is permanent. Continue?</p>
              <div className="flex flex-col gap-3">
                <button onClick={() => deleteMutation.mutate(selectedSkill.id)} className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-black rounded-xl transition-all active:scale-95 shadow-lg shadow-red-100 dark:shadow-none">Delete Forever</button>
                <button onClick={() => setIsDeleteModalOpen(false)} className="w-full py-4 bg-slate-50 dark:bg-slate-800 text-slate-400 font-bold rounded-xl hover:bg-slate-100 transition-all">Keep Skill</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}