"use client"

import { useState } from "react"

interface TOCItem {
  id: string
  title: string
  level: number
  children?: TOCItem[]
}

interface TableOfContentsProps {
  items: TOCItem[]
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsOpen(false)
    }
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full font-bold text-purple-900 hover:text-purple-700"
      >
        <span>Table of Contents</span>
        <span className={`transform transition ${isOpen ? "rotate-180" : ""}`}>▼</span>
      </button>

      {isOpen && (
        <nav className="mt-4 space-y-2">
          {items.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => handleClick(item.id)}
                className="text-left text-purple-600 hover:text-purple-700 hover:underline text-sm"
              >
                {item.title}
              </button>
              {item.children && (
                <div className="ml-4 space-y-1">
                  {item.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => handleClick(child.id)}
                      className="block text-left text-gray-600 hover:text-purple-600 hover:underline text-sm"
                    >
                      {child.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      )}
    </div>
  )
}
