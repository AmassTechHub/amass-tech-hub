'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, HelpCircle, Search, Eye, ListOrdered, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { AdminPage } from '@/components/admin/AdminPage';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import { fetchTableData, updateStatus } from '@/lib/admin/data-fetching';

export interface FAQCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  is_featured: boolean;
  faq_count?: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  slug: string;
  category_id: string | null;
  category?: FAQCategory | null;
  order_index: number;
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  featured_order: number | null;
  tags: string[];
  author_id?: string;
  last_updated_by?: string;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  views: number;
  helpful_yes: number;
  helpful_no: number;
  meta?: Record<string, any>;
}

const columns: ColumnDef<FAQItem>[] = [
  {
    accessorKey: 'question',
    header: 'Question',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.getValue('question')}</span>
        <div className="text-xs text-muted-foreground line-clamp-2">
          {row.original.answer.replace(/<[^>]*>?/gm, '')}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.category?.icon && (
          <span className="text-muted-foreground">{row.original.category.icon}</span>
        )}
        <span>{row.original.category?.name || 'Uncategorized'}</span>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge 
        variant={
          row.getValue('status') === 'published' ? 'default' :
          row.getValue('status') === 'draft' ? 'outline' : 'destructive'
        }
        className="capitalize"
      >
        {row.getValue('status')}
      </Badge>
    ),
  },
  {
    accessorKey: 'views',
    header: 'Views',
    cell: ({ row }) => row.original.views?.toLocaleString() || '0',
  },
  {
    accessorKey: 'helpful_score',
    header: 'Helpful',
    cell: ({ row }) => {
      const { helpful_yes = 0, helpful_no = 0 } = row.original;
      const total = helpful_yes + helpful_no;
      const percentage = total > 0 ? Math.round((helpful_yes / total) * 100) : 0;
      
      return (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-xs w-8">{percentage}%</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'updated_at',
    header: 'Last Updated',
    cell: ({ row }) => new Date(row.getValue('updated_at')).toLocaleDateString(),
  },
];

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    fetchFAQs();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await fetchTableData<FAQCategory>(
        'faq_categories',
        '*',
        { column: 'order', ascending: true }
      );
      
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err : new Error('Failed to load categories'));
    }
  };

  const fetchFAQs = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await fetchTableData<FAQItem>(
        'faqs',
        `
          *,
          category:category_id (*)
        `,
        { column: 'order_index', ascending: true }
      );
      
      if (error) throw error;
      
      setFaqs(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      setError(err instanceof Error ? err : new Error('Failed to load FAQs'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const { data, error } = await updateStatus<FAQItem>('faqs', id, status);
      
      if (error) throw error;
      
      setFaqs(faqs.map(faq => 
        faq.id === id ? { ...faq, status } : faq
      ));
    } catch (err) {
      console.error('Error updating FAQ status:', err);
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ? This action cannot be undone.')) return;
    
    try {
      const supabase = (await import('@/lib/supabase/client')).default;
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setFaqs(faqs.filter(faq => faq.id !== id));
    } catch (err) {
      console.error('Error deleting FAQ:', err);
      throw err;
    }
  };

  const handleFeatureToggle = async (id: string, isFeatured: boolean) => {
    try {
      const supabase = (await import('@/lib/supabase/client')).default;
      const { error } = await supabase
        .from('faqs')
        .update({ 
          is_featured: !isFeatured,
          featured_order: !isFeatured ? 0 : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      setFaqs(faqs.map(faq => 
        faq.id === id 
          ? { 
              ...faq, 
              is_featured: !isFeatured,
              featured_order: !isFeatured ? 0 : null 
            } 
          : faq
      ));
    } catch (err) {
      console.error('Error toggling featured status:', err);
      throw err;
    }
  };

  const handleReorder = async (startIndex: number, endIndex: number) => {
    try {
      const items = Array.from(faqs);
      const [removed] = items.splice(startIndex, 1);
      items.splice(endIndex, 0, removed);
      
      // Update local state immediately for a responsive UI
      setFaqs(items);
      
      // Update the order in the database
      const updates = items.map((item, index) => ({
        id: item.id,
        order_index: index,
        updated_at: new Date().toISOString()
      }));
      
      const supabase = (await import('@/lib/supabase/client')).default;
      const { error } = await supabase
        .from('faqs')
        .upsert(updates, { onConflict: 'id' });
        
      if (error) throw error;
      
    } catch (err) {
      console.error('Error reordering FAQs:', err);
      // Revert local state on error
      fetchFAQs();
    }
  };

  return (
    <AdminPage 
      title="Frequently Asked Questions"
      subtitle="Manage your help center's frequently asked questions"
      isLoading={isLoading}
      error={error}
      actions={
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => router.push('/admin/faqs/categories')}
          >
            <ListOrdered className="mr-2 h-4 w-4" />
            Categories
          </Button>
          <Button onClick={() => router.push('/admin/faqs/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New FAQ
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search FAQs..."
              className="w-full pl-9"
              // Add search functionality here
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select
              className="flex h-10 w-full sm:w-[200px] rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} {category.faq_count ? `(${category.faq_count})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <AdminDataTable
          columns={columns}
          data={faqs}
          searchKey="question"
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onReorder={handleReorder}
          editHref={(id) => `/admin/faqs/${id}/edit`}
          viewHref={(faq) => `/faq/${faq.slug || faq.id}`}
          statusOptions={[
            { value: 'draft', label: 'Draft' },
            { value: 'published', label: 'Published' },
            { value: 'archived', label: 'Archived' },
          ]}
          additionalActions={[
            {
              id: 'featured',
              label: 'Featured',
              icon: 'Star',
              onClick: (id) => {
                const faq = faqs.find(f => f.id === id);
                if (faq) {
                  handleFeatureToggle(id, faq.is_featured || false);
                }
              },
              isActive: (id) => {
                const faq = faqs.find(f => f.id === id);
                return faq?.is_featured || false;
              },
              activeVariant: 'default',
              tooltip: 'Toggle featured status'
            },
            {
              id: 'preview',
              label: 'Preview',
              icon: 'Eye',
              onClick: (id) => {
                const faq = faqs.find(f => f.id === id);
                if (faq) {
                  window.open(`/faq/${faq.slug || faq.id}`, '_blank');
                }
              },
              variant: 'ghost',
              tooltip: 'Preview FAQ'
            }
          ]}
        />
      </div>
    </AdminPage>
  )
}
