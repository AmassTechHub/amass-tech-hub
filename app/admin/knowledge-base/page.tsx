'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, BookOpen, Eye, Tag, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { AdminPage } from '@/components/admin/AdminPage';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import { fetchTableData, updateStatus } from '@/lib/admin/data-fetching';

interface KnowledgeBaseCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  is_featured: boolean;
}

interface KnowledgeBaseArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category_id: string | null;
  category?: KnowledgeBaseCategory | null;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  view_count: number;
  helpful_yes: number;
  helpful_no: number;
  author_id?: string;
  last_updated_by?: string;
  seo_title?: string;
  seo_description?: string;
  featured_image?: string;
  related_articles?: string[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
  reading_time?: number; // in minutes
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  is_featured?: boolean;
  featured_order?: number | null;
  meta?: Record<string, any>;
}

const columns: ColumnDef<KnowledgeBaseArticle>[] = [
  {
    accessorKey: 'title',
    header: 'Article Title',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.getValue('title')}</span>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{row.original.reading_time || 5} min read</span>
          <span>•</span>
          <span>{row.original.view_count || 0} views</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => row.original.category?.name || 'Uncategorized',
  },
  {
    accessorKey: 'difficulty',
    header: 'Level',
    cell: ({ row }) => {
      const difficulty = row.getValue('difficulty') as string || 'beginner';
      const variant = {
        beginner: 'default',
        intermediate: 'outline',
        advanced: 'destructive',
      }[difficulty] as 'default' | 'outline' | 'destructive';
      
      return (
        <Badge variant={variant} className="capitalize">
          {difficulty}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1 max-w-[200px]">
        {row.original.tags?.slice(0, 2).map(tag => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
        {row.original.tags?.length > 2 && (
          <Badge variant="outline" className="text-xs">
            +{row.original.tags.length - 2} more
          </Badge>
        )}
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
    accessorKey: 'updated_at',
    header: 'Last Updated',
    cell: ({ row }) => new Date(row.getValue('updated_at')).toLocaleDateString(),
  },
];

export default function KnowledgeBasePage() {
  const [articles, setArticles] = useState<KnowledgeBaseArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [categories, setCategories] = useState<KnowledgeBaseCategory[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, [])

  const fetchCategories = async () => {
    try {
      const { data, error } = await fetchTableData<KnowledgeBaseCategory>(
        'knowledge_base_categories',
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

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await fetchTableData<KnowledgeBaseArticle>(
        'knowledge_base',
        `
          *,
          category:category_id (*)
        `,
        { column: 'created_at', ascending: false }
      );
      
      if (error) throw error;
      
      // Calculate reading time for each article
      const articlesWithReadingTime = (data || []).map(article => ({
        ...article,
        reading_time: Math.ceil((article.content?.split(/\s+/).length || 0) / 200) || 1, // 200 words per minute
      }));
      
      setArticles(articlesWithReadingTime);
      setError(null);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError(err instanceof Error ? err : new Error('Failed to load articles'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const { data, error } = await updateStatus<KnowledgeBaseArticle>('knowledge_base', id, status);
      
      if (error) throw error;
      
      setArticles(articles.map(article => 
        article.id === id ? { ...article, status } : article
      ));
    } catch (err) {
      console.error('Error updating article status:', err);
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) return;
    
    try {
      const supabase = (await import('@/lib/supabase/client')).default;
      const { error } = await supabase
        .from('knowledge_base')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setArticles(articles.filter(article => article.id !== id));
    } catch (err) {
      console.error('Error deleting article:', err);
      throw err;
    }
  };

  const handleFeatureToggle = async (id: string, isFeatured: boolean) => {
    try {
      const supabase = (await import('@/lib/supabase/client')).default;
      const { error } = await supabase
        .from('knowledge_base')
        .update({ 
          is_featured: !isFeatured,
          featured_order: !isFeatured ? 0 : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      setArticles(articles.map(article => 
        article.id === id 
          ? { 
              ...article, 
              is_featured: !isFeatured,
              featured_order: !isFeatured ? 0 : null 
            } 
          : article
      ));
    } catch (err) {
      console.error('Error toggling featured status:', err);
      throw err;
    }
  };

  return (
    <AdminPage 
      title="Knowledge Base"
      subtitle="Manage your help center articles and documentation"
      isLoading={isLoading}
      error={error}
      actions={
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => router.push('/admin/knowledge-base/categories')}
          >
            <Tag className="mr-2 h-4 w-4" />
            Categories
          </Button>
          <Button onClick={() => router.push('/admin/knowledge-base/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Article
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search articles..."
              className="w-full pl-9"
              // Add search functionality here
            />
          </div>
          
          <select
            className="flex h-10 w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            // Add category filter functionality here
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <AdminDataTable
          columns={columns}
          data={articles}
          searchKey="title"
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          editHref={(id) => `/admin/knowledge-base/${id}/edit`}
          viewHref={(article) => `/knowledge-base/${article.slug}`}
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
                const article = articles.find(a => a.id === id);
                if (article) {
                  handleFeatureToggle(id, article.is_featured || false);
                }
              },
              isActive: (id) => {
                const article = articles.find(a => a.id === id);
                return article?.is_featured || false;
              },
              activeVariant: 'default',
              tooltip: 'Toggle featured status'
            },
            {
              id: 'preview',
              label: 'Preview',
              icon: 'Eye',
              onClick: (id) => {
                const article = articles.find(a => a.id === id);
                if (article) {
                  window.open(`/knowledge-base/${article.slug}`, '_blank');
                }
              },
              variant: 'ghost',
              tooltip: 'Preview article'
            }
          ]}
        />
      </div>
    </AdminPage>
  )
}
