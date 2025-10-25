export interface SEOMetadata {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: "article" | "website"
  author?: string
  publishedDate?: string
  modifiedDate?: string
}

export function generateMetadata(seo: SEOMetadata) {
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords?.join(", "),
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: seo.type || "website",
      url: seo.url,
      images: seo.image ? [{ url: seo.image }] : undefined,
      article: seo.type === "article" ? { publishedTime: seo.publishedDate } : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      image: seo.image,
    },
  }
}

export function generateArticleSchema(data: {
  title: string
  description: string
  image: string
  author: string
  publishedDate: string
  modifiedDate: string
  url: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: data.title,
    description: data.description,
    image: data.image,
    author: {
      "@type": "Person",
      name: data.author,
    },
    datePublished: data.publishedDate,
    dateModified: data.modifiedDate,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": data.url,
    },
  }
}
