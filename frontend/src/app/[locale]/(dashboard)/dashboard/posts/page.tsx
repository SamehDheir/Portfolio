"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, PostFormValues } from "@/lib/validations/post";
import { postsService } from "@/services/posts.service";
import { toast } from "react-hot-toast";

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
import {
  MdOutlineDynamicFeed,
  MdOutlineClose,
  MdOutlineCategory,
} from "react-icons/md";
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: { tags: [], isPublished: true },
  });

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", debouncedSearch],
    queryFn: () => postsService.getAll(debouncedSearch),
  });

  const onSubmit = async (data: PostFormValues) => {
    const t = toast.loading("Syncing with cloud...");
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
      toast.success("Post live and ready!", { id: t });
      setIsModalOpen(false);
      setFile(null);
    } catch (err: any) {
      toast.error("Deployment failed", { id: t });
    }
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    const t = toast.loading("Purging content...");
    try {
      await postsService.delete(postToDelete.id);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Article removed", { id: t });
      setIsDeleteModalOpen(false);
    } catch (err) {
      toast.error("Cleanup failed", { id: t });
    }
  };

  const openEdit = (post: any) => {
    setSelectedPost(post);
    reset({
      title: post.title,
      content: post.content,
      category: post.category || "Backend",
      tags: post.tags || [],
      isPublished: post.published,
    });
    setIsModalOpen(true);
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <VscLoading className="animate-spin text-indigo-600" size={50} />
      </div>
    );

  return (
    <div className="p-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      {/* Dynamic Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-12 gap-8">
        <div className="space-y-1">
          <h1 className="text-5xl font-black text-slate-900 flex items-center gap-4 tracking-tighter">
            <MdOutlineDynamicFeed className="text-indigo-600" /> Content Lab
          </h1>
          <p className="text-slate-400 font-bold ml-1 uppercase tracking-[0.2em] text-xs">
            Knowledge Base & Tech Insights
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          <div className="relative w-full sm:w-80 group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search architecture..."
              value={searchQuery}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-transparent rounded-[1.5rem] shadow-sm focus:border-indigo-100 focus:bg-white outline-none font-bold text-slate-700 transition-all"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setSelectedPost(null);
              reset({ category: "Backend", isPublished: true });
              setFile(null);
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto bg-slate-900 hover:bg-indigo-600 text-white px-8 py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-3 transition-all shadow-xl hover:-translate-y-1 active:scale-95 group"
          >
            <FaFeatherAlt className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />{" "}
            Write Article
          </button>
        </div>
      </div>

      {/* Modern Content Grid / Table Replacement */}
      <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Article Insight
                </th>
                <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Domain
                </th>
                <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Deployment Status
                </th>
                <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {posts?.map((post: any) => (
                <tr
                  key={post.id}
                  className="group hover:bg-indigo-50/20 transition-all duration-300"
                >
                  <td className="p-8">
                    <div className="flex items-center gap-6">
                      <div className="relative w-16 h-16 shrink-0">
                        <div className="absolute inset-0 bg-indigo-200 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform" />
                        <div className="relative w-full h-full rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-indigo-600 overflow-hidden shadow-sm">
                          {post.coverImg ? (
                            <img
                              src={`${IMAGE_BASE}${post.coverImg}`}
                              className="object-cover w-full h-full"
                              alt=""
                            />
                          ) : (
                            <FaRegFileAlt size={24} />
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="font-black text-xl text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1 italic">
                          {post.title}
                        </div>
                        <div className="text-[11px] font-bold text-slate-400 mt-1 flex items-center gap-2 uppercase tracking-tighter">
                          <FaRegClock className="text-indigo-400" />{" "}
                          {new Date(post.createdAt).toLocaleDateString(
                            "en-GB",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <span className="px-5 py-2 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black border border-slate-100 uppercase tracking-widest group-hover:bg-white group-hover:text-indigo-600 transition-colors">
                      {post.category || "General"}
                    </span>
                  </td>
                  <td className="p-8">
                    {post.published ? (
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        <FaCheckCircle /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                        <FaRegClock /> Local Draft
                      </span>
                    )}
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => openEdit(post)}
                        className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:bg-indigo-600 hover:text-white transition-all hover:shadow-lg active:scale-90"
                      >
                        <FaRegEdit size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setPostToDelete(post);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:bg-red-500 hover:text-white transition-all hover:shadow-lg active:scale-90"
                      >
                        <FaTrashAlt size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full-Screen Modern Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl flex items-center justify-center z-[100] p-4 sm:p-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white w-full max-w-5xl sm:max-h-[90vh] sm:rounded-[2.5rem] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-300"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10 sm:rounded-t-[2.5rem]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                  <FaFeatherAlt size={16} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    {selectedPost ? "Edit Post" : "New Insight"}
                  </h2>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Editor Mode
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400"
              >
                <MdOutlineClose size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Writing Area */}
                <div className="lg:col-span-8 space-y-6">
                  <input
                    {...register("title")}
                    className="w-full text-3xl font-black border-none outline-none placeholder:text-slate-100 text-slate-900 bg-transparent tracking-tight"
                    placeholder="Article title..."
                  />
                  <textarea
                    {...register("content")}
                    className="w-full h-[350px] text-base border-none outline-none resize-none placeholder:text-slate-100 font-medium leading-relaxed text-slate-600 bg-transparent"
                    placeholder="Start writing..."
                  />
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-slate-50 rounded-3xl p-6 space-y-6 border border-slate-100">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Category
                      </label>
                      <select
                        {...register("category")}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none"
                      >
                        <option value="Backend">Backend</option>
                        <option value="Frontend">Frontend</option>
                        <option value="AI">AI Engineering</option>
                        <option value="DevOps">DevOps</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Cover Image
                      </label>
                      <div className="relative group aspect-video bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center transition-all hover:border-indigo-300">
                        <input
                          type="file"
                          className="absolute inset-0 opacity-0 cursor-pointer z-20"
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                        {file || selectedPost?.coverImg ? (
                          <FaCheckCircle
                            className="text-emerald-500"
                            size={24}
                          />
                        ) : (
                          <FaCloudUploadAlt
                            className="text-slate-300"
                            size={24}
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-black text-slate-600 uppercase">
                        Public
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
                    className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    Save <HiExternalLink />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
              <FaTrashAlt size={24} />
            </div>
            <h3 className="text-xl font-black text-center text-slate-900 mb-2">
              Confirm Delete
            </h3>
            <p className="text-slate-400 text-center font-bold mb-8 text-[11px] leading-relaxed uppercase tracking-tight">
              You are about to remove: <br />
              <span className="text-red-500 text-sm normal-case italic">
                "{postToDelete?.title}"
              </span>
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="py-3 bg-slate-50 text-slate-400 rounded-xl font-bold text-xs hover:bg-slate-100 transition-all"
              >
                CANCEL
              </button>
              <button
                onClick={confirmDelete}
                className="py-3 bg-red-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-red-100 hover:bg-red-600 transition-all"
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
