"use client"

import { Bell, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminHeader() {
  return (
    <header className="bg-background border-b border-border px-8 py-4 flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Welcome back, Admin</h2>
        <p className="text-sm text-muted-foreground">Manage your content and settings</p>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell size={20} />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings size={20} />
        </Button>
        <Button variant="ghost" size="icon">
          <User size={20} />
        </Button>
      </div>
    </header>
  )
}
