"use client";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { FaPaperPlane, FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function ContactSection() {
  const t = useTranslations("Contact");
  const params = useParams();
  const locale = params.locale as string;
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setStatus("loading");
    try {
      await axios.post("http://localhost:3000/api/v1/contact", data);
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
    <section id="contact" className="py-10 bg-white relative overflow-hidden text-start">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-sky-50 rounded-full blur-[120px] -z-10" />
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <motion.div initial={{ opacity: 0, x: locale === 'en' ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-[2px] bg-red-500"></span>
                <span className="text-red-500 font-black text-xs uppercase tracking-widest">{t("badge")}</span>
              </div>
              <h2 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter mb-6">
                {t("titleStart")} <br /> {t("titleMiddle")}{" "}
                <span className="text-sky-600">{t("titleAccent")}</span>
              </h2>
              <p className="text-slate-500 font-medium text-lg max-w-md leading-relaxed">{t("description")}</p>
            </div>
            <div className="space-y-4">
              <a href="mailto:sameh.dheir1@gmail.com" className="flex items-center gap-4 text-slate-900 font-bold hover:text-sky-600 transition-colors group rtl:flex-row-reverse rtl:justify-end">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-sky-50 transition-colors">
                  <FaEnvelope className="text-sky-600" />
                </div>
                sameh.dheir1@gmail.com
              </a>
              <div className="flex gap-4 pt-4 rtl:justify-start">
                <a href="https://linkedin.com/in/sameh-dheir/" target="_blank" className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-sky-600 transition-all"><FaLinkedin size={20} /></a>
                <a href="https://github.com/SamehDheir" target="_blank" className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-sky-600 transition-all"><FaGithub size={20} /></a>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: locale === 'en' ? 30 : -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-slate-50 p-8 lg:p-12 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-100/50">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2 rtl:ml-0 rtl:mr-2">{t("labelName")}</label>
                  <input {...register("name", { required: true })} className={`w-full px-6 py-4 bg-white border rounded-2xl outline-none focus:border-sky-600 transition-all font-medium ${errors.name ? 'border-red-400' : 'border-slate-100'}`} placeholder={t("placeholderName")} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2 rtl:ml-0 rtl:mr-2">{t("labelEmail")}</label>
                  <input {...register("email", { required: true, pattern: /^\S+@\S+$/i })} className={`w-full px-6 py-4 bg-white border rounded-2xl outline-none focus:border-sky-600 transition-all font-medium ${errors.email ? 'border-red-400' : 'border-slate-100'}`} placeholder="sameh@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2 rtl:ml-0 rtl:mr-2">{t("labelMessage")}</label>
                <textarea {...register("message", { required: true })} rows={5} className={`w-full px-6 py-4 bg-white border rounded-2xl outline-none focus:border-sky-600 transition-all font-medium resize-none ${errors.message ? 'border-red-400' : 'border-slate-100'}`} placeholder={t("placeholderMessage")} />
              </div>
              <button disabled={status === "loading"} className="w-full py-5 bg-sky-600 text-white rounded-2xl font-black text-lg hover:bg-sky-700 hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:bg-slate-300 rtl:flex-row-reverse">
                {status === "loading" ? t("btnLoading") : status === "success" ? t("btnSuccess") : <>{t("btnSend")} <FaPaperPlane size={18} className="rtl:rotate-[-90deg] rtl:-scale-x-100" /></>}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}