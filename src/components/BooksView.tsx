import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  RotateCw, 
  FileText, 
  Download, 
  ExternalLink, 
  ArrowLeft, 
  Sparkles, 
  Shield, 
  BookMarked,
  X,
  Maximize2
} from 'lucide-react';
import { BookItem } from '../types';
import { fetchBooksFromSheet } from '../utils/sheetService';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface BooksViewProps {
  onShowToast?: (message: string, isError?: boolean) => void;
}

export const BooksView: React.FC<BooksViewProps> = ({ onShowToast }) => {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');
  const [activePdfBook, setActivePdfBook] = useState<BookItem | null>(null);

  // Lock body scroll when PDF viewer modal is open
  useBodyScrollLock(!!activePdfBook);

  // Load from Google Sheet
  const loadBooks = async () => {
    setIsLoading(true);
    try {
      const data = await fetchBooksFromSheet();
      setBooks(data);
      if (onShowToast) {
        onShowToast(`อัปเดตคลังหนังสือแล้ว (${data.length} รายการ)`);
      }
    } catch (e) {
      console.error('Failed to load books sheet', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  // Extract unique categories
  const categories = ['ทั้งหมด', ...Array.from(new Set(books.map(b => b.category).filter(Boolean)))];

  // Filter books
  const filteredBooks = books.filter((book) => {
    const matchesCategory = selectedCategory === 'ทั้งหมด' || book.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || (
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4 pb-12">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-[#0F172A] text-sm">คลังหนังสือ & เอกสารสรุป PDF</h2>
              <p className="text-[11px] text-[#64748B]">เปิดอ่าน E-Book สรุปสูตร และเก็งข้อสอบ</p>
            </div>
          </div>

          <button
            onClick={loadBooks}
            title="ดึงข้อมูลล่าสุดจาก Google Sheet"
            className="w-8 h-8 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#64748B] flex items-center justify-center transition-colors border border-[#E2E8F0]"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#2563EB]' : ''}`} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อหนังสือ, หมวดวิชา, หรือเนื้อหา..."
            className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 pl-9 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] font-sans"
          />
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-[#94A3B8] hover:text-[#0F172A] text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Chips Scroll */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl whitespace-nowrap text-[11px] font-display transition-all ${
                selectedCategory === cat
                  ? 'bg-[#0F172A] text-white font-bold shadow-xs'
                  : 'bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Books List Grid */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-2xs h-32 animate-pulse flex flex-col justify-between">
                <div className="h-4 bg-[#E2E8F0] rounded w-3/4"></div>
                <div className="h-3 bg-[#E2E8F0] rounded w-1/2"></div>
                <div className="h-8 bg-[#E2E8F0] rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-[#CBD5E1] space-y-2">
            <BookMarked className="w-10 h-10 text-[#94A3B8] mx-auto" />
            <div className="font-display font-bold text-[#334155] text-sm">ไม่พบหนังสือในหมวดหมู่นี้</div>
            <p className="text-xs text-[#64748B]">ลองเลือกหมวดอื่น หรือกดปุ่มรีเฟรชเพื่อโหลดข้อมูลล่าสุดจาก Sheet</p>
          </div>
        ) : (
          filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-2xs space-y-3 hover:border-[#CBD5E1] transition-all"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] text-[#2563EB] flex items-center justify-center font-bold shadow-xs flex-shrink-0 mt-0.5">
                    <FileText className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE] px-2 py-0.2 rounded font-bold">
                        {book.category}
                      </span>
                      {book.badge && (
                        <span className="text-[9px] bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] px-1.5 py-0.2 rounded font-semibold">
                          {book.badge}
                        </span>
                      )}
                      {book.pageCount && (
                        <span className="text-[10px] text-[#94A3B8]">
                          {book.pageCount}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-xs sm:text-sm text-[#0F172A] mt-1 leading-snug">
                      {book.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[#475569] leading-relaxed font-sans">
                {book.description}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setActivePdfBook(book)}
                  className="flex-1 py-2.5 px-3 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white font-display text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-blue-200" />
                  <span>เปิดอ่าน PDF ในแอป</span>
                </button>

                {book.url && (
                  <a
                    href={book.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="เปิดลิงก์ต้นฉบับในแท็บใหม่"
                    className="p-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0] transition-colors flex items-center justify-center"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* FULL IN-APP PDF VIEWER MODAL */}
      {activePdfBook && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#0F172A]/90 backdrop-blur-sm animate-in fade-in duration-200">
          
          {/* Top Bar with Return to App Button */}
          <div className="bg-[#0F172A] text-white px-3.5 py-2.5 flex items-center justify-between border-b border-slate-800 shadow-md">
            <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
              <button
                onClick={() => setActivePdfBook(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E293B] hover:bg-[#334155] active:bg-[#475569] text-white rounded-xl text-xs font-display font-semibold transition-all border border-slate-700 shadow-xs flex-shrink-0 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-blue-400" />
                <span>กลับสู่แอป</span>
              </button>

              <div className="overflow-hidden">
                <h4 className="font-display font-bold text-xs truncate text-white">
                  {activePdfBook.title}
                </h4>
                <p className="text-[10px] text-slate-400 truncate">
                  {activePdfBook.category} • {activePdfBook.pageCount || 'Google PDF'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {activePdfBook.url && (
                <a
                  href={activePdfBook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="เปิดในแท็บใหม่"
                  className="w-8 h-8 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-slate-300 flex items-center justify-center transition-colors border border-slate-700"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                onClick={() => setActivePdfBook(null)}
                aria-label="Close"
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors border border-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* PDF Viewer Frame */}
          <div className="flex-1 bg-[#1E293B] relative w-full h-full overflow-hidden">
            {activePdfBook.embedUrl ? (
              <iframe
                src={activePdfBook.embedUrl}
                title={activePdfBook.title}
                className="w-full h-full border-0 bg-white"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-white text-center p-6 space-y-3">
                <FileText className="w-12 h-12 text-slate-400" />
                <p className="text-sm font-semibold">เปิดเอกสารฉบับนี้ด้วยลิงก์ภายนอก</p>
                <a
                  href={activePdfBook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#2563EB] text-white rounded-xl text-xs font-display font-bold inline-flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>เปิดดูเอกสาร</span>
                </a>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
