"use client"

import React, { useRef, useState } from "react"
import useSWR from "swr"
import { uploadMedia } from "@/lib/upload-media"
import { Trash2, Copy, UploadCloud } from "lucide-react"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function AdminMediaPage() {
  const fileInput = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const { data: files = [], isLoading, mutate } = useSWR("/api/media", fetcher)

  async function handleFiles(selected: FileList | null) {
    if (!selected || selected.length === 0) return
    const file = selected[0]
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      await uploadMedia(file)
      mutate()
      setPreview(null)
    } catch (err) {
      alert("Upload failed: " + (err as Error).message)
    } finally {
      setUploading(false)
      if (fileInput.current) fileInput.current.value = ""
    }
  }

  async function handleUploadClick() {
    fileInput.current?.click()
  }

  async function deleteFile(name: string) {
    if (!confirm(`Delete ${name}?`)) return
    await fetch(`/api/media?name=${encodeURIComponent(name)}`, { method: "DELETE" })
    mutate()
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-primary">Media Library</h1>
        <div className="flex items-center gap-2">
          <input
            ref={fileInput}
            type="file"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <button
            onClick={handleUploadClick}
            disabled={uploading}
            className="flex items-center gap-2 bg-primary text-white rounded-lg px-4 py-2 hover:opacity-90 disabled:opacity-50"
          >
            <UploadCloud size={18} />
            {uploading ? "Uploading..." : "Upload File"}
          </button>
        </div>
      </header>

      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
          dragging ? "border-primary bg-primary/5" : "border-border"
        }`}
      >
        {uploading ? (
          <p className="text-primary font-medium animate-pulse">Uploading...</p>
        ) : preview ? (
          <div className="flex flex-col items-center space-y-2">
            <img src={preview} alt="Preview" className="w-40 h-40 object-cover rounded-lg" />
            <p className="text-muted-foreground text-sm">Preview — uploading in progress</p>
          </div>
        ) : (
          <p className="text-muted-foreground">
            Drag and drop files here or click <span className="text-primary font-medium">Upload File</span>
          </p>
        )}
      </div>

      {/* Gallery */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : files.length === 0 ? (
          <p>No files uploaded yet.</p>
        ) : (
          files.map((file: any) => (
            <div
              key={file.name}
              className="relative group border rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={file.url}
                alt={file.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 text-white transition">
                <button
                  onClick={() => navigator.clipboard.writeText(file.url)}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg"
                >
                  <Copy size={16} /> Copy URL
                </button>
                <button
                  onClick={() => deleteFile(file.name)}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
