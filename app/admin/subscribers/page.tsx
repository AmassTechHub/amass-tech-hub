"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, UserPlus } from "lucide-react"

interface Subscriber {
  id: string
  email: string
  created_at: string
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubscribers()
    subscribeToRealtime()
  }, [])

  // Fetch initial data
  const fetchSubscribers = async () => {
    const { data, error } = await supabase
      .from("subscribers")
      .select("*")
      .order("created_at", { ascending: false })
    if (error) console.error("Error loading subscribers:", error)
    else setSubscribers(data || [])
    setLoading(false)
  }

  // Realtime subscription
  const subscribeToRealtime = () => {
    const channel = supabase
      .channel("realtime-subscribers")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "subscribers" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setSubscribers((prev) => [payload.new as Subscriber, ...prev])
          }
          if (payload.eventType === "DELETE") {
            setSubscribers((prev) =>
              prev.filter((s) => s.id !== (payload.old as Subscriber).id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  return (
    <div className="fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Subscribers</h1>
          <p className="text-muted-foreground text-sm">
            View your newsletter subscribers in real time.
          </p>
        </div>
        <UserPlus className="text-primary" size={28} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscriber List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin text-primary w-6 h-6" />
            </div>
          ) : subscribers.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              No subscribers yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Date Subscribed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell>{sub.email}</TableCell>
                      <TableCell>
                        {new Date(sub.created_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
