"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { authService } from "@/services/auth.service";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.access_token);
      toast.success("Welcome back, Sameh!");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Invalid credentials";
      toast.error(message);
    },
  });

  const onSubmit = (data: LoginInput) => {
    mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-950 px-4 transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 rounded-[2rem] bg-white dark:bg-slate-900 p-10 shadow-xl dark:shadow-2xl border border-slate-100 dark:border-slate-800"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
            Admin<span className="text-sky-600">.Login</span>
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Secure access to your portfolio dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 ml-1">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="admin@sameh-dheir.vercel.app"
                className={`w-full rounded-2xl border bg-slate-50 dark:bg-slate-800/50 px-4 py-3.5 text-sm font-bold transition-all focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-900/30"
                    : "border-slate-200 dark:border-slate-700 dark:text-white focus:border-sky-500 focus:ring-sky-500/10"
                }`}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs font-bold text-red-500 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 ml-1">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className={`w-full rounded-2xl border bg-slate-50 dark:bg-slate-800/50 px-4 py-3.5 text-sm font-bold transition-all focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-900/30"
                    : "border-slate-200 dark:border-slate-700 dark:text-white focus:border-sky-500 focus:ring-sky-500/10"
                }`}
              />
              {errors.password && (
                <p className="mt-1.5 text-xs font-bold text-red-500 ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="group relative w-full overflow-hidden rounded-2xl bg-slate-900 dark:bg-sky-600 py-4 text-sm font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-sky-600 dark:hover:bg-sky-500 disabled:opacity-70"
          >
            <span className="relative z-10">
              {isPending ? "Authenticating..." : "Sign In"}
            </span>
            {isPending && (
              <motion.div
                className="absolute inset-0 bg-sky-500/20"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
