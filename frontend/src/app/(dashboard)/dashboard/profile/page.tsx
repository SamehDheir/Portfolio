"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useProfile } from "@/hooks/useProfile";
import { FaUserCircle, FaCloudUploadAlt, FaSave, FaEdit } from "react-icons/fa";
import { VscLoading } from "react-icons/vsc";

export default function ProfilePage() {
  const { user, isLoading, updateProfile, isUpdating } = useProfile();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { register, handleSubmit, reset, watch } = useForm();

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
      <div className="flex justify-center p-20">
        <VscLoading className="animate-spin text-4xl text-indigo-600" />
      </div>
    );

  return (
    <div className="p-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      <header className="mb-12 flex justify-between items-center bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-5xl font-black text-slate-900 flex items-center gap-4 tracking-tighter">
            <FaUserCircle className="text-indigo-600" size={40} /> Identity Lab
          </h1>
          <p className="text-slate-400 font-bold ml-1 uppercase tracking-[0.2em] text-xs">
            Manage your professional narrative
          </p>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={isUpdating}
          className="bg-slate-900 hover:bg-indigo-600 text-white px-10 py-5 rounded-[1.5rem] font-bold flex items-center gap-2 transition-all shadow-xl active:scale-95 disabled:opacity-50"
        >
          {isUpdating ? <VscLoading className="animate-spin" /> : <FaSave />}{" "}
          Save changes
        </button>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-12 gap-10"
      >
        {/* Left Layer: Avatar */}
        <div className="md:col-span-4 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl text-center h-fit">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">
            Profile Avatar
          </label>

          <div className="relative w-48 h-48 mx-auto group mb-6 overflow-hidden aspect-square rounded-[3rem] bg-slate-100 border-4 border-dashed border-slate-200 hover:border-indigo-300 transition-all cursor-pointer">
            <img
              src={preview || `http://localhost:3000${user?.profileImage}`}
              className="w-full h-full object-cover grayscale hover:grayscale-0 group-hover:blur-[2px] transition-all"
              alt="Profile"
            />
            <label className="absolute inset-0 flex flex-col gap-2 items-center justify-center bg-slate-900/60 opacity-0 group-hover:opacity-100 rounded-[3rem] cursor-pointer transition-all">
              <FaCloudUploadAlt className="text-white text-4xl" />
              <span className="text-xs font-bold text-white uppercase">
                Replace Identity
              </span>
              <input
                type="file"
                className="hidden"
                onChange={onFileChange}
                accept="image/*"
              />
            </label>
          </div>
          <h2 className="font-black text-2xl text-slate-800 tracking-tight">
            {user?.name}
          </h2>
          <span className="text-xs font-black text-indigo-500 uppercase bg-indigo-50 px-4 py-2 rounded-lg inline-block mt-2">
            {user?.role}
          </span>
        </div>

        <div className="md:col-span-8 space-y-10">
          <div className="space-y-6">
            <div className="group">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block focus-within:text-indigo-600">
                Full Legal Name
              </label>
              <input
                {...register("name")}
                className="w-full p-5 bg-white border border-slate-100 rounded-[1.5rem] font-bold text-slate-700 focus:ring-2 ring-indigo-50 outline-none shadow-sm transition-all"
                placeholder="Sameh Dheir"
              />
            </div>

            <div className="group">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block">
                Email Address (Read-Only)
              </label>
              <input
                value={user?.email}
                readOnly
                className="w-full p-5 bg-slate-100 border border-slate-200 rounded-[1.5rem] font-bold text-indigo-600 outline-none shadow-inner"
              />
            </div>
          </div>

          {/* Title and bio*/}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl space-y-6">
            <div className="group">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block">
                Professional Job Title
              </label>
              <input
                {...register("title")}
                className="w-full p-5 bg-slate-50 border border-transparent rounded-[1.5rem] font-bold text-slate-900 focus:bg-white focus:border-indigo-100 outline-none text-xl tracking-tight"
                placeholder="Senior Full-stack Developer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Bio / Narrative
                </label>
                <FaEdit className="text-indigo-300" size={14} />
              </div>
              <textarea
                {...register("bio")}
                rows={6}
                className="w-full p-5 bg-slate-50 border border-transparent rounded-[1.5rem] font-medium text-slate-600 text-sm focus:bg-white focus:border-indigo-100 outline-none resize-none custom-scrollbar leading-relaxed"
                placeholder="Write your tech story..."
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
