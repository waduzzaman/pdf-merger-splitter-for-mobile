
import React, { useState } from 'react';
import { FileStack, Scissors, Settings, Info } from 'lucide-react';
import { AppMode } from './types';
import PDFMerger from './components/PDFMerger';
import PDFSplitter from './components/PDFSplitter';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.MERGE);

  return (
    <div className="min-h-screen flex flex-col max-w-3xl mx-auto bg-gray-50 shadow-2xl">
      {/* Header */}
      <header className="bg-white px-6 pt-8 pb-4 shadow-sm z-20">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white mr-3 shadow-md shadow-indigo-100">
              <FileStack size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">PDF MASTER</h1>
              <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest mt-0.5">Mobile Pro Edition</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="p-2.5 bg-gray-50 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
              <Info size={20} />
            </button>
            <button className="p-2.5 bg-gray-50 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1.5 bg-gray-100 rounded-2xl">
          <button 
            onClick={() => setMode(AppMode.MERGE)}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
              mode === AppMode.MERGE 
                ? 'bg-white text-indigo-600 shadow-md translate-y-[-1px]' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileStack size={18} className="mr-2" />
            MERGER
          </button>
          <button 
            onClick={() => setMode(AppMode.SPLIT)}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
              mode === AppMode.SPLIT 
                ? 'bg-white text-rose-600 shadow-md translate-y-[-1px]' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Scissors size={18} className="mr-2" />
            SPLITTER
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative">
        <div className={`transition-opacity duration-300 h-full ${mode === AppMode.MERGE ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none absolute inset-0'}`}>
          <PDFMerger />
        </div>
        <div className={`transition-opacity duration-300 h-full ${mode === AppMode.SPLIT ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none absolute inset-0'}`}>
          <PDFSplitter />
        </div>
      </main>

      {/* Simple decorative footer for mobile app feel */}
      <div className="h-6 bg-white shrink-0"></div>
    </div>
  );
};

export default App;
