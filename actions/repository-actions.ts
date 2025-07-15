"use server"

import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

export interface IRepository {
  id?: string;
  name: string;
  description: string;
  lang: string;
  stars: number;
  forks: number;
  isPinned: boolean;
}

export type IRepositoryLean = IRepository;

export async function addRepository(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const lang = formData.get("lang") as string;
  const stars = Number(formData.get("stars")) || 0;
  const forks = Number(formData.get("forks")) || 0;
  const isPinned = formData.get("isPinned") === "on";

  const repo: IRepository = { name, description, lang, stars, forks, isPinned };
  await addDoc(collection(db, "repositories"), repo);
  return { success: true, message: "Repository added successfully!" };
}

export async function getRepositories(): Promise<IRepositoryLean[]> {
  const querySnapshot = await getDocs(collection(db, "repositories"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IRepositoryLean));
}

export async function updateRepository(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const lang = formData.get("lang") as string;
  const stars = Number(formData.get("stars")) || 0;
  const forks = Number(formData.get("forks")) || 0;
  const isPinned = formData.get("isPinned") === "on";

  const repo: IRepository = { name, description, lang, stars, forks, isPinned };
  await updateDoc(doc(db, "repositories", id), repo);
  return { success: true, message: "Repository updated successfully!" };
}

export async function deleteRepository(id: string) {
  await deleteDoc(doc(db, "repositories", id));
  return { success: true, message: "Repository deleted successfully!" };
}
