"use client"

import type { LucideIcon } from "lucide-react"

interface DesktopIconProps {
  name: string
  icon: LucideIcon
  onClick: () => void
}

export default function DesktopIcon({ name, icon: Icon, onClick }: DesktopIconProps) {
  return (
    <div
      className="flex flex-col items-center cursor-pointer group w-24 p-3 rounded-lg hover:bg-white/15 transition-all duration-200 backdrop-blur-sm transform hover:scale-105"
      onClick={onClick} // Single click to open
    >
      <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-2 group-hover:bg-orange-600 transition-all duration-200 shadow-xl border border-white/60">
        <Icon className="w-8 h-8 text-gray-800 group-hover:text-white transition-colors duration-200" />
      </div>
      <span className="text-white text-sm text-center leading-tight font-extrabold text-shadow-outline">{name}</span>
    </div>
  )
}
