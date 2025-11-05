import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notepad - Şifre Sıfırla",
  description: "Yeni şifrenizi belirleyin",
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
