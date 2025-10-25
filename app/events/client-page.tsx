"use client"

import { useState, useEffect } from "react"
import type { TechEvent } from "@/lib/types"

export default function EventsClientPage() {
  const [events, setEvents] = useState<TechEvent[]>([])
  const [filter, setFilter] = useState<"all" | "conference" | "webinar" | "meetup" | "workshop">("all")

  useEffect(() => {
    // Mock events data
    setEvents([
      {
        id: "1",
        title: "African Tech Summit 2024",
        slug: "african-tech-summit-2024",
        description: "The largest tech conference in Africa bringing together innovators and entrepreneurs",
        date: new Date("2024-11-15"),
        location: "Lagos Convention Center",
        country: "Nigeria",
        eventType: "conference",
        image: "/event-1.jpg",
        registrationUrl: "https://africantechsummit.com",
        speakers: [
          {
            id: "1",
            name: "Amara Obi",
            email: "amara@amasstechhub.com",
            bio: "Tech journalist",
            avatar: "/placeholder.svg",
            role: "editor",
          },
        ],
        createdAt: new Date(),
      },
      {
        id: "2",
        title: "Web Development Masterclass",
        slug: "web-dev-masterclass",
        description: "Learn modern web development from industry experts",
        date: new Date("2024-11-10"),
        location: "Online",
        country: "Global",
        eventType: "webinar",
        image: "/event-2.jpg",
        registrationUrl: "https://webdev-masterclass.com",
        speakers: [],
        createdAt: new Date(),
      },
      {
        id: "3",
        title: "Nairobi Tech Meetup",
        slug: "nairobi-tech-meetup",
        description: "Monthly meetup for tech professionals in Nairobi",
        date: new Date("2024-11-08"),
        location: "Tech Hub Nairobi",
        country: "Kenya",
        eventType: "meetup",
        image: "/event-3.jpg",
        registrationUrl: "https://meetup.com/nairobi-tech",
        speakers: [],
        createdAt: new Date(),
      },
    ])
  }, [])

  const filteredEvents = filter === "all" ? events : events.filter((e) => e.eventType === filter)

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-purple-900 mb-2">Tech Events</h1>
        <p className="text-gray-600 mb-8">Discover conferences, webinars, and meetups across Africa</p>

        <div className="mb-8 flex flex-wrap gap-2">
          {["all", "conference", "webinar", "meetup", "workshop"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as typeof filter)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === f
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-purple-600"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-lg md:col-span-1"
                />
                <div className="md:col-span-2">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-2xl font-bold text-purple-900">{event.title}</h2>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium">
                      {event.eventType}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p>
                      <strong>Location:</strong> {event.location}, {event.country}
                    </p>
                  </div>
                  {event.registrationUrl && (
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-medium"
                    >
                      Register Now
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
