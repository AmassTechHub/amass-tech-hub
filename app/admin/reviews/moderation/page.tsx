'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Clock, AlertCircle, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabase';
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
  created_at: string;
  updated_at: string;
};

type ModerationStats = {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
  avgResponseTime: number;
};

export default function ModerationQueue() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ModerationStats>({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
    avgResponseTime: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'pending' | 'recent'>('pending');
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);

  useEffect(() => {
    fetchModerationData();
  }, [selectedTab]);

  const fetchModerationData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch review statistics
      const { count: pendingCount } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: approvedCount } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      const { count: rejectedCount } = await supapshot
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rejected');

      // Calculate average response time (in hours)
      const { data: responseTimes } = await supabase
        .from('reviews')
        .select('created_at, updated_at')
        .neq('status', 'pending');

      const avgResponseTime = responseTimes && responseTimes.length > 0
        ? responseTimes.reduce((acc, review) => {
            const createdAt = new Date(review.created_at).getTime();
            const updatedAt = new Date(review.updated_at).getTime();
            const responseTimeHours = (updatedAt - createdAt) / (1000 * 60 * 60);
            return acc + responseTimeHours;
          }, 0) / responseTimes.length
        : 0;

      setStats({
        pending: pendingCount || 0,
        approved: approvedCount || 0,
        rejected: rejectedCount || 0,
        total: (pendingCount || 0) + (approvedCount || 0) + (rejectedCount || 0),
        avgResponseTime: Math.round(avgResponseTime * 10) / 10, // Round to 1 decimal place
      });

      // Fetch reviews based on selected tab
      let query = supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedTab === 'pending') {
        query = query.eq('status', 'pending');
      } else {
        // For recent tab, show latest 50 reviews regardless of status
        query = query.limit(50);
      }

      const { data, error } = await query;

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching moderation data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load moderation data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (reviewId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString() 
        })
        .eq('id', reviewId);

      if (error) throw error;

      // Update local state
      setReviews(reviews.filter(review => review.id !== reviewId));
      setStats(prev => ({
        ...prev,
        pending: newStatus === 'pending' ? prev.pending : prev.pending - 1,
        [newStatus]: prev[newStatus] + 1,
      }));

      toast({
        title: 'Success',
        description: `Review ${newStatus} successfully.`,
      });
    } catch (error) {
      console.error('Error updating review status:', error);
      toast({
        title: 'Error',
        description: `Failed to ${newStatus} review. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  const handleBulkAction = async (action: 'approve' | 'reject') => {
    if (selectedReviews.length === 0) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .update({ 
          status: action === 'approve' ? 'approved' : 'rejected',
          updated_at: new Date().toISOString() 
        })
        .in('id', selectedReviews);

      if (error) throw error;

      // Update local state
      setReviews(reviews.filter(review => !selectedReviews.includes(review.id)));
      
      setStats(prev => ({
        ...prev,
        pending: prev.pending - selectedReviews.length,
        [action === 'approve' ? 'approved' : 'rejected']: 
          prev[action === 'approve' ? 'approved' : 'rejected'] + selectedReviews.length,
      }));

      toast({
        title: 'Success',
        description: `${selectedReviews.length} ${selectedReviews.length === 1 ? 'review' : 'reviews'} ${action === 'approve' ? 'approved' : 'rejected'}.`,
      });

      // Clear selection
      setSelectedReviews([]);
    } catch (error) {
      console.error(`Error performing bulk ${action}:`, error);
      toast({
        title: 'Error',
        description: `Failed to ${action} selected reviews. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  const toggleSelectAll = () => {
    if (selectedReviews.length === reviews.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(reviews.map(review => review.id));
    }
  };

  const toggleReviewSelection = (reviewId: string) => {
    setSelectedReviews(prev => 
      prev.includes(reviewId)
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const filteredReviews = reviews.filter(review => 
    review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.author_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Review Moderation</h1>
          <p className="text-muted-foreground">
            Manage and moderate user-submitted reviews
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pending === 1 ? 'review' : 'reviews'} waiting
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <Check className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">
                {stats.approved === 1 ? 'review' : 'reviews'} approved
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <X className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rejected}</div>
              <p className="text-xs text-muted-foreground">
                {stats.rejected === 1 ? 'review' : 'reviews'} rejected
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Response</CardTitle>
              <AlertCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgResponseTime}h</div>
              <p className="text-xs text-muted-foreground">
                average response time
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs 
          defaultValue="pending" 
          className="space-y-4"
          onValueChange={(value) => setSelectedTab(value as 'pending' | 'recent')}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="pending">
                Pending
                {stats.pending > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {stats.pending}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="recent">
                Recent Activity
              </TabsTrigger>
            </TabsList>
            
            <div className="flex flex-1 items-center space-x-2 max-w-md">
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
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </div>
          </div>

          <TabsContent value="pending" className="space-y-4">
            {selectedReviews.length > 0 && (
              <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">
                  {selectedReviews.length} {selectedReviews.length === 1 ? 'review' : 'reviews'} selected
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('approve')}
                    disabled={isLoading}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Approve Selected
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('reject')}
                    disabled={isLoading}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reject Selected
                  </Button>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-medium">No reviews to moderate</h3>
                <p className="text-sm text-muted-foreground max-w-md mt-1">
                  All caught up! There are no pending reviews at the moment.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <Card key={review.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="p-4 flex items-start space-x-4 flex-1">
                        <Checkbox
                          id={`select-${review.id}`}
                          checked={selectedReviews.includes(review.id)}
                          onCheckedChange={() => toggleReviewSelection(review.id)}
                          className="mt-1"
                        />
                        <div className="space-y-2 flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{review.title}</h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant={getStatusBadgeVariant(review.status)}>
                                  {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(review.created_at)}
                                </span>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            {review.content.length > 200
                              ? `${review.content.substring(0, 200)}...`
                              : review.content}
                          </p>
                          
                          <div className="flex items-center pt-2">
                            <Avatar className="h-8 w-8 mr-2">
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
                              <p className="text-sm font-medium">{review.author_name}</p>
                              {(review.author_title || review.author_company) && (
                                <p className="text-xs text-muted-foreground">
                                  {[review.author_title, review.author_company].filter(Boolean).join(' at ')}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t md:border-t-0 md:border-l p-4 flex flex-col space-y-2 md:w-48 flex-shrink-0">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => router.push(`/admin/reviews/${review.id}`)}
                        >
                          <span className="mr-2">👁️</span> View Details
                        </Button>
                        <div className="flex space-x-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="flex-1"
                                  onClick={() => handleStatusUpdate(review.id, 'approved')}
                                >
                                  <Check className="h-4 w-4 text-green-500" />
                                  <span className="sr-only">Approve</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Approve</TooltipContent>
                            </Tooltip>
                          </Tooltip>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="flex-1"
                                  onClick={() => handleStatusUpdate(review.id, 'rejected')}
                                >
                                  <X className="h-4 w-4 text-red-500" />
                                  <span className="sr-only">Reject</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Reject</TooltipContent>
                            </Tooltip>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <Card key={review.id} className="overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{review.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={getStatusBadgeVariant(review.status)}>
                              {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(review.updated_at)}
                            </span>
                          </div>
                        </div>
                        {renderStars(review.rating)}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-2">
                        {review.content.length > 200
                          ? `${review.content.substring(0, 200)}...`
                          : review.content}
                      </p>
                      
                      <div className="flex items-center justify-between mt-4 pt-2 border-t">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            {review.author_avatar_url ? (
                              <AvatarImage src={review.author_avatar_url} alt={review.author_name} />
                            ) : (
                              <AvatarFallback className="text-xs">
                                {review.author_name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <p className="text-sm">{review.author_name}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => router.push(`/admin/reviews/${review.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
