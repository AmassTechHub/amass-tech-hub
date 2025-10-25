"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react"
import ThemeToggle from "./theme-toggle"
import SearchBar from "@/components/search/search-bar"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { label: "News", href: "/news" },
    { label: "Reviews", href: "/reviews" },
    { label: "Tutorials", href: "/tutorials" },
    { label: "Tools", href: "/tools" },
    { label: "Services", href: "/services" },
    { label: "Podcasts", href: "/podcasts" },
    { label: "Events", href: "/events" },
    { label: "Jobs", href: "/jobs" },
    { label: "About", href: "/about" },
  ]

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/amasstechhub", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com/amasstechhub", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com/amasstechhub", label: "Twitter" },
    { icon: Youtube, href: "https://youtube.com/@amasstechhub", label: "YouTube" },
    { icon: Linkedin, href: "https://linkedin.com/company/amasstechhub", label: "LinkedIn" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-background dark:bg-gray-900 border-b border-border dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-accent font-bold text-lg">A</span>
            </div>
            <span className="font-bold text-lg text-primary hidden sm:inline">Amass Tech Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.slice(0, 5).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="relative group">
              <button className="text-sm font-medium text-foreground dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors">
                More
              </button>
              <div className="absolute left-0 mt-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {navItems.slice(5).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-sm text-foreground dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <SearchBar />
            <ThemeToggle />
            <div className="flex items-center gap-3 border-l border-border dark:border-gray-700 pl-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-foreground dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors"
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
            <Link
              href="/contact"
              className="px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-sm font-medium text-foreground dark:text-gray-300 hover:bg-card dark:hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="px-4 py-4 border-t border-border dark:border-gray-700">
              <p className="text-xs font-semibold text-muted-foreground mb-3">Follow Us</p>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="text-foreground dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors"
                    >
                      <Icon size={20} />
                    </a>
                  )
                })}
              </div>
            </div>
            <Link
              href="/contact"
              className="block px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium text-center hover:opacity-90 transition-opacity"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
