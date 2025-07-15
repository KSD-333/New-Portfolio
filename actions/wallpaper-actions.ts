"use server"

import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";

export async function addWallpaper(formData: FormData) {
  const name = formData.get("name") as string;
  const url = formData.get("url") as string;
  const isDefault = formData.get("isDefault") === "on";
  const data = { name, url, isDefault };

  // Only check for duplicates if the url is a normal HTTP(S) URL
  if (url && url.startsWith("http")) {
    const q = query(collection(db, "wallpapers"), where("url", "==", url));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { success: false, message: "A wallpaper with this URL already exists." };
    }
  }

  await addDoc(collection(db, "wallpapers"), data);
  return { success: true, message: "Wallpaper added successfully!" };
}

export async function getWallpapers() {
  const querySnapshot = await getDocs(collection(db, "wallpapers"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function deleteWallpaper(id: string) {
  await deleteDoc(doc(db, "wallpapers", id));
  return { success: true, message: "Wallpaper deleted successfully!" };
}
