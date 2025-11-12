"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { api } from "@/lib/api";

function ResetPasswordContent() {
  const params = useSearchParams();
  const otp = params.get("otp") || "";
  const router = useRouter();
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const valid = pass1.length >= 8 && pass1 === pass2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || !otp) return;

    setError(null);
    setBusy(true);

    try {
      await api.resetPassword({
        otp: otp,
        new_password: pass1,
        confirm_new_password: pass2,
      });

      setSuccess(true);

      localStorage.removeItem("reset_otp");
      localStorage.removeItem("reset_email");

      setTimeout(() => {
        router.replace("/login");
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Şifre sıfırlama başarısız"
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#101622] w-full select-none h-screen overflow-auto py-10 flex items-center flex-col gap-10 justify-center text-white relative">
      <div className="absolute top-6 right-6 animate-fade-in">
        <ThemeToggle />
      </div>

      {!otp ? (
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
      ) : success ? (
        <div className="flex w-full max-w-md gap-4 flex-col rounded-xl p-6 shadow-lg ring-1 ring-neutral-700 text-center animate-fade-in">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <span className="text-black dark:text-white font-extrabold text-2xl">
            Şifre Başarıyla Sıfırlandı
          </span>
          <p className="text-neutral-600 dark:text-neutral-300">
            Giriş sayfasına yönlendiriliyorsunuz...
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-md gap-4 flex-col rounded-xl p-6 shadow-lg ring-1 ring-neutral-700 animate-fade-in"
        >
          <span className="text-center text-black dark:text-white font-extrabold text-2xl">
            Yeni Şifre Belirle
          </span>
          <p className="text-sm text-slate-600 dark:text-neutral-300 text-center">
            Güvenlik için bu bağlantı süreli ve tek kullanımlıktır.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <input
            type="password"
            placeholder="Yeni şifre (min 8 karakter)"
            value={pass1}
            onChange={(e) => setPass1(e.target.value)}
            className="w-full rounded-md border border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-3  text-black dark:text-white placeholder:text-neutral-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="password"
            placeholder="Yeni şifre tekrar"
            value={pass2}
            onChange={(e) => setPass2(e.target.value)}
            className="w-full rounded-md border border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-3 text-black dark:text-white placeholder:text-neutral-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            disabled={!valid || busy}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg w-full text-center p-3 font-semibold"
          >
            {busy ? "Güncelleniyor..." : "Şifreyi Güncelle"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white dark:bg-[#101622] w-full h-screen flex items-center justify-center">
          <div className="text-gray-600 dark:text-gray-400">Yükleniyor...</div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
