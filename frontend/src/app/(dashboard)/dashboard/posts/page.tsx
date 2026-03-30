"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, PostFormValues } from "@/lib/validations/post";
import { postsService } from "@/services/posts.service";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaPlus,
  FaSearch,
  FaRegEdit,
  FaTrashAlt,
  FaRegFileAlt,
  FaCheckCircle,
  FaRegClock,
  FaCloudUploadAlt,
  FaFeatherAlt,
} from "react-icons/fa";
import { MdOutlineDynamicFeed, MdOutlineClose } from "react-icons/md";
import { VscLoading } from "react-icons/vsc";
import { HiExternalLink } from "react-icons/hi";

const IMAGE_BASE = "http://localhost:3000";

export default function PostsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<any>(null);

  // Search Debounce Logic
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "Backend",
      tags: [],
      isPublished: true,
    },
  });

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", debouncedSearch],
    queryFn: () => postsService.getAll(debouncedSearch),
  });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    setFile(null);
    setPreview(null);
    reset({ title: "", content: "", category: "Backend", isPublished: true });
  };

  const onSubmit = async (data: PostFormValues) => {
    const t = toast.loading(
      selectedPost ? "Updating your insight..." : "Deploying to cloud...",
    );
    try {
      const fd = new FormData();
      fd.append("title", data.title);
      fd.append("content", data.content);
      if (data.category) fd.append("category", data.category);
      fd.append("published", String(data.isPublished));
      if (file) fd.append("coverImage", file);

      if (selectedPost) {
        await postsService.update(selectedPost.id, fd);
      } else {
        await postsService.create(fd);
      }

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success(
        selectedPost ? "Post refined successfully!" : "Article is now live!",
        { id: t },
      );
      closeModal();
    } catch (err: any) {
      toast.error("Cloud sync failed. Check connection.", { id: t });
    }
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    const t = toast.loading("Purging content from database...");
    try {
      await postsService.delete(postToDelete.id);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Content permanently removed", { id: t });
      setIsDeleteModalOpen(false);
      setPostToDelete(null);
    } catch (err) {
      toast.error("Cleanup process failed", { id: t });
    }
  };

  const openEdit = (post: any) => {
    setSelectedPost(post);
    reset({
      title: post.title,
      content: post.content,
      category: post.category || "Backend",
      isPublished: post.published,
    });
    setPreview(post.coverImg ? `${IMAGE_BASE}${post.coverImg}` : null);
    setIsModalOpen(true);
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <VscLoading
            className="animate-spin text-indigo-600 dark:text-sky-500 mb-4 mx-auto"
            size={50}
          />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Fetching Content Lab...
          </p>
        </div>
      </div>
    );

  return (
    <div className="p-4 md:p-10 max-w-[1600px] mx-auto bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      {/* Header Section */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-12 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-5xl font-black text-slate-900 dark:text-white flex items-center gap-4 tracking-tighter">
            <MdOutlineDynamicFeed className="text-indigo-600 dark:text-sky-400" />{" "}
            Content Lab
          </h1>
          <p className="text-slate-400 dark:text-slate-500 font-bold ml-1 uppercase tracking-[0.2em] text-xs mt-2">
            Professional Knowledge Base & Tech Insights
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          <div className="relative w-full sm:w-80 group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" />
            <input
              type="text"
              placeholder="Search architecture..."
              value={searchQuery}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-4 ring-indigo-50 dark:ring-sky-900/20 outline-none font-bold text-slate-700 dark:text-slate-200 transition-all"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-5 text-sm rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 group"
          >
            <FaFeatherAlt className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            <span className="w-30">Write Article</span>
          </button>
        </div>
      </header>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                <th className="p-8 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Article Insight
                </th>
                <th className="p-8 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Domain
                </th>
                <th className="p-8 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Deployment
                </th>
                <th className="p-8 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              <AnimatePresence>
                {posts?.map((post: any) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={post.id}
                    className="group hover:bg-indigo-50/20 dark:hover:bg-indigo-900/10 transition-all"
                  >
                    <td className="p-8">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 shrink-0 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-100 dark:border-slate-700">
                          {post.coverImg ? (
                            <img
                              src={`${IMAGE_BASE}${post.coverImg}`}
                              className="object-cover w-full h-full"
                              alt=""
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <FaRegFileAlt size={24} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-black text-xl text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1 italic">
                            {post.title}
                          </div>
                          <div className="text-[11px] font-bold text-slate-400 mt-1 flex items-center gap-2 uppercase tracking-tighter">
                            <FaRegClock className="text-indigo-400" />{" "}
                            {new Date(post.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <span className="px-5 py-2 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-[10px] font-black border border-slate-100 dark:border-slate-700 uppercase tracking-widest">
                        {post.category || "Backend"}
                      </span>
                    </td>
                    <td className="p-8">
                      {post.published ? (
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />{" "}
                          <FaCheckCircle /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-500 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest">
                          <FaRegClock /> Local Draft
                        </span>
                      )}
                    </td>
                    <td className="p-8 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => openEdit(post)}
                          className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:bg-indigo-600 hover:text-white transition-all active:scale-90 shadow-sm"
                        >
                          <FaRegEdit size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setPostToDelete(post);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:bg-red-500 hover:text-white transition-all active:scale-90 shadow-sm"
                        >
                          <FaTrashAlt size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Write/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-xl"
            onClick={closeModal}
          />
          <motion.form
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="relative bg-white dark:bg-slate-900 w-full max-w-6xl h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-white/10"
          >
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <FaFeatherAlt size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {selectedPost ? "Edit Insight" : "New Tech Story"}
                  </h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Drafting System v2
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-all"
              >
                <MdOutlineClose size={28} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-8">
                <input
                  {...register("title")}
                  className="w-full text-4xl font-black border-none outline-none placeholder:text-slate-100 dark:placeholder:text-slate-800 text-slate-900 dark:text-white bg-transparent tracking-tighter"
                  placeholder="Article title..."
                />
                <textarea
                  {...register("content")}
                  className="w-full h-[450px] text-lg border-none outline-none resize-none placeholder:text-slate-100 dark:placeholder:text-slate-800 font-medium leading-relaxed text-slate-600 dark:text-slate-400 bg-transparent"
                  placeholder="Start your technical deep dive..."
                />
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Category
                    </label>
                    <select
                      {...register("category")}
                      className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none"
                    >
                      <option value="Backend">Backend</option>
                      <option value="Frontend">Frontend</option>
                      <option value="AI">AI Engineering</option>
                      <option value="DevOps">DevOps</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Cover Image
                    </label>
                    <div className="relative aspect-video rounded-2xl bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center overflow-hidden hover:border-indigo-300 transition-all group">
                      {preview ? (
                        <img
                          src={preview}
                          className="absolute inset-0 w-full h-full object-cover"
                          alt="Preview"
                        />
                      ) : (
                        <FaCloudUploadAlt
                          className="text-slate-300"
                          size={30}
                        />
                      )}
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        onChange={onFileChange}
                        accept="image/*"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase">
                      Public Access
                    </span>
                    <input
                      type="checkbox"
                      {...register("isPublished")}
                      className="w-5 h-5 accent-indigo-600 cursor-pointer"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  Commit & Save <HiExternalLink />
                </button>
              </div>
            </div>
          </motion.form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsDeleteModalOpen(false)}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl text-center border border-slate-100 dark:border-slate-800"
          >
            <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-6 shadow-inner">
              <FaTrashAlt size={30} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
              Purge Content?
            </h3>
            <p className="text-slate-400 dark:text-slate-500 font-bold mb-8 text-[11px] uppercase tracking-tight leading-relaxed">
              You are about to delete: <br />{" "}
              <span className="text-red-500 normal-case italic font-medium">
                "{postToDelete?.title}"
              </span>
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="py-4 bg-slate-50 dark:bg-slate-800 text-slate-400 font-black text-xs rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="py-4 bg-red-500 text-white font-black text-xs rounded-2xl shadow-lg shadow-red-200 dark:shadow-none hover:bg-red-600 transition-all uppercase tracking-widest"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
