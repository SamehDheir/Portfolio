"use client";

import React from "react";
import { motion } from "framer-motion";
import { EditIcon, TrashIcon, ClockIcon, FileIcon } from "../../Icons";

interface PostRowProps {
  post: any;
  onEdit: (post: any) => void;
  onDelete: (post: any) => void;
}

export const PostRow = React.memo(
  ({ post, onEdit, onDelete }: PostRowProps) => (
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
            {post.coverImage ? (
              <img
                src={post.coverImage}
                className="object-cover w-full h-full"
                alt={post.title}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <FileIcon className="w-6 h-6" />
              </div>
            )}
          </div>
          <div>
            <div className="font-black text-xl text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1 italic">
              {post.title}
            </div>
            <div className="text-[11px] font-bold text-slate-400 mt-1 flex items-center gap-2 uppercase tracking-tighter">
              <ClockIcon className="w-4 h-4 text-indigo-400" />
              {new Date(post.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
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
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Published
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-500 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest">
            <ClockIcon className="w-4 h-4" /> Local Draft
          </span>
        )}
      </td>
      <td className="p-8 text-right">
        <div className="flex justify-end gap-3">
          <button
            onClick={() => onEdit(post)}
            className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:bg-indigo-600 hover:text-white transition-all active:scale-90 shadow-sm"
          >
            <EditIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(post)}
            className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:bg-red-500 hover:text-white transition-all active:scale-90 shadow-sm"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </td>
    </motion.tr>
  ),
);

PostRow.displayName = "PostRow";
