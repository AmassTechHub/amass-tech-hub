'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Check, X, Trash2, Star, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

type Review = {
  id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
};

type BulkActionsProps = {
  selectedReviews: string[];
  reviews: Review[];
  onSelectionChange: (selected: string[]) => void;
  onUpdate: () => void;
};

export function BulkActions({
  selectedReviews,
  reviews,
  onSelectionChange,
  onUpdate,
}: BulkActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState<string | null>(null);

  const selectedCount = selectedReviews.length;
  const allSelected = selectedCount === reviews.length && reviews.length > 0;

  const toggleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(reviews.map((review) => review.id));
    }
  };

  const handleBulkAction = async (actionType: string) => {
    if (selectedCount === 0) return;

    setIsLoading(true);
    setAction(actionType);

    try {
      let updateData: Partial<Review> = {};
      let successMessage = '';

      switch (actionType) {
        case 'approve':
          updateData = { status: 'approved' };
          successMessage = `${selectedCount} ${selectedCount === 1 ? 'review' : 'reviews'} approved`;
          break;
        case 'reject':
          updateData = { status: 'rejected' };
          successMessage = `${selectedCount} ${selectedCount === 1 ? 'review' : 'reviews'} rejected`;
          break;
        case 'pending':
          updateData = { status: 'pending' };
          successMessage = `${selectedCount} ${selectedCount === 1 ? 'review' : 'reviews'} marked as pending`;
          break;
        case 'feature':
          updateData = { featured: true };
          successMessage = `${selectedCount} ${selectedCount === 1 ? 'review' : 'reviews'} featured`;
          break;
        case 'unfeature':
          updateData = { featured: false };
          successMessage = `${selectedCount} ${selectedCount === 1 ? 'review' : 'reviews'} unfeatured`;
          break;
        case 'delete':
          if (!confirm(`Are you sure you want to delete ${selectedCount} ${selectedCount === 1 ? 'review' : 'reviews'}? This action cannot be undone.`)) {
            setIsLoading(false);
            setAction(null);
            return;
          }
          break;
        default:
          break;
      }

      if (actionType === 'delete') {
        const { error } = await supabase
          .from('reviews')
          .delete()
          .in('id', selectedReviews);

        if (error) throw error;

        successMessage = `${selectedCount} ${selectedCount === 1 ? 'review' : 'reviews'} deleted`;
      } else if (actionType === 'export') {
        // Export functionality will be implemented separately
        await new Promise(resolve => setTimeout(resolve, 1000));
        successMessage = `Exporting ${selectedCount} ${selectedCount === 1 ? 'review' : 'reviews'}...`;
      } else {
        const { error } = await supabase
          .from('reviews')
          .update(updateData)
          .in('id', selectedReviews);

        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: successMessage,
      });

      // Reset selection and refresh data
      onSelectionChange([]);
      onUpdate();
      router.refresh();
    } catch (error) {
      console.error(`Error performing ${actionType} action:`, error);
      toast({
        title: 'Error',
        description: `Failed to ${actionType} ${selectedCount === 1 ? 'review' : 'reviews'}. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setAction(null);
    }
  };

  if (selectedCount === 0 && !allSelected) {
    return (
      <div className="flex items-center space-x-2">
        <Checkbox
          id="select-all"
          checked={allSelected}
          onCheckedChange={toggleSelectAll}
          className="h-4 w-4"
        />
        <label
          htmlFor="select-all"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Select all {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
        </label>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all"
            checked={allSelected}
            onCheckedChange={toggleSelectAll}
            className="h-4 w-4"
          />
          <label
            htmlFor="select-all"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {selectedCount} {selectedCount === 1 ? 'review' : 'reviews'} selected
          </label>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={isLoading}>
              {isLoading && action === 'approve' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Approve
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => handleBulkAction('approve')}>
              <Check className="mr-2 h-4 w-4" />
              Approve selected
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleBulkAction('reject')}>
              <X className="mr-2 h-4 w-4" />
              Reject selected
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleBulkAction('pending')}>
              <span className="mr-2 h-4 w-4 flex items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
              </span>
              Mark as pending
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={isLoading}>
              {isLoading && (action === 'feature' || action === 'unfeature') ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Star className="mr-2 h-4 w-4" />
              )}
              Feature
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => handleBulkAction('feature')}>
              <Star className="mr-2 h-4 w-4 fill-yellow-400 text-yellow-400" />
              Feature selected
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleBulkAction('unfeature')}>
              <Star className="mr-2 h-4 w-4" />
              Unfeature selected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleBulkAction('delete')}
          disabled={isLoading}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          {isLoading && action === 'delete' ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="mr-2 h-4 w-4" />
          )}
          Delete
        </Button>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleBulkAction('export')}
        disabled={isLoading}
      >
        {isLoading && action === 'export' ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        Export
      </Button>
    </div>
  );
}
