'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Save, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const reviewSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
  author_name: z.string().min(2, 'Author name is required'),
  author_title: z.string().optional(),
  author_company: z.string().optional(),
  author_avatar_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  featured: z.boolean().default(false),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export default function NewReviewPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      status: 'pending',
      rating: 5,
      featured: false,
    },
  });

  const currentRating = watch('rating');
  const isPublished = watch('status') === 'approved';

  const onSubmit = async (data: ReviewFormData) => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('reviews')
        .insert([{
          ...data,
          status: isPublishing ? 'approved' : data.status,
        }])
        .select();

      if (error) throw error;

      toast({
        title: 'Success!',
        description: isPublishing 
          ? 'Review published successfully.' 
          : 'Review saved as draft.',
      });

      router.push('/admin/reviews');
    } catch (error) {
      console.error('Error creating review:', error);
      toast({
        title: 'Error',
        description: 'Failed to create review. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      setIsPublishing(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setValue('status', 'approved', { shouldValidate: true });
    
    // Trigger validation and submit if valid
    const isValid = await trigger();
    if (isValid) {
      handleSubmit(onSubmit)();
    } else {
      setIsPublishing(false);
    }
  };

  const renderStar = (starNumber: number) => {
    const isFilled = starNumber <= (hoverRating || currentRating);
    return (
      <button
        type="button"
        key={starNumber}
        className="focus:outline-none"
        onMouseEnter={() => setHoverRating(starNumber)}
        onMouseLeave={() => setHoverRating(0)}
        onClick={() => setValue('rating', starNumber, { shouldValidate: true })}
      >
        <Star
          className={`h-8 w-8 ${isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
        />
      </button>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">New Review</h1>
          <p className="text-muted-foreground">Add a new customer or user review</p>
        </div>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={() => router.push('/admin/reviews')}
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
            Save as Draft
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
            Publish Review
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Review Title</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Enter a title for this review"
                error={errors.title?.message}
              />
            </div>

            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map(renderStar)}
                <span className="ml-2 text-sm text-muted-foreground">
                  {currentRating} {currentRating === 1 ? 'star' : 'stars'}
                </span>
              </div>
              {errors.rating?.message && (
                <p className="text-sm font-medium text-destructive">
                  {errors.rating.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Review Content</Label>
              <Textarea
                id="content"
                {...register('content')}
                placeholder="Share your experience..."
                className="min-h-[200px]"
                error={errors.content?.message}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border p-4 space-y-4">
              <h3 className="font-medium">Reviewer Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="author_name">Name *</Label>
                <Input
                  id="author_name"
                  {...register('author_name')}
                  placeholder="John Doe"
                  error={errors.author_name?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author_title">Title</Label>
                <Input
                  id="author_title"
                  {...register('author_title')}
                  placeholder="CEO, Developer, etc."
                  error={errors.author_title?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author_company">Company</Label>
                <Input
                  id="author_company"
                  {...register('author_company')}
                  placeholder="Company name"
                  error={errors.author_company?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author_avatar_url">Avatar URL</Label>
                <Input
                  id="author_avatar_url"
                  {...register('author_avatar_url')}
                  placeholder="https://example.com/avatar.jpg"
                  error={errors.author_avatar_url?.message}
                />
              </div>

              {watch('author_avatar_url') && (
                <div className="pt-2">
                  <Label>Avatar Preview</Label>
                  <div className="mt-1">
                    <img
                      src={watch('author_avatar_url')}
                      alt="Avatar preview"
                      className="h-16 w-16 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-lg border p-4 space-y-4">
              <h3 className="font-medium">Options</h3>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  {...register('featured')}
                  checked={watch('featured')}
                  onCheckedChange={(checked) => {
                    setValue('featured', Boolean(checked), { shouldValidate: true });
                  }}
                />
                <Label htmlFor="featured" className="font-normal">
                  Feature this review
                </Label>
              </div>

              <div className="space-y-2 pt-2">
                <Label>Status</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={watch('status') === 'pending' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setValue('status', 'pending', { shouldValidate: true })}
                  >
                    Draft
                  </Button>
                  <Button
                    type="button"
                    variant={watch('status') === 'approved' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setValue('status', 'approved', { shouldValidate: true })}
                  >
                    Approved
                  </Button>
                  <Button
                    type="button"
                    variant={watch('status') === 'rejected' ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => setValue('status', 'rejected', { shouldValidate: true })}
                  >
                    Rejected
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
