"use client"

import { useWindows } from "@/contexts/window-context"
import { useTheme } from "@/contexts/theme-context"
import DesktopIcon from "./desktop-icon"
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
import ResumeApp from "./apps/resume-app"
import { Linkedin } from "lucide-react"


// Use Tabler Icons for more realistic look
import {
  IconUser,
  IconCode,
  IconFolder,
  IconTerminal2,
  IconMail,
  IconFileText,
  IconBrowser,
  IconPhoto,
  IconSettings,
  IconBrandLinkedin,
  IconFileCv
} from "@tabler/icons-react"

export default function Desktop() {
  const { openWindow } = useWindows()
  const { wallpaper } = useTheme()

  const desktopIcons = [
    {
      name: "About Me",
      icon: IconUser,
      onClick: () =>
        openWindow({
          title: "About Me - Personal Information",
          component: <AboutApp />, position: { x: 100, y: 100 }, size: { width: 800, height: 600 },
        }),
    },
    {
      name: "Skills & Tech",
      icon: IconCode,
      onClick: () =>
        openWindow({
          title: "Skills & Technologies",
          component: <SkillsApp />, position: { x: 150, y: 150 }, size: { width: 900, height: 700 },
        }),
    },
    {
      name: "Projects",
      icon: IconFolder,
      onClick: () =>
        openWindow({
          title: "My Projects",
          component: <ProjectsApp />, position: { x: 200, y: 200 }, size: { width: 1000, height: 800 },
        }),
    },
    {
      name: "Terminal",
      icon: IconTerminal2,
      onClick: () =>
        openWindow({
          title: "Terminal",
          component: <TerminalApp />, position: { x: 250, y: 250 }, size: { width: 800, height: 500 },
        }),
    },
    {
      name: "Firefox",
      icon: IconBrowser,
      onClick: () =>
        openWindow({
          title: "Firefox Web Browser",
          component: <BrowserApp />, position: { x: 100, y: 50 }, size: { width: 1200, height: 800 },
        }),
    },
    {
      name: "Photos",
      icon: IconPhoto,
      onClick: () =>
        openWindow({
          title: "Photos - Wallpaper Settings",
          component: <PhotosApp />, position: { x: 300, y: 200 }, size: { width: 800, height: 600 },
        }),
    },
    {
      name: "Settings",
      icon: IconSettings,
      onClick: () =>
        openWindow({
          title: "Settings",
          component: <SettingsApp />, position: { x: 350, y: 250 }, size: { width: 700, height: 500 },
        }),
    },
    {
      name: "Contact",
      icon: IconMail,
      onClick: () =>
        openWindow({
          title: "Contact Information",
          component: <ContactApp />, position: { x: 400, y: 300 }, size: { width: 600, height: 500 },
        }),
    },
    {
      name: "Files",
      icon: IconFileText,
      onClick: () =>
        openWindow({
          title: "File Manager - Documents",
          component: <FileManagerApp />, position: { x: 450, y: 350 }, size: { width: 800, height: 600 },
        }),
    },
    {
  name: "LinkedIn Profile",
  icon: IconBrandLinkedin,
  onClick: () =>
    openWindow({
      title: "Ketan Dhainje | LinkedIn",
      component: <LinkedinApp />,
      position: { x: 100, y: 100 },
      size: { width: 900, height: 700 },
    }),
},
    {
      name: "Resume",
      icon: IconFileCv,
      onClick: () =>
        openWindow({
          title: "My Resume",
          component: <ResumeApp />, position: { x: 550, y: 450 }, size: { width: 800, height: 700 },
        }),
    },
  ]

  return (
    <div className="h-screen p-4 relative">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${wallpaper}')` }} />
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 grid grid-flow-col auto-cols-max grid-rows-[repeat(auto-fill,minmax(96px,1fr))] gap-x-6 gap-y-8 p-8 h-full w-full overflow-hidden">
        {desktopIcons.map((icon, index) => (
          <DesktopIcon key={index} name={icon.name} icon={icon.icon} onClick={icon.onClick} />
        ))}
      </div>
    </div>
  )
}
