import React, { useRef, useState, useEffect } from 'react';
import { Scissors, Download, Loader2, Play, Square } from 'lucide-react';

interface VideoExporterProps {
  sourceFile: File;
  startTime: number;
  endTime: number;
  title: string;
}

const VideoExporter: React.FC<VideoExporterProps> = ({ sourceFile, startTime, endTime, title }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [previewing, setPreviewing] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(sourceFile);
    setVideoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [sourceFile]);

  const togglePreview = () => {
    if (!videoRef.current) return;
    if (previewing) {
      videoRef.current.pause();
      setPreviewing(false);
    } else {
      videoRef.current.currentTime = startTime;
      videoRef.current.play();
      setPreviewing(true);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.currentTime >= endTime && previewing) {
        video.pause();
        setPreviewing(false);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [endTime, previewing]);

  const handleExport = async () => {
    const video = videoRef.current;
    if (!video || !video.captureStream) {
      alert("Your browser does not support video export features.");
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    video.muted = false;
    video.currentTime = startTime;
    
    // Ensure video metadata is loaded and seek is done
    await new Promise(r => setTimeout(r, 500));

    const stream = video.captureStream();
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/\s+/g, '_')}_short.webm`;
      a.click();
      setIsExporting(false);
      setExportProgress(0);
    };

    const duration = endTime - startTime;
    const updateInterval = 100;
    let elapsed = 0;

    recorder.start();
    video.play();

    const progressTimer = setInterval(() => {
      elapsed += updateInterval / 1000;
      setExportProgress(Math.min((elapsed / duration) * 100, 100));
      if (video.currentTime >= endTime) {
        video.pause();
        recorder.stop();
        clearInterval(progressTimer);
      }
    }, updateInterval);
  };

  if (!videoUrl) return null;

  return (
    <div className="mt-6 border-t border-slate-700/50 pt-4 space-y-4">
      <div className="relative aspect-video rounded-xl bg-black overflow-hidden group">
        <video 
          ref={videoRef} 
          src={videoUrl} 
          className="w-full h-full object-contain"
          playsInline
        />
        <button 
          onClick={togglePreview}
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {previewing ? <Square className="w-12 h-12 text-white fill-white" /> : <Play className="w-12 h-12 text-white fill-white" />}
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl font-bold transition-all shadow-lg ${
            isExporting 
              ? 'bg-indigo-900/50 text-indigo-300 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
          }`}
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Rendering {Math.round(exportProgress)}%
            </>
          ) : (
            <>
              <Scissors className="w-4 h-4 mr-2" />
              Export & Download Short
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default VideoExporter;