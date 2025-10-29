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
  const [imageError, setImageError] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

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

  const logoSrc = theme === 'dark' ? '/logo-dark.png' : '/logo-light.png'

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {!imageError ? (
        <>
          {/* Light mode logo */}
          <Image
            src={"/logo-light.png"}
            alt="Amass Tech Hub Logo"
            width={sizes[size]}
            height={sizes[size]}
            className="object-contain dark:hidden"
            onError={() => setImageError(true)}
            priority
          />
          {/* Dark mode logo */}
          <Image
            src={"/logo-dark.png"}
            alt="Amass Tech Hub Logo"
            width={sizes[size]}
            height={sizes[size]}
            className="hidden dark:block object-contain"
            onError={() => setImageError(true)}
            priority
          />
        </>
      ) : (
        <div className="bg-primary text-accent font-extrabold rounded-lg flex items-center justify-center w-10 h-10">
          A
        </div>
      )}

      {showText && (
        <span
          className={`font-extrabold tracking-tight ${textSizes[size]} text-[#3c0a6b] dark:text-[#d6a51b]`}
        >
          Amass Tech Hub
        </span>
      )}
    </div>
  )
}
