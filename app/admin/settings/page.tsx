"use client"

import React from "react"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      {/* Page Title */}
      <header>
        <h1 className="text-3xl font-bold text-primary">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account, site preferences, and system configuration.
        </p>
      </header>

      {/* General Settings */}
      <section className="bg-card border rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">General Settings</h2>
        <p className="text-sm text-muted-foreground">
          Coming soon: update site name, description, and contact details.
        </p>
      </section>

      {/* Account Settings */}
      <section className="bg-card border rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your admin password and security preferences.
        </p>
      </section>

      {/* Email & Notifications */}
      <section className="bg-card border rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Email & Notifications</h2>
        <p className="text-sm text-muted-foreground">
          Configure email notifications and communication preferences.
        </p>
      </section>
    </div>
  )
}
