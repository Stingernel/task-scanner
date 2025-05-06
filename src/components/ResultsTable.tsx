
import React, { useState } from 'react';
import { SimilarityResult } from '@/types';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ResultsTableProps {
  results: SimilarityResult[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  const { toast } = useToast();
  const [sortColumn, setSortColumn] = useState<string>('similarity');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Show notifications for high similarity
  React.useEffect(() => {
    // Find results with similarity > 70%
    const highSimilarityResults = results.filter(r => r.similarity > 70);
    
    if (highSimilarityResults.length > 0) {
      toast({
        title: 'Ditemukan Kesamaan Tinggi!',
        description: `${highSimilarityResults.length} pasang dokumen memiliki kesamaan lebih dari 70%`,
        variant: "destructive"
      });
    }
  }, [results, toast]);

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  // Sort results
  const sortedResults = [...results].sort((a, b) => {
    let comparison = 0;
    
    if (sortColumn === 'docA') {
      comparison = a.docA.localeCompare(b.docA);
    } else if (sortColumn === 'docB') {
      comparison = a.docB.localeCompare(b.docB);
    } else if (sortColumn === 'similarity') {
      comparison = a.similarity - b.similarity;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Get color based on similarity percentage
  const getSimilarityColor = (similarity: number): string => {
    if (similarity > 70) return 'text-dangerRed font-bold';
    if (similarity > 50) return 'text-dangerRed';
    if (similarity > 30) return 'text-amber-500';
    return 'text-green-500';
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-xl flex items-center justify-between">
          <span>Hasil Perbandingan</span>
          <span className="text-sm text-muted-foreground">
            {results.length} perbandingan
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Belum ada hasil. Silakan unggah dokumen dan mulai pemeriksaan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:text-accentPurple"
                    onClick={() => handleSort('docA')}
                  >
                    Dokumen A
                    {sortColumn === 'docA' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-accentPurple"
                    onClick={() => handleSort('docB')}
                  >
                    Dokumen B
                    {sortColumn === 'docB' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-accentPurple text-right"
                    onClick={() => handleSort('similarity')}
                  >
                    Kesamaan
                    {sortColumn === 'similarity' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedResults.map((result, index) => (
                  <TableRow 
                    key={`${result.docA}-${result.docB}`}
                    className={result.similarity > 50 ? 'bg-red-900 bg-opacity-10' : ''}
                  >
                    <TableCell className="font-medium truncate max-w-[150px] md:max-w-[250px]">
                      {result.docA}
                    </TableCell>
                    <TableCell className="truncate max-w-[150px] md:max-w-[250px]">
                      {result.docB}
                    </TableCell>
                    <TableCell className={`text-right ${getSimilarityColor(result.similarity)}`}>
                      {result.similarity}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultsTable;
