'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Column<T> = {
  id: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  filterable?: boolean;
  filterType?: 'text' | 'select';
  filterOptions?: { value: string; label: string }[];
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  searchTerm: string;
  onSearch: (term: string) => void;
  onAddNew?: () => void;
  addNewLabel?: string;
  filters?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
  emptyMessage?: string;
};

export function DataTable<T extends { id: string }>({
  columns,
  data,
  isLoading = false,
  searchTerm,
  onSearch,
  onAddNew,
  addNewLabel = 'Add New',
  filters = {},
  onFilterChange = () => {},
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  const filterableColumns = columns.filter(col => col.filterable);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        
        {filterableColumns.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filterableColumns.map((column) => {
              if (column.filterType === 'select' && column.filterOptions) {
                return (
                  <Select
                    key={column.id}
                    value={filters[column.id] || ''}
                    onValueChange={(value) => onFilterChange(column.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={`Filter by ${column.header}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {column.filterOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              }
              return null;
            })}
          </div>
        )}
        
        {onAddNew && (
          <Button onClick={onAddNew} className="ml-auto">
            <Plus className="mr-2 h-4 w-4" />
            {addNewLabel}
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {searchTerm || Object.values(filters).some(Boolean)
                    ? 'No matching results found'
                    : emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <TableCell key={`${row.id}-${column.id}`}>
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
