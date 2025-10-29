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
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        {!imageError ? (
          <>
            {/* Light Mode */}
            <Image
              src="/logo-light.png"
              alt="Amass Tech Hub Logo"
              fill
              className="object-contain block dark:hidden"
              onError={() => setImageError(true)}
              priority
            />
            {/* Dark Mode */}
            <Image
              src="/logo-dark.png"
              alt="Amass Tech Hub Logo"
              fill
              className="object-contain hidden dark:block"
              onError={() => setImageError(true)}
              priority
            />
          </>
        ) : (
          <div className="bg-primary text-accent font-extrabold rounded-lg flex items-center justify-center w-full h-full">
            A
          </div>
        )}
      </div>
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
