import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteTag, getAllTagsByUser, updateTag } from "../api";
import { Tag } from "../types";

type TagsState = {
    userTags: Tag[];
    error: string | undefined;
    getUserTags: () => Promise<void>;
    deleteUserTag: (tagId: number) => Promise<void>;
    updateTag: (updatedTag: Tag) => void;
}

let token: string | null = null;

(async () => {
  try {
    token = await AsyncStorage.getItem("accessToken");
    if (!token) console.warn("Token bulunamadı");
  } catch (error) {
    console.error("Token alınırken hata oluştu:", error);
  }
})();

export const useTagsStore = create<TagsState>((set, get) => ({
    userTags: [],
    error: undefined,
    

    getUserTags: async () => {
        set({ error: undefined });
        try {
            if (!token) throw new Error("Token bulunamadı");
            const data = await getAllTagsByUser(token);
            set({ userTags: data });
        } catch (error: any) {
            set({ error: error?.message ?? "Etiketler alınamadı" });
        }
    },

    deleteUserTag: async (tagId: number) => {
        const { userTags } = get();
        if (!token) {
            set({ error: "Token bulunamadı" });
            return;
        }
        set({ error: undefined });
        try {
            await deleteTag(token, tagId);
            set({
                userTags: userTags.filter((tag) => tag.id !== tagId),
            });
        } catch (error: any) {
            set({ error: error?.message ?? "Etiket silinemedi" });
        }
    },
    
    updateTag: async (updatedTag: Tag) => {
        const { userTags } = get();
         if (!token) {
            set({ error: "Token bulunamadı" });
            return;
        }
        set({
            userTags: userTags.map((tag) =>
                tag.id === updatedTag.id ? updatedTag : tag
            ),
        });
        await updateTag(token, updatedTag.id, updatedTag.name);
    }
}));