import React, { useCallback, useState } from 'react';
import { Upload, FileVideo, Type, Youtube, ArrowRight } from 'lucide-react';
import { InputMode } from '../types';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  onTranscriptSubmit: (text: string) => void;
  onLinkSubmit: (url: string) => void;
  isProcessing: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, onTranscriptSubmit, onLinkSubmit, isProcessing }) => {
  const [mode, setMode] = useState<InputMode>(InputMode.VIDEO);
  const [dragActive, setDragActive] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        onFileSelect(file);
      } else {
        alert("Please upload a video file.");
      }
    }
  }, [onFileSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleTranscriptSubmit = () => {
    if (transcript.trim().length < 50) {
      alert("Transcript is too short.");
      return;
    }
    onTranscriptSubmit(transcript);
  };

  const handleLinkSubmitClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeLink.includes('youtube.com') && !youtubeLink.includes('youtu.be')) {
      alert("Please provide a valid YouTube link.");
      return;
    }
    onLinkSubmit(youtubeLink);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Tab Switcher */}
      <div className="flex justify-center mb-6">
        <div className="bg-slate-800 p-1 rounded-full flex shadow-lg border border-slate-700">
          <button
            onClick={() => setMode(InputMode.VIDEO)}
            className={`flex items-center px-6 py-2 rounded-full text-sm font-medium transition-all ${
              mode === InputMode.VIDEO
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileVideo className="w-4 h-4 mr-2" />
            Video / Link
          </button>
          <button
            onClick={() => setMode(InputMode.TRANSCRIPT)}
            className={`flex items-center px-6 py-2 rounded-full text-sm font-medium transition-all ${
              mode === InputMode.TRANSCRIPT
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Type className="w-4 h-4 mr-2" />
            Transcript / Text
          </button>
        </div>
      </div>

      {mode === InputMode.VIDEO ? (
        <div className="space-y-6">
            {/* YouTube Link Input */}
            <form onSubmit={handleLinkSubmitClick} className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Youtube className="h-5 w-5 text-red-500" />
                </div>
                <input
                    type="text"
                    disabled={isProcessing}
                    placeholder="Paste YouTube Link here..."
                    className="block w-full pl-12 pr-32 py-4 border border-slate-700 rounded-2xl leading-5 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xl transition-all"
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                />
                <div className="absolute inset-y-2 right-2 flex items-center">
                    <button
                        type="submit"
                        disabled={isProcessing || !youtubeLink}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 h-full rounded-xl flex items-center font-semibold text-sm transition-all disabled:opacity-50"
                    >
                        Analyze Link
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                </div>
                <p className="text-xs text-slate-500 mt-3 ml-1 px-2">
                    * Gemini will use Google Search to find transcripts and context for the provided link.
                </p>
            </form>

            <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-4 text-slate-600 text-xs font-bold uppercase tracking-widest">OR UPLOAD FILE</span>
                <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <div
                className={`relative group rounded-3xl border-2 border-dashed transition-all duration-300 ease-in-out cursor-pointer ${
                dragActive
                    ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
                    : 'border-slate-700 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
            >
                <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="video/*"
                onChange={handleChange}
                disabled={isProcessing}
                />
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="p-4 bg-slate-800 rounded-full mb-4 shadow-xl ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-300">
                    <Upload className={`w-8 h-8 ${dragActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                    {isProcessing ? 'Processing...' : 'Upload Video File'}
                </h3>
                <p className="text-slate-500 max-w-sm text-xs">
                    Supports MP4, MOV, WebM. (Max 100MB)
                </p>
                </div>
            </div>
        </div>
      ) : (
        <div className="bg-slate-800/30 rounded-3xl p-1 border border-slate-700">
          <textarea
            className="w-full h-64 bg-slate-900/50 text-slate-200 p-6 rounded-2xl focus:outline-none resize-none placeholder-slate-500"
            placeholder="Paste your video transcript or script here..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            disabled={isProcessing}
          ></textarea>
          <div className="flex justify-end p-4">
            <button
              onClick={handleTranscriptSubmit}
              disabled={isProcessing || !transcript}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20"
            >
              Analyze Transcript
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadZone;