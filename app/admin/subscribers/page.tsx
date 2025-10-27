"use client"

import React, { useMemo, useState } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function AdminSubscribersPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 20

  const query = useMemo(() => {
    const params = new URLSearchParams({ search, page: String(page), pageSize: String(pageSize) })
    return `/api/subscribers?${params.toString()}`
  }, [search, page])

  const { data, isLoading, mutate } = useSWR(query, fetcher)
  const items = data?.items || []
  const total = data?.total || 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  async function addSubscriber(formData: FormData) {
    const email = String(formData.get("email") || "").trim()
    if (!email) return
    await fetch("/api/subscribers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "admin" }),
    })
    mutate()
  }

  async function remove(id: string) {
    if (!confirm("Delete this subscriber?")) return
    await fetch(`/api/subscribers?id=${id}`, { method: "DELETE" })
    mutate()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold">Subscribers</h1>
        <form action={addSubscriber} className="flex gap-2 w-full sm:w-auto">
          <input
            name="email"
            type="email"
            required
            placeholder="Add subscriber email"
            className="flex-1 sm:w-72 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90">
            Add
          </button>
        </form>
      </div>

      <input
        value={search}
        onChange={(e) => { setPage(1); setSearch(e.target.value) }}
        placeholder="Search subscribers..."
        className="w-full sm:w-80 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
      />

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td className="p-6 text-center" colSpan={4}>Loading...</td></tr>
              ) : items.length === 0 ? (
                <tr><td className="p-6 text-center" colSpan={4}>No subscribers found.</td></tr>
              ) : (
                items.map((s: any) => (
                  <tr key={s.id} className="border-t">
                    <td className="px-4 py-3">{s.email}</td>
                    <td className="px-4 py-3 capitalize">{s.status}</td>
                    <td className="px-4 py-3">{new Date(s.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => remove(s.id)}
                        className="border rounded-lg px-3 py-1 hover:bg-muted"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center px-4 py-3 border-t text-sm">
          <span>
            Showing {(items.length ? (page - 1) * pageSize + 1 : 0)}–
            {(page - 1) * pageSize + items.length} of {total}
          </span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="border rounded-lg px-3 py-1.5 disabled:opacity-50">Prev</button>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="border rounded-lg px-3 py-1.5 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
