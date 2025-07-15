"use server"

import { db } from "@/lib/firebase";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";

export interface IUserProfile {
  id?: string;
  about: {
    name: string;
    tagline: string;
    location: string;
    experience: string;
    specialization: string;
    passion: string;
    education: string;
    certifications: string;
    philosophy: string;
  };
  linkedin: {
    name: string;
    tagline: string;
    connections: string;
    about: string;
    experience: Array<{
      title: string;
      company: string;
      duration: string;
      description: string;
    }>;
    skills: string[];
    education: {
      institution: string;
      degree: string;
      duration: string;
    };
  };
  resume: {
    title: string;
    sections: Array<{
      heading: string;
      content: string;
    }>;
  };
}

// Get the single user profile (assume only one exists)
export async function getUserProfile(): Promise<IUserProfile | null> {
  const querySnapshot = await getDocs(collection(db, "userProfiles"));
  if (querySnapshot.empty) return null;
  const docSnap = querySnapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as IUserProfile;
}

// Update or create the single user profile
type ProfileFormData = FormData;
export async function updateUserProfile(formData: ProfileFormData) {
  // Extract About section
  const about = {
    name: formData.get("aboutName") as string,
    tagline: formData.get("aboutTagline") as string,
    location: formData.get("aboutLocation") as string,
    experience: formData.get("aboutExperience") as string,
    specialization: formData.get("aboutSpecialization") as string,
    passion: formData.get("aboutPassion") as string,
    education: formData.get("aboutEducation") as string,
    certifications: formData.get("aboutCertifications") as string,
    philosophy: formData.get("aboutPhilosophy") as string,
  };

  // LinkedIn section
  const linkedin = {
    name: formData.get("linkedinName") as string,
    tagline: formData.get("linkedinTagline") as string,
    connections: formData.get("linkedinConnections") as string,
    about: formData.get("linkedinAbout") as string,
    experience: [] as Array<{ title: string; company: string; duration: string; description: string }>,
    skills: (formData.get("linkedinSkills") as string)?.split(",").map(s => s.trim()).filter(Boolean) || [],
    education: {
      institution: formData.get("linkedinEducationInstitution") as string,
      degree: formData.get("linkedinEducationDegree") as string,
      duration: formData.get("linkedinEducationDuration") as string,
    },
  };
  // Parse LinkedIn experience
  let expIndex = 0;
  while (formData.has(`linkedinExpTitle_${expIndex}`)) {
    linkedin.experience.push({
      title: formData.get(`linkedinExpTitle_${expIndex}`) as string,
      company: formData.get(`linkedinExpCompany_${expIndex}`) as string,
      duration: formData.get(`linkedinExpDuration_${expIndex}`) as string,
      description: formData.get(`linkedinExpDescription_${expIndex}`) as string,
    });
    expIndex++;
  }

  // Resume section
  const resume = {
    title: formData.get("resumeTitle") as string,
    sections: [] as Array<{ heading: string; content: string }>,
  };
  let sectionIndex = 0;
  while (formData.has(`resumeSectionHeading_${sectionIndex}`)) {
    resume.sections.push({
      heading: formData.get(`resumeSectionHeading_${sectionIndex}`) as string,
      content: formData.get(`resumeSectionContent_${sectionIndex}`) as string,
    });
    sectionIndex++;
  }

  // Save to Firestore (always use the same doc id, e.g. 'main')
  const profile: IUserProfile = { about, linkedin, resume };
  await setDoc(doc(db, "userProfiles", "main"), profile);
  return { success: true, message: "Profile updated successfully!" };
}
