import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notepad - Şifremi Unuttum",
  description: "Notepad şifrenizi sıfırlayın",
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
