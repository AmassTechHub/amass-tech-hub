import { ImageLoader } from 'next/image'

// Custom image loader for better performance
export const customLoader: ImageLoader = ({ src, width, quality }) => {
  // If it's a placeholder or local image, return as is
  if (src.startsWith('/') || src.includes('placeholder')) {
    return src
  }
  
  // For external images, you can use a service like Cloudinary or ImageKit
  // Example with Cloudinary:
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/fetch/w_${width},q_${quality || 75},f_auto/${src}`
  }
  
  // Fallback to original image
  return src
}

// Image optimization configuration
export const imageConfig = {
  domains: ['images.unsplash.com', 'via.placeholder.com', 'res.cloudinary.com'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  formats: ['image/webp', 'image/avif'],
}

// Performance monitoring
export function trackPerformance(eventName: string, value?: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      value: value,
      event_category: 'Performance',
    })
  }
}

// Lazy loading utility
export function lazyLoadImage(img: HTMLImageElement) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const image = entry.target as HTMLImageElement
        if (image.dataset.src) {
          image.src = image.dataset.src
          image.classList.remove('lazy')
          observer.unobserve(image)
        }
      }
    })
  })
  
  observer.observe(img)
}

// Preload critical resources
export function preloadCriticalResources() {
  if (typeof window !== 'undefined') {
    // Preload critical fonts
    const fontLink = document.createElement('link')
    fontLink.rel = 'preload'
    fontLink.href = '/fonts/geist-sans.woff2'
    fontLink.as = 'font'
    fontLink.type = 'font/woff2'
    fontLink.crossOrigin = 'anonymous'
    document.head.appendChild(fontLink)
    
    // Preload critical images
    const criticalImages = [
      '/logo.png',
      '/og-image.jpg'
    ]
    
    criticalImages.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = src
      link.as = 'image'
      document.head.appendChild(link)
    })
  }
}
