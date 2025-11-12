import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getNotesServerSide } from "@/lib/api";
import HomePage from "./HomePage";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    redirect("/login");
  }

  let initialNotes = [];
  try {
    initialNotes = await getNotesServerSide(token);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect("/login");
    }
    initialNotes = [];
  }

  return <HomePage initialNotes={initialNotes} />;
}
