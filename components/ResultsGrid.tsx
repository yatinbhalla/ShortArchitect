import React from 'react';
import { ShortIdea } from '../types';
import { Sparkles, TrendingUp, Clock, Copy, Scissors } from 'lucide-react';
import VideoExporter from './VideoExporter';

interface ResultsGridProps {
  ideas: ShortIdea[];
  sourceFile: File | null;
}

const ResultsGrid: React.FC<ResultsGridProps> = ({ ideas, sourceFile }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {ideas.map((idea, index) => (
        <div
          key={index}
          className="group relative bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-[2rem] p-8 hover:bg-slate-800/60 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 overflow-hidden"
        >
          {/* Decorative Gradient */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-70 group-hover:opacity-100 transition-opacity" />

          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="bg-indigo-500/10 text-indigo-300 px-4 py-1.5 rounded-full text-xs font-bold flex items-center border border-indigo-500/20 tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Viral Concept #{index + 1}
            </div>
            <div className="flex items-center space-x-3">
                <div className="flex items-center text-slate-300 text-xs font-medium bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
                    <Clock className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                    {Math.floor(idea.startTimeSeconds)}s - {Math.floor(idea.endTimeSeconds)}s
                </div>
                <div className={`flex items-center text-xs px-3 py-1.5 rounded-lg font-black tracking-tight ${idea.viralScore >= 8 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/20 text-amber-400 border border-amber-500/20'}`}>
                    <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
                    {idea.viralScore}/10
                </div>
            </div>
          </div>

          <h3 className="text-2xl font-black text-white mb-4 leading-tight group-hover:text-indigo-300 transition-colors">
            {idea.title}
          </h3>

          <div className="space-y-5">
            {/* Hook Section */}
            <div className="bg-slate-900/40 rounded-2xl p-5 border border-slate-700/30">
              <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-black mb-2">The Hook (0:00 - 0:03)</p>
              <p className="text-sm text-slate-100 leading-relaxed italic font-medium">"{idea.hook}"</p>
            </div>

            {/* Script Summary */}
            <div className="px-1">
               <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-2">Production Strategy</p>
               <p className="text-sm text-slate-400 leading-relaxed">
                {idea.script}
               </p>
            </div>

            {/* Cutter Integration */}
            {sourceFile ? (
              <VideoExporter 
                sourceFile={sourceFile} 
                startTime={idea.startTimeSeconds} 
                endTime={idea.endTimeSeconds}
                title={idea.title}
              />
            ) : (
              <div className="bg-amber-500/5 rounded-2xl p-4 border border-amber-500/10 mt-6">
                <p className="text-xs text-amber-200/80 leading-relaxed">
                  <span className="font-bold text-amber-400 block mb-1">Cutting Unavailable:</span> 
                  Video trimming requires an uploaded file. For links, use the timestamps above to manually clip this segment.
                </p>
              </div>
            )}
            
            <button 
                onClick={() => navigator.clipboard.writeText(`Title: ${idea.title}\n\nTimestamps: ${idea.startTimeSeconds}s - ${idea.endTimeSeconds}s\n\nHook: ${idea.hook}\n\nScript: ${idea.script}`)}
                className="w-full bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center border border-slate-700/50 hover:text-white">
                <Copy className="w-4 h-4 mr-2" />
                Copy Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultsGrid;