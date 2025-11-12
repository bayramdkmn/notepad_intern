import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTagsServerSide } from "@/lib/api";
import NewNotePage from "./NewNotePage";

export default async function NewNote() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    redirect("/login");
  }

  let initialTags = [];
  try {
    initialTags = await getTagsServerSide(token);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect("/login");
    }
    initialTags = [];
  }

  return <NewNotePage initialTags={initialTags} />;
}
