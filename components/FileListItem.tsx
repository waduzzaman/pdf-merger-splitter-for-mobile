
import React from 'react';
import { ChevronUp, ChevronDown, Trash2, FileText } from 'lucide-react';
import { PDFFile } from '../types';

interface FileListItemProps {
  file: PDFFile;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

const FileListItem: React.FC<FileListItemProps> = ({ 
  file, 
  isFirst, 
  isLast, 
  onMoveUp, 
  onMoveDown, 
  onRemove 
}) => {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-3 flex items-center shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-indigo-50 p-3 rounded-lg mr-4">
        <FileText className="text-indigo-600 w-6 h-6" />
      </div>
      
      <div className="flex-1 min-w-0 mr-4">
        <p className="text-sm font-semibold text-gray-900 truncate">{file.name}</p>
        <p className="text-xs text-gray-500 uppercase font-medium mt-0.5">
          {formatSize(file.size)} • {file.pageCount} Pages
        </p>
      </div>

      <div className="flex items-center space-x-1">
        <button 
          onClick={onMoveUp}
          disabled={isFirst}
          className={`p-2 rounded-full ${isFirst ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
          title="Move Up"
        >
          <ChevronUp size={20} />
        </button>
        <button 
          onClick={onMoveDown}
          disabled={isLast}
          className={`p-2 rounded-full ${isLast ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
          title="Move Down"
        >
          <ChevronDown size={20} />
        </button>
        <button 
          onClick={onRemove}
          className="p-2 text-red-500 hover:bg-red-50 rounded-full"
          title="Remove"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default FileListItem;
