"use client"

import { useTheme } from "@/contexts/theme-context"
import { Check } from "lucide-react"
import { useState, useEffect } from "react"
import { getWallpapers } from "@/actions/wallpaper-actions"
import type { IWallpaper } from "@/models/Wallpaper"

export default function PhotosApp() {
  const { wallpaper, setWallpaper } = useTheme()
  const [dbWallpapers, setDbWallpapers] = useState<IWallpaper[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
useEffect(() => {
  const fetchWallpapers = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getWallpapers()
      setDbWallpapers(data)

      // Only auto-set wallpaper if none is currently selected
      if (!wallpaper) {
        const defaultWall = data.find((w) => w.isDefault)
        if (defaultWall) {
          setWallpaper(defaultWall.url)
        } else if (data.length > 0) {
          setWallpaper(data[0].url)
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load wallpapers.")
    } finally {
      setLoading(false)
    }
  }

  fetchWallpapers()
}, [setWallpaper, wallpaper])


  if (loading) {
    return (
      <div className="p-6 h-full bg-white flex items-center justify-center">
        <p className="text-gray-500">Loading wallpapers...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 h-full bg-white flex items-center justify-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="h-full bg-white p-6 overflow-auto pb-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Wallpapers</h1>
        <p className="text-gray-600 mb-8">Choose a wallpaper for your desktop</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {dbWallpapers.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No wallpapers found. Add some in the Admin Panel!
            </div>
          ) : (
            dbWallpapers.map((wall, index) => (
              <div
                key={wall._id || index}
                className={`relative cursor-pointer rounded-lg overflow-hidden border-4 transition-all ${
                  wallpaper === wall.url ? "border-orange-500 shadow-lg" : "border-transparent hover:border-gray-300"
                }`}
                onClick={() => setWallpaper(wall.url)}
              >
                <img src={wall.url || "/placeholder.svg"} alt={wall.name} className="w-full h-32 object-cover" />
                {wallpaper === wall.url && (
                  <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
                <div className="p-2 bg-gray-50">
                  <p className="text-xs text-gray-600">{wall.name}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Tips</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Click on any wallpaper to set it as your desktop background</li>
            <li>• The change will be applied immediately</li>
            <li>• Your selection will be remembered during this session</li>
            <li>• Add and manage wallpapers in the Admin Panel</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
