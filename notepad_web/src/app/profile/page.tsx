"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import Sidebar from "@/components/dashboard/Sidebar";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LockIcon from "@mui/icons-material/Lock";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import SaveIcon from "@mui/icons-material/Save";
import VpnKeyIcon from "@mui/icons-material/VpnKey";

export default function ProfilePage() {
  const { user, logout, updateUser, changePassword, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // User yüklendiğinde form data'yı güncelle
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name?.split(" ")[0] || "",
        surname: user.name?.split(" ").slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phone || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [user]);

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

  const handleSave = async () => {
    // Form validation
    if (!formData.name.trim()) {
      alert("Lütfen adınızı girin!");
      return;
    }
    if (!formData.surname.trim()) {
      alert("Lütfen soyadınızı girin!");
      return;
    }

    // Telefon validasyonu
    if (
      formData.phone &&
      formData.phone.length > 0 &&
      formData.phone.length < 10
    ) {
      alert("Telefon numarası en az 10 haneli olmalıdır!");
      return;
    }

    try {
      setIsSaving(true);
      await updateUser({
        firstName: formData.name,
        lastName: formData.surname,
        phone: formData.phone || "",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update failed:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Profil güncellenirken bir hata oluştu"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    // Şifre validasyonu
    if (!formData.currentPassword) {
      alert("Lütfen mevcut şifrenizi girin!");
      return;
    }
    if (formData.newPassword.length < 6) {
      alert("Yeni şifre en az 6 karakter olmalıdır!");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Yeni şifreler eşleşmiyor!");
      return;
    }

    try {
      setIsSaving(true);
      await changePassword(formData.currentPassword, formData.newPassword);
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsPasswordChangeOpen(false);
      alert("Şifreniz başarıyla değiştirildi!");
    } catch (error) {
      console.error("Password change failed:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Şifre değiştirilirken bir hata oluştu"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name?.split(" ")[0] || "",
      surname: user?.name?.split(" ").slice(1).join(" ") || "",
      email: user?.email || "",
      phone: user?.phone || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsEditing(false);
  };

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8 animate-fade-in">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 animate-slide-in-top">
            <h1 className="text-gray-900 text-3xl font-bold tracking-tight dark:text-white">
              Profil Ayarları
            </h1>
            <p className="text-gray-600 text-base mt-2 dark:text-gray-400">
              Hesap bilgilerinizi görüntüleyin ve düzenleyin
            </p>
          </div>

          <div className="bg-white dark:bg-[#1A1A1A] rounded-xl shadow-sm border border-gray-200 dark:border-[#2A2A2A] p-8 animate-scale-in">
            <div className="flex items-center gap-6 pb-8 border-b border-gray-200 dark:border-[#2A2A2A] animate-slide-in-left">
              {!user || isLoading ? (
                <>
                  <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse" />
                  <div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-48 animate-pulse mb-2" />
                    <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-64 animate-pulse" />
                  </div>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl">
                    {user.name
                      .split(" ")
                      .map((n) => n.charAt(0))
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Form Section */}
            {!user || isLoading ? (
              <div className="mt-8 space-y-6">
                {/* Skeleton loaders for form fields */}
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-2 animate-pulse" />
                    <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded w-full animate-pulse" />
                  </div>
                ))}
                <div className="flex gap-3 pt-6">
                  <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded w-40 animate-pulse" />
                  <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded w-40 animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="mt-8 space-y-6 stagger-children">
                {/* Ad */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <PersonIcon fontSize="small" />
                    Ad
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-[#1A1A1A] disabled:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                  />
                </div>

                {/* Soyad */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <PersonIcon fontSize="small" />
                    Soyad
                  </label>
                  <input
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-[#1A1A1A] disabled:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <EmailIcon fontSize="small" />
                    E-posta Adresi
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={true}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-[#1A1A1A] disabled:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                  />
                </div>

                {/* Telefon */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <PhoneIcon fontSize="small" />
                    Telefon Numarası
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="5xxxxxxxxx"
                    maxLength={11}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-[#1A1A1A] disabled:text-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                  />
                  {isEditing && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Sadece rakam giriniz (Örn: 5551234567) - En az 10, en
                      fazla 11 hane
                    </p>
                  )}
                </div>

                {/* Şifre Değiştir Modal */}
                {isPasswordChangeOpen && (
                  <div className="pt-6 border-t border-gray-200 dark:border-[#2A2A2A] space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <LockIcon fontSize="small" />
                      Şifre Değiştir
                    </h3>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Mevcut Şifre
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="Mevcut şifrenizi girin"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Yeni Şifre
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Yeni şifrenizi girin"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Yeni Şifre (Tekrar)
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Yeni şifrenizi tekrar girin"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-6">
                  {!isEditing && !isPasswordChangeOpen ? (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <PersonIcon fontSize="small" />
                        Profili Düzenle
                      </button>
                      <button
                        onClick={() => setIsPasswordChangeOpen(true)}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <VpnKeyIcon fontSize="small" />
                        Şifre Değiştir
                      </button>
                    </>
                  ) : isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <SaveIcon fontSize="small" />
                        {isSaving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                      >
                        İptal
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handlePasswordChange}
                        disabled={isSaving}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <SaveIcon fontSize="small" />
                        {isSaving ? "Kaydediliyor..." : "Şifreyi Kaydet"}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        İptal
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Logout Button at Bottom */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-[#2A2A2A]">
              <button
                onClick={logout}
                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <LogoutIcon fontSize="small" />
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
