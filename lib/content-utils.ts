// Utility functions for content enhancement

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export interface TableOfContentsItem {
  id: string
  title: string
  level: number
  children?: TableOfContentsItem[]
}

export function generateTableOfContents(content: string): TableOfContentsItem[] {
  const headingRegex = /<h([2-4]).*?id="([^"]*)".*?>([^<]+)<\/h\1>/g
  const toc: TableOfContentsItem[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = Number.parseInt(match[1])
    const id = match[2]
    const title = match[3]

    const item: TableOfContentsItem = { id, title, level }

    if (level === 2) {
      toc.push(item)
    } else if (level === 3 && toc.length > 0) {
      if (!toc[toc.length - 1].children) {
        toc[toc.length - 1].children = []
      }
      toc[toc.length - 1].children!.push(item)
    }
  }

  return toc
}

export function shareArticle(title: string, url: string, platform: "twitter" | "linkedin" | "facebook" | "whatsapp") {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&via=amasstechhub`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  }

  window.open(shareUrls[platform], "_blank", "width=600,height=400")
}
