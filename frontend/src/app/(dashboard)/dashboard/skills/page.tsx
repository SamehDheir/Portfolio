"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { skillsService } from "@/services/skills.service";
import { toast } from "react-hot-toast";
import { Trash2, Edit3, Plus, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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

  // --- React Hook Form Setup ---
  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: { name: "", level: 80, category: "Backend", icon: "" }
  });

  // --- Queries & Mutations ---
  const { data: skills, isLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: skillsService.getAll,
  });

  const upsertMutation = useMutation({
    mutationFn: (data: SkillFormValues) => 
      selectedSkill ? skillsService.update(selectedSkill.id, data) : skillsService.create(data),
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

  // --- Handlers ---
  const openModal = (skill: any = null) => {
    setSelectedSkill(skill);
    if (skill) {
      form.reset({ name: skill.name, level: skill.level, category: skill.category, icon: skill.icon });
    } else {
      form.reset({ name: "", level: 80, category: "Backend", icon: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSkill(null);
  };

  if (isLoading) return <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Header Area */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Technical Skills</h1>
          <p className="text-gray-500 text-sm">Manage your expertise and proficiency levels</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
        >
          <Plus size={18} /> Add New Skill
        </button>
      </div>

      {/* Grid of Skills (Better Looking than Table) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills?.map((skill: any) => (
          <div key={skill.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {skill.icon && <img src={skill.icon} className="w-10 h-10 object-contain" alt={skill.name} />}
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{skill.name}</h3>
                  <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-lg">{skill.category}</span>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openModal(skill)} className="p-2 text-gray-400 hover:text-blue-600"><Edit3 size={16} /></button>
                <button onClick={() => { setSelectedSkill(skill); setIsDeleteModalOpen(true); }} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Proficiency</span>
                <span className="text-blue-700 font-bold">{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)]" 
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add/Edit Skill */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-200">
            <h2 className="text-2xl font-bold mb-6 text-blue-600">{selectedSkill ? "Edit Skill" : "Add New Skill"}</h2>
            <form onSubmit={form.handleSubmit((data) => upsertMutation.mutate(data))} className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-gray-600 block mb-1.5">Skill Name</label>
                <input {...form.register("name")} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-600" placeholder="e.g. NestJS" />
                {form.formState.errors.name && <p className="text-red-500 text-xs mt-1">{form.formState.errors.name.message}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600 block mb-1.5">Category</label>
                  <input {...form.register("category")} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-600" placeholder="e.g. Backend" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 block mb-1.5">Level (%)</label>
                  <input type="number" {...form.register("level", { valueAsNumber: true })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-600" />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 block mb-1.5">Icon URL</label>
                <input {...form.register("icon")} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-600" placeholder="SVG or PNG link" />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={upsertMutation.isPending} className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-colors disabled:bg-blue-300">
                  {upsertMutation.isPending ? "Saving..." : "Save Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl animate-in fade-in zoom-in duration-200 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Are you sure?</h2>
            <p className="text-gray-500 mb-8">This action cannot be undone. You are about to delete <span className="font-bold text-gray-800">{selectedSkill?.name}</span>.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors">No, Keep it</button>
              <button onClick={() => deleteMutation.mutate(selectedSkill.id)} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}