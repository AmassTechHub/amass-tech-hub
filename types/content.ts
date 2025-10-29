export type ContentType = 'news' | 'tutorial' | 'tool' | 'service' | 'podcast' | 'event';

export type ContentStatus = 'draft' | 'published' | 'archived';

export interface ContentMetadata {
  author?: {
    name: string;
    avatar?: string;
  };
  featuredImage?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  tags?: string[];
  readTime?: number; // in minutes
  // Podcast specific
  audioUrl?: string;
  duration?: number; // in seconds
  // Event specific
  eventDate?: string;
  location?: string;
  isVirtual?: boolean;
  // Tutorial specific
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
  // Tool/Service specific
  website?: string;
  pricing?: {
    type: 'free' | 'paid' | 'freemium' | 'open-source';
    price?: number;
    currency?: string;
    period?: 'monthly' | 'yearly' | 'one-time';
  };
  // Any additional custom fields
  [key: string]: any;
}

export interface Content {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  description?: string;
  content: string;
  status: ContentStatus;
  isFeatured: boolean;
  metadata?: ContentMetadata;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  // For relation loading
  author?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export interface ContentFormData {
  id?: string;
  type: ContentType;
  title: string;
  slug: string;
  description: string;
  content: string;
  status: ContentStatus;
  isFeatured: boolean;
  metadata: ContentMetadata;
  // For form handling
  featuredImageFile?: File | null;
}

export interface ContentListResponse {
  data: Content[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ContentFilterParams {
  type?: ContentType;
  status?: ContentStatus;
  isFeatured?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}
