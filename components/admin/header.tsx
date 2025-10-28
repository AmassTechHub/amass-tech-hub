"use client"

import { Bell, Settings, LogOut, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"

export default function AdminHeader() {
  const { data: session } = useSession()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Detect system theme
  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDarkMode(true)
    }
  }, [])

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark")
    setIsDarkMode(!isDarkMode)
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" })
  }

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border px-4 md:px-8 py-4 flex justify-between items-center">
      {/* ===== Left Section ===== */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Welcome back, {session?.user?.name || "Admin"}
        </h2>
        <p className="text-sm text-muted-foreground">Manage your content and settings</p>
      </div>

      {/* ===== Right Section ===== */}
      <div className="flex items-center gap-2 md:gap-4 relative">
        {/* Theme toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell size={20} />
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="icon" aria-label="Settings">
          <Settings size={20} />
        </Button>

        {/* User Avatar */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center font-semibold hover:opacity-90 transition"
          >
            {session?.user?.name?.[0]?.toUpperCase() || "A"}
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-medium text-foreground">
                  {session?.user?.name || "Admin"}
                </p>
                <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left px-4 py-3 text-sm hover:bg-muted/60 transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
