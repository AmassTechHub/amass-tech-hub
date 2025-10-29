import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function ArticlePage({ article }) {
  return (
    <div className="prose max-w-none dark:prose-invert">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
    </div>
  )
}
