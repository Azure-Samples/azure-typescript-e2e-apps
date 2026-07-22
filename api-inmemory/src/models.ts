export interface TodoItem {
  title: string;
}

export interface BulkItemResult {
  index: number;
  success: boolean;
  id?: string;
  title?: string;
  error?: string;
}

export interface BulkCreateResponse {
  correlationId: string;
  total: number;
  succeeded: number;
  failed: number;
  results: BulkItemResult[];
}

export interface ValidationError {
  index: number;
  message: string;
}
