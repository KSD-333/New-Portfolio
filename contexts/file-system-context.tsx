"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { getSimulatedFiles } from "@/actions/simulated-file-actions"

// Define the type for file system entries
type FileSystemEntry = string | { [key: string]: FileSystemEntry }

interface FileSystemContextType {
  fileSystem: FileSystemEntry // This will now be a derived state or less relevant for dynamic files
  currentPath: string
  setCurrentPath: (path: string) => void
  resolvePathSegments: (path: string) => string[]
  getEntry: (segments: string[]) => FileSystemEntry | undefined // This will need to be updated to fetch from DB
  updateFileSystem: (segments: string[], value: FileSystemEntry | undefined) => void // This will need to be updated to use DB actions
  listDirectoryContents: (
    path: string,
  ) => { name: string; type: "file" | "folder"; content?: string | object; url?: string; _id?: string }[]
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined)

// Initial fileSystem state (nested structure) - This will now be primarily for hardcoded system files
// Dynamic files will be fetched from MongoDB
const initialFileSystem: FileSystemEntry = {
  home: {
    developer: {
      portfolio: {
        // These will now be fetched from DB or handled by specific apps
        // "about.txt": "...",
        // "skills.md": "...",
        // "projects": { ... },
        // "contact.info": "...",
        // "resume.pdf": "PDF document - Resume",
        // "README.md": "...",
        ".bashrc": "# ~/.bashrc\nexport PS1='\\u@ubuntu:\\w$ '\nalias ll='ls -la'\nalias la='ls -A'\nalias l='ls -CF'",
        "package.json":
          '{\n  "name": "ubuntu-portfolio",\n  "version": "1.0.0",\n  "description": "Interactive Ubuntu desktop portfolio",\n  "main": "index.js",\n  "scripts": {\n    "dev": "next dev",\n    "build": "next build",\n    "start": "next start"\n  },\n  "dependencies": {\n    "react": "^18.0.0",\n    "next": "^14.0.0",\n    "tailwindcss": "^3.0.0"\n  }\n}',
      },
    },
  },
}

export function FileSystemProvider({ children }: { children: ReactNode }) {
  const [fileSystem, setFileSystem] = useState<FileSystemEntry>(initialFileSystem)
  const [currentPath, setCurrentPath] = useState("/home/developer/portfolio") // Store as absolute path internally

  // Helper to resolve absolute path into an array of segments
  const resolvePathSegments = (path: string): string[] => {
    const absolutePath = path.startsWith("~") ? path.replace("~", "/home/developer") : path
    const segments = absolutePath.split("/").filter(Boolean) // Remove empty strings from split

    const resolved: string[] = []
    for (const segment of segments) {
      if (segment === "..") {
        resolved.pop() // Go up one directory
      } else if (segment !== ".") {
        resolved.push(segment) // Add segment
      }
    }
    return resolved
  }

  // Helper to get an entry from the file system based on path segments
  // This now needs to check both hardcoded and DB-fetched files
  const getEntry = (segments: string[]): FileSystemEntry | undefined => {
    let current: FileSystemEntry = fileSystem
    for (const segment of segments) {
      if (typeof current === "object" && current !== null && segment in current) {
        current = (current as { [key: string]: FileSystemEntry })[segment]
      } else {
        // If not found in hardcoded, we'd ideally check DB here,
        // but for simplicity in this context, getEntry will primarily work on hardcoded.
        // Dynamic files are handled by listDirectoryContents.
        return undefined
      }
    }
    return current
  }

  // Helper to immutably update the file system state (primarily for hardcoded, or if we add client-side file creation)
  const updateFileSystem = (segments: string[], value: FileSystemEntry | undefined) => {
    setFileSystem((prevFs) => {
      const newFs = JSON.parse(JSON.stringify(prevFs)) // Deep clone for immutability
      let current: { [key: string]: FileSystemEntry } = newFs as { [key: string]: FileSystemEntry }
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i]
        if (i === segments.length - 1) {
          if (value === undefined) {
            delete current[segment] // Remove entry
          } else {
            current[segment] = value // Set or update entry
          }
        } else {
          if (typeof current[segment] !== "object" || current[segment] === null) {
            current[segment] = {} // Create directory if it doesn't exist or is not an object
          }
          current = current[segment] as { [key: string]: FileSystemEntry }
        }
      }
      return newFs
    })
  }

  // Helper to list contents of a directory, combining hardcoded and DB-fetched files
  const listDirectoryContents = async (path: string) => {
    const dbFiles = await getSimulatedFiles(path) // Fetch dynamic files for the current path

    const hardcodedFiles: { name: string; type: "file" | "folder"; content?: string | object }[] = []
    const segments = resolvePathSegments(path)
    const entry = getEntry(segments)

    if (typeof entry === "object" && entry !== null) {
      Object.entries(entry).forEach(([name, content]) => {
        // Only add if not already present in DB files (to prioritize DB)
        if (!dbFiles.some((f) => f.name === name)) {
          hardcodedFiles.push({
            name,
            type: typeof content === "object" ? "folder" : "file",
            content: typeof content === "string" ? content : undefined,
          })
        }
      })
    }

    // Combine and deduplicate (if any hardcoded names overlap with DB names)
    const combinedFilesMap = new Map<
      string,
      { name: string; type: "file" | "folder"; content?: string | object; url?: string; _id?: string }
    >()

    dbFiles.forEach((file) =>
      combinedFilesMap.set(file.name, {
        name: file.name,
        type: file.type,
        content: file.content,
        url: file.url,
        _id: file._id,
      }),
    )

    hardcodedFiles.forEach((file) => {
      if (!combinedFilesMap.has(file.name)) {
        combinedFilesMap.set(file.name, file)
      }
    })

    return Array.from(combinedFilesMap.values()).sort((a, b) => {
      if (a.type === "folder" && b.type !== "folder") return -1
      if (a.type !== "folder" && b.type === "folder") return 1
      return a.name.localeCompare(b.name)
    })
  }

  return (
    <FileSystemContext.Provider
      value={{
        fileSystem,
        currentPath,
        setCurrentPath,
        resolvePathSegments,
        getEntry,
        updateFileSystem,
        listDirectoryContents,
      }}
    >
      {children}
    </FileSystemContext.Provider>
  )
}

export function useFileSystem() {
  const context = useContext(FileSystemContext)
  if (!context) {
    throw new Error("useFileSystem must be used within a FileSystemProvider")
  }
  return context
}
