import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserServerSide } from "@/lib/api";
import ProfilePage from "./ProfilePage";

export default async function Profile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  // Token yoksa login'e yönlendir
  if (!token) {
    redirect("/login");
  }

  // Kullanıcı bilgilerini sunucu tarafında çek
  let initialUser = null;
  try {
    initialUser = await getUserServerSide(token);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect("/login");
    }
  }

  return <ProfilePage initialUser={initialUser} />;
}
