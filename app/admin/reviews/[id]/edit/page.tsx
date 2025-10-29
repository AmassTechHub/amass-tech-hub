'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Save, X, Star, Trash2, ExternalLink } from 'lucide-react';
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
  status: z.enum(['pending', 'approved', 'rejected']),
  author_name: z.string().min(2, 'Author name is required'),
  author_title: z.string().optional(),
  author_company: z.string().optional(),
  author_avatar_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  featured: z.boolean().default(false),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export default function EditReviewPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
    watch,
    trigger,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
  });

  const currentRating = watch('rating');
  const reviewId = params?.id as string;

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const { data: review, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('id', reviewId)
          .single();

        if (error) throw error;
        if (!review) {
          router.push('/admin/reviews');
          return;
        }

        reset({
          ...review,
          // Ensure all required fields have values
          author_name: review.author_name || '',
          author_title: review.author_title || '',
          author_company: review.author_company || '',
          author_avatar_url: review.author_avatar_url || '',
        });
      } catch (error) {
        console.error('Error fetching review:', error);
        toast({
          title: 'Error',
          description: 'Failed to load review. Please try again.',
          variant: 'destructive',
        });
        router.push('/admin/reviews');
      } finally {
        setIsLoading(false);
      }
    };

    if (reviewId) {
      fetchReview();
    }
  }, [reviewId, reset, router, toast]);

  const onSubmit = async (data: ReviewFormData) => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('reviews')
        .update(data)
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Review updated successfully.',
      });

      router.push('/admin/reviews');
    } catch (error) {
      console.error('Error updating review:', error);
      toast({
        title: 'Error',
        description: 'Failed to update review. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Review deleted successfully.',
      });

      router.push('/admin/reviews');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete review. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Edit Review</h1>
          <p className="text-muted-foreground">Update review details</p>
        </div>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={() => router.push('/admin/reviews')}
            disabled={isSubmitting || isDeleting}
          >
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isSubmitting || isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete
          </Button>
          <Button 
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || isDeleting || !isDirty}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
          <Button 
            variant="secondary"
            onClick={() => window.open(`/reviews/${reviewId}`, '_blank')}
            disabled={watch('status') !== 'approved'}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Live
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
                    Pending
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

              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  <p>Created: {new Date(watch('created_at')).toLocaleString()}</p>
                  <p>Last updated: {new Date(watch('updated_at') || new Date()).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
