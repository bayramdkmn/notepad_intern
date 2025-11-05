"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const router = useRouter();
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");

  const valid = pass1.length >= 8 && pass1 === pass2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || !token) return;
    // Burada backend'e { token, newPassword: pass1 } gönderiniz
    router.replace("/login");
  };

  return (
    <div className="bg-white dark:bg-[#101622] w-full select-none h-screen overflow-auto py-10 flex items-center flex-col gap-10 justify-center text-white relative">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-6 right-6 animate-fade-in">
        <ThemeToggle />
      </div>

      {!token ? (
        <div className="flex w-full max-w-md gap-4 flex-col rounded-xl bg-neutral-800/60 p-6 shadow-lg ring-1 ring-neutral-700 text-center animate-fade-in">
          <span className="font-extrabold text-2xl">Bağlantı Geçersiz</span>
          <p className="text-neutral-300">
            Bağlantı süresi dolmuş olabilir. Lütfen yeniden şifre sıfırlama
            isteyin.
          </p>
          <button
            onClick={() => router.replace("/forgotPassword")}
            className="bg-blue-600 hover:bg-blue-500 rounded-lg p-3 font-semibold"
          >
            Tekrar İste
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-md gap-4 flex-col rounded-xl p-6 shadow-lg ring-1 ring-neutral-700 animate-fade-in"
        >
          <span className="text-center font-extrabold text-2xl">
            Yeni Şifre Belirle
          </span>
          <p className="text-sm text-neutral-300 text-center">
            Güvenlik için bu bağlantı süreli ve tek kullanımlıktır.
          </p>
          <input
            type="password"
            placeholder="Yeni şifre (min 8 karakter)"
            value={pass1}
            onChange={(e) => setPass1(e.target.value)}
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-3 text-white placeholder:text-neutral-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="password"
            placeholder="Yeni şifre tekrar"
            value={pass2}
            onChange={(e) => setPass2(e.target.value)}
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-3 text-white placeholder:text-neutral-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            disabled={!valid}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg w-full text-center p-3 font-semibold"
          >
            Şifreyi Güncelle
          </button>
        </form>
      )}
    </div>
  );
}
