"use client"

import type React from "react"

import { Folder, FileText, Download, Eye, ArrowLeft, ImageIcon, FileTypeIcon as GenericFileIcon } from "lucide-react"
import { useWindows } from "@/contexts/window-context"
import TerminalApp from "./terminal-app"
import BrowserApp from "./browser-app"
import PhotosApp from "./photos-app"
import SettingsApp from "./settings-app"
import TextEditorApp from "./text-editor-app"
import PdfViewerApp from "./pdf-viewer-app"
import { useState, useEffect } from "react"
import { getSimulatedFiles } from "@/actions/simulated-file-actions"
import type { ISimulatedFile } from "@/models/SimulatedFile"

export default function FileManagerApp() {
  const [currentPath, setCurrentPath] = useState("/home/developer/portfolio")
  const [files, setFiles] = useState<ISimulatedFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { openWindow } = useWindows()

  useEffect(() => {
    fetchFilesForCurrentPath()
  }, [currentPath])

  const fetchFilesForCurrentPath = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getSimulatedFiles(currentPath)
      setFiles(data)
    } catch (err: any) {
      setError(err.message || "Failed to load files.")
    } finally {
      setLoading(false)
    }
  }

  // Mapping of specific file/folder names to their corresponding application components
  const appMapping: {
    [key: string]: { component: React.ComponentType<any>; title: string; size?: { width: number; height: number } }
  } = {
    // These are hardcoded app mappings, not dynamic file content
    Terminal: { component: TerminalApp, title: "Terminal", size: { width: 800, height: 500 } },
    Firefox: { component: BrowserApp, title: "Firefox Web Browser", size: { width: 1200, height: 800 } },
    Photos: { component: PhotosApp, title: "Photos - Wallpaper Settings", size: { width: 800, height: 600 } },
    Settings: { component: SettingsApp, title: "Settings", size: { width: 700, height: 500 } },
    // Note: AboutApp, SkillsApp, ProjectsApp, ContactApp are now driven by UserProfile/Repository data,
    // so their "files" (e.g., about.txt) will open the generic text editor or be handled by the browser app.
  }

  const handleItemClick = (item: ISimulatedFile) => {
    if (item.type === "folder") {
      setCurrentPath(`${item.path}/${item.name}`)
    } else if (item.type === "file") {
      // Check for specific app mappings first (e.g., if a "Projects" folder should open ProjectsApp)
      const appToOpen = appMapping[item.name] || appMapping[item.name.split(".")[0]]

      // Check for common text file extensions
      const textFileExtensions = [
        ".txt",
        ".md",
        ".bashrc",
        ".json",
        ".info",
        ".log",
        ".conf",
        ".yaml",
        ".yml",
        ".xml",
        ".html",
        ".css",
        ".js",
        ".ts",
        ".jsx",
        ".tsx",
        ".py",
        ".java",
        ".c",
        ".cpp",
        ".h",
        ".sh",
      ]
      const isTextFile = textFileExtensions.some((ext) => item.name.endsWith(ext))

      // Check for PDF file extension
      const isPdfFile = item.name.endsWith(".pdf")

      // Check for image file extensions
      const isImageFile =
        item.url &&
        (item.url.endsWith(".png") ||
          item.url.endsWith(".jpg") ||
          item.url.endsWith(".jpeg") ||
          item.url.endsWith(".gif"))

      if (appToOpen) {
        openWindow({
          title: appToOpen.title,
          component: <appToOpen.component />,
          position: { x: 100, y: 100 },
          size: appToOpen.size || { width: 800, height: 600 },
        })
      } else if (isTextFile && typeof item.content === "string") {
        openWindow({
          title: item.name,
          component: <TextEditorApp fileName={item.name} fileContent={item.content} />,
          position: { x: 150, y: 150 },
          size: { width: 700, height: 500 },
        })
      } else if (isPdfFile && item.url) {
        openWindow({
          title: item.name,
          component: <PdfViewerApp fileName={item.name} />,
          position: { x: 200, y: 200 },
          size: { width: 800, height: 600 },
        })
      } else if (isImageFile && item.url) {
        // Simple image viewer
        openWindow({
          title: item.name,
          component: (
            <div className="flex items-center justify-center h-full bg-gray-800">
              <img
                src={item.url || "/placeholder.svg"}
                alt={item.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ),
          position: { x: 250, y: 250 },
          size: { width: 800, height: 600 },
        })
      } else {
        alert(`File: ${item.name}\nType: ${item.type}\nContent: ${item.content || item.url || "No content/URL."}`)
      }
    }
  }

  const handleGoUp = () => {
    const segments = currentPath.split("/").filter(Boolean)
    if (segments.length > 1) {
      const parentPath = "/" + segments.slice(0, -1).join("/")
      setCurrentPath(parentPath)
    } else if (segments.length === 1 && segments[0] !== "") {
      setCurrentPath("/")
    }
  }

  const displayPath = currentPath.replace("/home/developer", "~")

  return (
    <div className="h-full bg-white flex flex-col">
      {/* File Manager Header */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center">
          {currentPath !== "/" && (
            <button onClick={handleGoUp} className="p-2 rounded hover:bg-gray-200 mr-2" title="Go up one directory">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <h1 className="text-lg font-semibold text-gray-800">Files</h1>
        </div>
        <div className="text-sm text-gray-500">{displayPath}</div>
      </div>

      {/* File List */}
      <div className="flex-1 p-4 overflow-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading files...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">Error: {error}</div>
        ) : files.length === 0 ? (
          <div className="text-gray-500 text-center py-8">This folder is empty. Add files via Admin Panel.</div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {files.map((file) => (
              <div
                key={file._id}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer group"
                onClick={() => handleItemClick(file)}
              >
                <div className="mr-3">
                  {file.type === "folder" ? (
                    <Folder className="w-6 h-6 text-blue-500" />
                  ) : file.url &&
                    (file.url.endsWith(".png") ||
                      file.url.endsWith(".jpg") ||
                      file.url.endsWith(".jpeg") ||
                      file.url.endsWith(".gif")) ? (
                    <ImageIcon className="w-6 h-6 text-purple-500" />
                  ) : file.url && file.url.endsWith(".pdf") ? (
                    <FileText className="w-6 h-6 text-red-500" />
                  ) : (
                    <GenericFileIcon className="w-6 h-6 text-gray-500" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="font-medium text-gray-800">{file.name}</div>
                  <div className="text-sm text-gray-500">{file.type === "folder" ? "Folder" : "File"}</div>
                </div>

                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 rounded hover:bg-gray-200">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  {file.type === "file" && (
                    <button className="p-1 rounded hover:bg-gray-200">
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 text-sm text-gray-600">{files.length} items</div>
    </div>
  )
}
