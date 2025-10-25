interface ReadingTimeProps {
  content: string
  className?: string
}

export default function ReadingTime({ content, className = "" }: ReadingTimeProps) {
  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200
    const wordCount = text.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  const minutes = calculateReadingTime(content)

  return <span className={`text-sm text-gray-600 ${className}`}>{minutes} min read</span>
}
