"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import { onAuthStateChanged, setPersistence, inMemoryPersistence } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  XCircle,
  Folder,
  FileText,
  ImageIcon,
  Link,
  User,
  Briefcase,
  BookOpen,
} from "lucide-react"
import { addRepository, getRepositories, updateRepository, deleteRepository } from "@/actions/repository-actions"
import { getContactSubmissions, deleteContactSubmission } from "@/actions/contact-actions"
import { addWallpaper, getWallpapers, deleteWallpaper } from "@/actions/wallpaper-actions"
import {
  addSimulatedFile,
  getSimulatedFiles,
  updateSimulatedFile,
  deleteSimulatedFile,
} from "@/actions/simulated-file-actions"
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
interface IContactSubmission {
  id?: string;
  name: string;
  email: string;
  message: string;
  timestamp?: string;
}
interface IWallpaper {
  id?: string;
  name: string;
  url: string;
  isDefault: boolean;
}
interface ISimulatedFile {
  id?: string;
  name: string;
  path: string;
  type: "file" | "folder";
  content?: string;
  url?: string;
}
// Define ISimulatedFileLean for lean queries
interface ISimulatedFileLean {
  id: string;
  name: string;
  path: string;
  type: "file" | "folder";
  content?: string;
  url?: string;
}

interface IRepository {
  id?: string;
  name: string;
  description: string;
  link?: string;
}
type IRepositoryLean = IRepository;

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("repositories")
  const [formMessage, setFormMessage] = useState<string | null>(null)

  // State for Repositories
  const [repositories, setRepositories] = useState<Array<IRepositoryLean>>([])
  const [editingRepo, setEditingRepo] = useState<IRepositoryLean | null>(null)
  const [repoLoading, setRepoLoading] = useState(true)
  const [repoError, setRepoError] = useState<string | null>(null)

  // State for Contact Submissions
  const [submissions, setSubmissions] = useState<Array<IContactSubmission>>([])
  const [submissionLoading, setSubmissionLoading] = useState(true)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  // State for Wallpapers
  const [wallpapers, setWallpapers] = useState<Array<IWallpaper>>([])
  const [wallpaperLoading, setWallpaperLoading] = useState(true)
  const [wallpaperError, setWallpaperError] = useState<string | null>(null)

  // State for Simulated Files
  const [simulatedFiles, setSimulatedFiles] = useState<Array<ISimulatedFile>>([])
  const [editingFile, setEditingFile] = useState<ISimulatedFile | null>(null)
  const [fileLoading, setFileLoading] = useState(true)
  const [fileError, setFileError] = useState<string | null>(null)

  // Add new state and handlers for Projects, Work, Skills & Tech, and About Me/Resume
  // Add new SidebarTab entries for these sections
  // Add new tab content sections for each, with forms and lists for add/update/remove
  // Prepare the UI and state for Firestore integration

  // --- Repository Management ---
  const fetchRepositories = async () => {
    setRepoLoading(true)
    setRepoError(null)
    try {
      const data = await getRepositories()
      setRepositories(data)
    } catch (err: any) {
      setRepoError(err.message || "Failed to fetch repositories.")
    } finally {
      setRepoLoading(false)
    }
  }

  const handleRepoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormMessage(null)
    const formData = new FormData(e.currentTarget)

    let result
    if (editingRepo) {
      result = await updateRepository(editingRepo.id, formData)
    } else {
      result = await addRepository(formData)
    }

    if (result.success) {
      setFormMessage(result.message)
      e.currentTarget.reset()
      setEditingRepo(null)
      fetchRepositories()
    } else {
      setFormMessage(`Error: ${result.message}`)
    }
    setTimeout(() => setFormMessage(null), 3000)
  }

  const handleRepoDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this repository?")) {
      setFormMessage(null)
      const result = await deleteRepository(id)
      if (result.success) {
        setFormMessage(result.message)
        fetchRepositories()
      } else {
        setFormMessage(`Error: ${result.message}`)
      }
      setTimeout(() => setFormMessage(null), 3000)
    }
  }

  const handleRepoEdit = (repo: IRepositoryLean) => {
    setEditingRepo(repo)
    setFormMessage(null)
  }

  const handleRepoCancelEdit = () => {
    setEditingRepo(null)
    setFormMessage(null)
  }

  // --- Contact Submission Management ---
  const fetchContactSubmissions = async () => {
    setSubmissionLoading(true)
    setSubmissionError(null)
    try {
      const data = await getContactSubmissions()
      setSubmissions(data.map((sub: any) => ({
        id: sub.id?.toString() ?? "",
        name: sub.name ?? "",
        email: sub.email ?? "",
        message: sub.message ?? "",
        timestamp: sub.timestamp ?? "",
      })))
    } catch (err: any) {
      setSubmissionError(err.message || "Failed to fetch submissions.")
    } finally {
      setSubmissionLoading(false)
    }
  }

  const handleSubmissionDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this contact submission?")) {
      setFormMessage(null)
      const result = await deleteContactSubmission(id)
      if (result.success) {
        setFormMessage(result.message)
        fetchContactSubmissions()
      } else {
        setFormMessage(`Error: ${result.message}`)
      }
      setTimeout(() => setFormMessage(null), 3000)
    }
  }

  // --- Wallpaper Management ---
  const fetchWallpapers = async () => {
    setWallpaperLoading(true)
    setWallpaperError(null)
    try {
      const data = await getWallpapers()
      setWallpapers(data.map((wall: any) => ({
        id: wall.id?.toString() ?? "",
        name: wall.name ?? "",
        url: wall.url ?? "",
        isDefault: wall.isDefault ?? false,
      })))
    } catch (err: any) {
      setWallpaperError(err.message || "Failed to fetch wallpapers.")
    } finally {
      setWallpaperLoading(false)
    }
  }

  const handleWallpaperSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormMessage(null);
    const formData = new FormData(e.currentTarget);

    let url = formData.get("url") as string;
    const file = (formData.get("file") as File) || null;

    // If a file is uploaded, upload it to Firebase Storage
    if (file && file.size > 0) {
      const storage = getStorage();
      const fileRef = storageRef(storage, `wallpapers/${file.name}-${Date.now()}`);
      await uploadBytes(fileRef, file);
      url = await getDownloadURL(fileRef);
    }

    // Now use the url (from input or uploaded file)
    // Create a new FormData to send only the required fields
    const newFormData = new FormData();
    newFormData.set("name", formData.get("name") as string);
    newFormData.set("url", url);
    newFormData.set("isDefault", formData.get("isDefault") as string);

    const result = await addWallpaper(newFormData);

    if (result.success) {
      setFormMessage(result.message);
      e.currentTarget.reset();
      fetchWallpapers();
    } else {
      setFormMessage(`Error: ${result.message}`);
    }
    setTimeout(() => setFormMessage(null), 3000);
  };

  const handleWallpaperDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this wallpaper?")) {
      setFormMessage(null)
      const result = await deleteWallpaper(id)
      if (result.success) {
        setFormMessage(result.message)
        fetchWallpapers()
      } else {
        setFormMessage(`Error: ${result.message}`)
      }
      setTimeout(() => setFormMessage(null), 3000)
    }
  }

  // --- Simulated File Management ---
  const fetchSimulatedFiles = async () => {
    setFileLoading(true)
    setFileError(null)
    try {
      const data = await getSimulatedFiles() // Fetch all files for now
      setSimulatedFiles(data.map((file: any) => ({
        id: file.id?.toString() ?? "",
        name: file.name ?? "",
        path: file.path ?? "",
        type: file.type ?? "file",
        content: file.content ?? "",
        url: file.url ?? "",
      })))
    } catch (err: any) {
      setFileError(err.message || "Failed to fetch simulated files.")
    } finally {
      setFileLoading(false)
    }
  }

  const handleFileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormMessage(null)
    const formData = new FormData(e.currentTarget)

    let result
    if (editingFile) {
      result = await updateSimulatedFile(editingFile.id, formData)
    } else {
      result = await addSimulatedFile(formData)
    }

    if (result.success) {
      setFormMessage(result.message)
      e.currentTarget.reset()
      setEditingFile(null)
      fetchSimulatedFiles()
    } else {
      setFormMessage(`Error: ${result.message}`)
    }
    setTimeout(() => setFormMessage(null), 3000)
  }

  const handleFileDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this file/folder?")) {
      setFormMessage(null)
      const result = await deleteSimulatedFile(id)
      if (result.success) {
        setFormMessage(result.message)
        fetchSimulatedFiles()
      } else {
        setFormMessage(`Error: ${result.message}`)
      }
      setTimeout(() => setFormMessage(null), 3000)
    }
  }

  const handleFileEdit = (file: ISimulatedFile) => {
    setEditingFile(file)
    setFormMessage(null)
  }

  const handleFileCancelEdit = () => {
    setEditingFile(null)
    setFormMessage(null)
  }

  useEffect(() => {
    setPersistence(auth, inMemoryPersistence);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setUser(null);
        setLoading(false);
        router.replace("/login");
      } else {
        setUser(user);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!user) return;
    // Debug: log the current user before fetching Firestore data
    console.log("Current user before Firestore call:", auth.currentUser);
    setFormMessage(null); // Clear message on tab change
    if (activeTab === "repositories") fetchRepositories();
    if (activeTab === "contact") fetchContactSubmissions();
    if (activeTab === "wallpapers") fetchWallpapers();
    if (activeTab === "files") fetchSimulatedFiles();
  }, [user, activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Loading...</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-100 flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm py-4 px-8 flex items-center">
        <h1 className="text-3xl font-bold text-orange-600 tracking-tight flex items-center gap-2">
          <User className="w-7 h-7 text-orange-500" /> Admin Dashboard
        </h1>
      </header>
      <div className="flex flex-1 w-full max-w-7xl mx-auto mt-8 gap-8 px-4 md:px-8">
        {/* Sidebar Navigation */}
        <nav className="w-56 shrink-0 hidden md:flex flex-col gap-2 bg-white rounded-xl shadow p-4 h-fit sticky top-24">
          <SidebarTab
            icon={<Folder className="w-5 h-5" />}
            label="Repositories"
            active={activeTab === "repositories"}
            onClick={() => setActiveTab("repositories")}
          />
          <SidebarTab
            icon={<ImageIcon className="w-5 h-5" />}
            label="Wallpapers"
            active={activeTab === "wallpapers"}
            onClick={() => setActiveTab("wallpapers")}
          />
          <SidebarTab
            icon={<FileText className="w-5 h-5" />}
            label="File Manager Content"
            active={activeTab === "files"}
            onClick={() => setActiveTab("files")}
          />
          <SidebarTab
            icon={<Link className="w-5 h-5" />}
            label="Contact Submissions"
            active={activeTab === "contact"}
            onClick={() => setActiveTab("contact")}
          />
        </nav>
        {/* Main Content */}
        <main className="flex-1 w-full max-w-4xl mx-auto space-y-8 pb-16">
          {formMessage && (
            <div
              className={`p-4 mb-6 rounded-md text-base ${
                formMessage.startsWith("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
              }`}
            >
              {formMessage}
            </div>
          )}
          {/* Tab Content (unchanged) */}
          {/* Repositories Tab Content */}
          {activeTab === "repositories" && (
            <div className="space-y-8">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {editingRepo ? "Edit Repository" : "Add New Repository"}
                </h2>
                <form onSubmit={handleRepoSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="repoName" className="block text-sm font-medium text-gray-700 mb-1">
                      Repository Name
                    </label>
                    <input
                      type="text"
                      id="repoName"
                      name="name"
                      defaultValue={editingRepo?.name || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="repoDescription" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="repoDescription"
                      name="description"
                      rows={3}
                      defaultValue={editingRepo?.description || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="repoLink" className="block text-sm font-medium text-gray-700 mb-1">Repository Link</label>
                    <input type="url" id="repoLink" name="link" defaultValue={editingRepo?.link ?? ""} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white" placeholder="https://github.com/username/repo" required />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors flex items-center justify-center"
                    >
                      {editingRepo ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                      {editingRepo ? "Update Repository" : "Add Repository"}
                    </button>
                    {editingRepo && (
                      <button
                        type="button"
                        onClick={handleRepoCancelEdit}
                        className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors flex items-center justify-center"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Existing Repositories</h2>
              {repoLoading ? (
                <div className="text-center py-8 text-gray-500">Loading repositories...</div>
              ) : repoError ? (
                <div className="text-center py-8 text-red-600">Error: {repoError}</div>
              ) : repositories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No repositories found. Add one above!</div>
              ) : (
                <div className="space-y-4">
                  {repositories.map((repo) => (
                    <div
                      key={repo.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-800">{repo.name}</h3>
                        <p className="text-sm text-gray-600">{repo.description}</p>
                        {repo.link && <a href={repo.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-2">View Repo</a>}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleRepoEdit(repo)}
                          className="p-2 rounded-full hover:bg-blue-100 text-blue-600"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRepoDelete(repo.id ?? "")}
                          className="p-2 rounded-full hover:bg-red-100 text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Wallpapers Tab Content */}
          {activeTab === "wallpapers" && (
            <div className="space-y-8">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Wallpaper</h2>
                <form onSubmit={handleWallpaperSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="wallpaperName" className="block text-sm font-medium text-gray-700 mb-1">
                      Wallpaper Name
                    </label>
                    <input
                      type="text"
                      id="wallpaperName"
                      name="name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="wallpaperUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL (or upload below)
                    </label>
                    <input
                      type="url"
                      id="wallpaperUrl"
                      name="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                      placeholder="e.g., https://images.unsplash.com/photo-..."
                    />
                  </div>
                  <div>
                    <label htmlFor="wallpaperFile" className="block text-sm font-medium text-gray-700 mb-1">
                      Or Upload Image
                    </label>
                    <input
                      type="file"
                      id="wallpaperFile"
                      name="file"
                      accept="image/*"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="wallpaperIsDefault"
                      name="isDefault"
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded bg-white"
                    />
                    <label htmlFor="wallpaperIsDefault" className="ml-2 block text-sm font-medium text-gray-700">
                      Set as Default
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Wallpaper
                  </button>
                </form>
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Existing Wallpapers</h2>
              {wallpaperLoading ? (
                <div className="text-center py-8 text-gray-500">Loading wallpapers...</div>
              ) : wallpaperError ? (
                <div className="text-center py-8 text-red-600">Error: {wallpaperError}</div>
              ) : wallpapers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No wallpapers found. Add one above!</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {wallpapers.map((wall) => (
                    <div key={wall.id} className="relative border border-gray-200 rounded-lg overflow-hidden">
                      <img src={wall.url || "/placeholder.svg"} alt={wall.name} className="w-full h-32 object-cover" />
                      <div className="p-3 bg-gray-50">
                        <h3 className="font-medium text-gray-800 truncate">{wall.name}</h3>
                        {wall.isDefault && (
                          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                            Default
                          </span>
                        )}
                        <button
                          onClick={() => handleWallpaperDelete(wall.id ?? "")}
                          className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                          title="Delete Wallpaper"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* File Manager Content Tab */}
          {activeTab === "files" && (
            <div className="space-y-8">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {editingFile ? "Edit File/Folder" : "Add New File/Folder"}
                </h2>
                <form onSubmit={handleFileSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="fileName"
                      name="name"
                      defaultValue={editingFile?.name || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="filePath" className="block text-sm font-medium text-gray-700 mb-1">
                      Path (e.g., /home/developer/documents)
                    </label>
                    <input
                      type="text"
                      id="filePath"
                      name="path"
                      defaultValue={editingFile?.path || "/home/developer/portfolio"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="fileType" className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      id="fileType"
                      name="type"
                      defaultValue={editingFile?.type || "file"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                      required
                    >
                      <option value="file">File</option>
                      <option value="folder">Folder</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="fileContent" className="block text-sm font-medium text-gray-700 mb-1">
                      Content (for text files)
                    </label>
                    <textarea
                      id="fileContent"
                      name="content"
                      rows={5}
                      defaultValue={editingFile?.content || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                      placeholder="Enter text content here (e.g., for .txt, .md files)"
                    />
                  </div>
                  <div>
                    <label htmlFor="fileUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      URL (for image/PDF files)
                    </label>
                    <input
                      type="url"
                      id="fileUrl"
                      name="url"
                      defaultValue={editingFile?.url || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                      placeholder="e.g., /placeholder.svg or https://example.com/doc.pdf"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors flex items-center justify-center"
                    >
                      {editingFile ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                      {editingFile ? "Update Item" : "Add Item"}
                    </button>
                    {editingFile && (
                      <button
                        type="button"
                        onClick={handleFileCancelEdit}
                        className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors flex items-center justify-center"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Existing Files & Folders</h2>
              {fileLoading ? (
                <div className="text-center py-8 text-gray-500">Loading files...</div>
              ) : fileError ? (
                <div className="text-center py-8 text-red-600">Error: {fileError}</div>
              ) : simulatedFiles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No files or folders found. Add one above!</div>
              ) : (
                <div className="space-y-4">
                  {simulatedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-800 flex items-center">
                          {file.type === "folder" ? (
                            <Folder className="w-5 h-5 mr-2 text-blue-500" />
                          ) : file.url &&
                            (file.url.endsWith(".png") ||
                              file.url.endsWith(".jpg") ||
                              file.url.endsWith(".jpeg") ||
                              file.url.endsWith(".gif")) ? (
                            <ImageIcon className="w-5 h-5 mr-2 text-purple-500" />
                          ) : file.url && file.url.endsWith(".pdf") ? (
                            <FileText className="w-5 h-5 mr-2 text-red-500" />
                          ) : (
                            <FileText className="w-5 h-5 mr-2 text-gray-500" />
                          )}
                          {file.name}
                        </h3>
                        <p className="text-sm text-gray-600">Path: {file.path}</p>
                        <p className="text-xs text-gray-500">Type: {file.type}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleFileEdit(file)}
                          className="p-2 rounded-full hover:bg-blue-100 text-blue-600"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleFileDelete(file.id ?? "")}
                          className="p-2 rounded-full hover:bg-red-100 text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Contact Submissions Tab Content */}
          {activeTab === "contact" && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Contact Submissions</h2>
              {submissionLoading ? (
                <div className="text-center py-8 text-gray-500">Loading submissions...</div>
              ) : submissionError ? (
                <div className="text-center py-8 text-red-600">Error: {submissionError}</div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No contact submissions yet.</div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-start justify-between"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-800">{submission.name}</h3>
                        <p className="text-sm text-gray-600">{submission.email}</p>
                        <p className="text-sm text-gray-700 mt-2">{submission.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{submission.timestamp && !isNaN(Date.parse(submission.timestamp)) ? new Date(submission.timestamp).toLocaleString() : ""}</p>
                      </div>
                      <button
                        onClick={() => handleSubmissionDelete(submission.id ?? "")}
                        className="p-2 rounded-full hover:bg-red-100 text-red-600"
                        title="Delete Submission"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// SidebarTab component for navigation
function SidebarTab({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      className={`flex items-center gap-3 px-4 py-2 rounded-lg text-lg font-medium transition-colors w-full text-left
        ${active ? "bg-orange-100 text-orange-700 border-l-4 border-orange-500 shadow" : "text-gray-700 hover:bg-gray-100"}`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}