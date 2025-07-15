"use server"

import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

export async function addContactSubmission(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;
  const data = { name, email, message };
  await addDoc(collection(db, "contactSubmissions"), data);
  return { success: true, message: "Message sent successfully!" };
}

export async function getContactSubmissions() {
  const querySnapshot = await getDocs(collection(db, "contactSubmissions"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function deleteContactSubmission(id: string) {
  await deleteDoc(doc(db, "contactSubmissions", id));
  return { success: true, message: "Submission deleted successfully!" };
}
