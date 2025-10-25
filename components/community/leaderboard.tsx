"use client"

import { useState, useEffect } from "react"

interface LeaderboardEntry {
  userId: string
  name: string
  avatar: string
  score: number
  rank: number
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    // Mock leaderboard data
    setLeaderboard([
      { userId: "1", name: "Alex Okonkwo", avatar: "/placeholder.svg", score: 2450, rank: 1 },
      { userId: "2", name: "Zainab Hassan", avatar: "/placeholder.svg", score: 2180, rank: 2 },
      { userId: "3", name: "Kwame Asante", avatar: "/placeholder.svg", score: 1920, rank: 3 },
      { userId: "4", name: "Amara Obi", avatar: "/placeholder.svg", score: 1750, rank: 4 },
      { userId: "5", name: "Jamal Diallo", avatar: "/placeholder.svg", score: 1620, rank: 5 },
    ])
  }, [])

  return (
    <section className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-purple-900 mb-6">Top Contributors</h2>
      <div className="space-y-3">
        {leaderboard.map((entry) => (
          <div
            key={entry.userId}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-purple-50 transition"
          >
            <div className="text-2xl font-bold text-purple-600 w-8">#{entry.rank}</div>
            <img src={entry.avatar || "/placeholder.svg"} alt={entry.name} className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{entry.name}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-purple-900">{entry.score}</p>
              <p className="text-xs text-gray-600">points</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
