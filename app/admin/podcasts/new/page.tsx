'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const podcastSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug can only contain lowercase letters, numbers, and hyphens'
  ),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  audio_url: z.string().url('Please enter a valid URL').min(1, 'Audio URL is required'),
  duration_seconds: z.number().int().positive('Duration must be a positive number'),
  is_published: z.boolean().default(false),
  published_at: z.string().nullable(),
  transcript: z.string().optional(),
  show_notes: z.string().optional(),
  season_number: z.number().int().min(1).optional(),
  episode_number: z.number().int().min(1).optional(),
  featured_image_url: z.string().url('Please enter a valid URL').optional(),
});

type PodcastFormData = z.infer<typeof podcastSchema>;

export default function NewPodcastPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<PodcastFormData>({
    resolver: zodResolver(podcastSchema),
    defaultValues: {
      is_published: false,
      published_at: null,
    },
  });

  const isPublished = watch('is_published');

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = generateSlug(title);
    setValue('title', title);
    setValue('slug', slug, { shouldValidate: true });
  };

  const onSubmit = async (data: PodcastFormData) => {
    try {
      setIsSubmitting(true);
      
      const podcastData = {
        ...data,
        published_at: data.is_published ? new Date().toISOString() : null,
      };

      const { error } = await supabase
        .from('podcasts')
        .insert([podcastData])
        .select();

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Podcast created successfully.',
      });

      router.push('/admin/podcasts');
    } catch (error) {
      console.error('Error creating podcast:', error);
      toast({
        title: 'Error',
        description: 'Failed to create podcast. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      setIsPublishing(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setValue('is_published', true, { shouldValidate: true });
    
    // Trigger validation and submit if valid
    const isValid = await trigger();
    if (isValid) {
      handleSubmit(onSubmit)();
    } else {
      setIsPublishing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">New Podcast</h1>
          <p className="text-muted-foreground">Add a new podcast episode</p>
        </div>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={() => router.push('/admin/podcasts')}
            disabled={isSubmitting}
          >
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button 
            variant="outline" 
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Draft
          </Button>
          <Button 
            onClick={handlePublish}
            disabled={isSubmitting || isPublishing}
          >
            {isPublishing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Publish
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register('title')}
                onChange={handleTitleChange}
                placeholder="Enter podcast title"
                error={errors.title?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                {...register('slug')}
                placeholder="podcast-slug"
                error={errors.slug?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Enter podcast description"
                className="min-h-[120px]"
                error={errors.description?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audio_url">Audio URL</Label>
              <Input
                id="audio_url"
                {...register('audio_url')}
                placeholder="https://example.com/audio.mp3"
                error={errors.audio_url?.message}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration_seconds">Duration (seconds)</Label>
                <Input
                  id="duration_seconds"
                  type="number"
                  {...register('duration_seconds', { valueAsNumber: true })}
                  placeholder="3600"
                  error={errors.duration_seconds?.message}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="featured_image_url">Featured Image URL</Label>
                <Input
                  id="featured_image_url"
                  {...register('featured_image_url')}
                  placeholder="https://example.com/image.jpg"
                  error={errors.featured_image_url?.message}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="season_number">Season Number</Label>
                <Input
                  id="season_number"
                  type="number"
                  {...register('season_number', { valueAsNumber: true })}
                  placeholder="1"
                  error={errors.season_number?.message}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="episode_number">Episode Number</Label>
                <Input
                  id="episode_number"
                  type="number"
                  {...register('episode_number', { valueAsNumber: true })}
                  placeholder="1"
                  error={errors.episode_number?.message}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transcript">Transcript (Optional)</Label>
              <Textarea
                id="transcript"
                {...register('transcript')}
                placeholder="Enter transcript text"
                className="min-h-[200px] font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="show_notes">Show Notes (Markdown supported)</Label>
              <Textarea
                id="show_notes"
                {...register('show_notes')}
                placeholder="Enter show notes in Markdown format"
                className="min-h-[200px] font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border p-4 space-y-4">
              <h3 className="font-medium">Publishing</h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_published"
                  {...register('is_published')}
                  checked={isPublished}
                  onCheckedChange={(checked) => {
                    setValue('is_published', Boolean(checked), { shouldValidate: true });
                  }}
                />
                <Label htmlFor="is_published">Publish this episode</Label>
              </div>
              
              {isPublished && (
                <div className="space-y-2">
                  <Label>Publish Date</Label>
                  <Input
                    type="datetime-local"
                    {...register('published_at')}
                    defaultValue={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              )}
            </div>

            <div className="rounded-lg border p-4 space-y-4">
              <h3 className="font-medium">Audio Preview</h3>
              <div className="aspect-video bg-muted rounded flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Audio player will appear here</p>
              </div>
            </div>

            <div className="rounded-lg border p-4 space-y-4">
              <h3 className="font-medium">Featured Image</h3>
              <div className="aspect-video bg-muted rounded flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Image preview will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
