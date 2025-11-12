import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTagsServerSide, getNotesServerSide } from "@/lib/api";
import TagsPage from "./TagsPage";

export default async function Tags() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    redirect("/login");
  }

  let initialTags = [];
  try {
    initialTags = await getTagsServerSide(token);

    const notes = await getNotesServerSide(token);
    initialTags = initialTags.map((tag: any) => ({
      ...tag,
      notes_count: notes.filter((note: any) =>
        note.tags?.some((t: any) => t.id === tag.id)
      ).length,
    }));
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect("/login");
    }
    initialTags = [];
  }

  return <TagsPage initialTags={initialTags} />;
}
