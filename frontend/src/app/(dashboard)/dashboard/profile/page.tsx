"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useProfile } from "@/hooks/useProfile";
import { FaUserCircle, FaCloudUploadAlt, FaSave, FaEdit, FaShieldAlt } from "react-icons/fa";
import { VscLoading } from "react-icons/vsc";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { user, isLoading, updateProfile, isUpdating } = useProfile();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        title: user.title,
        bio: user.bio,
      });
    }
  }, [user, reset]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      // Clean up previous preview memory
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const onSubmit = (data: any) => {
    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("title", data.title);
    fd.append("bio", data.bio);
    if (file) {
      fd.append("profileImage", file);
    }
    updateProfile(fd);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <VscLoading className="animate-spin text-5xl text-indigo-600 dark:text-sky-500" />
      </div>
    );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen transition-colors duration-500">
      {/* Dynamic Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm gap-6"
      >
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white flex items-center gap-4 tracking-tighter">
            <FaUserCircle className="text-indigo-600 dark:text-sky-400" size={36} /> Identity Lab
          </h1>
          <p className="text-slate-400 dark:text-slate-500 font-bold ml-1 uppercase tracking-[0.2em] text-[10px] mt-2">
            Fine-tune your digital presence
          </p>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={isUpdating}
          className="w-full md:w-auto bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 disabled:opacity-50"
        >
          {isUpdating ? <VscLoading className="animate-spin text-xl" /> : <FaSave className="text-xl" />} 
          <span>Save Profile</span>
        </button>
      </motion.header>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar: Identity & Avatar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 space-y-6"
        >
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl text-center">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-6">
              Vessel Appearance
            </label>

            <div className="relative w-52 h-52 mx-auto group mb-8 rounded-[3.5rem] bg-slate-50 dark:bg-slate-800 border-4 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-sky-500 transition-all cursor-pointer p-2">
              <div className="w-full h-full overflow-hidden rounded-[2.8rem] relative">
                <img
                  src={preview || (user?.profileImage ? `${process.env.NEXT_PUBLIC_API_URL}${user.profileImage}` : "/placeholder-avatar.png")}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  alt="Profile"
                />
                <label className="absolute inset-0 flex flex-col gap-2 items-center justify-center bg-indigo-900/80 opacity-0 group-hover:opacity-100 cursor-pointer transition-all backdrop-blur-sm">
                  <FaCloudUploadAlt className="text-white text-4xl animate-bounce" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Update Photo</span>
                  <input type="file" className="hidden" onChange={onFileChange} accept="image/*" />
                </label>
              </div>
            </div>

            <h2 className="font-black text-2xl text-slate-800 dark:text-white tracking-tight">
              {user?.name || "Senior Developer"}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-3">
              <FaShieldAlt className="text-indigo-500 dark:text-sky-400" size={12} />
              <span className="text-[10px] font-black text-indigo-600 dark:text-sky-400 uppercase tracking-widest">
                {user?.role || "Member"}
              </span>
            </div>
          </div>

          <div className="bg-indigo-600 dark:bg-indigo-900/30 p-8 rounded-[2.5rem] text-white">
            <h3 className="font-black text-lg mb-2">Visibility Tip</h3>
            <p className="text-indigo-100 dark:text-indigo-300 text-sm leading-relaxed">
              Your professional title and bio are indexed for search. Make them impactful!
            </p>
          </div>
        </motion.div>

        {/* Main Content: Bio & Data */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-8 space-y-8"
        >
          {/* Section: Credentials */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 ml-2 block">
                  Full Display Name
                </label>
                <input
                  {...register("name")}
                  className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-100 dark:focus:border-indigo-900 rounded-2xl font-bold text-slate-700 dark:text-white outline-none transition-all shadow-sm"
                  placeholder="e.g. Sameh Dheir"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 ml-2 block">
                  Secure Email (Verified)
                </label>
                <div className="w-full p-5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-slate-400 dark:text-slate-600 flex items-center gap-3">
                   <span className="truncate">{user?.email}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 ml-2 block">
                Professional Headline
              </label>
              <div className="relative">
                <input
                  {...register("title")}
                  className="w-full p-5 pl-14 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-100 dark:focus:border-indigo-900 rounded-2xl font-black text-slate-900 dark:text-white outline-none text-lg tracking-tight transition-all"
                  placeholder="e.g. Senior Backend Architect"
                />
                <FaEdit className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" />
              </div>
            </div>
          </div>

          {/* Section: Narrative */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 ml-2">
                The Narrative (Bio)
              </label>
              <span className="text-[10px] font-bold text-indigo-400 dark:text-sky-600 px-3 py-1 bg-indigo-50 dark:bg-sky-500/10 rounded-full">Markdown Supported</span>
            </div>
            <textarea
              {...register("bio")}
              rows={8}
              className="w-full p-6 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-100 dark:focus:border-indigo-900 rounded-[2rem] font-medium text-slate-600 dark:text-slate-300 text-sm outline-none resize-none leading-relaxed transition-all"
              placeholder="Tell your professional story, focus on impact and tech stack..."
            />
          </div>
        </motion.div>
      </form>
    </div>
  );
}