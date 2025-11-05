import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notepad - Yönlendiriliyor",
  description: "Giriş sayfasına yönlendiriliyorsunuz",
};

export default function AuthRedirectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
