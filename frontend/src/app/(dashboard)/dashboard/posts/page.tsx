"use client";

import { useState, useEffect } from "react"; 
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, PostFormValues } from "@/lib/validations/post";
import { postsService } from "@/services/posts.service";
import { toast } from "react-hot-toast";
import {
  Plus,
  X,
  Search,
  Loader2,
  Trash2,
  Edit,
  FileText,
  CheckCircle,
  Clock,
  Newspaper,
  UploadCloud,
} from "lucide-react";

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

  const { register, handleSubmit, reset, control } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: { tags: [], isPublished: true },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tags" as any,
  });

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", debouncedSearch],
    queryFn: () => postsService.getAll(debouncedSearch),
  });

  const onSubmit = async (data: PostFormValues) => {
    const t = toast.loading("Saving post...");
    try {
      const fd = new FormData();
      fd.append("title", data.title);
      fd.append("content", data.content);
      if (data.category) fd.append("category", data.category);

      fd.append("published", String(data.isPublished));

      if (file) {
        fd.append("coverImage", file);
      }

      if (selectedPost) {
        await postsService.update(selectedPost.id, fd);
      } else {
        await postsService.create(fd);
      }

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Done!", { id: t });
      setIsModalOpen(false);
      setFile(null);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Error saving";
      toast.error(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg, { id: t });
    }
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    const t = toast.loading("Deleting post...");
    try {
      await postsService.delete(postToDelete.id);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully", { id: t });
      setIsDeleteModalOpen(false);
      setPostToDelete(null);
    } catch (err) {
      toast.error("Failed to delete post", { id: t });
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
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );

  return (
    <div className="p-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
            <Newspaper className="text-indigo-600" size={36} /> Content Hub
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Manage all articles (Drafts & Published)
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
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
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95"
          >
            <Plus size={20} /> Write Post
          </button>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">
                Article
              </th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">
                Category
              </th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">
                Status
              </th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {posts?.map((post: any) => (
              <tr
                key={post.id}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 overflow-hidden border border-indigo-100 shadow-inner">
                      {post.coverImg ? (
                        <img
                          src={`${IMAGE_BASE}${post.coverImg}`}
                          className="object-cover w-full h-full"
                          alt=""
                        />
                      ) : (
                        <FileText size={24} />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {post.title}
                      </div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                        <Clock size={12} />{" "}
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200">
                    {post.category || "Backend"}
                  </span>
                </td>
                <td className="p-6">
                  {/* هنا يظهر المقال سواء كان published true أو false */}
                  {post.published ? (
                    <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                      <CheckCircle size={14} /> Published
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-amber-500 text-xs font-bold">
                      <Clock size={14} /> Draft
                    </span>
                  )}
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEdit(post)}
                      className="p-2 text-slate-400 hover:text-indigo-600 transition-all"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setPostToDelete(post);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts?.length === 0 && (
          <div className="p-20 text-center text-slate-400 font-bold">
            No posts found.
          </div>
        )}
      </div>

      {/* Modal - Editor */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-[3rem] p-10 w-full max-w-6xl shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto relative"
          >
            <div className="flex justify-between items-center mb-10 sticky top-0 bg-white z-10 pb-4 border-b">
              <h2 className="text-3xl font-black text-slate-900">
                {selectedPost ? "Edit Post" : "New Post"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-6">
                <input
                  {...register("title")}
                  className="w-full text-5xl font-black border-none outline-none placeholder:text-slate-200"
                  placeholder="Post Title..."
                />
                <textarea
                  {...register("content")}
                  className="w-full h-[32rem] text-lg border-none outline-none resize-none placeholder:text-slate-200 font-medium leading-relaxed"
                  placeholder="Write here..."
                />
              </div>

              <div className="space-y-8 bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase block mb-3 ml-1">
                    Category
                  </label>
                  <select
                    {...register("category")}
                    className="w-full p-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none font-bold text-slate-700"
                  >
                    <option value="Backend">Backend</option>
                    <option value="Frontend">Frontend</option>
                    <option value="AI">AI</option>
                    <option value="DevOps">DevOps</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase block mb-3 ml-1">
                    Cover Image
                  </label>
                  <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-white hover:border-indigo-300 transition-all">
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <UploadCloud
                      className="mx-auto text-slate-300 mb-2"
                      size={32}
                    />
                    <p className="text-[10px] font-bold text-slate-400 leading-tight">
                      {file
                        ? file.name
                        : selectedPost?.coverImg
                          ? "Image exists (Click to change)"
                          : "Upload Image"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                  <input
                    type="checkbox"
                    {...register("isPublished")}
                    className="w-6 h-6 accent-indigo-600 rounded-md"
                  />
                  <label className="text-sm font-bold text-slate-700">
                    Publicly Published
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-[2rem] font-black text-xl transition-all shadow-lg active:scale-95"
                >
                  Save Post
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-200">
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-6">
              <Trash2 size={40} />
            </div>

            <h3 className="text-2xl font-black text-center text-slate-900 mb-2">
              Are you sure?
            </h3>
            <p className="text-slate-500 text-center font-medium mb-8">
              You are about to delete{" "}
              <span className="text-slate-900 font-bold">
                "{postToDelete?.title}"
              </span>
              . This action cannot be undone.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-6 py-4 rounded-2xl font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200 transition-all active:scale-95"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
