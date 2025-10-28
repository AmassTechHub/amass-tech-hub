"use client"

import React, { useRef, useState } from "react"
import useSWR from "swr"
import { uploadMedia } from "@/lib/upload-media"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function AdminMediaPage() {
  const fileInput = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const { data: files = [], isLoading, mutate } = useSWR("/api/media", fetcher)

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    const file = fileInput.current?.files?.[0]
    if (!file) return
    try {
      setUploading(true)
      await uploadMedia(file)
      mutate()
      if (fileInput.current) fileInput.current.value = ""
    } catch (err) {
      alert("Upload failed: " + (err as Error).message)
    } finally {
      setUploading(false)
    }
  }

  async function deleteFile(name: string) {
    if (!confirm(`Delete ${name}?`)) return
    await fetch(`/api/media?name=${encodeURIComponent(name)}`, { method: "DELETE" })
    mutate()
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-primary">Media Library</h1>
        <form onSubmit={handleUpload} className="flex gap-2 items-center">
          <input ref={fileInput} type="file" required className="border rounded-lg px-3 py-2" />
          <button
            type="submit"
            disabled={uploading}
            className="bg-primary text-white rounded-lg px-4 py-2 hover:opacity-90 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </header>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden p-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : files.length === 0 ? (
          <p>No files uploaded yet.</p>
        ) : (
          files.map((file: any) => (
            <div key={file.name} className="relative group border rounded-lg overflow-hidden">
              <img src={file.url} alt={file.name} className="w-full h-40 object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition">
                <div className="flex flex-col items-center justify-center h-full text-white space-y-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(file.url)}
                    className="bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30"
                  >
                    Copy URL
                  </button>
                  <button
                    onClick={() => deleteFile(file.name)}
                    className="bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
