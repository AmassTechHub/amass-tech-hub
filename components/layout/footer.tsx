"use client"

import Link from "next/link"
import { Linkedin, Twitter, Facebook, Instagram, Youtube } from "lucide-react"
import Logo from "@/components/ui/logo"

export default function Footer() {
  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/amasstechhub", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com/amasstechhub", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com/amasstechhub", label: "Twitter" },
    { icon: Youtube, href: "https://youtube.com/@amasstechhub", label: "YouTube" },
    { icon: Linkedin, href: "https://linkedin.com/company/amasstechhub", label: "LinkedIn" },
  ]

  return (
    <footer className="bg-primary/90 dark:bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top grid section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-10 text-center md:text-left">
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-4">
              <Logo size="md" showText={false} />
              <span className="font-extrabold text-lg tracking-tight text-white dark:text-[#d6a51b] whitespace-nowrap">
                Amass Tech Hub
              </span>
            </div>
            <p className="text-sm text-white/80 max-w-xs">
              Africa's premier tech news and digital solutions hub.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white dark:text-[#d6a51b]">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/news" className="text-white/80 hover:text-white transition-colors">News</Link></li>
              <li><Link href="/reviews" className="text-white/80 hover:text-white transition-colors">Reviews</Link></li>
              <li><Link href="/tutorials" className="text-white/80 hover:text-white transition-colors">Tutorials</Link></li>
              <li><Link href="/tools" className="text-white/80 hover:text-white transition-colors">Tools</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4 text-white dark:text-[#d6a51b]">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-white/80 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/services" className="text-white/80 hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/advertise" className="text-white/80 hover:text-white transition-colors">Advertise</Link></li>
              <li><Link href="/contact" className="text-white/80 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold mb-4 text-white dark:text-[#d6a51b]">Follow Us</h3>
            <div className="flex gap-4 flex-wrap justify-center md:justify-start">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-white/80 hover:text-accent transition-colors"
                  >
                    <Icon size={20} />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Divider and bottom section */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/80 text-center">
            <p>&copy; {new Date().getFullYear()} Amass Tech Hub. All rights reserved.</p>
            <div className="flex gap-6 justify-center">
              <Link href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
