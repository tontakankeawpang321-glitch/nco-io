import React from 'react';
import { ArrowLeft, ExternalLink, RotateCw, X, Globe, Shield } from 'lucide-react';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface InAppBrowserModalProps {
  url: string | null;
  title?: string;
  onClose: () => void;
}

export const InAppBrowserModal: React.FC<InAppBrowserModalProps> = ({
  url,
  title = 'เนื้อหาประกอบการติว',
  onClose
}) => {
  const isOpen = !!url;
  useBodyScrollLock(isOpen);

  if (!url) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0F172A]/80 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Top Navigation Bar with Return to App Button */}
      <div className="bg-[#0F172A] text-white px-3 py-2.5 flex items-center justify-between border-b border-slate-700 shadow-md">
        <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E293B] hover:bg-[#334155] active:bg-[#475569] text-white rounded-xl text-xs font-display font-semibold transition-all border border-slate-600 shadow-xs flex-shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400" />
            <span>กลับสู่แอป</span>
          </button>
          
          <div className="overflow-hidden">
            <div className="font-display font-bold text-xs truncate text-white">
              {title}
            </div>
            <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
              <Globe className="w-2.5 h-2.5 text-slate-400" />
              <span>{url}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title="เปิดในแท็บใหม่"
            className="w-8 h-8 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-slate-300 flex items-center justify-center transition-colors border border-slate-700"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 bg-white relative w-full h-full overflow-hidden">
        <iframe
          src={url}
          title={title}
          className="w-full h-full border-0 bg-white"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

    </div>
  );
};
