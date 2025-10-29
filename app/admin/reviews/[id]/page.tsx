'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Edit, Trash2, ArrowLeft, Check, X, Star, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

type Review = {
  id: string;
  title: string;
  content: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  author_name: string;
  author_title?: string;
  author_company?: string;
  author_avatar_url?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export default function ReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [review, setReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const reviewId = params?.id as string;

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('id', reviewId)
          .single();

        if (error) throw error;
        if (!data) {
          router.push('/admin/reviews');
          return;
        }

        setReview(data);
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
  }, [reviewId, router, toast]);

  const handleStatusChange = async (newStatus: Review['status']) => {
    if (!review) return;

    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('reviews')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', reviewId);

      if (error) throw error;

      setReview({ ...review, status: newStatus });
      
      toast({
        title: 'Success',
        description: `Review marked as ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating review status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update review status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleFeatured = async () => {
    if (!review) return;

    try {
      setIsUpdating(true);
      const newFeaturedStatus = !review.featured;
      
      const { error } = await supabase
        .from('reviews')
        .update({ 
          featured: newFeaturedStatus,
          updated_at: new Date().toISOString() 
        })
        .eq('id', reviewId);

      if (error) throw error;

      setReview({ ...review, featured: newFeaturedStatus });
      
      toast({
        title: 'Success',
        description: newFeaturedStatus 
          ? 'Review added to featured.' 
          : 'Review removed from featured.',
      });
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update featured status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
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
        title: 'Success',
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

  const getStatusBadgeVariant = (status: Review['status']) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'outline';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: Review['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
      default:
        return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };

  if (isLoading || !review) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admin/reviews')}
            className="w-fit"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reviews
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/admin/reviews/${reviewId}/edit`)}
              disabled={isUpdating || isDeleting}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isUpdating || isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{review.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {new Date(review.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusBadgeVariant(review.status)} className="flex items-center gap-1">
                    {getStatusIcon(review.status)}
                    {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {review.rating} out of 5
                  </span>
                </div>
                
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line">{review.content}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity</CardTitle>
                <CardDescription>Recent actions on this review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Review created</p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Status: <span className="capitalize">{review.status}</span>
                      </p>
                    </div>
                  </div>
                  
                  {review.updated_at !== review.created_at && (
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium">Review updated</p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.updated_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Last modified
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reviewer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-14 w-14">
                    {review.author_avatar_url ? (
                      <AvatarImage src={review.author_avatar_url} alt={review.author_name} />
                    ) : (
                      <AvatarFallback>
                        {review.author_name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-medium">{review.author_name}</p>
                    {review.author_title && (
                      <p className="text-sm text-muted-foreground">
                        {review.author_title}
                      </p>
                    )}
                    {review.author_company && (
                      <p className="text-sm text-muted-foreground">
                        {review.author_company}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Status</p>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={review.status === 'pending' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => handleStatusChange('pending')}
                      disabled={review.status === 'pending' || isUpdating}
                    >
                      {review.status === 'pending' && (
                        <Check className="mr-2 h-4 w-4" />
                      )}
                      Pending
                    </Button>
                    <Button
                      variant={review.status === 'approved' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => handleStatusChange('approved')}
                      disabled={review.status === 'approved' || isUpdating}
                    >
                      {review.status === 'approved' && (
                        <Check className="mr-2 h-4 w-4" />
                      )}
                      Approve
                    </Button>
                    <Button
                      variant={review.status === 'rejected' ? 'destructive' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => handleStatusChange('rejected')}
                      disabled={review.status === 'rejected' || isUpdating}
                    >
                      {review.status === 'rejected' && (
                        <X className="mr-2 h-4 w-4" />
                      )}
                      Reject
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-medium">Featured</p>
                  <Button
                    variant={review.featured ? 'default' : 'outline'}
                    size="sm"
                    className="w-full"
                    onClick={handleToggleFeatured}
                    disabled={isUpdating}
                  >
                    {review.featured ? (
                      <Check className="mr-2 h-4 w-4" />
                    ) : (
                      <Star className="mr-2 h-4 w-4" />
                    )}
                    {review.featured ? 'Featured' : 'Feature this review'}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Featured reviews are displayed more prominently on the website.
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-medium">Danger Zone</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    Delete Review
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    This action cannot be undone. All data will be permanently deleted.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(review.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(review.updated_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Review ID</p>
                  <p className="text-sm font-mono text-muted-foreground break-all">
                    {review.id}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
