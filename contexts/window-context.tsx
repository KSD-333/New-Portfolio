"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface WindowData {
  id: string
  title: string
  component: ReactNode
  isMinimized: boolean
  isMaximized: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
}

interface WindowContextType {
  windows: WindowData[]
  openWindow: (window: Omit<WindowData, "id" | "isMinimized" | "isMaximized" | "zIndex">) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  focusWindow: (id: string) => void
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void
  updateWindowSize: (id: string, size: { width: number; height: number }) => void
}

const WindowContext = createContext<WindowContextType | undefined>(undefined)

export function WindowProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowData[]>([])
  const [nextZIndex, setNextZIndex] = useState(1000)
  const [screenSize, setScreenSize] = useState({ width: 1920, height: 1080 })

  const DOCK_HEIGHT = 64 // Consistent dock height

  // Get screen dimensions on client side
  useEffect(() => {
    const updateScreenSize = () => {
      if (typeof window !== "undefined") {
        setScreenSize({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }
    }

    updateScreenSize()

    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateScreenSize)
      return () => window.removeEventListener("resize", updateScreenSize)
    }
  }, [])

  const openWindow = (windowData: Omit<WindowData, "id" | "isMinimized" | "isMaximized" | "zIndex">) => {
    const id = Math.random().toString(36).substr(2, 9)

    // Better window positioning - cascade windows
    const existingWindows = windows.length
    const offsetX = (existingWindows * 30) % 300
    const offsetY = (existingWindows * 30) % 200

    // Ensure valid position values
    const baseX =
      typeof windowData.position.x === "number" && !isNaN(windowData.position.x) ? windowData.position.x : 100
    const baseY =
      typeof windowData.position.y === "number" && !isNaN(windowData.position.y) ? windowData.position.y : 100

    const defaultWidth =
      typeof windowData.size.width === "number" && !isNaN(windowData.size.width) ? windowData.size.width : 800
    const defaultHeight =
      typeof windowData.size.height === "number" && !isNaN(windowData.size.height) ? windowData.size.height : 600

    // Calculate max Y position for the window's top edge, respecting the dock
    const maxInitialY = screenSize.height - DOCK_HEIGHT - defaultHeight

    const newWindow: WindowData = {
      ...windowData,
      id,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZIndex,
      position: {
        x: Math.max(50, Math.min(baseX + offsetX, screenSize.width - defaultWidth)), // Ensure the window's right edge doesn't go beyond the screen width
        y: Math.max(50, Math.min(baseY + offsetY, maxInitialY)), // Constrain Y to be above the dock
      },
      size: {
        width: defaultWidth,
        height: defaultHeight,
      },
    }
    setWindows((prev) => [...prev, newWindow])
    setNextZIndex((prev) => prev + 1)
  }

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id))
  }

  const minimizeWindow = (id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMinimized: !w.isMinimized } : w)))
  }

  const maximizeWindow = (id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)))
  }

  const focusWindow = (id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, zIndex: nextZIndex, isMinimized: false } : w)))
    setNextZIndex((prev) => prev + 1)
  }

  const updateWindowPosition = (id: string, position: { x: number; y: number }) => {
    // Validate position values
    const safePosition = {
      x: typeof position.x === "number" && !isNaN(position.x) ? position.x : 100,
      y: typeof position.y === "number" && !isNaN(position.y) ? position.y : 100,
    }
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, position: safePosition } : w)))
  }

  const updateWindowSize = (id: string, size: { width: number; height: number }) => {
    // Validate size values
    const safeSize = {
      width: typeof size.width === "number" && !isNaN(size.width) ? Math.max(300, size.width) : 800,
      height: typeof size.height === "number" && !isNaN(size.height) ? Math.max(200, size.height) : 600,
    }
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, size: safeSize } : w)))
  }

  return (
    <WindowContext.Provider
      value={{
        windows,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        focusWindow,
        updateWindowPosition,
        updateWindowSize,
      }}
    >
      {children}
    </WindowContext.Provider>
  )
}

export function useWindows() {
  const context = useContext(WindowContext)
  if (!context) {
    throw new Error("useWindows must be used within a WindowProvider")
  }
  return context
}
