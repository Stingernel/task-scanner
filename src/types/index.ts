
// Document file information
export interface DocFile {
  id: string;
  name: string;
  size: number;
  lastModified: number;
}

// Similarity result between two documents
export interface SimilarityResult {
  docA: string; // Document A name
  docB: string; // Document B name
  similarity: number; // Similarity percentage (0-100)
}

// API response structure for similarity check
export interface SimilarityResponse {
  results: SimilarityResult[];
  timestamp: string;
}

// Application state
export interface AppState {
  files: DocFile[];
  results: SimilarityResult[];
  loading: boolean;
  error: string | null;
}
