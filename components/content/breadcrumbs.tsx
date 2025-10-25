import Link from "next/link"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      <Link href="/" className="text-purple-600 hover:underline">
        Home
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="text-gray-400">/</span>
          {index === items.length - 1 ? (
            <span className="text-gray-600">{item.label}</span>
          ) : (
            <Link href={item.href} className="text-purple-600 hover:underline">
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
