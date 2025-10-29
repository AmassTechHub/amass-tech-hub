import { useState, useEffect, useCallback } from 'react';
import { useApi } from './use-api';
import { Content, ContentType, ContentStatus, ContentListResponse } from '../types/content';

interface ContentFilters {
  type?: ContentType;
  status?: 'draft' | 'published' | 'archived';
  isFeatured?: boolean;
  limit?: number;
  offset?: number;
  search?: string;
}

export function useContent(initialFilters: ContentFilters = {}) {
  const [filters, setFilters] = useState<ContentFilters>({
    limit: 10,
    offset: 0,
    ...initialFilters,
  });

  const [contentList, setContentList] = useState<Content[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const api = useApi<ContentListResponse>('/api/content');

  const buildQueryString = useCallback((filters: ContentFilters) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });

    return params.toString();
  }, []);

  const fetchContent = useCallback(async (reset = false) => {
    const query = buildQueryString(filters);
    const { data, error } = await api.request({
      method: 'GET',
      skipToast: true,
    }, `?${query}`);

    if (!error && data) {
      if (reset || filters.offset === 0) {
        setContentList(data.data || []);
      } else {
        setContentList(prev => [...prev, ...(data.data || [])]);
      }
      setTotalCount(data.pagination?.total || 0);
    }

    return { data, error };
  }, [api, buildQueryString, filters]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore) return;
    
    setIsLoadingMore(true);
    setFilters(prev => ({
      ...prev,
      offset: (prev.offset || 0) + (prev.limit || 10),
    }));
  }, [isLoadingMore]);

  const refetch = useCallback(() => {
    return fetchContent(true);
  }, [fetchContent]);

  // Initial fetch
  useEffect(() => {
    fetchContent(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.type, filters.status, filters.isFeatured, filters.search]);

  // Load more when offset changes
  useEffect(() => {
    if (filters.offset && filters.offset > 0) {
      fetchContent(false).finally(() => {
        setIsLoadingMore(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.offset]);

  const createContent = useCallback(async (contentData: Omit<Content, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'author'>) => {
    const { data, error } = await api.request({
      method: 'POST',
      body: contentData,
      successMessage: 'Content created successfully',
      errorMessage: 'Failed to create content',
    });
    
    if (data && !error) {
      await refetch();
    }
    
    return { data, error };
  }, [api, refetch]);

  const updateContent = useCallback(async (id: string, updates: Partial<Content>) => {
    const { data, error } = await api.request({
      method: 'PUT',
      body: updates,
      successMessage: 'Content updated successfully',
      errorMessage: 'Failed to update content',
    }, `?id=${id}`);
    
    if (data && !error) {
      await refetch();
    }
    
    return { data, error };
  }, [api, refetch]);

  const deleteContent = useCallback(async (id: string) => {
    const { data, error } = await api.request({
      method: 'DELETE',
      successMessage: 'Content deleted successfully',
      errorMessage: 'Failed to delete content',
    }, `?id=${id}`);
    
    if (data && !error) {
      setContentList(prev => prev.filter(item => item.id !== id));
      setTotalCount(prev => Math.max(0, prev - 1));
    }
    
    return { data, error };
  }, [api]);

  const publishContent = useCallback(async (id: string, action: 'publish' | 'unpublish' | 'archive') => {
    const { data, error } = await api.request({
      method: 'PATCH',
      body: { action },
      successMessage: `Content ${action}ed successfully`,
      errorMessage: `Failed to ${action} content`,
    }, `?id=${id}`);
    
    if (data && !error) {
      await refetch();
    }
    
    return { data, error };
  }, [api, refetch]);

  return {
    content: contentList,
    loading: api.loading,
    error: api.error,
    total: totalCount,
    hasMore: contentList.length < totalCount,
    isLoadingMore,
    filters,
    setFilters,
    refetch,
    loadMore,
    createContent,
    updateContent,
    deleteContent,
    publishContent,
  };
}
