"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { TrashIcon } from "@/components/Icons";
import { useQueryClient } from "@tanstack/react-query";
import { postsService } from "@/services/posts.service";

interface DeleteModalProps {
  isOpen: boolean;
  post: any;
  onClose: () => void;
  onSuccess: () => void;
}

export const DeleteModal = React.memo(
  ({ isOpen, post, onClose, onSuccess }: DeleteModalProps) => {
    const queryClient = useQueryClient();
    const [isDeleting, setIsDeleting] = React.useState(false);

    const confirmDelete = async () => {
      if (!post) return;
      const t = toast.loading("Purging content from database...");
      setIsDeleting(true);
      try {
        await postsService.delete(post.id);
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        toast.success("Content permanently removed", { id: t });
        onSuccess();
      } catch (err) {
        toast.error("Cleanup process failed", { id: t });
      } finally {
        setIsDeleting(false);
      }
    };

    if (!isOpen || !post) return null;

    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl text-center border border-slate-100 dark:border-slate-800"
          >
            <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-6 shadow-inner">
              <TrashIcon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
              Purge Content?
            </h3>
            <p className="text-slate-400 dark:text-slate-500 font-bold mb-8 text-[11px] uppercase tracking-tight leading-relaxed">
              You are about to delete: <br />
              <span className="text-red-500 normal-case italic font-medium">
                "{post?.title}"
              </span>
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="py-4 bg-slate-50 dark:bg-slate-800 text-slate-400 font-black text-xs rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-widest disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="py-4 bg-red-500 text-white font-black text-xs rounded-2xl shadow-lg hover:bg-red-600 transition-all uppercase tracking-widest disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  },
);

DeleteModal.displayName = "DeleteModal";
