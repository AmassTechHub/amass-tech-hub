"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useMemo } from "react"
import { Menu, X, Facebook, Instagram, Twitter, Linkedin, Youtube, ChevronDown } from "lucide-react"
import ThemeToggle from "./theme-toggle"
import SearchBar from "@/components/search/search-bar"
import Logo from "@/components/ui/logo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export default function Header() {
  const pathname = usePathname()
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

  const primary = navItems.slice(0, 5)
  const more = navItems.slice(5)

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/amasstechhub", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com/amasstechhub", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com/amasstechhub", label: "Twitter" },
    { icon: Youtube, href: "https://youtube.com/@amasstechhub", label: "YouTube" },
    { icon: Linkedin, href: "https://linkedin.com/company/amasstechhub", label: "LinkedIn" },
  ]

  const isActive = useMemo(
    () => (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href)),
    [pathname]
  )

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top row */}
        <div className="flex justify-between items-center h-16">
          {/* Logo — bigger & clearer */}
          <Link href="/" aria-label="Amass Tech Hub" className="flex items-center gap-3">
            {/* Pass a bigger size; ensure your <Logo /> supports it */}
            <Logo size="lg" className="h-10 w-10 md:h-11 md:w-11" />
            <span className="hidden sm:inline text-xl md:text-2xl font-extrabold tracking-tight text-foreground">
              Amass Tech Hub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {primary.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "text-primary"
                    : "text-foreground/80 hover:text-primary"
                )}
              >
                {item.label}
              </Link>
            ))}

            {/* Accessible “More” menu */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className="inline-flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-primary focus:outline-none"
                aria-label="More navigation"
              >
                More <ChevronDown size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-44">
                {more.map((item) => (
                  <DropdownMenuItem asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "w-full",
                        isActive(item.href) ? "text-primary font-medium" : ""
                      )}
                    >
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right tools */}
          <div className="hidden md:flex items-center gap-4">
            <SearchBar />
            <ThemeToggle />
            <div className="flex items-center gap-3 border-l border-border pl-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-foreground/80 hover:text-primary transition-colors"
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
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-muted/60 transition"
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav id="mobile-nav" className="md:hidden pb-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/90 hover:bg-muted/60"
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="px-4 py-4 border-t border-border">
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
                      className="text-foreground/80 hover:text-primary transition-colors"
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
