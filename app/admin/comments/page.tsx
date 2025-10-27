"use client"

import React, { useMemo, useState } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function AdminCommentsPage() {
  const [status, setStatus] = useState<"all"|"pending"|"approved"|"spam">("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 20

  const query = useMemo(() => {
    const params = new URLSearchParams({ status, search, page: String(page), pageSize: String(pageSize) })
    return `/api/comments?${params.toString()}`
  }, [status, search, page])

  const { data, isLoading, mutate } = useSWR(query, fetcher)
  const items = data?.items || []
  const total = data?.total || 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  async function setCommentStatus(id: string, next: "pending"|"approved"|"spam") {
    await fetch("/api/comments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: next }),
    })
    mutate()
  }

  async function remove(id: string) {
    if (!confirm("Delete this comment?")) return
    await fetch(`/api/comments?id=${id}`, { method: "DELETE" })
    mutate()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold">Comments</h1>
        <div className="flex gap-2">
          <select
            value={status}
            onChange={(e) => { setPage(1); setStatus(e.target.value as any) }}
            className="border rounded-lg px-3 py-2 bg-background"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="spam">Spam</option>
          </select>
          <input
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value) }}
            placeholder="Search content..."
            className="border rounded-lg px-3 py-2 w-64"
          />
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y">
          {isLoading ? (
            <div className="p-6">Loading…</div>
          ) : items.length === 0 ? (
            <div className="p-6">No comments found.</div>
          ) : items.map((c: any) => (
            <div key={c.id} className="p-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="text-sm text-muted-foreground">
                  {c.author_name || "Anonymous"} • {c.author_email || "—"} •{" "}
                  {new Date(c.created_at).toLocaleString()} • <span className="capitalize">{c.status}</span>
                </div>
                <div className="mt-1 whitespace-pre-wrap break-words">{c.content}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                {c.status !== "approved" && (
                  <button onClick={() => setCommentStatus(c.id, "approved")} className="border rounded-lg px-3 py-1.5 hover:bg-muted">
                    Approve
                  </button>
                )}
                {c.status !== "spam" && (
                  <button onClick={() => setCommentStatus(c.id, "spam")} className="border rounded-lg px-3 py-1.5 hover:bg-muted">
                    Mark Spam
                  </button>
                )}
                <button onClick={() => remove(c.id)} className="border rounded-lg px-3 py-1.5 hover:bg-muted">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center px-4 py-3 border-t text-sm">
          <span>Page {page} of {totalPages} • {total} total</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="border rounded-lg px-3 py-1.5 disabled:opacity-50">Prev</button>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="border rounded-lg px-3 py-1.5 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
