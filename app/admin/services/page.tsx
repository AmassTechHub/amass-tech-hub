'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { AdminPage } from '@/components/admin/AdminPage';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import { fetchTableData, updateStatus } from '@/lib/admin/data-fetching';
import { Badge } from '@/components/ui/badge';

interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  details: string | null;
  icon_name: string | null;
  featured: boolean;
  category_id: string | null;
  category?: ServiceCategory | null;
  status: 'draft' | 'published' | 'archived';
  price_range?: string;
  duration?: string;
  created_at: string;
  updated_at: string;
  seo_title?: string;
  seo_description?: string;
  tags?: string[];
  requirements?: string[];
  deliverables?: string[];
  faqs?: Array<{ question: string; answer: string }>;
  testimonials?: Array<{ name: string; role: string; content: string }>;
  gallery?: Array<{ url: string; alt: string }>;
  related_services?: string[];
  is_featured?: boolean;
  featured_order?: number | null;
  booking_url?: string;
  support_email?: string;
  support_phone?: string;
  service_type?: 'standard' | 'premium' | 'enterprise';
  rating?: number;
  review_count?: number;
  has_demo?: boolean;
  demo_url?: string;
  documentation_url?: string;
  video_url?: string;
  what_you_get?: string[];
  process?: Array<{ step: number; title: string; description: string }>;
  technologies?: string[];
  team_members?: Array<{ name: string; role: string; bio: string; avatar_url: string }>;
  pricing_options?: Array<{
    name: string;
    price: number;
    currency: string;
    period?: string;
    features: string[];
    is_popular?: boolean;
  }>;
}

const columns: ColumnDef<Service>[] = [
  {
    accessorKey: 'name',
    header: 'Service Name',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.icon_name && (
          <span className="text-lg">{row.original.icon_name}</span>
        )}
        <span className="font-medium">{row.getValue('name')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => row.original.category?.name || 'Uncategorized',
  },
  {
    accessorKey: 'service_type',
    header: 'Type',
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.getValue('service_type') || 'standard'}
      </Badge>
    ),
  },
  {
    accessorKey: 'price_range',
    header: 'Price Range',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge
        variant={
          row.getValue('status') === 'published'
            ? 'default'
            : row.getValue('status') === 'draft'
            ? 'outline'
            : 'destructive'
        }
        className="capitalize"
      >
        {row.getValue('status')}
      </Badge>
    ),
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) =>
      new Date(row.getValue('created_at')).toLocaleDateString(),
  },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } =
        await fetchTableData<ServiceCategory>('service_categories');
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(
        err instanceof Error ? err : new Error('Failed to load categories')
      );
    }
  };

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await fetchTableData<Service>(
        'services',
        `
        *,
        category:category_id (*)
      `
      );

      if (error) throw error;

      setServices(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(
        err instanceof Error ? err : new Error('Failed to load services')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const { error } = await updateStatus<Service>('services', id, status);
      if (error) throw error;

      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status } : s))
      );
    } catch (err) {
      console.error('Error updating service status:', err);
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this service? This action cannot be undone.'
      )
    )
      return;

    try {
      const supabase = (await import('@/lib/supabase/client')).default;
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Error deleting service:', err);
      throw err;
    }
  };

  const handleFeatureToggle = async (id: string, isFeatured: boolean) => {
    try {
      const supabase = (await import('@/lib/supabase/client')).default;
      const { error } = await supabase
        .from('services')
        .update({
          is_featured: !isFeatured,
          featured_order: !isFeatured ? 0 : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      setServices((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                is_featured: !isFeatured,
                featured_order: !isFeatured ? 0 : null,
              }
            : s
        )
      );
    } catch (err) {
      console.error('Error toggling featured status:', err);
      throw err;
    }
  };

  return (
    <AdminPage
      title="Services Management"
      subtitle="Manage your services and offerings"
      isLoading={isLoading}
      error={error}
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/service-categories')}
          >
            Categories
          </Button>
          <Button onClick={() => router.push('/admin/services/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </div>
      }
    >
      <AdminDataTable
        columns={columns}
        data={services}
        searchKey="name"
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        editHref={(id) => `/admin/services/${id}/edit`}
        viewHref={(id) => `/services/${id}`}
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
              const service = services.find((s) => s.id === id);
              if (service) {
                handleFeatureToggle(id, service.is_featured || false);
              }
            },
            isActive: (id) => {
              const service = services.find((s) => s.id === id);
              return service?.is_featured || false;
            },
            activeVariant: 'default',
            tooltip: 'Toggle featured status',
          },
          {
            id: 'preview',
            label: 'Preview',
            icon: 'Eye',
            onClick: (id) => {
              window.open(`/services/${id}`, '_blank');
            },
            variant: 'ghost',
            tooltip: 'Preview service',
          },
        ]}
      />
    </AdminPage>
  );
}
