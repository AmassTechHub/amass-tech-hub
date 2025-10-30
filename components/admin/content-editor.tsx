'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

/* ------------------------- Content Schema and Types ------------------------ */

const contentTypes = [
  { value: 'news', label: 'News' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'tool', label: 'Tool' },
  { value: 'service', label: 'Service' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'event', label: 'Event' },
]

const formSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  featuredImage: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  isFeatured: z.boolean().default(false),
  metadata: z.any().optional(),
})

type ContentFormValues = z.infer<typeof formSchema>

interface Content {
  id?: string
  type: string
  title: string
  description?: string
  content: string
  featuredImage?: string
  status: 'draft' | 'published' | 'archived'
  isFeatured: boolean
  metadata?: Record<string, any>
}

interface ContentEditorProps {
  content?: Content | null
  onSave?: () => void
  onCancel?: () => void
}

/* ------------------------- Component Implementation ------------------------ */

export function ContentEditor({ content, onSave, onCancel }: ContentEditorProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: content?.type || 'news',
      title: content?.title || '',
      description: content?.description || '',
      content: content?.content || '',
      featuredImage: content?.featuredImage || '',
      status: content?.status || 'draft',
      isFeatured: content?.isFeatured || false,
      metadata: content?.metadata || {},
    },
  })

  const selectedType = form.watch('type')

  /* ------------------------------- Form Submit ------------------------------ */
  const onSubmit = async (data: ContentFormValues) => {
    try {
      setIsLoading(true)

      const method = content?.id ? 'PUT' : 'POST'
      const url = content?.id ? `/api/content/${content.id}` : '/api/content'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: data.type,
          data: {
            ...data,
            ...(data.type === 'event' && {
              startDate: data.metadata?.startDate,
              endDate: data.metadata?.endDate,
              location: data.metadata?.location,
            }),
            ...(data.type === 'podcast' && {
              audioUrl: data.metadata?.audioUrl,
              duration: data.metadata?.duration,
            }),
          },
        }),
      })

      if (!response.ok) throw new Error('Failed to save content')

      const result = await response.json()
      toast.success(content?.id ? 'Content updated successfully!' : 'Content created successfully!')

      if (onSave) onSave()
      form.reset()
    } catch (error) {
      console.error('Error saving content:', error)
      toast.error('Failed to save content')
    } finally {
      setIsLoading(false)
    }
  }

  /* ------------------------------- UI Layout ------------------------------- */

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Type + Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a content type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {contentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter a brief description" className="min-h-[100px]" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Content */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea placeholder="Write your content here..." className="min-h-[200px]" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Featured Image */}
          <FormField
            control={form.control}
            name="featuredImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Featured Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Event Metadata */}
          {selectedType === 'event' && (
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium">Event Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="metadata.startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="metadata.endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="metadata.location"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Event location" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {/* Podcast Metadata */}
          {selectedType === 'podcast' && (
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium">Podcast Details</h3>
              <FormField
                control={form.control}
                name="metadata.audioUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Audio URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/audio.mp3" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="metadata.duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="60" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Featured Toggle + Actions */}
          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>Mark this content as featured</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onCancel?.()} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {content?.id ? 'Update Content' : 'Save Content'}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
