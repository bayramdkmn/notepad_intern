import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notepad - Ayarlar",
  description: "Uygulama ayarlarınızı yönetin",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
