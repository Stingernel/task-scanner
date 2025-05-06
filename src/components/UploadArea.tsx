
import React, { useState, useCallback } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocFile } from '@/types';

interface UploadAreaProps {
  files: DocFile[];
  onFilesAdded: (files: DocFile[]) => void;
  onFileRemoved: (id: string) => void;
  disabled: boolean;
}

const UploadArea: React.FC<UploadAreaProps> = ({ 
  files, 
  onFilesAdded, 
  onFileRemoved, 
  disabled 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  
  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);
  
  // Process dropped or selected files
  const processFiles = useCallback((fileList: FileList | null) => {
    if (disabled || !fileList) return;
    
    const newFiles: DocFile[] = [];
    
    Array.from(fileList).forEach(file => {
      // Only accept .docx files
      if (file.name.endsWith('.docx')) {
        newFiles.push({
          id: `${file.name}-${file.lastModified}`,
          name: file.name,
          size: file.size,
          lastModified: file.lastModified
        });
      }
    });
    
    if (newFiles.length > 0) {
      onFilesAdded(newFiles);
    }
    
    setIsDragging(false);
  }, [disabled, onFilesAdded]);
  
  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    processFiles(e.dataTransfer.files);
  }, [processFiles]);
  
  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  }, [processFiles]);
  
  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full">
      <div 
        className={`upload-area ${isDragging ? 'active' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-accentPurple bg-opacity-20 flex items-center justify-center mb-4">
            <Upload className="h-5 w-5 text-accentPurple" />
          </div>
          <h3 className="text-lg font-semibold">Unggah Dokumen</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Seret dan lepaskan file .docx atau klik untuk memilih
          </p>
          
          <input
            type="file"
            id="file-upload"
            multiple
            accept=".docx"
            className="hidden"
            onChange={handleFileInputChange}
            disabled={disabled}
          />
          
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={disabled}
            className="border-accentPurple text-accentPurple hover:bg-accentPurple hover:bg-opacity-10"
          >
            <Upload className="mr-2 h-4 w-4" /> Pilih File
          </Button>
        </div>
      </div>
      
      {files.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">File Terunggah ({files.length})</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {files.map(file => (
              <div 
                key={file.id} 
                className="flex items-center justify-between p-3 rounded-md bg-secondary"
              >
                <div className="flex items-center">
                  <File className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                {!disabled && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFileRemoved(file.id)}
                    className="text-muted-foreground hover:text-white hover:bg-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadArea;
