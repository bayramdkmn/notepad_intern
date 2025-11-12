import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notepad - Etiketler",
  description: "Notlarınızı etiketlerle organize edin",
};

export default function TagsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
