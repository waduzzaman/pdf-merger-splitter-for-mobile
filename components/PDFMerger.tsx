
import React, { useState, useCallback } from 'react';
import { Plus, Download, X, AlertCircle, FileStack } from 'lucide-react';
import { PDFFile } from '../types';
import FileListItem from './FileListItem';
import { mergePDFs, downloadBlob, getPageCount } from '../services/pdfService';

const PDFMerger: React.FC = () => {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles: PDFFile[] = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      if (file.type !== 'application/pdf') continue;

      const arrayBuffer = await file.arrayBuffer();
      const pageCount = await getPageCount(arrayBuffer);
      
      newFiles.push({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        data: arrayBuffer,
        pageCount: pageCount
      });
    }

    setFiles(prev => [...prev, ...newFiles]);
    // Reset input
    e.target.value = '';
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newFiles = [...files];
    [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
    setFiles(newFiles);
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
    setFiles(newFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    
    setIsProcessing(true);
    try {
      const mergedData = await mergePDFs(files.map(f => f.data));
      downloadBlob(mergedData, `merged_${Date.now()}.pdf`);
    } catch (err) {
      console.error("Merging failed", err);
      alert("Failed to merge PDFs. One of the files might be corrupted or protected.");
    } finally {
      setIsProcessing(false);
    }
  };

  const clearAll = () => {
    if (confirm("Clear all selected files?")) {
      setFiles([]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 pb-24 pt-4">
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-8">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
              <Plus className="text-indigo-600 w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Start Merging</h3>
            <p className="text-gray-500 mb-8 max-w-xs">Upload two or more PDF documents to combine them into a single file.</p>
            
            <label className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-2xl shadow-lg cursor-pointer transition-transform active:scale-95 inline-flex items-center">
              <Plus className="mr-2" size={20} />
              SELECT PDF FILES
              <input 
                type="file" 
                multiple 
                accept="application/pdf" 
                className="hidden" 
                onChange={handleFileChange} 
              />
            </label>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-50/95 backdrop-blur z-10 py-2">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <FileStack className="mr-2 text-indigo-600" size={20} />
                Selected Files ({files.length})
              </h3>
              <button 
                onClick={clearAll}
                className="text-gray-500 text-sm font-semibold hover:text-red-600 flex items-center"
              >
                <X size={16} className="mr-1" /> EXIT / CLEAR
              </button>
            </div>
            
            <div className="pb-4">
              {files.map((file, index) => (
                <FileListItem 
                  key={file.id} 
                  file={file} 
                  isFirst={index === 0}
                  isLast={index === files.length - 1}
                  onMoveUp={() => moveUp(index)}
                  onMoveDown={() => moveDown(index)}
                  onRemove={() => removeFile(file.id)}
                />
              ))}
            </div>

            <label className="w-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 text-gray-400 hover:border-indigo-400 hover:text-indigo-500 cursor-pointer transition-colors mb-8">
              <Plus className="mr-2" size={24} />
              <span className="font-semibold text-lg">Add more files</span>
              <input 
                type="file" 
                multiple 
                accept="application/pdf" 
                className="hidden" 
                onChange={handleFileChange} 
              />
            </label>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-xl flex gap-3 max-w-3xl mx-auto rounded-t-3xl">
          <button 
            disabled={files.length < 2 || isProcessing}
            onClick={handleMerge}
            className={`flex-1 font-bold py-4 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-95 ${
              files.length < 2 
                ? 'bg-gray-200 text-gray-400' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                PROCESSING...
              </>
            ) : (
              <>
                <Download className="mr-2" size={20} />
                MERGE & DOWNLOAD
              </>
            )}
          </button>
        </div>
      )}

      {files.length === 1 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-amber-50 border border-amber-200 rounded-full px-4 py-2 flex items-center text-amber-700 text-sm shadow-sm">
          <AlertCircle size={16} className="mr-2" />
          Add at least one more file to merge.
        </div>
      )}
    </div>
  );
};

export default PDFMerger;
