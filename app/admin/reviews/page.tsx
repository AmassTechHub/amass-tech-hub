'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Check, X, Star, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import { BulkActions } from '@/components/admin/reviews/bulk-actions';
import { toast } from '@/components/ui/use-toast';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Review['status']>('all');
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const router = useRouter();
  
  const toggleReviewSelection = (reviewId: string) => {
    setSelectedReviews(prev => 
      prev.includes(reviewId)
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      let query = supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
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
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setReviews(reviews.map(review => 
        review.id === id ? { ...review, status } : review
      ));

      toast({
        title: 'Success',
        description: `Review ${status} successfully.`,
      });
    } catch (error) {
      console.error('Error updating review status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update review status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ featured: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      setReviews(reviews.map(review => 
        review.id === id ? { ...review, featured: !currentStatus } : review
      ));

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
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setReviews(reviews.filter(review => review.id !== id));
      setSelectedReviews(selectedReviews.filter(reviewId => reviewId !== id));
      
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

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.author_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to load reviews. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Reviews</h1>
          <p className="text-muted-foreground">Manage customer and user reviews</p>
        </div>
        <Button onClick={() => router.push('/admin/reviews/new')}>
          <Plus className="mr-2 h-4 w-4" /> New Review
        </Button>
      </div>

      <div className="mb-6">
        <BulkActions
          selectedReviews={selectedReviews}
          reviews={reviews}
          onSelectionChange={setSelectedReviews}
          onUpdate={refreshData}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search reviews..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-auto">
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  id="select-all"
                  checked={selectedReviews.length === reviews.length && reviews.length > 0}
                  onCheckedChange={() => {
                    if (selectedReviews.length === reviews.length) {
                      setSelectedReviews([]);
                    } else {
                      setSelectedReviews(reviews.map(r => r.id));
                    }
                  }}
                  className="h-4 w-4"
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <TableRow key={review.id} className={selectedReviews.includes(review.id) ? 'bg-muted/50' : ''}>
                  <TableCell className="w-12">
                    <Checkbox
                      id={`select-${review.id}`}
                      checked={selectedReviews.includes(review.id)}
                      onCheckedChange={() => toggleReviewSelection(review.id)}
                      className="h-4 w-4"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="space-y-1">
                      <p className="font-medium">
                        <button
                          onClick={() => router.push(`/admin/reviews/${review.id}`)}
                          className="text-left hover:underline"
                        >
                          {review.title}
                        </button>
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {review.content}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground/30'
                          }`}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {review.author_avatar_url && (
                        <img
                          src={review.author_avatar_url}
                          alt={review.author_name}
                          className="h-8 w-8 rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-medium">{review.author_name}</p>
                        {(review.author_title || review.author_company) && (
                          <p className="text-xs text-muted-foreground">
                            {[review.author_title, review.author_company].filter(Boolean).join(' at ')}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(review.status)}>
                      {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(review.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${review.featured ? 'bg-primary/10' : ''}`}
                        onClick={() => handleToggleFeatured(review.id, review.featured)}
                        title={review.featured ? 'Remove from featured' : 'Add to featured'}
                      >
                        <Star
                          className={`h-4 w-4 ${review.featured ? 'fill-yellow-400 text-yellow-400' : ''}`}
                        />
                      </Button>
                      
                      {review.status !== 'approved' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                          onClick={() => handleStatusChange(review.id, 'approved')}
                          title="Approve"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {review.status !== 'rejected' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleStatusChange(review.id, 'rejected')}
                          title="Reject"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => router.push(`/admin/reviews/${review.id}/edit`)}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleDelete(review.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No matching reviews found' 
                    : 'No reviews found. Create your first review.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
