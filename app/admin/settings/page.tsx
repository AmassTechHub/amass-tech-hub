"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Save } from "lucide-react"
import toast from "react-hot-toast"

interface SiteSettings {
  site_name: string
  tagline: string
  email: string
}

interface SocialLinks {
  twitter: string
  facebook: string
  linkedin: string
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [siteInfo, setSiteInfo] = useState<SiteSettings>({
    site_name: "",
    tagline: "",
    email: "",
  })
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    twitter: "",
    facebook: "",
    linkedin: "",
  })

  useEffect(() => {
    fetchSettings()
    subscribeToUpdates()
  }, [])

  // Load settings
  const fetchSettings = async () => {
    const { data, error } = await supabase.from("site_settings").select("*")
    if (error) {
      console.error("Error loading settings:", error)
    } else {
      data.forEach((row) => {
        if (row.key === "site_info") setSiteInfo(row.value)
        if (row.key === "social_links") setSocialLinks(row.value)
      })
    }
    setLoading(false)
  }

  // Realtime updates
  const subscribeToUpdates = () => {
    const channel = supabase
      .channel("realtime-settings")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "site_settings" },
        (payload) => {
          if (payload.new.key === "site_info") setSiteInfo(payload.new.value)
          if (payload.new.key === "social_links") setSocialLinks(payload.new.value)
        }
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }

  // Save settings
  const handleSave = async () => {
    setSaving(true)
    try {
      const { error: infoError } = await supabase
        .from("site_settings")
        .update({ value: siteInfo, updated_at: new Date().toISOString() })
        .eq("key", "site_info")

      const { error: socialError } = await supabase
        .from("site_settings")
        .update({ value: socialLinks, updated_at: new Date().toISOString() })
        .eq("key", "social_links")

      if (infoError || socialError) {
        console.error(infoError || socialError)
        toast.error("Failed to save settings.")
      } else {
        toast.success("Settings saved successfully!")
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-6 h-6 text-primary" />
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Site Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage site information and social media links in real-time.
        </p>
      </div>

      {/* Site Info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Site Name</label>
            <Input
              value={siteInfo.site_name}
              onChange={(e) => setSiteInfo({ ...siteInfo, site_name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Tagline</label>
            <Input
              value={siteInfo.tagline}
              onChange={(e) => setSiteInfo({ ...siteInfo, tagline: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Contact Email</label>
            <Input
              type="email"
              value={siteInfo.email}
              onChange={(e) => setSiteInfo({ ...siteInfo, email: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Twitter</label>
            <Input
              value={socialLinks.twitter}
              onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Facebook</label>
            <Input
              value={socialLinks.facebook}
              onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">LinkedIn</label>
            <Input
              value={socialLinks.linkedin}
              onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 mt-4"
          >
            {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={18} />}
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
