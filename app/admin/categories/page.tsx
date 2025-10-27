"use client"

import React, { useMemo, useState } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function AdminCategoriesPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 20

  const query = useMemo(() => {
    const params = new URLSearchParams({ search, page: String(page), pageSize: String(pageSize) })
    return `/api/categories?${params.toString()}`
  }, [search, page])

  const { data, isLoading, mutate } = useSWR(query, fetcher)
  const items = data?.items || []
  const total = data?.total || 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  async function createCategory(formData: FormData) {
    const name = String(formData.get("name") || "").trim()
    const slug = String(formData.get("slug") || "").trim()
    const description = String(formData.get("description") || "").trim()
    if (!name || !slug) return
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, description }),
    })
    ;(document.getElementById("cat-form") as HTMLFormElement)?.reset()
    mutate()
  }

  async function updateCategory(id: string, patch: any) {
    await fetch("/api/categories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    })
    mutate()
  }

  async function removeCategory(id: string) {
    if (!confirm("Delete this category?")) return
    await fetch(`/api/categories?id=${id}`, { method: "DELETE" })
    mutate()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold">Categories</h1>
        <form id="cat-form" action={createCategory} className="grid sm:flex gap-2 w-full sm:w-auto">
          <input name="name" placeholder="Name" className="border rounded-lg px-3 py-2" required />
          <input name="slug" placeholder="slug-like-this" className="border rounded-lg px-3 py-2" required />
          <input name="description" placeholder="Description (optional)" className="border rounded-lg px-3 py-2" />
          <button className="bg-primary text-white rounded-lg px-4 py-2">Add</button>
        </form>
      </div>

      <input
        value={search}
        onChange={(e) => { setPage(1); setSearch(e.target.value) }}
        placeholder="Search categories…"
        className="w-full sm:w-80 border rounded-lg px-3 py-2"
      />

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Slug</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td className="p-6 text-center" colSpan={5}>Loading…</td></tr>
              ) : items.length === 0 ? (
                <tr><td className="p-6 text-center" colSpan={5}>No categories found.</td></tr>
              ) : items.map((c: any) => (
                <tr key={c.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3">{c.slug}</td>
                  <td className="px-4 py-3">{c.description || "—"}</td>
                  <td className="px-4 py-3">{new Date(c.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          const name = prompt("New name", c.name)?.trim()
                          if (name) updateCategory(c.id, { name })
                        }}
                        className="border rounded-lg px-3 py-1.5 hover:bg-muted"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => removeCategory(c.id)}
                        className="border rounded-lg px-3 py-1.5 hover:bg-muted"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center px-4 py-3 border-t text-sm">
          <span>Showing {(items.length ? (page - 1) * pageSize + 1 : 0)}–{(page - 1) * pageSize + items.length} of {total}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="border rounded-lg px-3 py-1.5 disabled:opacity-50">Prev</button>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="border rounded-lg px-3 py-1.5 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
