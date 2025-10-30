'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Edit, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface AdminDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
  editHref?: (id: string) => string;
  viewHref?: (id: string) => string;
  statusOptions?: { value: string; label: string }[];
  isLoading?: boolean;
}

export function AdminDataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  onDelete,
  onStatusChange,
  editHref,
  viewHref,
  statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ],
  isLoading = false,
}: AdminDataTableProps<TData, TValue>) {
  const actionColumn: ColumnDef<TData, TValue> = {
    id: 'actions',
    cell: ({ row }) => {
      const item = row.original as any;
      
      return (
        <div className="flex items-center space-x-2">
          {viewHref && (
            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <Link href={viewHref(item.id)} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">View</span>
              </Link>
            </Button>
          )}
          
          {editHref && (
            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <Link href={editHref(item.id)}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Link>
            </Button>
          )}
          
          {onStatusChange && statusOptions.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const currentStatus = item.status || 'inactive';
                const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
                onStatusChange(item.id, newStatus);
              }}
            >
              {item.status === 'active' ? (
                <X className="h-4 w-4 text-red-500" />
              ) : (
                <Check className="h-4 w-4 text-green-500" />
              )}
              <span className="sr-only">Toggle status</span>
            </Button>
          )}
          
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
              <span className="sr-only">Delete</span>
            </Button>
          )}
        </div>
      );
    },
  };

  const statusColumn: ColumnDef<TData, TValue> = {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = (row.getValue('status') as string) || 'inactive';
      return (
        <Badge variant={status === 'active' ? 'default' : 'outline'} className="capitalize">
          {status}
        </Badge>
      );
    },
  };

  const allColumns = [
    ...columns,
    ...(onStatusChange ? [statusColumn] : []),
    actionColumn,
  ];

  return (
    <DataTable
      columns={allColumns}
      data={data}
      searchKey={searchKey}
      isLoading={isLoading}
    />
  );
}
