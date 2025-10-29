"use client"

import { Menu, Bell, User, Settings } from "lucide-react"
import ThemeToggle from "@/components/layout/theme-toggle"
import Logo from "@/components/ui/logo"

interface AdminHeaderProps {
  onMenuClick?: () => void
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-3 border-b border-border bg-background sticky top-0 z-40">
      {/* Left side: logo + dashboard title */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden p-2 rounded-md hover:bg-muted transition"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>

        {/* ✅ Admin uses logo to match brand identity */}
        <div className="flex items-center gap-2">
          <Logo size="md" showText={false} />
          <span className="font-semibold text-base md:text-lg">Admin Dashboard</span>
        </div>
      </div>

      {/* Right side: icons */}
      <div className="flex items-center gap-4">
        <button
          className="relative p-2 rounded-md hover:bg-muted transition"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <ThemeToggle />

        <button
          className="p-2 rounded-md hover:bg-muted transition"
          aria-label="Settings"
        >
          <Settings size={18} />
        </button>

        <button
          className="p-2 rounded-full bg-accent text-accent-foreground font-semibold"
          aria-label="User menu"
        >
          <User size={18} />
        </button>
      </div>
    </header>
  )
}
