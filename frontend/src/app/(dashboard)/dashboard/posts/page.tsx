"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePosts } from "@/hooks/usePosts";
import { PostRow } from "@/components/dashboard/posts/PostRow";
import {
  SearchIcon,
  PenIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LoadingIcon,
  FeedIcon,
} from "@/components/Icons";

// Lazy load modals for better performance
const PostModal = lazy(() =>
  import("@/components/dashboard/posts/PostModal").then((mod) => ({
    default: mod.PostModal,
  })),
);
const DeleteModal = lazy(() =>
  import("@/components/dashboard/posts/DeleteModal").then((mod) => ({
    default: mod.DeleteModal,
  })),
);

export default function PostsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<any>(null);

  // --- Pagination States ---
  const [page, setPage] = useState(1);
  const limit = 8;

  // Search Debounce Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // --- Fetching Data (Updated to include search and page) ---
  const {
    data: response,
    isLoading,
    isPlaceholderData,
  } = usePosts({
    publishedOnly: false,
    page,
    limit,
    search: debouncedSearch,
  });

  const posts = response?.data || [];
  const meta = response?.meta;

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const openEdit = (post: any) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    closeModal();
  };

  const handleDeleteSuccess = () => {
    setIsDeleteModalOpen(false);
    setPostToDelete(null);
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <LoadingIcon className="animate-spin text-indigo-600 dark:text-sky-500 mb-4 mx-auto w-12 h-12" />
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
            <FeedIcon className="text-indigo-600 dark:text-sky-400 w-12 h-12" />
            Content Lab
          </h1>
          <p className="text-slate-400 dark:text-slate-500 font-bold ml-1 uppercase tracking-[0.2em] text-xs mt-2">
            Professional Knowledge Base & Tech Insights
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          <div className="relative w-full sm:w-80 group">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 w-4 h-4" />
            <input
              type="text"
              placeholder="Search architecture..."
              value={searchQuery}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-4 ring-indigo-50 dark:ring-sky-900/20 outline-none font-bold text-slate-700 dark:text-slate-200 transition-all"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setSelectedPost(null);
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-5 text-sm rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 group"
          >
            <PenIcon className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform w-5 h-5" />
            <span>Write Article</span>
          </button>
        </div>
      </header>

      {/* Table Section */}
      <div
        className={`bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden transition-opacity ${isPlaceholderData ? "opacity-50" : "opacity-100"}`}
      >
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
              <AnimatePresence mode="popLayout">
                {posts.map((post: any) => (
                  <PostRow
                    key={post.id}
                    post={post}
                    onEdit={openEdit}
                    onDelete={(post) => {
                      setPostToDelete(post);
                      setIsDeleteModalOpen(true);
                    }}
                  />
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* --- Empty State --- */}
        {!isLoading && posts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-xl font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest italic">
              No Articles Found in Lab
            </p>
          </div>
        )}
      </div>

      {/* --- Dashboard Pagination --- */}
      {meta && meta.lastPage > 1 && (
        <div className="flex justify-center items-center gap-3 mt-12">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 disabled:opacity-20 transition-all hover:border-indigo-500"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>

          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-200/50 dark:bg-slate-800 px-4 py-2 rounded-xl">
            Page {page} / {meta.lastPage}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(meta.lastPage, p + 1))}
            disabled={page === meta.lastPage}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 disabled:opacity-20 transition-all hover:border-indigo-500"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Lazy-loaded Post Modal */}
      {isModalOpen && (
        <Suspense fallback={null}>
          <PostModal
            isOpen={isModalOpen}
            selectedPost={selectedPost}
            onClose={closeModal}
            onSuccess={handleModalSuccess}
          />
        </Suspense>
      )}

      {/* Lazy-loaded Delete Modal */}
      {isDeleteModalOpen && (
        <Suspense fallback={null}>
          <DeleteModal
            isOpen={isDeleteModalOpen}
            post={postToDelete}
            onClose={() => setIsDeleteModalOpen(false)}
            onSuccess={handleDeleteSuccess}
          />
        </Suspense>
      )}
    </div>
  );
}
