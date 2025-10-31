'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CodeSnippet } from '../page'
import CodeEditor from '@/components/admin/CodeEditor'
import { toast } from 'sonner'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Database } from '@/lib/database.types'

type CustomCodeRow = Database['public']['Tables']['custom_code']['Row']
type CustomCodeUpdate = Database['public']['Tables']['custom_code']['Update']

export default function EditCustomCodePage({ params }: { params: { id: string } }) {
  const [snippet, setSnippet] = useState<CustomCodeRow | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // ---------------------------- Fetch snippet ----------------------------
  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const { data, error } = await supabase
          .from('custom_code')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) throw error
        setSnippet(data)
      } catch (err) {
        console.error('Error fetching snippet:', err)
        setError('Failed to load snippet.')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) fetchSnippet()
  }, [params.id, supabase])

  // ---------------------------- Handle save ----------------------------
  const handleSave = async (data: Omit<CustomCodeUpdate, 'updated_at'>) => {
    if (!snippet) return

    setIsSaving(true)
    try {
      const updateData: CustomCodeUpdate = {
        ...data,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('custom_code')
        .update(updateData)
        .eq('id', snippet.id)

      if (error) throw error

      toast.success('Snippet updated successfully')
      router.push('/admin/custom-code')
      router.refresh()
    } catch (err) {
      console.error('Error updating snippet:', err)
      toast.error('Failed to update snippet')
    } finally {
      setIsSaving(false)
    }
  }

  // ---------------------------- Render ----------------------------
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )

  if (error)
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/admin/custom-code">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Snippets
          </Link>
        </Button>
      </div>
    )

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {snippet ? `Edit: ${snippet.name}` : 'New Code Snippet'}
          </h1>
          <p className="text-muted-foreground">
            {snippet
              ? 'Update your code snippet'
              : 'Create a new code snippet to inject into your site'}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/custom-code">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Snippets
          </Link>
        </Button>
      </div>

      {snippet ? (
        <div className="bg-background rounded-lg border p-6">
          <CodeEditor snippet={snippet} onSave={handleSave} isSaving={isSaving} />
        </div>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Snippet not found</AlertTitle>
          <AlertDescription>
            This snippet could not be found. It may have been deleted or you lack permission.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
