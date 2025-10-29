"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Loader2, X, Plus as PlusIcon, Minus, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tool } from "@/lib/content-types"

const categories = [
  "Development",
  "Design",
  "Productivity",
  "AI & Machine Learning",
  "DevOps",
  "Data Science",
  "Security",
  "Other"
]

const pricingTypes = ["free", "freemium", "paid", "open-source"] as const

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  website: z.string().url("Please enter a valid URL"),
  featuredImage: z.string().url("Please enter a valid URL").optional(),
  category: z.string().min(1, "Please select a category"),
  pricing: z.enum(["free", "freemium", "paid", "open-source"]),
  tags: z.array(z.string()).min(1, "Please add at least one tag"),
  features: z.array(z.string()).min(1, "Please add at least one feature"),
  pros: z.array(z.string()).min(1, "Please add at least one pro"),
  cons: z.array(z.string()).min(1, "Please add at least one con"),
  rating: z.number().min(0).max(5).default(0),
  published: z.boolean().default(false),
})

type ToolFormValues = z.infer<typeof formSchema>

interface ToolFormProps {
  initialData?: Tool
  isEditing?: boolean
}

export function ToolForm({ initialData, isEditing = false }: ToolFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const [featureInput, setFeatureInput] = useState("")
  const [proInput, setProInput] = useState("")
  const [conInput, setConInput] = useState("")

  const form = useForm<ToolFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      slug: "",
      description: "",
      website: "",
      category: "",
      pricing: "free",
      tags: [],
      features: [],
      pros: [],
      cons: [],
      rating: 0,
      published: false,
    },
  })

  const { setValue, watch } = form
  const tags = watch("tags")
  const features = watch("features")
  const pros = watch("pros")
  const cons = watch("cons")
  const rating = watch("rating")

  const addItem = (type: 'tag' | 'feature' | 'pro' | 'con') => {
    const inputMap = {
      tag: { input: tagInput, setInput: setTagInput, field: 'tags' },
      feature: { input: featureInput, setInput: setFeatureInput, field: 'features' },
      pro: { input: proInput, setInput: setProInput, field: 'pros' },
      con: { input: conInput, setInput: setConInput, field: 'cons' },
    }

    const { input, setInput, field } = inputMap[type]
    
    if (input.trim()) {
      const currentItems = [...(form.getValues(field as any) || [])]
      if (!currentItems.includes(input.trim())) {
        form.setValue(field as any, [...currentItems, input.trim()])
      }
      setInput("")
    }
  }

  const removeItem = (type: 'tags' | 'features' | 'pros' | 'cons', itemToRemove: string) => {
    const currentItems = [...(form.getValues(type) || [])]
    form.setValue(
      type,
      currentItems.filter((item) => item !== itemToRemove)
    )
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
  }

  const onSubmit = async (data: ToolFormValues) => {
    try {
      setLoading(true)
      const url = isEditing && initialData?.id 
        ? `/api/content/${initialData.id}`
        : "/api/content"
      
      const method = isEditing ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          type: "tool",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save tool")
      }

      const result = await response.json()
      router.push(`/admin/tools/${result.id}`)
      router.refresh()
    } catch (error) {
      console.error("Error saving tool:", error)
    } finally {
      setLoading(false)
    }
  }

  const renderListWithInput = (
    type: 'tag' | 'feature' | 'pro' | 'con',
    items: string[],
    input: string,
    setInput: (value: string) => void,
    placeholder: string
  ) => {
    const labels = {
      tag: 'Tags',
      feature: 'Features',
      pro: 'Pros',
      con: 'Cons'
    }

    const descriptions = {
      tag: 'Add keywords that describe this tool',
      feature: 'List the main features of this tool',
      pro: 'What are the advantages of this tool?',
      con: 'What are the limitations or drawbacks?'
    }

    return (
      <div className="space-y-2">
        <FormLabel>{labels[type]}</FormLabel>
        <div className="flex gap-2">
          <Input
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addItem(type)
              }
            }}
          />
          <Button 
            type="button" 
            variant="outline" 
            size="icon"
            onClick={() => addItem(type)}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
        <FormDescription>{descriptions[type]}</FormDescription>
        <div className="flex flex-wrap gap-2 mt-2">
          {items.map((item) => (
            <Badge key={item} className="flex items-center gap-1">
              {item}
              <button
                type="button"
                onClick={() => removeItem(`${type}s` as any, item)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tool Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter tool name"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          if (!isEditing || !initialData?.slug) {
                            form.setValue("slug", generateSlug(e.target.value))
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                          /tools/
                        </span>
                        <Input
                          placeholder="tool-slug"
                          className="rounded-l-none"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a brief description of the tool"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Input
                          placeholder="https://example.com"
                          type="url"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featuredImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo/Image URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/logo.png"
                        type="url"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {renderListWithInput('feature', features, featureInput, setFeatureInput, "Add a feature")}
            {renderListWithInput('pro', pros, proInput, setProInput, "Add a pro")}
            {renderListWithInput('con', cons, conInput, setConInput, "Add a con")}
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Publish</FormLabel>
                    <FormDescription>
                      {field.value
                        ? "This tool is visible to the public."
                        : "This tool is not visible to the public."}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <div className="relative flex items-center">
                      <div className="flex h-6 items-center">
                        <input
                          type="checkbox"
                          id="published"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
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
              name="pricing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pricing Model</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pricing model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pricingTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
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
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating: {rating.toFixed(1)}</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => field.onChange(star)}
                          className="text-2xl focus:outline-none"
                        >
                          {star <= rating ? '★' : '☆'}
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Rate this tool from 1 to 5 stars
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {renderListWithInput('tag', tags, tagInput, setTagInput, "Add a tag")}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update Tool" : "Create Tool"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
