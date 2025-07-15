"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useWindows } from "@/contexts/window-context"
import { Minus, Square, X } from "lucide-react"

interface WindowFrameProps {
  window: {
    id: string
    title: string
    component: React.ReactNode
    isMinimized: boolean
    isMaximized: boolean
    position: { x: number; y: number }
    size: { width: number; height: number }
    zIndex: number
  }
}

export default function WindowFrame({ window: windowData }: WindowFrameProps) {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindowPosition, updateWindowSize } =
    useWindows()
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState("")
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [screenSize, setScreenSize] = useState({ width: 1920, height: 1080 })
  const windowRef = useRef<HTMLDivElement>(null)

  // Define dock height
  const DOCK_HEIGHT = 64 // h-16 in Tailwind CSS is 64px

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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains("window-header")) {
      setIsDragging(true)
      const rect = windowRef.current?.getBoundingClientRect()
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
      focusWindow(windowData.id)
    }
  }

  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeDirection(direction)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: windowData.size.width,
      height: windowData.size.height,
    })
    focusWindow(windowData.id)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !windowData.isMaximized) {
        // Get the current width of the window
        const currentWindowWidth = windowRef.current?.offsetWidth || windowData.size.width
        // Update the newX calculation to ensure the right edge stays within bounds
        const newX = Math.max(0, Math.min(screenSize.width - currentWindowWidth, e.clientX - dragOffset.x))
        const currentWindowHeight = windowRef.current?.offsetHeight || windowData.size.height
        const newY = Math.max(
          0,
          Math.min(screenSize.height - DOCK_HEIGHT - currentWindowHeight, e.clientY - dragOffset.y),
        )
        updateWindowPosition(windowData.id, { x: newX, y: newY })
      }

      if (isResizing && !windowData.isMaximized) {
        const deltaX = e.clientX - resizeStart.x
        const deltaY = e.clientY - resizeStart.y
        let newWidth = resizeStart.width
        let newHeight = resizeStart.height
        let newX = windowData.position.x
        let newY = windowData.position.y

        if (resizeDirection.includes("right")) {
          newWidth = Math.max(300, resizeStart.width + deltaX)
        }
        if (resizeDirection.includes("left")) {
          newWidth = Math.max(300, resizeStart.width - deltaX)
          newX = windowData.position.x + (resizeStart.width - newWidth)
        }
        if (resizeDirection.includes("bottom")) {
          newHeight = Math.max(200, resizeStart.height + deltaY)
        }
        if (resizeDirection.includes("top")) {
          newHeight = Math.max(200, resizeStart.height - deltaY)
          newY = windowData.position.y + (resizeStart.height - newHeight)
        }

        // Ensure window stays within screen bounds and above the dock
        newWidth = Math.min(newWidth, screenSize.width - newX)
        newHeight = Math.min(newHeight, screenSize.height - newY - DOCK_HEIGHT) // Account for dock height

        updateWindowSize(windowData.id, { width: newWidth, height: newHeight })
        if (newX !== windowData.position.x || newY !== windowData.position.y) {
          updateWindowPosition(windowData.id, { x: newX, y: newY })
        }
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
      setResizeDirection("")
    }

    if (isDragging || isResizing) {
      if (typeof document !== "undefined") {
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
      }
    }

    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [
    isDragging,
    isResizing,
    dragOffset,
    resizeStart,
    resizeDirection,
    windowData.id,
    windowData.isMaximized,
    windowData.position,
    windowData.size,
    screenSize,
    updateWindowPosition,
    updateWindowSize,
  ])

  if (windowData.isMinimized) return null

  // Ensure all values are valid numbers
  const safePosition = {
    x: isNaN(windowData.position.x) ? 100 : Math.max(0, windowData.position.x),
    y: isNaN(windowData.position.y) ? 100 : Math.max(0, windowData.position.y),
  }

  const safeSize = {
    width: isNaN(windowData.size.width) ? 800 : Math.max(300, windowData.size.width),
    height: isNaN(windowData.size.height) ? 600 : Math.max(200, windowData.size.height),
  }

  // Ensure window doesn't go below dock (64px height)
  // Calculate max Y position for the window's top edge
  const maxWindowY = screenSize.height - DOCK_HEIGHT - safeSize.height
  const constrainedY = Math.min(safePosition.y, Math.max(0, maxWindowY))

  const windowStyle = windowData.isMaximized
    ? { top: 0, left: 0, width: "100vw", height: `calc(100vh - ${DOCK_HEIGHT}px)` }
    : {
        top: constrainedY, // Use the constrained Y position
        left: Math.max(0, Math.min(safePosition.x, screenSize.width - safeSize.width)),
        width: safeSize.width,
        height: Math.min(safeSize.height, screenSize.height - constrainedY - DOCK_HEIGHT), // Ensure height doesn't push it below dock
      }

  return (
    <div
      ref={windowRef}
      className="absolute bg-gray-100 border border-gray-300 rounded-lg shadow-2xl overflow-hidden select-none"
      style={{
        ...windowStyle,
        zIndex: windowData.zIndex,
      }}
      onMouseDown={() => focusWindow(windowData.id)}
    >
      {/* Window Header */}
      <div
        className="window-header h-8 bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-between px-3 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <span className="text-white text-sm font-medium truncate">{windowData.title}</span>
        <div className="flex space-x-1">
          <button
            className="w-5 h-5 rounded-full bg-yellow-500 hover:bg-yellow-400 flex items-center justify-center"
            onClick={() => minimizeWindow(windowData.id)}
          >
            <Minus className="w-3 h-3 text-gray-800" />
          </button>
          <button
            className="w-5 h-5 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center"
            onClick={() => maximizeWindow(windowData.id)}
          >
            <Square className="w-3 h-3 text-gray-800" />
          </button>
          <button
            className="w-5 h-5 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center"
            onClick={() => closeWindow(windowData.id)}
          >
            <X className="w-3 h-3 text-gray-800" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="h-full pb-8 overflow-auto">{windowData.component}</div>

      {/* Resize Handles */}
      {!windowData.isMaximized && (
        <>
          {/* Corner handles */}
          <div
            className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize"
            onMouseDown={(e) => handleResizeStart(e, "top-left")}
          />
          <div
            className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize"
            onMouseDown={(e) => handleResizeStart(e, "top-right")}
          />
          <div
            className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize"
            onMouseDown={(e) => handleResizeStart(e, "bottom-left")}
          />
          <div
            className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize"
            onMouseDown={(e) => handleResizeStart(e, "bottom-right")}
          />

          {/* Edge handles */}
          <div
            className="absolute top-0 left-2 right-2 h-1 cursor-n-resize"
            onMouseDown={(e) => handleResizeStart(e, "top")}
          />
          <div
            className="absolute bottom-0 left-2 right-2 h-1 cursor-s-resize"
            onMouseDown={(e) => handleResizeStart(e, "bottom")}
          />
          <div
            className="absolute left-0 top-2 bottom-2 w-1 cursor-w-resize"
            onMouseDown={(e) => handleResizeStart(e, "left")}
          />
          <div
            className="absolute right-0 top-2 bottom-2 w-1 cursor-e-resize"
            onMouseDown={(e) => handleResizeStart(e, "right")}
          />
        </>
      )}
    </div>
  )
}
