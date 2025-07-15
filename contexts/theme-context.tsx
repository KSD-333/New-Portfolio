"use client"

import { ThemeProvider as NextThemeProvider, useTheme as useNextTheme } from "next-themes"
import { createContext, useContext, useState, type ReactNode } from "react"
const wallpapers = [
  "https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1464822759844-d150baec0494?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop",
]



export function ThemeProvider({ children }: { children: ReactNode }) {
  const [wallpaper, setWallpaper] = useState(wallpapers[0])

  return (
    <NextThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <ThemeContext.Provider value={{ wallpaper, setWallpaper }}>
        {children}
      </ThemeContext.Provider>
    </NextThemeProvider>
  )
}

// Create a separate context for wallpaper only
interface ThemeContextType {
  wallpaper: string
  setWallpaper: (wallpaper: string) => void
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const themeData = useNextTheme()
  const wallpaperData = useContext(ThemeContext)
  if (!wallpaperData) throw new Error("useTheme must be used within ThemeProvider")

  return {
    ...themeData, // gives access to setTheme(), theme
    ...wallpaperData, // gives access to wallpaper, setWallpaper
  }
}

export { wallpapers }
