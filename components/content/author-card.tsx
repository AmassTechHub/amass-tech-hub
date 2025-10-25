import Link from "next/link"
import type { Author } from "@/lib/types"

interface AuthorCardProps {
  author: Author
}

export default function AuthorCard({ author }: AuthorCardProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-yellow-50 rounded-lg p-6 mb-8">
      <div className="flex items-start gap-4">
        <img src={author.avatar || "/placeholder.svg"} alt={author.name} className="w-16 h-16 rounded-full" />
        <div className="flex-1">
          <h3 className="font-bold text-purple-900 mb-1">{author.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{author.bio}</p>
          <Link href={`/authors/${author.id}`} className="text-purple-600 hover:underline text-sm font-medium">
            View all articles by {author.name}
          </Link>
        </div>
      </div>
    </div>
  )
}
