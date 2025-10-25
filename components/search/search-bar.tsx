"use client"

import { Search } from "lucide-react"
import { useState } from "react"

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
        aria-label="Search"
      >
        <Search size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-background dark:bg-gray-800 rounded-lg shadow-lg border border-border dark:border-gray-700 p-4">
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full px-3 py-2 bg-input dark:bg-gray-700 border border-border dark:border-gray-600 rounded-lg text-foreground dark:text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
        </div>
      )}
    </div>
  )
}
