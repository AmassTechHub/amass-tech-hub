'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Star, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { AdminPage } from '@/components/admin/AdminPage';
import { DataTable } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';

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

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: 'all' });
  const router = useRouter();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err instanceof Error ? err : new Error('Failed to load reviews'));
      toast({
        title: 'Error',
        description: 'Failed to load reviews. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: Review['status']) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );

      toast({
        title: 'Success',
        description: `Review marked as ${status} successfully.`,
      });
    } catch (error) {
      console.error('Error updating review status:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update review status. Please try again.',
        variant: 'destructive',
      });
      fetchReviews();
    }
  };

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ featured: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      setReviews((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, featured: !currentStatus } : r
        )
      );

      toast({
        title: 'Success',
        description: `Review ${!currentStatus ? 'added to' : 'removed from'} featured.`,
      });
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update featured status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;

      setReviews((prev) => prev.filter((r) => r.id !== id));

      toast({
        title: 'Success',
        description: 'Review deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete review. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.author_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filters.status === 'all' || review.status === filters.status;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      id: 'title',
      header: 'Title',
      cell: (review: Review) => (
        <div className="font-medium">{review.title}</div>
      ),
    },
    {
      id: 'author',
      header: 'Author',
      cell: (review: Review) =>
        [review.author_name, review.author_company]
          .filter(Boolean)
          .join(' at '),
    },
    {
      id: 'rating',
      header: 'Rating',
      cell: (review: Review) => (
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
          {review.rating}
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (review: Review) => (
        <Badge
          variant={
            review.status === 'approved'
              ? 'default'
              : review.status === 'pending'
              ? 'outline'
              : 'destructive'
          }
          className="capitalize"
        >
          {review.status}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (review: Review) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleFeatured(review.id, review.featured)}
            title={
              review.featured
                ? 'Remove from featured'
                : 'Add to featured'
            }
          >
            <Star
              className={`h-4 w-4 ${
                review.featured
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground'
              }`}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusChange(review.id, 'approved')}
            disabled={review.status === 'approved'}
            title="Approve"
          >
            <Check className="h-4 w-4 text-green-500" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusChange(review.id, 'rejected')}
            disabled={review.status === 'rejected'}
            title="Reject"
          >
            <X className="h-4 w-4 text-red-500" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              router.push(`/admin/reviews/${review.id}/edit`)
            }
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(review.id)}
            title="Delete"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminPage title="Reviews" isLoading={isLoading} error={error}>
      <DataTable
        columns={columns}
        data={filteredReviews}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        onAddNew={() => router.push('/admin/reviews/new')}
        addNewLabel="Add Review"
        filters={filters}
        onFilterChange={(key, value) =>
          setFilters((prev) => ({ ...prev, [key]: value }))
        }
        emptyMessage="No reviews found. Create your first review."
      />
    </AdminPage>
  );
}
