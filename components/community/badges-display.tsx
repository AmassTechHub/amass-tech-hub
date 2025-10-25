import type { Badge } from "@/lib/types"

interface BadgesDisplayProps {
  badges: Badge[]
}

export default function BadgesDisplay({ badges }: BadgesDisplayProps) {
  return (
    <div className="bg-white rounded-lg p-6 mb-8">
      <h3 className="text-lg font-bold text-purple-900 mb-4">Achievements</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge) => (
          <div key={badge.id} className="text-center">
            <div className="text-4xl mb-2">{badge.icon}</div>
            <p className="font-medium text-sm text-gray-900">{badge.name}</p>
            <p className="text-xs text-gray-600">{badge.criteria}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
