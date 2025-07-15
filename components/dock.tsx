"use client"

import type React from "react"
import { useWindows } from "@/contexts/window-context"
import AboutApp from "./apps/about-app"
import SkillsApp from "./apps/skills-app"
import ProjectsApp from "./apps/projects-app"
import TerminalApp from "./apps/terminal-app"
import ContactApp from "./apps/contact-app"
import FileManagerApp from "./apps/file-manager-app"
import BrowserApp from "./apps/browser-app"
import PhotosApp from "./apps/photos-app"
import SettingsApp from "./apps/settings-app"
import LinkedinApp from "./apps/linkedin-app"
import ResumeApp from "./apps/resume-app" // Import ResumeApp
import { Globe, FolderOpen, Terminal, ImageIcon, Mail, User, Code, Settings, Linkedin, FileBadge } from "lucide-react" // Import FileBadge icon
import type { LucideIcon } from "lucide-react"

// Define the default applications that appear in the dock
const dockAppsConfig = [
  { name: "Firefox", icon: Globe, component: BrowserApp, title: "Firefox Web Browser" },
  { name: "Files", icon: FolderOpen, component: FileManagerApp, title: "File Manager - Documents" },
  { name: "Terminal", icon: Terminal, component: TerminalApp, title: "Terminal" },
  { name: "Photos", icon: ImageIcon, component: PhotosApp, title: "Photos - Wallpaper Settings" },
  { name: "Settings", icon: Settings, component: SettingsApp, title: "Settings" },
  { name: "Contact", icon: Mail, component: ContactApp, title: "Contact Information" },
  { name: "About Me", icon: User, component: AboutApp, title: "About Me - Personal Information" },
  { name: "Skills", icon: Code, component: SkillsApp, title: "Skills & Technologies" },
  { name: "Projects", icon: FolderOpen, component: ProjectsApp, title: "My Projects" },
  { name: "LinkedIn", icon: Linkedin, component: LinkedinApp, title: "Ketan Dhainje | LinkedIn" },
  { name: "Resume", icon: FileBadge, component: ResumeApp, title: "My Resume" }, // New Resume dock item
]

interface DockApp {
  name: string
  icon: LucideIcon
  component: React.ComponentType<any>
  title: string
  id?: string
  isMinimized?: boolean
  isFocused?: boolean
}

export default function Dock() {
  const { windows, focusWindow, minimizeWindow, openWindow } = useWindows()

  // Get a unique list of apps to display in the dock
  // This includes all currently open/minimized windows, plus default dock apps not currently open
  const dockItems: DockApp[] = []
  const openAppTitles = new Set(windows.map((w) => w.title))

  // Add open/minimized windows first
  windows.forEach((win) => {
    const config = dockAppsConfig.find((app) => app.title === win.title)
    if (config) {
      dockItems.push({
        ...config,
        id: win.id,
        isMinimized: win.isMinimized,
        isFocused: win.zIndex === windows[windows.length - 1]?.zIndex,
      })
    }
  })

  // Add default dock apps that are not currently open
  dockAppsConfig.forEach((appConfig) => {
    if (!openAppTitles.has(appConfig.title)) {
      dockItems.push(appConfig)
    }
  })

  // Sort items for consistent display (e.g., by name or a predefined order)
  dockItems.sort((a, b) => a.name.localeCompare(b.name))

  const handleDockIconClick = (app: DockApp) => {
    const existingWindow = windows.find((w) => w.title === app.title)

    if (existingWindow) {
      if (existingWindow.isMinimized) {
        focusWindow(existingWindow.id) // Restore and focus
      } else if (existingWindow.zIndex === windows[windows.length - 1]?.zIndex) {
        minimizeWindow(existingWindow.id) // Minimize if already focused
      } else {
        focusWindow(existingWindow.id) // Focus if open but not focused
      }
    } else {
      // Open a new instance of the app
      openWindow({
        title: app.title,
        component: <app.component />,
        position: { x: 100, y: 100 }, // Default position, window manager will adjust
        size: { width: 800, height: 600 }, // Default size
      })
    }
  }

  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-16 w-fit px-6 py-2 bg-gray-900/70 backdrop-blur-lg rounded-2xl flex items-center justify-center z-50 border-none">
      <div className="flex space-x-4">
        {dockItems.map((app, index) => {
          const Icon = app.icon
          const isOpen = windows.some((w) => w.title === app.title)
          const isFocused = windows.some(
            (w) => w.title === app.title && w.zIndex === windows[windows.length - 1]?.zIndex,
          )

          return (
            <button
              key={app.name}
              className="relative flex flex-col items-center justify-center group"
              onClick={() => handleDockIconClick(app)}
              title={app.name}
            >
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110 ">
                <Icon className="w-7 h-7 text-white" />
              </div>
              {isOpen && (
                <div
                  className={`absolute -bottom-2 w-1.5 h-1.5 rounded-full ${isFocused ? "bg-orange-500" : "bg-gray-400"} transition-colors duration-200`}
                ></div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
