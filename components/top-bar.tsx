"use client"

import { useState, useEffect } from "react"

export default function TopBar() {
  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("")

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
      setCurrentDate(now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }))
    }

    updateDateTime() // Set initial time immediately
    const intervalId = setInterval(updateDateTime, 1000) // Update every second

    return () => clearInterval(intervalId) // Clean up on unmount
  }, [])

  return (
    <div className="absolute top-0 left-0 right-0 h-8 bg-gray-900/70 backdrop-blur-lg flex items-center justify-center z-40 text-white text-sm font-medium">
      <span className="mr-4">{currentDate}</span>
      <span>{currentTime}</span>
    </div>
  )
}
