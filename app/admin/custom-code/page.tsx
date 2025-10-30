'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Code as CodeIcon, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Search, 
  Eye, 
  Code2, 
  FileCode, 
  Terminal,
  Pencil,
  Copy,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ColumnDef } from '@tanstack/react-table';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export type CodeSnippetLocation = 'head' | 'body_start' | 'body_end';
export type DeviceType = 'all' | 'desktop' | 'tablet' | 'mobile';
export type CodeSnippetStatus = 'draft' | 'active' | 'inactive' | 'scheduled';

export interface CodeSnippet {
  id: string;
  name: string;
  description: string | null;
  code: string;
  location: CodeSnippetLocation;
  device_type: DeviceType;
  status: CodeSnippetStatus;
  author_id?: string;
  last_updated_by?: string;
  priority: number;
  start_date?: string | null;
  end_date?: string | null;
  created_at: string;
  updated_at: string;
  meta?: Record<string, any>;
  conditions?: {
    pages?: string[];
    user_roles?: string[];
    logged_in?: boolean;
    query_params?: Record<string, string>;
  };
}

const locationLabels: Record<CodeSnippetLocation, { label: string; icon: any }> = {
  head: { label: 'Head', icon: FileCode },
  body_start: { label: 'Body Start', icon: Code2 },
  body_end: { label: 'Body End', icon: Terminal },
};

const deviceIcons: Record<DeviceType, { icon: any; label: string }> = {
  all: { icon: Monitor, label: 'All Devices' },
  desktop: { icon: Monitor, label: 'Desktop' },
  tablet: { icon: Tablet, label: 'Tablet' },
  mobile: { icon: Smartphone, label: 'Mobile' },
};

const statusVariants: Record<
  CodeSnippetStatus,
  { label: string; variant: 'default' | 'destructive' | 'outline' | 'secondary' }
> = {
  draft: { label: 'Draft', variant: 'outline' },
  active: { label: 'Active', variant: 'default' },
  inactive: { label: 'Inactive', variant: 'secondary' },
  scheduled: { label: 'Scheduled', variant: 'outline' },
};

export default function CustomCodePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [filteredSnippets, setFilteredSnippets] = useState<CodeSnippet[]>([]);
  const supabase = createClient();

  const columns: ColumnDef<CodeSnippet>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-primary/10 text-primary">
            <Code2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{row.getValue('name')}</span>
            {row.original.description && (
              <span className="text-xs text-muted-foreground line-clamp-1">
                {row.original.description}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => {
        const location = row.original.location;
        const { icon: Icon, label } = locationLabels[location];
        return (
          <div className="flex items-center space-x-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span>{label}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'device_type',
      header: 'Devices',
      cell: ({ row }) => {
        const deviceType = row.original.device_type as DeviceType;
        const { icon: Icon, label } = deviceIcons[deviceType];
        return (
          <div className="flex items-center space-x-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="hidden sm:inline">{label}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const { label, variant } = statusVariants[status];
        return <Badge variant={variant}>{label}</Badge>;
      },
    },
    {
      accessorKey: 'updated_at',
      header: 'Last Updated',
      cell: ({ row }) => {
        const date = new Date(row.original.updated_at);
        return (
          <div className="text-sm text-muted-foreground">
            <div>{format(date, 'MMM d, yyyy')}</div>
            <div className="text-xs">{format(date, 'h:mm a')}</div>
          </div>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const snippet = row.original;

        const handleDelete = async () => {
          if (confirm('Are you sure you want to delete this snippet?')) {
            try {
              const { error } = await supabase
                .from('custom_code')
                .delete()
                .eq('id', snippet.id);

              if (error) throw error;
              toast.success('Snippet deleted successfully');
              fetchSnippets();
            } catch (err) {
              console.error('Error deleting snippet:', err);
              toast.error('Failed to delete snippet');
            }
          }
        };

        const handleDuplicate = async () => {
          try {
            const { data: newSnippet, error } = await supabase
              .from('custom_code')
              .insert([
                {
                  ...snippet,
                  name: `${snippet.name} (Copy)`,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                },
              ])
              .select()
              .single();

            if (error) throw error;
            toast.success('Snippet duplicated successfully');
            router.push(`/admin/custom-code/${newSnippet.id}`);
          } catch (err) {
            console.error('Error duplicating snippet:', err);
            toast.error('Failed to duplicate snippet');
          }
        };

        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/admin/custom-code/${snippet.id}`)}
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDuplicate}
              title="Duplicate"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toast.info('Preview coming soon')}
              title="Preview"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              title="Delete"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const fetchSnippets = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('custom_code')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setSnippets(data || []);
      setFilteredSnippets(data || []);
    } catch (err) {
      console.error('Error fetching snippets:', err);
      toast.error('Failed to load snippets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSnippets();
  }, []);

  useEffect(() => {
    const filtered = snippets.filter((snippet) => {
      const statusMatch = statusFilter === 'all' || snippet.status === statusFilter;
      const locationMatch = locationFilter === 'all' || snippet.location === locationFilter;
      const searchMatch = snippet.name.toLowerCase().includes(searchQuery.toLowerCase());
      return statusMatch && locationMatch && searchMatch;
    });
    setFilteredSnippets(filtered);
  }, [snippets, statusFilter, locationFilter, searchQuery]);

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Custom Code</h1>
          <p className="text-muted-foreground">
            Manage custom code snippets that run on your site
          </p>
        </div>
        <Button onClick={() => router.push('/admin/custom-code/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Snippet
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search snippets..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="head">Head</SelectItem>
                <SelectItem value="body_start">Body Start</SelectItem>
                <SelectItem value="body_end">Body End</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <AdminDataTable
            columns={columns}
            data={filteredSnippets}
            isLoading={isLoading}
          />
        </div>

        {!isLoading && filteredSnippets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center border rounded-md">
            <CodeIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-1">No snippets found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery || statusFilter !== 'all' || locationFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding a new code snippet.'}
            </p>
            <Button onClick={() => router.push('/admin/custom-code/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Snippet
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
