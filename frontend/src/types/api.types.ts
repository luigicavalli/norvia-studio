export interface ApiResponse<T> {
  data?:    T;
  message?: string;
  error?:   string;
}

export interface ApiPaginatedResponse<T> {
  data:    T[];
  hasMore: boolean;
}
