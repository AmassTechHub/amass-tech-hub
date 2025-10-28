"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  BarChart3,
  Image as MediaIcon,
  MessageSquare,
  Folder,
} from "lucide-react"
import { useState } from "react"
import { signOut, useSession } from "next-auth/react"

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" })
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: FileText, label: "Posts", href: "/admin/posts" },
    { icon: Users, label: "Subscribers", href: "/admin/subscribers" },
    { icon: Folder, label: "Categories", href: "/admin/categories" },
    { icon: MessageSquare, label: "Comments", href: "/admin/comments" },
    { icon: MediaIcon, label: "Media", href: "/admin/media" },
    { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ]

  return (
    <>
      {/* ===== Mobile Overlay ===== */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 md:hidden z-30"
        />
      )}

      {/* ===== Toggle Button ===== */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-primary text-white rounded-lg shadow-lg"
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      {/* ===== Sidebar ===== */}
      <aside
        aria-label="Admin navigation"
        className={`fixed md:relative flex flex-col bg-card border-r border-border h-screen w-64 transform transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* ----- Logo ----- */}
        <div className="p-6 border-b border-border flex items-center gap-2">
          <div className="w-8 h-8 bg-primary text-white flex items-center justify-center rounded-lg font-bold">
            A
          </div>
          <span className="font-semibold text-primary text-lg">Admin Panel</span>
        </div>

        {/* ----- Scrollable Menu ----- */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-white"
                    : "text-foreground hover:bg-muted/60"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* ----- Footer Section ----- */}
        <div className="p-4 border-t border-border bg-muted/30">
          {session?.user && (
            <div className="mb-3 px-3 py-2 bg-muted rounded-lg">
              <p className="text-sm font-semibold">{session.user.name}</p>
              <p className="text-xs text-muted-foreground break-all">
                {session.user.email}
              </p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted/60 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
