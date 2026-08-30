import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCw, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Film, 
  X, 
  ExternalLink,
  ArrowLeft,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { ShortVideoItem } from '../types';
import { fetchShortsFromSheet } from '../utils/sheetService';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

export const ShortsSection: React.FC = () => {
  const [shorts, setShorts] = useState<ShortVideoItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<ShortVideoItem | null>(null);

  const CLIPS_PER_PAGE = 4;

  // Lock body scroll when video player modal is active
  useBodyScrollLock(!!selectedVideo);

  // Load from Google Sheet on open / mount
  const loadShorts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchShortsFromSheet();
      setShorts(data);
    } catch (e) {
      console.error('Failed to load shorts', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadShorts();
  }, []);

  // Filter based on search query
  const filteredShorts = shorts.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredShorts.length / CLIPS_PER_PAGE));
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * CLIPS_PER_PAGE;
  const currentShorts = filteredShorts.slice(startIndex, startIndex + CLIPS_PER_PAGE);

  const handlePrevPage = () => {
    if (validPage > 1) {
      setCurrentPage(validPage - 1);
    }
  };

  const handleNextPage = () => {
    if (validPage < totalPages) {
      setCurrentPage(validPage + 1);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-2xs space-y-3.5">
      
      {/* Section Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold shadow-xs">
            <Film className="w-5 h-5 text-[#2563EB]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-display font-bold text-[#0F172A] text-sm">คลิปสรุปติวสั้น (Shorts)</h3>
              <span className="text-[10px] bg-[#FEF2F2] text-[#DC2626] font-bold px-2 py-0.2 rounded-full border border-[#FECACA] flex items-center gap-1">
                <Flame className="w-3 h-3 text-[#DC2626]" /> 60 วิ
              </span>
            </div>
            <p className="text-[11px] text-[#64748B]">เทคนิคจำเร็ว สรุปสูตร และจับใจความ</p>
          </div>
        </div>

        {/* Action Buttons: Search Toggle & Refresh */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              if (isSearchOpen) setSearchQuery('');
            }}
            title="ค้นหาคลิป"
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors border ${
              isSearchOpen || searchQuery 
                ? 'bg-[#2563EB] text-white border-[#2563EB]' 
                : 'bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={loadShorts}
            title="ดึงข้อมูลล่าสุดจาก Sheet"
            className="w-8 h-8 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#64748B] flex items-center justify-center transition-colors border border-[#E2E8F0]"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#2563EB]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expandable Search Input Bar */}
      {isSearchOpen && (
        <div className="relative animate-in fade-in slide-in-from-top-1 duration-150">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="ค้นหาชื่อคลิป, หมวดวิชา, หรือเทคนิค..."
            className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 pl-9 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] font-sans"
            autoFocus
          />
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-[#94A3B8] hover:text-[#0F172A] text-xs"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Video Cards Grid (4 per page) */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-2.5 py-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 h-32 animate-pulse flex flex-col justify-between">
              <div className="h-3 bg-[#E2E8F0] rounded w-3/4"></div>
              <div className="h-2 bg-[#E2E8F0] rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : currentShorts.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-[#CBD5E1] rounded-xl space-y-1.5">
          <Film className="w-8 h-8 text-[#94A3B8] mx-auto" />
          <p className="text-xs font-semibold text-[#475569]">ไม่พบคลิปที่ค้นหา</p>
          <p className="text-[10px] text-[#94A3B8]">ลองพิมพ์คำค้นหาอื่น หรือกดรีเฟรชข้อมูลจาก Sheet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {currentShorts.map((clip) => (
            <div
              key={clip.id}
              onClick={() => setSelectedVideo(clip)}
              className="group cursor-pointer bg-[#F8FAFC] hover:bg-[#EFF6FF]/60 border border-[#E2E8F0] hover:border-[#93C5FD] rounded-xl overflow-hidden shadow-2xs transition-all flex flex-col justify-between p-2.5 active:scale-98"
            >
              {/* Thumbnail / Header Area */}
              <div className="relative aspect-[16/10] bg-[#0F172A] rounded-lg overflow-hidden flex items-center justify-center mb-2 shadow-xs group-hover:shadow-md transition-shadow">
                {clip.videoId ? (
                  <img
                    src={`https://img.youtube.com/vi/${clip.videoId}/hqdefault.jpg`}
                    alt={clip.title}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // fallback if thumbnail doesn't load
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1E293B] to-[#0F172A] flex items-center justify-center">
                    <Film className="w-6 h-6 text-[#2563EB]/70" />
                  </div>
                )}

                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Duration Badge */}
                {clip.duration && (
                  <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                    {clip.duration}
                  </span>
                )}

                {/* Category Badge */}
                <span className="absolute top-1 left-1 bg-black/60 backdrop-blur-xs text-blue-200 text-[9px] font-medium px-1.5 py-0.2 rounded truncate max-w-[80%]">
                  {clip.category}
                </span>
              </div>

              {/* Title & Description */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-display font-bold text-xs text-[#0F172A] line-clamp-2 leading-tight group-hover:text-[#2563EB] transition-colors">
                    {clip.title}
                  </h4>
                  <p className="text-[10px] text-[#64748B] line-clamp-1 mt-1">
                    {clip.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#E2E8F0]/70 text-[10px] text-[#94A3B8]">
                  <span>{clip.views ? `ยอดวิว ${clip.views}` : 'ติวสั้น 60 วิ'}</span>
                  <span className="text-[#2563EB] font-bold flex items-center gap-0.5">
                    เล่นคลิป <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Bar (4 items per page) */}
      <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] text-xs">
        <div className="text-[11px] text-[#64748B] font-display">
          แสดง <span className="font-bold text-[#0F172A]">{currentShorts.length}</span> จากทั้งหมด <span className="font-bold text-[#0F172A]">{filteredShorts.length}</span> คลิป
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevPage}
            disabled={validPage <= 1}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#334155] border border-[#E2E8F0] font-display text-[11px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>ย้อนกลับ</span>
          </button>

          <span className="text-[11px] font-bold text-[#0F172A] px-2 py-0.5 bg-[#EFF6FF] text-[#2563EB] rounded-md border border-[#BFDBFE]">
            {validPage}/{totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={validPage >= totalPages}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#334155] border border-[#E2E8F0] font-display text-[11px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <span>ถัดไป</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* VIDEO PLAYER MODAL */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/80 backdrop-blur-sm p-3 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-2xl space-y-0 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            
            {/* Modal Header with Back to App Button */}
            <div className="bg-[#0F172A] text-white p-3 px-4 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
              <button
                onClick={() => setSelectedVideo(null)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-display font-semibold transition-colors border border-slate-700 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-blue-400" />
                <span>กลับสู่แอป</span>
              </button>

              <div className="text-right overflow-hidden ml-2">
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.2 rounded border border-blue-400/30">
                  {selectedVideo.category}
                </span>
              </div>
            </div>

            {/* Video Frame */}
            <div className="relative aspect-[9/16] sm:aspect-[9/14] bg-black max-h-[50vh] flex-shrink-0 flex items-center justify-center">
              {selectedVideo.embedUrl ? (
                <iframe
                  src={selectedVideo.embedUrl}
                  title={selectedVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="text-center p-4 text-white text-xs">
                  <p>ไม่สามารถโหลดวิดีโอนี้ได้โดยตรง</p>
                  {selectedVideo.url && (
                    <a 
                      href={selectedVideo.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-blue-400 underline text-xs"
                    >
                      เปิดดูใน YouTube <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Video Detail & Actions */}
            <div className="p-4 bg-white space-y-3 overflow-y-auto flex-1">
              <div>
                <h3 className="font-display font-bold text-sm text-[#0F172A] leading-snug">
                  {selectedVideo.title}
                </h3>
                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                  {selectedVideo.description}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#F1F5F9]">
                {selectedVideo.url && (
                  <a
                    href={selectedVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#1E293B] border border-[#E2E8F0] rounded-xl font-display text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>เปิดใน YouTube</span>
                  </a>
                )}
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="flex-1 py-2 px-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-display text-xs font-bold transition-colors shadow-xs"
                >
                  ปิดวิดีโอ
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
