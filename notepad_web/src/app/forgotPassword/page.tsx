"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";

function CircularTimer({ seconds, total }: { seconds: number; total: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, seconds / total));
  const dash = useMemo(
    () => circumference * progress,
    [circumference, progress]
  );
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" className="shrink-0">
      <circle
        cx="22"
        cy="22"
        r={radius}
        className="fill-none stroke-neutral-700"
        strokeWidth="6"
      />
      <circle
        cx="22"
        cy="22"
        r={radius}
        className="fill-none stroke-blue-500 transition-[stroke-dasharray] duration-300 ease-linear"
        strokeWidth="6"
        strokeDasharray={`${dash} ${circumference}`}
        transform="rotate(-90 22 22)"
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="fill-black dark:fill-white text-[10px]"
      >
        {seconds}s
      </text>
    </svg>
  );
}

function isValidEmail(email: string) {
  return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"request" | "verify">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [serverCode, setServerCode] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const busy = false;

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSeconds(60);
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
    },
    []
  );

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) return;
    // Simülasyon: backend bir kod gönderdi
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setServerCode(generated);
    const token = (
      Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
    ).slice(0, 48);
    setResetToken(token);
    // Geliştirici görünürlüğü için
    try {
      console.log("Şifre sıfırlama kodu:", generated, "resetToken:", token);
    } catch {}
    setStep("verify");
    startTimer();
  };

  const handleResend = () => {
    if (!isValidEmail(email)) return;
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setServerCode(generated);
    const token = (
      Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
    ).slice(0, 48);
    setResetToken(token);
    try {
      console.log("Yeniden gönderilen kod:", generated, "resetToken:", token);
    } catch {}
    startTimer();
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length < 4) return;
    if (serverCode && code.trim() === serverCode) {
      if (resetToken) {
        router.push(`/reset-password?token=${encodeURIComponent(resetToken)}`);
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center flex-col gap-10 justify-center select-none bg-white dark:bg-[#101622] text-white relative">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-6 right-6 animate-fade-in">
        <ThemeToggle />
      </div>

      {step === "request" && (
        <form
          onSubmit={handleRequest}
          className="flex w-full max-w-md gap-4 flex-col rounded-xl  p-6 shadow-lg ring-1 ring-neutral-700 animate-fade-in"
        >
          <span className="text-black dark:text-white text-center font-extrabold text-2xl">
            Şifrenizi Sıfırlayın
          </span>
          <div className="flex w-full flex-col gap-2">
            <label className="text-black dark:text-neutral-300">
              E-posta Adresi
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta adresinizi girin"
              className="w-full rounded-md border border-neutral-700 bg-white text-black dark:text-gray-400 dark:bg-neutral-900 px-3 py-3 dark:placeholder:text-neutral-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={!isValidEmail(email) || busy}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg w-full text-center p-3 font-semibold"
          >
            Kodu Gönder
          </button>
        </form>
      )}

      {step === "verify" && (
        <form
          onSubmit={handleVerify}
          className="flex w-full max-w-md gap-4 flex-col rounded-xl p-6 shadow-lg ring-1 ring-neutral-700 animate-fade-in"
        >
          <span className="text-black dark:text-white text-center font-extrabold text-xl">
            E-posta Doğrulama
          </span>
          <p className="text-sm text-neutral-600 dark:text-neutral-300  text-center">
            {email} adresine gönderilen 6 haneli kodu girin.
          </p>
          <div className="flex items-center justify-between gap-4">
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="flex-1 rounded-md border border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-3 text-black dark:text-[#92a4c9] placeholder:text-neutral-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none tracking-widest text-center"
            />
            <CircularTimer seconds={seconds} total={60} />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={code.length !== 6}
              className="bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg w-full text-center p-3 font-semibold"
            >
              Doğrula
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={seconds > 0}
              className={`${
                seconds > 0
                  ? "border border-neutral-500 text-neutral-400 bg-transparent cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              } transition-colors rounded-lg px-4`}
            >
              {seconds > 0 ? `Yeniden Gönder (${seconds}s)` : "Yeniden Gönder"}
            </button>
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() =>
                resetToken &&
                router.push(
                  `/reset-password?token=${encodeURIComponent(resetToken)}`
                )
              }
              className="text-xs text-neutral-300 hover:text-white underline underline-offset-4"
            >
              Demo: Şifre ekranına geç
            </button>
          </div>
        </form>
      )}
      <Link href={"/login"}>Giriş Yap</Link>
    </div>
  );
}
