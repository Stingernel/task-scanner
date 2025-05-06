
import { DocFile, SimilarityResponse } from '../types';
import { generateMockSimilarityResults } from '../lib/mockData';

// Mock API service for document similarity checking
export const api = {
  // Simulates uploading files to the server
  uploadFiles: async (files: DocFile[]): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        resolve({
          success: true,
          message: `Successfully uploaded ${files.length} files`,
        });
      }, 1500);
    });
  },

  // Simulates checking similarity between documents
  checkSimilarity: async (files: DocFile[]): Promise<SimilarityResponse> => {
    return new Promise((resolve) => {
      // Simulate processing time based on number of files
      const processingTime = Math.max(1500, files.length * 500);
      
      setTimeout(() => {
        resolve({
          results: generateMockSimilarityResults(files),
          timestamp: new Date().toISOString(),
        });
      }, processingTime);
    });
  },
};
