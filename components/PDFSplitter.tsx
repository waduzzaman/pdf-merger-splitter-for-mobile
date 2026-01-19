
import React, { useState } from 'react';
import { Scissors, FileText, Download, X, AlertCircle } from 'lucide-react';
import { PDFFile } from '../types';
import { splitPDF, downloadBlob, getPageCount } from '../services/pdfService';

const PDFSplitter: React.FC = () => {
  const [file, setFile] = useState<PDFFile | null>(null);
  const [startPage, setStartPage] = useState<string>('1');
  const [endPage, setEndPage] = useState<string>('1');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile || selectedFile.type !== 'application/pdf') return;

    const arrayBuffer = await selectedFile.arrayBuffer();
    const pageCount = await getPageCount(arrayBuffer);
    
    setFile({
      id: Math.random().toString(36).substr(2, 9),
      name: selectedFile.name,
      size: selectedFile.size,
      data: arrayBuffer,
      pageCount: pageCount
    });
    setStartPage('1');
    setEndPage(pageCount.toString());
  };

  const handleSplit = async () => {
    if (!file) return;
    
    const start = parseInt(startPage);
    const end = parseInt(endPage);

    if (isNaN(start) || isNaN(end) || start < 1 || end > file.pageCount || start > end) {
      alert("Please enter a valid page range.");
      return;
    }

    setIsProcessing(true);
    try {
      const splitData = await splitPDF(file.data, start, end);
      downloadBlob(splitData, `split_${file.name}`);
    } catch (err) {
      console.error("Split failed", err);
      alert("Failed to split PDF. The file might be corrupted or protected.");
    } finally {
      setIsProcessing(false);
    }
  };

  const clearFile = () => {
    setFile(null);
  };

  return (
    <div className="flex flex-col h-full px-4 pt-4">
      {!file ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-8">
          <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-6">
            <Scissors className="text-rose-600 w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Split a PDF</h3>
          <p className="text-gray-500 mb-8 max-w-xs">Extract specific pages from a PDF document to create a new file.</p>
          
          <label className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 px-10 rounded-2xl shadow-lg cursor-pointer transition-transform active:scale-95 inline-flex items-center">
            <FileText className="mr-2" size={20} />
            SELECT PDF FILE
            <input 
              type="file" 
              accept="application/pdf" 
              className="hidden" 
              onChange={handleFileChange} 
            />
          </label>
        </div>
      ) : (
        <div className="max-w-lg mx-auto w-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Split Settings</h3>
            <button onClick={clearFile} className="text-gray-400 hover:text-red-500">
              <X size={24} />
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
            <div className="flex items-center mb-6">
              <div className="bg-indigo-50 p-3 rounded-xl mr-4">
                <FileText className="text-indigo-600 w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-indigo-600 font-bold mt-0.5">{file.pageCount} TOTAL PAGES</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Start Page</label>
                  <input 
                    type="number" 
                    value={startPage}
                    min="1"
                    max={file.pageCount}
                    onChange={(e) => setStartPage(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-lg font-bold text-gray-900 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">End Page</label>
                  <input 
                    type="number" 
                    value={endPage}
                    min="1"
                    max={file.pageCount}
                    onChange={(e) => setEndPage(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-lg font-bold text-gray-900 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-start">
                <AlertCircle className="text-rose-500 mt-0.5 mr-3 flex-shrink-0" size={18} />
                <p className="text-xs text-rose-800 leading-relaxed font-medium">
                  Pages <strong>{startPage || '?'}</strong> through <strong>{endPage || '?'}</strong> will be extracted into a new PDF document.
                </p>
              </div>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-xl max-w-lg mx-auto rounded-t-3xl">
            <button 
              onClick={handleSplit}
              disabled={isProcessing}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-95 disabled:bg-gray-200 disabled:text-gray-400"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  EXTRACTING...
                </>
              ) : (
                <>
                  <Download className="mr-2" size={20} />
                  SPLIT & DOWNLOAD
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFSplitter;
