"use client"

import { useState, useEffect } from "react"
import type { JobListing } from "@/lib/types"

export default function JobsPageClient() {
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [filter, setFilter] = useState<"all" | "full-time" | "part-time" | "contract" | "remote">("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Mock jobs data
    setJobs([
      {
        id: "1",
        title: "Senior React Developer",
        slug: "senior-react-developer",
        company: "TechCorp Africa",
        location: "Lagos",
        country: "Nigeria",
        jobType: "full-time",
        description: "We are looking for an experienced React developer to join our team",
        requirements: ["5+ years React experience", "TypeScript", "Node.js", "PostgreSQL"],
        salary: "$80,000 - $120,000",
        applyUrl: "https://techcorp.com/apply",
        postedAt: new Date("2024-10-20"),
        expiresAt: new Date("2024-11-20"),
      },
      {
        id: "2",
        title: "Product Manager",
        slug: "product-manager",
        company: "StartupXYZ",
        location: "Nairobi",
        country: "Kenya",
        jobType: "full-time",
        description: "Lead product strategy for our growing fintech platform",
        requirements: ["3+ years PM experience", "Fintech knowledge", "Data analysis"],
        salary: "$60,000 - $90,000",
        applyUrl: "https://startupxyz.com/apply",
        postedAt: new Date("2024-10-19"),
        expiresAt: new Date("2024-11-19"),
      },
      {
        id: "3",
        title: "UI/UX Designer",
        slug: "ui-ux-designer",
        company: "DesignStudio",
        location: "Remote",
        country: "Global",
        jobType: "remote",
        description: "Design beautiful interfaces for our web and mobile applications",
        requirements: ["Figma", "Design systems", "User research", "Prototyping"],
        applyUrl: "https://designstudio.com/apply",
        postedAt: new Date("2024-10-18"),
        expiresAt: new Date("2024-11-18"),
      },
    ])
  }, [])

  const filteredJobs = jobs.filter((job) => {
    const matchesType = filter === "all" || job.jobType === filter
    const matchesSearch =
      searchQuery === "" ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-purple-900 mb-2">Tech Jobs</h1>
        <p className="text-gray-600 mb-8">Find your next opportunity in African tech</p>

        <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Search jobs by title or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />

          <div className="flex flex-wrap gap-2">
            {["all", "full-time", "part-time", "contract", "remote"].map((f) => (
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
        </div>

        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-xl font-bold text-purple-900">{job.title}</h2>
                  <p className="text-gray-600">{job.company}</p>
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium">
                  {job.jobType}
                </span>
              </div>

              <p className="text-gray-600 mb-4">{job.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-600">
                    <strong>Location:</strong> {job.location}, {job.country}
                  </p>
                </div>
                {job.salary && (
                  <div>
                    <p className="text-gray-600">
                      <strong>Salary:</strong> {job.salary}
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Requirements:</p>
                <div className="flex flex-wrap gap-2">
                  {job.requirements.map((req, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              <a
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-medium"
              >
                Apply Now
              </a>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No jobs found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
