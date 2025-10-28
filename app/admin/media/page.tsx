"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2, UploadCloud } from "lucide-react"

interface MediaFile {
  name: string
  url: string
  created_at: string
}

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load files on mount
  useEffect(() => {
    fetchFiles()
    subscribeToUpdates()
  }, [])

  // Fetch all media files
  const fetchFiles = async () => {
    const { data, error } = await supabase.storage.from("media").list("", {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    })

    if (error) {
      console.error("Error fetching media:", error.message)
      setLoading(false)
      return
    }

    const filesWithUrls =
      data?.map((file) => ({
        name: file.name,
        url:
          supabase.storage
            .from("media")
            .getPublicUrl(file.name).data.publicUrl ?? "",
        created_at: file.created_at ?? new Date().toISOString(),
      })) || []

    setFiles(filesWithUrls)
    setLoading(false)
  }

  // Subscribe to realtime changes
  const subscribeToUpdates = () => {
    const channel = supabase
      .channel("realtime-media")
      .on(
        "postgres_changes",
        { event: "*", schema: "storage", table: "objects" },
        (payload) => {
          if (payload.eventType === "INSERT") fetchFiles()
          if (payload.eventType === "DELETE") fetchFiles()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  // Upload new file
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const fileName = `${Date.now()}-${file.name}`

    const { error } = await supabase.storage.from("media").upload(fileName, file)
    setUploading(false)

    if (error) {
      alert("Upload failed: " + error.message)
    } else {
      fetchFiles()
    }
  }

  // Delete file
  const handleDelete = async (name: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this file?")
    if (!confirmDelete) return

    const { error } = await supabase.storage.from("media").remove([name])
    if (error) {
      alert("Failed to delete file: " + error.message)
    } else {
      setFiles((prev) => prev.filter((f) => f.name !== name))
    }
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Media Library</h1>
          <p className="text-sm text-muted-foreground">
            Manage your uploaded images, videos, and files.
          </p>
        </div>

        <div>
          <label
            htmlFor="file-upload"
            className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
          >
            {uploading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <UploadCloud size={18} />
            )}
            {uploading ? "Uploading..." : "Upload File"}
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* File Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Files</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin w-6 h-6 text-primary" />
            </div>
          ) : files.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No files uploaded yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {files.map((file) => (
                <div
                  key={file.name}
                  className="relative border border-border rounded-lg overflow-hidden group hover:shadow-md transition"
                >
                  {file.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="object-cover w-full h-40"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-40 bg-muted text-sm text-muted-foreground">
                      File
                    </div>
                  )}

                  <div className="absolute bottom-0 w-full bg-black/50 text-white text-xs px-2 py-1 truncate">
                    {file.name}
                  </div>

                  <button
                    onClick={() => handleDelete(file.name)}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
