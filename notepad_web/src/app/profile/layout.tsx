import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notepad - Profil",
  description: "Profil bilgilerinizi görüntüleyin ve düzenleyin",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
