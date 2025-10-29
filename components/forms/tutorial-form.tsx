"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Loader2, X } from "lucide-react"

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
import { Tutorial } from "@/lib/content-types"

const difficultyLevels = ["beginner", "intermediate", "advanced"] as const
const categories = ["Web Development", "Mobile Development", "Data Science", "DevOps", "UI/UX", "Cybersecurity"]

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  category: z.string().min(1, "Please select a category"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  estimatedReadTime: z.coerce.number().min(1, "Estimated read time must be at least 1 minute"),
  tags: z.array(z.string()).min(1, "Please add at least one tag"),
  featuredImage: z.string().url("Please enter a valid URL").optional(),
  published: z.boolean().default(false),
  prerequisites: z.array(z.string()).optional(),
})

type TutorialFormValues = z.infer<typeof formSchema>

interface TutorialFormProps {
  initialData?: Tutorial
  isEditing?: boolean
}

export function TutorialForm({ initialData, isEditing = false }: TutorialFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const [prerequisiteInput, setPrerequisiteInput] = useState("")

  const form = useForm<TutorialFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      slug: "",
      description: "",
      content: "",
      category: "",
      difficulty: "beginner",
      estimatedReadTime: 5,
      tags: [],
      published: false,
      prerequisites: [],
    },
  })

  const { setValue, watch } = form
  const tags = watch("tags")
  const prerequisites = watch("prerequisites")

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setValue("tags", [...tags, tagInput.trim()])
      }
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setValue(
      "tags",
      tags.filter((tag) => tag !== tagToRemove)
    )
  }

  const addPrerequisite = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && prerequisiteInput.trim()) {
      e.preventDefault()
      if (!prerequisites?.includes(prerequisiteInput.trim())) {
        setValue("prerequisites", [...(prerequisites || []), prerequisiteInput.trim()])
      }
      setPrerequisiteInput("")
    }
  }

  const removePrerequisite = (prerequisiteToRemove: string) => {
    setValue(
      "prerequisites",
      prerequisites?.filter((item) => item !== prerequisiteToRemove) || []
    )
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
  }

  const onSubmit = async (data: TutorialFormValues) => {
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
          type: "tutorial",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save tutorial")
      }

      const result = await response.json()
      router.push(`/admin/tutorials/${result.id}`)
      router.refresh()
    } catch (error) {
      console.error("Error saving tutorial:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-3 space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter tutorial title"
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
                        /tutorials/
                      </span>
                      <Input
                        placeholder="tutorial-slug"
                        className="rounded-l-none"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    The URL-friendly version of the title. Only lowercase letters, numbers, and hyphens are allowed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a brief description of the tutorial"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your tutorial content here (Markdown supported)"
                      rows={12}
                      className="font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                        ? "This tutorial is visible to the public."
                        : "This tutorial is not visible to the public."}
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
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {difficultyLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
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
              name="estimatedReadTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Read Time (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
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
                  <FormLabel>Featured Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        placeholder="Add a tag and press Enter"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={addTag}
                      />
                      <div className="mt-2 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Badge key={tag} className="flex items-center gap-1">
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prerequisites"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prerequisites (Optional)</FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        placeholder="Add a prerequisite and press Enter"
                        value={prerequisiteInput}
                        onChange={(e) => setPrerequisiteInput(e.target.value)}
                        onKeyDown={addPrerequisite}
                      />
                      <div className="mt-2 space-y-1">
                        {prerequisites?.map((item) => (
                          <div
                            key={item}
                            className="flex items-center justify-between bg-muted/50 p-2 rounded text-sm"
                          >
                            <span>{item}</span>
                            <button
                              type="button"
                              onClick={() => removePrerequisite(item)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            {isEditing ? "Update Tutorial" : "Create Tutorial"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
