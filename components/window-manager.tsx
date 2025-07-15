"use client"

import { useWindows } from "@/contexts/window-context"
import WindowFrame from "./window-frame"

export default function WindowManager() {
  const { windows } = useWindows()

  return (
    <>
      {windows.map((window) => (
        <WindowFrame key={window.id} window={window} />
      ))}
    </>
  )
}
