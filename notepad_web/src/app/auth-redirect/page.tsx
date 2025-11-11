"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function AuthRedirectContent() {
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(2);
  const redirectTo = searchParams.get("to") || "/login";

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = redirectTo;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [redirectTo]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#101622] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 animate-fade-in">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-blue-600/20 dark:border-blue-400/20 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 animate-spin"></div>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Giriş Yapmanız Gerekiyor
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bu sayfayı görüntülemek için önce giriş yapmalısınız.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300">
          <svg
            className="w-5 h-5 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-lg">
            Giriş ekranına yönlendiriliyorsunuz...{" "}
            <span className="font-bold text-blue-600 dark:text-blue-400 text-2xl">
              {countdown}
            </span>
          </span>
        </div>

        <button
          onClick={() => (window.location.href = redirectTo)}
          className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Hemen Git
        </button>
      </div>
    </div>
  );
}

export default function AuthRedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white dark:bg-[#101622] flex items-center justify-center">
          <div className="text-gray-600 dark:text-gray-400">Yükleniyor...</div>
        </div>
      }
    >
      <AuthRedirectContent />
    </Suspense>
  );
}
