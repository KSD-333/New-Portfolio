import type { Metadata } from "next"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider" // This should re-export next-themes correctly


export const metadata: Metadata = {
  title: "Ketan Portfolio",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
