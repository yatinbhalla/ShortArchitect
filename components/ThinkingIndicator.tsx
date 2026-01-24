import React from 'react';
import { BrainCircuit } from 'lucide-react';

const ThinkingIndicator: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse rounded-full"></div>
        <div className="relative bg-slate-800 p-6 rounded-full border border-slate-700 shadow-2xl">
          <BrainCircuit className="w-12 h-12 text-indigo-400 animate-pulse" />
        </div>
      </div>
      <h2 className="mt-8 text-2xl font-bold text-white">Gemini is Thinking...</h2>
      <p className="text-slate-400 mt-2 text-center max-w-md">
        Analyzing video frames, checking retention patterns, and generating viral hooks. <br/>
        <span className="text-xs text-slate-500 mt-2 block">(Model: gemini-3-pro-preview with 32k thinking budget)</span>
      </p>
      
      <div className="mt-8 flex space-x-2">
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
};

export default ThinkingIndicator;