import React, { useState } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import UploadZone from './components/UploadZone';
import ResultsGrid from './components/ResultsGrid';
import ThinkingIndicator from './components/ThinkingIndicator';
import { generateShortsFromContent } from './services/geminiService';
import { AnalysisState, ShortIdea } from './types';

function App() {
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    data: null,
    status: 'idle',
    sourceFile: null,
  });

  const handleFileSelect = async (file: File) => {
    // Increased limit to 100MB for better support of long-form content
    const MAX_FILE_SIZE = 100 * 1024 * 1024; 
    
    if (file.size > MAX_FILE_SIZE) {
        setState(prev => ({ ...prev, error: "File too large. For this browser-based demo, please use files under 100MB or use the Link/Transcript option." }));
        return;
    }

    setState({ isLoading: true, error: null, data: null, status: 'uploading', sourceFile: file });
    
    setTimeout(async () => {
        try {
            setState(prev => ({ ...prev, status: 'analyzing' }));
            const results = await generateShortsFromContent(file, 'video');
            setState(prev => ({ ...prev, isLoading: false, error: null, data: results, status: 'complete' }));
        } catch (err: any) {
            setState(prev => ({ 
                ...prev,
                isLoading: false, 
                error: err.message || "Failed to analyze video. Please try again.", 
                data: null, 
                status: 'idle' 
            }));
        }
    }, 1500);
  };

  const handleLinkSubmit = async (url: string) => {
    setState({ isLoading: true, error: null, data: null, status: 'analyzing', sourceFile: null });
    try {
        const results = await generateShortsFromContent(url, 'url');
        setState(prev => ({ ...prev, isLoading: false, error: null, data: results, status: 'complete' }));
    } catch (err: any) {
        setState(prev => ({ 
            ...prev,
            isLoading: false, 
            error: err.message || "Failed to analyze link. Gemini couldn't find enough information about this video.", 
            data: null, 
            status: 'idle' 
        }));
    }
  };

  const handleTranscriptSubmit = async (text: string) => {
    setState({ isLoading: true, error: null, data: null, status: 'analyzing', sourceFile: null });
    try {
      const results = await generateShortsFromContent(text, 'text');
      setState(prev => ({ ...prev, isLoading: false, error: null, data: results, status: 'complete' }));
    } catch (err: any) {
      setState(prev => ({ 
        ...prev,
        isLoading: false, 
        error: err.message || "Failed to analyze transcript.", 
        data: null, 
        status: 'idle' 
      }));
    }
  };

  const reset = () => {
    setState({ isLoading: false, error: null, data: null, status: 'idle', sourceFile: null });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30">
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center cursor-pointer group" onClick={reset}>
              <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2.5 rounded-2xl mr-4 shadow-2xl shadow-indigo-500/40 group-hover:rotate-6 transition-transform">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500">
                    ShortsArchitect
                </span>
                <span className="block text-[10px] font-bold text-indigo-400 tracking-[0.3em] uppercase opacity-70">Video Repurposing AI</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2">
                <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Model: Gemini 3 Pro</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        
        {/* Header Section */}
        {state.status === 'idle' && (
            <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold mb-8 uppercase tracking-widest">
                    Next-Gen Video Intelligence
                </div>
                <h1 className="text-5xl sm:text-7xl font-black text-white mb-8 tracking-tighter leading-[1.1]">
                    Generate <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400">Ready-to-Upload</span> <br className="hidden md:block" />
                    Shorts in Seconds
                </h1>
                <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
                    Upload a video and let Gemini find the viral gold. Our AI identifies high-impact hooks, writes scripts, and trims the video for you.
                </p>
            </div>
        )}

        {/* Error State */}
        {state.error && (
            <div className="max-w-2xl mx-auto mb-12 bg-red-500/10 border border-red-500/30 text-red-200 px-6 py-4 rounded-3xl flex items-center shadow-2xl shadow-red-900/10">
                <AlertCircle className="w-6 h-6 mr-4 flex-shrink-0 text-red-400" />
                <span className="font-semibold">{state.error}</span>
            </div>
        )}

        {/* Main Interaction Area */}
        <div className="relative">
            {state.status === 'idle' && (
                <UploadZone 
                    onFileSelect={handleFileSelect} 
                    onTranscriptSubmit={handleTranscriptSubmit}
                    onLinkSubmit={handleLinkSubmit}
                    isProcessing={false}
                />
            )}

            {(state.status === 'uploading' || state.status === 'analyzing') && (
                <ThinkingIndicator />
            )}

            {state.status === 'complete' && state.data && (
                <div className="space-y-12">
                    <div className="flex flex-col md:flex-row justify-between items-center px-6 bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5">
                         <div className="text-center md:text-left mb-6 md:mb-0">
                            <h2 className="text-3xl font-black text-white tracking-tight">AI Viral Analysis</h2>
                            <p className="text-slate-400 text-sm mt-1 font-medium italic">Gemini has identified {state.data.length} segments with high retention potential.</p>
                         </div>
                         <button 
                            onClick={reset}
                            className="bg-white text-slate-950 px-8 py-3 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-white/5"
                         >
                            Start New Project
                         </button>
                    </div>
                    <ResultsGrid ideas={state.data} sourceFile={state.sourceFile} />
                </div>
            )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/5 mt-auto py-16 bg-[#01040f]">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex justify-center space-x-8 mb-8">
                <span className="text-xs font-black text-slate-500 tracking-widest uppercase">YouTube</span>
                <span className="text-xs font-black text-slate-500 tracking-widest uppercase">TikTok</span>
                <span className="text-xs font-black text-slate-500 tracking-widest uppercase">Reels</span>
                <span className="text-xs font-black text-slate-500 tracking-widest uppercase">Shorts</span>
            </div>
            <p className="text-slate-600 text-xs font-bold tracking-widest uppercase opacity-50">&copy; 2024 ShortsArchitect Engine. Deep Video Analysis Enabled.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;