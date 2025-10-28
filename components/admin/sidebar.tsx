"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Users, Settings, LogOut, Menu } from "lucide-react"
import { useState } from "react"
import { signOut, useSession } from "next-auth/react"

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)
  const { data: session } = useSession()

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" })
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: FileText, label: "Posts", href: "/admin/posts" },
    { icon: Users, label: "Subscribers", href: "/admin/subscribers" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
    { icon: FileText, label: "Categories", href: "/admin/categories" },
    { icon: FileText, label: "Comments", href: "/admin/comments" },
    { icon: FileText, label: "Media", href: "/admin/media" },

  ]

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/40 md:hidden z-20" />
      )}

      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-primary text-white rounded-lg"
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <aside
        aria-label="Admin navigation"
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative w-64 h-screen bg-card border-r border-border transition-transform ease-in-out duration-300 z-30 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-accent font-bold">
              A
            </div>
            <span className="font-bold text-primary">Admin</span>
          </Link>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-primary text-white" : "text-foreground hover:bg-muted/60"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-border">
          {session?.user && (
            <div className="mb-3 px-4 py-2 bg-muted rounded-lg">
              <p className="text-sm font-medium">{session.user.name}</p>
              <p className="text-xs text-muted-foreground break-all">{session.user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-muted/60 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
