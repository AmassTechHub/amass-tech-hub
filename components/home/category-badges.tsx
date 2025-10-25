"use client"

const categories = [
  { name: "Startup News", color: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200" },
  { name: "Infrastructure", color: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200" },
  { name: "AI & Tech", color: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200" },
  { name: "Security", color: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200" },
  { name: "Fintech", color: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200" },
  { name: "Cloud", color: "bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200" },
]

export default function CategoryBadges() {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <span key={category.name} className={`px-3 py-1 rounded-full text-sm font-medium ${category.color}`}>
          {category.name}
        </span>
      ))}
    </div>
  )
}
