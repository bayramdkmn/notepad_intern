import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notepad - Giriş Yap",
  description: "Notepad hesabınıza giriş yapın",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
