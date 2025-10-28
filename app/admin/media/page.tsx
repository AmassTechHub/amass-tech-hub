"use client"

import { useEffect, useRef, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Upload, Trash2 } from "lucide-react"

export default function MediaManager() {
  const [files, setFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const fetchFiles = async () => {
    const res = await fetch("/api/media")
    const data = await res.json()
    setFiles(data || [])
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setLoading(true)

    const { error } = await supabase.storage.from("media").upload(file.name, file)

    if (error) {
      alert("Upload failed: " + error.message)
    } else {
      await fetchFiles() // refresh dashboard list
    }

    setLoading(false)
  }

  const handleDelete = async (name: string) => {
    if (!confirm("Delete this file?")) return
    await fetch(`/api/media?name=${name}`, { method: "DELETE" })
    fetchFiles()
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-border p-8 rounded-xl text-center">
        <input
          type="file"
          hidden
          ref={fileInputRef}
          onChange={handleUpload}
          accept="image/*,video/*"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
        >
          <Upload size={18} />
          {loading ? "Uploading..." : "Click here to upload"}
        </button>
      </div>

      {/* File List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.length === 0 && (
          <p className="text-muted-foreground text-center col-span-full">
            No media files found.
          </p>
        )}

        {files.map((file) => (
          <div
            key={file.name}
            className="relative bg-card rounded-lg border border-border overflow-hidden shadow-sm"
          >
            <img
              src={file.url}
              alt={file.name}
              className="w-full h-40 object-cover"
            />
            <div className="flex justify-between items-center p-3">
              <span className="truncate text-sm">{file.name}</span>
              <button
                onClick={() => handleDelete(file.name)}
                className="text-destructive hover:text-destructive/80"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
