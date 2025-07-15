"use client"

import { useState, useEffect } from "react"
import Desktop from "@/components/desktop"
import Dock from "@/components/dock"
import WindowManager from "@/components/window-manager"
import TopBar from "@/components/top-bar" // Import TopBar
import { WindowProvider } from "@/contexts/window-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { FileSystemProvider } from "@/contexts/file-system-context" // Import FileSystemProvider

export default function UbuntuDesktop() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simulate boot time
    const timer = setTimeout(() => setIsLoaded(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!isLoaded) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white font-mono">
            <p className="text-orange-500 text-xl mb-2">Ubuntu 24.04 LTS</p>
            <p className="text-sm">Loading desktop environment...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <WindowProvider>
        <FileSystemProvider>
          {" "}
          {/* Wrap with FileSystemProvider */}
          <div className="h-screen overflow-hidden relative">
            <TopBar /> {/* Render the TopBar */}
            <Desktop />
            <WindowManager />
            <Dock />
          </div>
        </FileSystemProvider>
      </WindowProvider>
    </ThemeProvider>
  )
}
