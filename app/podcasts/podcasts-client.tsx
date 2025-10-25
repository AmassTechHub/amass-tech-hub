"use client"

import { useState, useEffect } from "react"
import type { Podcast } from "@/lib/types"

export default function PodcastsClient() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([])

  useEffect(() => {
    // Mock podcast data
    setPodcasts([
      {
        id: "1",
        title: "African Tech Talks",
        slug: "african-tech-talks",
        description: "Weekly discussions on African tech innovation and entrepreneurship",
        host: {
          id: "1",
          name: "Amara Obi",
          email: "amara@amasstechhub.com",
          bio: "Tech journalist and podcast host",
          avatar: "/placeholder.svg",
          role: "editor",
        },
        episodes: [
          {
            id: "1",
            podcastId: "1",
            title: "The Future of Fintech in Africa",
            description: "Exploring how fintech is revolutionizing financial services across Africa",
            audioUrl: "/podcasts/episode-1.mp3",
            duration: 45,
            publishedAt: new Date("2024-10-20"),
          },
          {
            id: "2",
            podcastId: "1",
            title: "AI and Machine Learning Trends",
            description: "Latest trends in AI and ML adoption in African startups",
            audioUrl: "/podcasts/episode-2.mp3",
            duration: 52,
            publishedAt: new Date("2024-10-13"),
          },
        ],
        image: "/podcast-cover-1.jpg",
        spotifyUrl: "https://spotify.com/show/african-tech-talks",
        appleUrl: "https://podcasts.apple.com/african-tech-talks",
        createdAt: new Date("2024-01-01"),
      },
      {
        id: "2",
        title: "Startup Stories",
        slug: "startup-stories",
        description: "Inspiring stories from African startup founders and entrepreneurs",
        host: {
          id: "2",
          name: "Kwame Asante",
          email: "kwame@amasstechhub.com",
          bio: "Startup advisor and mentor",
          avatar: "/placeholder.svg",
          role: "contributor",
        },
        episodes: [
          {
            id: "3",
            podcastId: "2",
            title: "From Zero to Series A",
            description: "How one founder raised their first funding round",
            audioUrl: "/podcasts/episode-3.mp3",
            duration: 38,
            publishedAt: new Date("2024-10-19"),
          },
        ],
        image: "/podcast-cover-2.jpg",
        createdAt: new Date("2024-02-01"),
      },
    ])
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-purple-900 mb-2">Podcasts</h1>
        <p className="text-gray-600 mb-12">
          Listen to our tech podcasts featuring industry experts and thought leaders
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {podcasts.map((podcast) => (
            <div key={podcast.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              <img src={podcast.image || "/placeholder.svg"} alt={podcast.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-purple-900 mb-2">{podcast.title}</h2>
                <p className="text-gray-600 mb-4">{podcast.description}</p>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={podcast.host.avatar || "/placeholder.svg"}
                    alt={podcast.host.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{podcast.host.name}</p>
                    <p className="text-sm text-gray-600">Host</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {podcast.spotifyUrl && (
                    <a
                      href={podcast.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-center font-medium"
                    >
                      Spotify
                    </a>
                  )}
                  {podcast.appleUrl && (
                    <a
                      href={podcast.appleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gray-900 text-white py-2 rounded-lg hover:bg-black text-center font-medium"
                    >
                      Apple
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-purple-900 mb-6">Latest Episodes</h2>
          <div className="space-y-4">
            {podcasts.flatMap((podcast) =>
              podcast.episodes.map((episode) => (
                <div key={episode.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{episode.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{episode.description}</p>
                      <p className="text-xs text-gray-500">
                        {episode.duration} min • {new Date(episode.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <audio controls className="w-48">
                      <source src={episode.audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
              )),
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
