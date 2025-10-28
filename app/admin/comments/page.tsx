"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

const STATUSES = ["pending", "approved", "rejected", "spam"] as const
type Comment = { id: string; article_id: string; author_name: string | null; author_email: string | null; content: string; status: string; created_at: string }

export default function CommentsPage() {
  const [active, setActive] = useState<typeof STATUSES[number]>("pending")
  const [rows, setRows] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)

  const load = async (status = active) => {
    setLoading(true)
    const r = await fetch(`/api/comments?status=${status}`)
    const j = await r.json()
    if (r.ok) setRows(j.comments || [])
    else toast.error(j.error || "Failed to load")
    setLoading(false)
  }

  useEffect(() => { load("pending") }, [])
  useEffect(() => { load(active) }, [active])

  const setStatus = async (id: string, status: string) => {
    const r = await fetch(`/api/comments/${id}`, { method: "PUT", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ status }) })
    const j = await r.json()
    if (r.ok) {
      setRows(rows => rows.filter(x => x.id !== id))
      toast.success(`Marked ${status}`)
    } else toast.error(j.error || "Failed")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Comments</h1>
        <p className="text-muted-foreground">Moderate user comments</p>
      </div>

      <Tabs value={active} onValueChange={(v: any) => setActive(v)}>
        <TabsList className="flex flex-wrap">
          {STATUSES.map(s => <TabsTrigger key={s} value={s} className="capitalize">{s}</TabsTrigger>)}
        </TabsList>

        <TabsContent value={active}>
          <Card>
            <CardHeader><CardTitle>{active.toUpperCase()}</CardTitle></CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-40 text-muted-foreground">Loading…</div>
              ) : rows.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">No comments</div>
              ) : (
                <div className="space-y-4">
                  {rows.map(c => (
                    <div key={c.id} className="p-4 rounded border">
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <div className="font-medium">{c.author_name || "Anonymous"} <span className="text-muted-foreground">({c.author_email || "—"})</span></div>
                          <div className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()}</div>
                        </div>
                        <div className="flex gap-2">
                          {active !== "approved" && <Button size="sm" onClick={() => setStatus(c.id, "approved")}>Approve</Button>}
                          {active !== "rejected" && <Button size="sm" variant="outline" onClick={() => setStatus(c.id, "rejected")}>Reject</Button>}
                          {active !== "spam" && <Button size="sm" variant="destructive" onClick={() => setStatus(c.id, "spam")}>Spam</Button>}
                        </div>
                      </div>
                      <p className="mt-3 text-sm">{c.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
