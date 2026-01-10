// Generic API response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp: string;
}

// Paginated response
export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// API Error response
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}
