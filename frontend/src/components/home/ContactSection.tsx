"use client";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { FaPaperPlane, FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import api from "@/lib/axios";

export default function ContactSection() {
  const t = useTranslations("Contact");
  const params = useParams();
  const locale = params.locale as string;
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    setStatus("loading");
    try {
      await api.post("/contact", data);

      setStatus("success");
      reset();
      setTimeout(() => setStatus("idle"), 5000);
      toast.success(t("successMessage"));
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("errorMessage"));
      setStatus("idle");
    }
  };

  return (
    <section
      id="contact"
      className="py-24 bg-transparent relative overflow-hidden text-start transition-colors duration-500"
    >
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-sky-50 dark:bg-sky-900/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Left Side: Info */}
          <motion.div
            initial={{ opacity: 0, x: locale === "en" ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-[2px] bg-red-500"></span>
                <span className="text-red-500 font-black text-xs uppercase tracking-widest">
                  {t("badge")}
                </span>
              </div>
              <h2 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter mb-6 leading-tight">
                {t("titleStart")} <br /> {t("titleMiddle")}{" "}
                <span className="text-sky-600 dark:text-sky-400">
                  {t("titleAccent")}
                </span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-md leading-relaxed">
                {t("description")}
              </p>
            </div>

            <div className="space-y-4">
              <a
                href="mailto:sameh.dheir1@gmail.com"
                className="flex items-center gap-4 text-slate-900 dark:text-white font-bold hover:text-sky-600 dark:hover:text-sky-400 transition-colors group rtl:flex-row-reverse rtl:justify-end"
                aria-label="Send me an email at sameh.dheir1@gmail.com"
              >
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center group-hover:bg-sky-50 dark:group-hover:bg-sky-900/50 transition-colors border border-transparent dark:border-slate-800">
                  <FaEnvelope
                    className="text-sky-600 dark:text-sky-400"
                    aria-hidden="true"
                  />
                </div>
                sameh.dheir1@gmail.com
              </a>
              <div className="flex gap-4 pt-4 rtl:justify-start">
                <a
                  href="https://linkedin.com/in/sameh-dheir/"
                  target="_blank"
                  className="w-12 h-12 bg-slate-900 dark:bg-sky-600 text-white rounded-2xl flex items-center justify-center hover:bg-sky-600 dark:hover:bg-sky-500 transition-all shadow-lg dark:shadow-none"
                  aria-label="Visit my LinkedIn profile"
                >
                  <FaLinkedin size={20} aria-hidden="true" />
                </a>
                <a
                  href="https://github.com/SamehDheir"
                  target="_blank"
                  className="w-12 h-12 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl flex items-center justify-center hover:bg-sky-600 dark:hover:bg-slate-700 transition-all shadow-lg dark:shadow-none"
                  aria-label="Visit my GitHub profile"
                >
                  <FaGithub size={20} aria-hidden="true" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, x: locale === "en" ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-50 dark:bg-slate-900 p-8 lg:p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-100/50 dark:shadow-none"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2 rtl:ml-0 rtl:mr-2">
                    {t("labelName")}
                  </label>
                  <input
                    {...register("name", { required: true })}
                    className={`w-full px-6 py-4 bg-white dark:bg-slate-800 border rounded-2xl outline-none focus:border-sky-600 dark:focus:border-sky-400 dark:text-white transition-all font-medium ${errors.name ? "border-red-400" : "border-slate-100 dark:border-slate-700"}`}
                    placeholder={t("placeholderName")}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2 rtl:ml-0 rtl:mr-2">
                    {t("labelEmail")}
                  </label>
                  <input
                    {...register("email", {
                      required: true,
                      pattern: /^\S+@\S+$/i,
                    })}
                    className={`w-full px-6 py-4 bg-white dark:bg-slate-800 border rounded-2xl outline-none focus:border-sky-600 dark:focus:border-sky-400 dark:text-white transition-all font-medium ${errors.email ? "border-red-400" : "border-slate-100 dark:border-slate-700"}`}
                    placeholder="sameh@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2 rtl:ml-0 rtl:mr-2">
                  {t("labelMessage")}
                </label>
                <textarea
                  {...register("message", { required: true })}
                  rows={5}
                  className={`w-full px-6 py-4 bg-white dark:bg-slate-800 border rounded-2xl outline-none focus:border-sky-600 dark:focus:border-sky-400 dark:text-white transition-all font-medium resize-none ${errors.message ? "border-red-400" : "border-slate-100 dark:border-slate-700"}`}
                  placeholder={t("placeholderMessage")}
                />
              </div>
              <button
                disabled={status === "loading"}
                className="w-full py-5 bg-sky-600 text-white rounded-2xl font-black text-lg hover:bg-sky-700 dark:hover:bg-sky-500 hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:bg-slate-300 dark:disabled:bg-slate-800 rtl:flex-row-reverse"
              >
                {status === "loading" ? (
                  t("btnLoading")
                ) : status === "success" ? (
                  t("btnSuccess")
                ) : (
                  <>
                    {t("btnSend")}{" "}
                    <FaPaperPlane
                      size={18}
                      className="rtl:rotate-[-90deg] rtl:-scale-x-100"
                    />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
