"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useProfile } from "@/hooks/useProfile";
import {
  FaUserCircle,
  FaCloudUploadAlt,
  FaSave,
  FaEdit,
  FaShieldAlt,
  FaFilePdf,
  FaCheckCircle,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { VscLoading } from "react-icons/vsc";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { user, isLoading, updateProfile, isUpdating } = useProfile();
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
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

  const onImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setImgFile(selected);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const onCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === "application/pdf") {
      setCvFile(selected);
    } else if (selected) {
      alert("Please upload a PDF file.");
    }
  };

  const onSubmit = (data: any) => {
    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("title", data.title || "");
    fd.append("bio", data.bio || "");

    if (imgFile) fd.append("profileImage", imgFile);
    if (cvFile) fd.append("cvFile", cvFile);

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
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm gap-6"
      >
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white flex items-center gap-4 tracking-tighter">
            <FaUserCircle
              className="text-indigo-600 dark:text-sky-400"
              size={36}
            />{" "}
            Identity Lab
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
          {isUpdating ? (
            <VscLoading className="animate-spin text-xl" />
          ) : (
            <FaSave className="text-xl" />
          )}
          <span>Save Changes</span>
        </button>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <motion.div className="lg:col-span-4 space-y-6">
          {/* Profile Image Card */}
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl text-center">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-6">
              Vessel Appearance
            </label>
            <div className="relative w-52 h-52 mx-auto group mb-8 rounded-[3.5rem] bg-slate-50 dark:bg-slate-800 border-4 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition-all cursor-pointer p-2">
              <div className="w-full h-full overflow-hidden rounded-[2.8rem] relative">
                <img
                  src={
                    preview || user?.profileImage || "/placeholder-avatar.png"
                  }
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  alt="Profile"
                />
                <label className="absolute inset-0 flex flex-col gap-2 items-center justify-center bg-indigo-900/80 opacity-0 group-hover:opacity-100 cursor-pointer transition-all backdrop-blur-sm">
                  <FaCloudUploadAlt className="text-white text-4xl animate-bounce" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={onImgChange}
                    accept="image/*"
                  />
                </label>
              </div>
            </div>
            <h2 className="font-black text-2xl text-slate-800 dark:text-white tracking-tight">
              {user?.name}
            </h2>
          </div>

          {/* CV Upload Card */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-4">
              Professional Resume
            </label>
            <input
              type="file"
              id="cv-upload"
              className="hidden"
              accept=".pdf"
              onChange={onCvChange}
            />
            <label
              htmlFor="cv-upload"
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
                cvFile
                  ? "border-green-500 bg-green-50 dark:bg-green-500/5"
                  : "border-slate-200 dark:border-slate-800 hover:border-indigo-500"
              }`}
            >
              <div
                className={`p-3 rounded-xl ${cvFile ? "bg-green-500" : "bg-indigo-600"} text-white`}
              >
                {cvFile ? <FaCheckCircle size={20} /> : <FaFilePdf size={20} />}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-black dark:text-white uppercase truncate">
                  {cvFile ? "CV Ready" : "Upload CV"}
                </span>
                <span className="text-[10px] text-slate-400 truncate w-32">
                  {cvFile ? cvFile.name : "PDF format"}
                </span>
              </div>
            </label>
            {user?.cvUrl && (
              <a
                href={user.cvUrl}
                target="_blank"
                className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold text-indigo-500 hover:text-indigo-600 transition-colors"
              >
                <FaExternalLinkAlt size={10} /> View Current CV
              </a>
            )}
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div className="lg:col-span-8 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase text-slate-400 ml-2 block">
                  Full Name
                </label>
                <input
                  {...register("name")}
                  className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 ring-indigo-100 transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase text-slate-400 ml-2 block">
                  Verified Email
                </label>
                <div className="w-full p-5 bg-slate-100 dark:bg-slate-950 rounded-2xl font-bold text-slate-400 truncate">
                  {user?.email}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase text-slate-400 ml-2 block">
                Professional Headline
              </label>
              <div className="relative">
                <input
                  {...register("title")}
                  className="w-full p-5 pl-14 bg-slate-50 dark:bg-slate-800 rounded-2xl font-black text-lg dark:text-white outline-none focus:ring-2 ring-indigo-100 transition-all"
                />
                <FaEdit className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl">
            <label className="text-[11px] font-black uppercase text-slate-400 ml-2 block mb-6">
              The Narrative (Bio)
            </label>
            <textarea
              {...register("bio")}
              rows={8}
              className="w-full p-6 bg-slate-50 dark:bg-slate-800/50 border border-transparent dark:border-slate-800 rounded-[2rem] font-medium text-sm leading-relaxed text-slate-600 dark:text-slate-300 outline-none focus:ring-2 ring-indigo-100 dark:focus:ring-indigo-500/30 transition-all resize-none"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
