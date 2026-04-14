"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, PostFormValues } from "@/lib/validations/post";
import { toast } from "react-hot-toast";
import {
  CloseIcon,
  UploadIcon,
  PenIcon,
  ExternalLinkIcon,
} from "@/components/Icons";
import { useQueryClient } from "@tanstack/react-query";
import { postsService } from "@/services/posts.service";

interface PostModalProps {
  isOpen: boolean;
  selectedPost: any;
  onClose: () => void;
  onSuccess: () => void;
}

export const PostModal = React.memo(
  ({ isOpen, selectedPost, onClose, onSuccess }: PostModalProps) => {
    const queryClient = useQueryClient();
    const [file, setFile] = React.useState<File | null>(null);
    const [preview, setPreview] = React.useState<string | null>(
      selectedPost?.coverImage || null,
    );
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<PostFormValues>({
      resolver: zodResolver(postSchema) as any,
      defaultValues: {
        title: selectedPost?.title || "",
        content: selectedPost?.content || "",
        category: selectedPost?.category || "Backend",
        isPublished: selectedPost?.published || true,
        tags: selectedPost?.tags || [],
      },
    });

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) {
        setFile(selected);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(URL.createObjectURL(selected));
      }
    };

    const onSubmit = async (data: PostFormValues) => {
      const toastId = toast.loading(
        selectedPost ? "Updating post..." : "Creating post...",
      );
      setIsSubmitting(true);

      try {
        const fd = new FormData();
        fd.append("title", data.title);
        fd.append("content", data.content);
        fd.append("category", data.category);
        fd.append("published", String(data.isPublished));

        if (data.tags && data.tags.length > 0) {
          data.tags.forEach((tag) => fd.append("tags", tag));
        }

        if (file) {
          fd.append("coverImage", file);
        }

        if (selectedPost) {
          await postsService.update(selectedPost.id, fd);
        } else {
          await postsService.create(fd);
        }

        await queryClient.invalidateQueries({ queryKey: ["posts"] });
        toast.success("Done!", { id: toastId });
        onSuccess();
      } catch (err: any) {
        console.error("Submission Error:", err.response?.data);
        toast.error(err.response?.data?.message || "Something went wrong", {
          id: toastId,
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    if (!isOpen) return null;

    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-xl"
            onClick={onClose}
          />
          <motion.form
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onSubmit={handleSubmit(onSubmit)}
            className="relative bg-white dark:bg-slate-900 w-full max-w-6xl h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-white/10"
          >
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <PenIcon className="w-5 h-5" />
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
                onClick={onClose}
                className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-all"
              >
                <CloseIcon className="w-7 h-7" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-8">
                <input
                  {...register("title")}
                  className={`w-full text-4xl font-black border-none outline-none bg-transparent tracking-tighter transition-all ${
                    errors.title
                      ? "text-red-500 placeholder:text-red-300 border-b-2 border-red-500/50"
                      : "placeholder:text-slate-200 dark:placeholder:text-slate-800 text-slate-900 dark:text-white"
                  }`}
                  placeholder="Article title..."
                />
                {errors.title && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2"
                  >
                    {errors.title.message}
                  </motion.p>
                )}

                <div className="flex flex-col space-y-2 group">
                  <textarea
                    {...register("content")}
                    className={`w-full h-[450px] text-lg border-none outline-none resize-none bg-transparent font-medium leading-relaxed transition-all duration-300 ${
                      errors.content
                        ? "text-red-500 placeholder:text-red-300/50"
                        : "text-slate-600 dark:text-slate-400 placeholder:text-slate-200 dark:placeholder:text-slate-800 focus:text-slate-900 dark:focus:text-slate-200"
                    }`}
                    placeholder="Start your technical deep dive..."
                  />
                  <div
                    className={`h-[1px] w-full transition-all duration-500 ${
                      errors.content
                        ? "bg-red-500 scale-x-100"
                        : "bg-slate-100 dark:bg-slate-800 scale-x-0 group-focus-within:scale-x-100"
                    }`}
                  />
                  {errors.content && (
                    <motion.span
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 mt-2"
                    >
                      {errors.content.message}
                    </motion.span>
                  )}
                </div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 space-y-8 backdrop-blur-md">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">
                      Category
                    </label>
                    <select
                      {...register("category")}
                      className={`w-full p-4 bg-white dark:bg-slate-900 border rounded-2xl text-sm font-bold outline-none transition-all duration-300 ${
                        errors.category
                          ? "border-red-500 text-red-500"
                          : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:border-indigo-500 dark:focus:border-indigo-400 shadow-sm"
                      }`}
                    >
                      <option value="Backend">Backend Architecture</option>
                      <option value="Frontend">Frontend Excellence</option>
                      <option value="AI">AI Engineering</option>
                      <option value="DevOps">DevOps & Cloud</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">
                      Cover Image
                    </label>
                    <div className="relative aspect-video rounded-3xl bg-white dark:bg-slate-950 border-2 border-dashed transition-all duration-500 group overflow-hidden flex flex-col items-center justify-center border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400">
                      {preview ? (
                        <div className="relative w-full h-full">
                          <img
                            src={preview}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            alt="Preview"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white text-[10px] font-black uppercase tracking-widest bg-black/40 backdrop-blur-md px-4 py-2 rounded-full">
                              Change Image
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center space-y-2">
                          <UploadIcon className="text-slate-300 dark:text-slate-700 mx-auto group-hover:text-indigo-500 transition-colors w-10 h-10" />
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-tighter">
                            Click or drag to upload
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        onChange={onFileChange}
                        accept="image/*"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-5 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter">
                        Public Access
                      </span>
                      <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500">
                        Visible to everyone
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      {...register("isPublished")}
                      className="w-5 h-5 accent-indigo-600 dark:accent-indigo-500 cursor-pointer rounded-lg"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-500 text-white py-6 rounded-[2rem] font-black text-lg shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    "Syncing..."
                  ) : (
                    <>
                      Commit & Save
                      <ExternalLinkIcon className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.form>
        </div>
      </AnimatePresence>
    );
  },
);

PostModal.displayName = "PostModal";
