
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import Header from '@/components/Header';
import UploadArea from '@/components/UploadArea';
import ResultsTable from '@/components/ResultsTable';
import { DocFile, SimilarityResult } from '@/types';
import { api } from '@/utils/api';

const Index: React.FC = () => {
  const [files, setFiles] = useState<DocFile[]>([]);
  const [results, setResults] = useState<SimilarityResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Add files to state
  const handleFilesAdded = (newFiles: DocFile[]) => {
    setFiles(prev => {
      // Filter out duplicates based on id
      const existingIds = new Set(prev.map(file => file.id));
      const filesToAdd = newFiles.filter(file => !existingIds.has(file.id));
      
      return [...prev, ...filesToAdd];
    });
  };

  // Remove file from state
  const handleFileRemoved = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  // Check document similarity
  const handleCheckSimilarity = async () => {
    if (files.length < 2) {
      toast({
        title: "Jumlah dokumen tidak cukup",
        description: "Anda membutuhkan minimal 2 dokumen untuk pemeriksaan plagiarisme.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      // Upload files first (mock)
      await api.uploadFiles(files);
      
      // Then check similarity
      const response = await api.checkSimilarity(files);
      
      setResults(response.results);
      
      toast({
        title: "Analisis selesai",
        description: `Berhasil menganalisis ${files.length} dokumen.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal melakukan pemeriksaan. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Header />
        
        <main className="py-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2">Pemeriksaan Kemiripan Dokumen</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Unggah dokumen tugas mahasiswa (.docx) dan temukan kemiripan antar dokumen menggunakan Jaccard Similarity dengan metode shingling.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <Card className="glass-card h-full">
                <CardContent className="p-6">
                  <UploadArea 
                    files={files}
                    onFilesAdded={handleFilesAdded}
                    onFileRemoved={handleFileRemoved}
                    disabled={loading}
                  />
                  
                  <div className="mt-6">
                    <Button 
                      onClick={handleCheckSimilarity}
                      disabled={loading || files.length < 2}
                      className="w-full bg-accentPurple hover:bg-accentPurple/80 text-white"
                    >
                      {loading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
                          Menganalisis...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Cek Plagiarisme
                        </>
                      )}
                    </Button>
                    
                    {files.length === 0 && (
                      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                        <AlertTriangle className="h-3 w-3" /> 
                        Unggah minimal 2 dokumen untuk analisis
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-3">
              <ResultsTable results={results} />
            </div>
          </div>
          
          {/* Information section */}
          {results.length > 0 && (
            <Card className="glass-card mt-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Informasi Hasil</h3>
                <p className="text-sm text-muted-foreground">
                  Persentase kemiripan dihitung menggunakan Jaccard Similarity dengan metode shingling. 
                  Kemiripan lebih dari 50% ditandai dengan warna merah. Dokumen dengan kemiripan tinggi
                  (lebih dari 70%) perlu ditinjau lebih lanjut.
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 bg-secondary rounded-md">
                    <div className="font-medium">Total Dokumen</div>
                    <div className="text-2xl font-bold text-accentPurple mt-1">{files.length}</div>
                  </div>
                  <div className="p-3 bg-secondary rounded-md">
                    <div className="font-medium">Total Perbandingan</div>
                    <div className="text-2xl font-bold text-accentBlue mt-1">{results.length}</div>
                  </div>
                  <div className="p-3 bg-secondary rounded-md">
                    <div className="font-medium">Kemiripan Tinggi (>50%)</div>
                    <div className="text-2xl font-bold text-dangerRed mt-1">
                      {results.filter(r => r.similarity > 50).length}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <footer className="mt-16 text-center text-sm text-muted-foreground py-6">
            <p>
              © 2025 corner
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Index;
