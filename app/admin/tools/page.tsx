'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { AdminPage } from '@/components/admin/AdminPage';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import { fetchTableData, updateStatus } from '@/lib/admin/data-fetching';

interface Tool {
  id: string;
  name: string;
  description: string | null;
  url: string;
  icon_url: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
  category: string | null;
  status: 'draft' | 'published' | 'archived';
  rating?: number;
}

const columns: ColumnDef<Tool>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'url',
    header: 'URL',
    cell: ({ row }) => (
      <a 
        href={row.getValue('url')} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        View
      </a>
    ),
  },
  {
    accessorKey: 'featured',
    header: 'Featured',
    cell: ({ row }) => (
      <span className="capitalize">
        {row.getValue('featured') ? 'Yes' : 'No'}
      </span>
    ),
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => new Date(row.getValue('created_at')).toLocaleDateString(),
  },
];

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await fetchTableData<Tool>('tools');
      
      if (error) throw error;
      
      setTools(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching tools:', err);
      setError(err instanceof Error ? err : new Error('Failed to load tools'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const { data, error } = await updateStatus<Tool>('tools', id, status);
      
      if (error) throw error;
      
      setTools(tools.map(tool => 
        tool.id === id ? { ...tool, status } : tool
      ));
    } catch (err) {
      console.error('Error updating tool status:', err);
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tool?')) return;
    
    try {
      const supabase = (await import('@/lib/supabase/client')).default;
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTools(tools.filter(tool => tool.id !== id));
    } catch (err) {
      console.error('Error deleting tool:', err);
      throw err;
    }
  };

  return (
    <AdminPage 
      title="Tools & Resources"
      subtitle="Manage tools and resources for your community"
      isLoading={isLoading}
      error={error}
      actions={
        <Button onClick={() => router.push('/admin/tools/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Tool
        </Button>
      }
    >
      <AdminDataTable
        columns={columns}
        data={tools}
        searchKey="name"
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        editHref={(id) => `/admin/tools/${id}/edit`}
        viewHref={(id) => `/tools/${id}`}
        statusOptions={[
          { value: 'draft', label: 'Draft' },
          { value: 'published', label: 'Published' },
          { value: 'archived', label: 'Archived' },
        ]}
      />
    </AdminPage>
  )
}
