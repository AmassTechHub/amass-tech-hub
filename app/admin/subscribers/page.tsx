"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Trash2, RefreshCw } from "lucide-react"
import toast from "react-hot-toast"

export default function SubscribersPage() {
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState("")
  const [subscribers, setSubscribers] = useState<any[]>([])

  const load = async () => {
    setLoading(true)
    const r = await fetch(`/api/newsletter/subscribers?q=${encodeURIComponent(q)}`)
    const json = await r.json()
    if (r.ok) setSubscribers(json.subscribers || [])
    else toast.error(json.error || "Failed to load subscribers")
    setLoading(false)
  }

  useEffect(() => { load() }, []) // initial

  const remove = async (id: string) => {
    if (!confirm("Delete subscriber?")) return
    const r = await fetch(`/api/newsletter/subscribers?id=${id}`, { method: "DELETE" })
    if (r.ok) {
      setSubscribers(s => s.filter(x => x.id !== id))
      toast.success("Removed")
    } else {
      const j = await r.json()
      toast.error(j.error || "Failed")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Subscribers</h1>
          <p className="text-muted-foreground">Newsletter subscribers list</p>
        </div>
        <div className="flex gap-2">
          <Input placeholder="Search email..." value={q} onChange={(e) => setQ(e.target.value)} />
          <Button onClick={load}><RefreshCw size={16} className="mr-2" /> Refresh</Button>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Total: {subscribers.length}</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground">Loading…</div>
          ) : subscribers.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">No subscribers yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Source</th>
                    <th className="text-left py-3 px-4">Joined</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map(s => (
                    <tr key={s.id} className="border-b hover:bg-muted/40">
                      <td className="py-3 px-4">{s.email}</td>
                      <td className="py-3 px-4">{s.name || "-"}</td>
                      <td className="py-3 px-4">{s.source || "-"}</td>
                      <td className="py-3 px-4">{new Date(s.created_at).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" onClick={() => remove(s.id)}><Trash2 size={16} /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
