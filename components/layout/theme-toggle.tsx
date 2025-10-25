"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/lib/theme-context"

export default function ThemeToggle() {
  const { theme, setTheme, isDark } = useTheme()

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
