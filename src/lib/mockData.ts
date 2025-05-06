
import { DocFile, SimilarityResult } from '../types';

// Simulates random similarity scores for documents
export const generateMockSimilarityResults = (files: DocFile[]): SimilarityResult[] => {
  const results: SimilarityResult[] = [];
  
  // Generate similarity scores for each pair of documents
  for (let i = 0; i < files.length; i++) {
    for (let j = i + 1; j < files.length; j++) {
      // Generate a random similarity score (0-100)
      // Making some pairs have high similarity for demonstration
      let similarity: number;
      
      // Ensure we have some high similarity examples for demo purposes
      if ((i === 0 && j === 1) || (i === 1 && j === 2)) {
        similarity = 60 + Math.floor(Math.random() * 30); // 60-90% similarity
      } else {
        similarity = Math.floor(Math.random() * 60); // 0-60% similarity
      }
      
      results.push({
        docA: files[i].name,
        docB: files[j].name,
        similarity: parseFloat(similarity.toFixed(2))
      });
    }
  }
  
  // Sort by similarity (highest first)
  return results.sort((a, b) => b.similarity - a.similarity);
};
