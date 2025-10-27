"use client"

import { useState } from "react"

interface LogoProps {
  className?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

export default function Logo({ className = "", showText = true, size = "md" }: LogoProps) {
  const [imageError, setImageError] = useState(false)
  
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  }
  
  const textSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl"
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizeClasses[size]} flex items-center justify-center`}>
        {!imageError ? (
          <img 
            src="/logo.png" 
            alt="Amass Tech Hub Logo" 
            className={`${sizeClasses[size]} object-contain brightness-0 dark:invert`}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`${sizeClasses[size]} bg-primary rounded-lg flex items-center justify-center`}>
            <span className="text-accent font-bold text-lg">A</span>
          </div>
        )}
      </div>
      {showText && (
        <span className={`font-bold text-primary dark:text-accent ${textSizes[size]} hidden sm:inline`}>
          Amass Tech Hub
        </span>
      )}
    </div>
  )
}
