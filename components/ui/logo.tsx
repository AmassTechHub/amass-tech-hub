"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"

interface LogoProps {
  className?: string
  showText?: boolean
  size?: "sm" | "md" | "lg" | "xl"
}

export default function Logo({
  className = "",
  showText = true,
  size = "md",
}: LogoProps) {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const logoSrc = resolvedTheme === 'dark' ? '/logo-dark.png' : '/logo-light.png'
  const [imgSrc, setImgSrc] = useState(logoSrc)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
    setImgSrc(resolvedTheme === 'dark' ? '/logo-dark.png' : '/logo-light.png')
  }, [resolvedTheme])

  const sizes = {
    sm: 28,
    md: 36,
    lg: 48,
    xl: 64,
  }

  const textSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
  }

  // Don't render the logo during SSR to avoid hydration issues
  if (!mounted) {
    return (
      <div 
        className={`flex items-center gap-2 ${className}`}
        style={{ width: sizes[size], height: sizes[size] }}
      />
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src={imgSrc}
        alt="Amass Tech Hub Logo"
        width={sizes[size]}
        height={sizes[size]}
        className="object-contain"
        onError={(e) => {
          // Fallback to default logo if theme-specific one fails
          const fallback = resolvedTheme === 'dark' ? '/logo.png' : '/logo-light.png';
          if (e.currentTarget.src.endsWith(fallback)) {
            // If fallback also fails, show text only
            e.currentTarget.style.display = 'none';
          } else {
            setImgSrc(fallback);
          }
        }}
        priority
      />
      {showText && (
        <span className={`font-extrabold tracking-tight ${textSizes[size]} text-[#3c0a6b] dark:text-[#d6a51b]`}>
          Amass Tech Hub
        </span>
      )}
    </div>
  )
}
