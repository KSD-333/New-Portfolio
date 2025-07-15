"use server"

import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

export interface ISimulatedFile {
  id?: string;
  name: string;
  path: string;
  type: "file" | "folder";
  content?: string;
  url?: string;
}

export async function addSimulatedFile(formData: FormData) {
  const name = formData.get("name") as string;
  const path = formData.get("path") as string;
  const type = formData.get("type") as "file" | "folder";
  const content = formData.get("content") as string;
  const url = formData.get("url") as string;
  const file: ISimulatedFile = { name, path, type };
  if (content) file.content = content;
  if (url) file.url = url;
  await addDoc(collection(db, "simulatedFiles"), file);
  return { success: true, message: "File/Folder added successfully!" };
}

export async function getSimulatedFiles(): Promise<ISimulatedFile[]> {
  const querySnapshot = await getDocs(collection(db, "simulatedFiles"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ISimulatedFile));
}

export async function updateSimulatedFile(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const path = formData.get("path") as string;
  const type = formData.get("type") as "file" | "folder";
  const content = formData.get("content") as string;
  const url = formData.get("url") as string;
  const file: ISimulatedFile = { name, path, type };
  if (content) file.content = content;
  if (url) file.url = url;
  await updateDoc(doc(db, "simulatedFiles", id), file);
  return { success: true, message: "File/Folder updated successfully!" };
}

export async function deleteSimulatedFile(id: string) {
  await deleteDoc(doc(db, "simulatedFiles", id));
  return { success: true, message: "File/Folder deleted successfully!" };
}
