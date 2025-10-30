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

type CustomCode = {
  id: string
  author_id?: string
  name: string
  code: string
  description?: string | null
  status: 'draft' | 'published' | 'archived'
  priority: number
  language: string
  created_at?: string
  updated_at?: string
  conditions?: {
    pages?: string[]
    user_roles?: string[]
    logged_in?: boolean
    query_params?: Record<string, string>
  }
}

export default function EditCustomCodePage({ params }: { params: { id: string } }) {
  const [snippet, setSnippet] = useState<CodeSnippet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  /* ---------------------------- Fetch existing snippet --------------------------- */
  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const { data, error } = await supabase
          .from<CustomCode>('custom_code') // ✅ add one generic
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) throw error
        setSnippet(data as CodeSnippet)
      } catch (err) {
        console.error('Error fetching snippet:', err)
        setError(
          'Failed to load snippet. It may have been deleted or you may not have permission to view it.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) fetchSnippet()
    else setIsLoading(false)
  }, [params.id, supabase])

  /* ----------------------------- Handle save updates ----------------------------- */
  const handleSave = async (data: Omit<CodeSnippet, 'id' | 'created_at' | 'updated_at'>) => {
    if (!snippet) return

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from<CustomCode>('custom_code') // ✅ one generic type
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        } as any) // ✅ fixes the "never" error safely
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

  /* ----------------------------- Loading and errors ------------------------------ */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button asChild variant="outline">
            <Link href="/admin/custom-code">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Snippets
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  /* ------------------------------ Render editor UI ------------------------------ */
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
            The requested snippet could not be found. It may have been deleted or you may not have
            permission to view it.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
