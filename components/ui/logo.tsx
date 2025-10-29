"use client"

import { useState } from "react"
import Image from "next/image"

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

  const sizeClasses: Record<string, string> = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  }

  const textSizes: Record<string, string> = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  }

  return (
    <div
      className={`flex items-center gap-2 whitespace-nowrap ${className}`}
      aria-label="Amass Tech Hub Logo"
    >
      {/* Logo Image */}
      <div className={`${sizeClasses[size]} flex items-center justify-center`}>
        {!imageError ? (
          <>
            <Image
              src="/logo-light.png"
              alt="Amass Tech Hub Logo"
              width={48}
              height={48}
              className={`block dark:hidden ${sizeClasses[size]} object-contain`}
              onError={() => setImageError(true)}
              priority
            />
            <Image
              src="/logo-dark.png"
              alt="Amass Tech Hub Logo"
              width={48}
              height={48}
              className={`hidden dark:block ${sizeClasses[size]} object-contain`}
              onError={() => setImageError(true)}
              priority
            />
          </>
        ) : (
          <div
            className={`${sizeClasses[size]} bg-primary rounded-xl flex items-center justify-center`}
          >
            <span className="text-accent font-extrabold text-lg">A</span>
          </div>
        )}
      </div>

      {/* Text — Always horizontal, color swaps by theme */}
      {showText && (
        <span
          className={`font-extrabold tracking-tight ${textSizes[size]} transition-colors text-[#3c0a6b] dark:text-[#d6a51b]`}
        >
          Amass Tech Hub
        </span>
      )}
    </div>
  )
}
