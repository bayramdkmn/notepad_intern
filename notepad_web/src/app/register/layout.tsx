import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notepad - Kayıt Ol",
  description: "Notepad'e yeni hesap oluşturun",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
