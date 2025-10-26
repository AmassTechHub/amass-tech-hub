import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-bold text-foreground mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Home size={20} />
              Go Home
            </button>
          </Link>
          <button onClick={() => window.history.back()}>
            <div className="bg-background border border-border text-foreground px-6 py-3 rounded-lg font-semibold hover:bg-muted transition-colors flex items-center gap-2">
              <ArrowLeft size={20} />
              Go Back
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

