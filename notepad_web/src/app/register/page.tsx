"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Telefon numarası için sadece rakam kontrolü
    if (name === "phone") {
      const numbersOnly = value.replace(/[^0-9]/g, "");
      setFormData({
        ...formData,
        [name]: numbersOnly,
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateStep = () => {
    if (step === 1) {
      if (formData.name.trim() === "" || formData.surname.trim() === "") {
        alert("Lütfen ad ve soyad alanlarını doldurun!");
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (formData.email.trim() === "") {
        alert("Lütfen e-posta adresinizi girin!");
        return false;
      }
      if (!validateEmail(formData.email)) {
        alert("Lütfen geçerli bir e-posta adresi girin!");
        return false;
      }
      if (formData.phone.trim() === "") {
        alert("Lütfen telefon numaranızı girin!");
        return false;
      }
      if (formData.phone.length < 10) {
        alert("Telefon numarası en az 10 haneli olmalıdır!");
        return false;
      }
      return true;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Burada API çağrısı yapılacak
  };

  const steps = [
    { number: 1, title: "Kişisel Bilgiler" },
    { number: 2, title: "İletişim Bilgileri" },
    { number: 3, title: "Hesap Bilgileri" },
  ];

  return (
    <div className="bg-white dark:bg-[#101622] w-full select-none h-screen overflow-auto py-10 flex items-center flex-col gap-10 justify-center relative">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center gap-2 text-center text-white">
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
        className="flex w-full max-w-2xl gap-6 flex-col rounded-xl bg-surface-dark/50 p-8 shadow-lg ring-1 ring-border-dark/50"
      >
        <span className="text-black dark:text-white text-center font-extrabold text-2xl">
          Hesap Oluştur
        </span>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {steps.map((s, index) => (
            <div key={s.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8  rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    step >= s.number
                      ? "bg-blue-600 text-white"
                      : "dark:bg-gray-700 bg-neutral-200 text-gray-400"
                  }`}
                >
                  {s.number}
                </div>
                <span
                  className={`text-[10px] mt-1 text-center whitespace-nowrap transition-all ${
                    step >= s.number ? "text-blue-400" : "text-gray-500"
                  }`}
                >
                  {s.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-[2px] w-16 mx-2 transition-all ${
                    step > s.number ? "bg-blue-600" : "bg-gray-700"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Kişisel Bilgiler */}
        {step === 1 && (
          <div className="gap-5 flex flex-col">
            <div>
              <label className="text-black dark:text-white font-medium">
                Ad
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-border-dark bg-transparent px-3 py-4 text-black dark:text-white placeholder:text-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none"
                type="text"
                placeholder="Adınızı girin"
                required
              />
            </div>
            <div>
              <label className="text-black dark:text-white font-medium">
                Soyad
              </label>
              <input
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-border-dark bg-transparent px-3 py-4 text-black dark:text-white placeholder:text-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none"
                type="text"
                placeholder="Soyadınızı girin"
                required
              />
            </div>
          </div>
        )}

        {/* Step 2: İletişim Bilgileri */}
        {step === 2 && (
          <div className="gap-5 flex flex-col">
            <div>
              <label className="text-white font-medium">E-posta</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-border-dark bg-transparent px-3 py-4 text-black dark:text-white placeholder:text-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none"
                type="email"
                placeholder="E-posta adresinizi girin"
                required
              />
            </div>
            <div>
              <label className="text-white font-medium">Telefon No</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-border-dark bg-transparent px-3 py-4 text-black dark:text-white placeholder:text-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none"
                type="text"
                placeholder="5xxxxxxxxx"
                maxLength={11}
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Sadece rakam giriniz (Örn: 5551234567)
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Hesap Bilgileri */}
        {step === 3 && (
          <div className="gap-5 flex flex-col">
            <div>
              <label className="text-white font-medium">Kullanıcı Adı</label>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-border-dark bg-transparent px-3 py-4 text-black dark:text-white placeholder:text-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none"
                type="text"
                placeholder="Kullanıcı adınızı girin"
                required
              />
            </div>
            <div>
              <label className="text-white font-medium">Şifre</label>
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-border-dark bg-transparent px-3 py-4 text-black dark:text-white placeholder:text-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none"
                type="password"
                placeholder="Şifrenizi girin"
                required
              />
            </div>
            <div>
              <label className="text-white font-medium">Şifre Tekrar</label>
              <input
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-border-dark bg-transparent px-3 py-4 text-black dark:text-white placeholder:text-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none"
                type="password"
                placeholder="Şifrenizi tekrar girin"
                required
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 rounded-md bg-neutral-500 dark:bg-gray-700 text-white hover:bg-gray-600 transition-colors"
            >
              Geri
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors ml-auto"
            >
              İleri
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-3 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors ml-auto"
            >
              Hesap Oluştur
            </button>
          )}
        </div>
      </form>
      <div className="text-[#92a4c9]">
        Hesabınız var mı?
        <Link
          className="ml-2 underline text-blue-500 hover:text-blue-400 cursor-pointer transition-colors"
          href={"/login"}
        >
          Giriş Yap
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
