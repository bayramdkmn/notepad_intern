"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/providers/AuthProvider";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { email: "", password: "" };

    if (!email.trim()) {
      newErrors.email = "E-posta adresi gereklidir";
    } else if (!validateEmail(email)) {
      newErrors.email = "Geçerli bir e-posta adresi girin";
    }

    if (!password) {
      newErrors.password = "Şifre gereklidir";
    } else if (password.length < 6) {
      newErrors.password = "Şifre en az 6 karakter olmalıdır";
    }

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      setIsSubmitting(true);
      try {
        await login(email, password);
      } catch (error) {
        setErrors({
          ...errors,
          password: "Giriş başarısız. Bilgilerinizi kontrol edin.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-[#101622] w-full h-screen flex items-center flex-col gap-10 justify-center relative animate-fade-in">
      <div className="absolute top-6 right-6 animate-scale-in">
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center gap-2 text-center text-white animate-slide-in-top">
        <svg
          className="h-10 w-10 text-blue-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
        <p className="text-xl font-semibold text-black dark:text-white">
          AI Not Yönetim Sistemi
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex w-1/2 gap-4 flex-col rounded-xl bg-surface-dark/50 p-8 shadow-lg ring-1 ring-border-dark/50 animate-scale-in stagger-children"
      >
        <span className="text-black dark:text-white text-center font-extrabold text-2xl">
          Hesabınıza Giriş Yapın
        </span>

        <div className="flex w-full px-3 flex-col gap-2">
          <span className="text-black dark:text-white">E-posta Adresi</span>
          <div className="px-1 w-full">
            <input
              className={`rounded-md border border-[#92a4c9] placeholder:text-[#92a4c9] text-[#92a4c9] ${
                errors.email ? "border-red-500" : "border-border-dark"
              } w-full bg-transparent px-3 py-4 text-black dark:text-white placeholder:text-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none`}
              type="email"
              placeholder="E-posta adresinizi girin"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 px-1">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="flex w-full px-3 flex-col gap-2">
          <span className="text-black dark:text-white">Şifre</span>
          <div className="px-1 w-full relative">
            <input
              className={`rounded-md border border-[#92a4c9] placeholder:text-[#92a4c9] text-[#92a4c9] ${
                errors.password ? "border-red-500" : "border-border-dark"
              } w-full bg-transparent px-3 py-4 pr-12 text-black dark:text-white placeholder:text-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none`}
              type={showPassword ? "text" : "password"}
              placeholder="Şifrenizi girin"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
        </div>

        <Link
          href="/forgotPassword"
          className="w-full text-[#92a4c9] underline cursor-pointer px-4 text-end hover:text-blue-400 transition-colors"
        >
          Şifrenizi mi unuttunuz?
        </Link>

        <div className="flex w-full justify-center py-3 px-5 text-white font-bold text-xl">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:scale-95 disabled:opacity-50 disabled:cursor-not-allowed duration-200 transition-all rounded-xl w-full text-center p-3"
          >
            {isSubmitting ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </div>
      </form>
      <div className="text-[#92a4c9]">
        Hesabın yok mu?
        <Link
          href="/register"
          className="ml-2 underline text-blue-500 hover:text-blue-400 cursor-pointer transition-colors"
        >
          Kayıt Ol
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
