import React from 'react';
import { 
  X, 
  BookOpen, 
  Award, 
  Calculator, 
  Languages, 
  FlaskConical, 
  Globe, 
  Laptop, 
  Users, 
  Scale, 
  Dices, 
  ExternalLink,
  BookMarked,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SubjectInfo } from '../types';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface SubjectDetailModalProps {
  subject: SubjectInfo | null;
  onClose: () => void;
  onNavigateToCurriculum?: (branchTab: 'subjects-army' | 'subjects-police') => void;
  onOpenInAppBrowser?: (url: string, title?: string) => void;
}

export const SubjectDetailModal: React.FC<SubjectDetailModalProps> = ({
  subject,
  onClose,
  onNavigateToCurriculum,
  onOpenInAppBrowser
}) => {
  const isOpen = !!subject;
  useBodyScrollLock(isOpen);

  if (!subject) return null;

  const isArmy = subject.branch === 'army';

  // Construct online study link if externalLink exists
  const getFullExternalUrl = (link?: string) => {
    if (!link) return 'https://sites.google.com/view/tiwkhosoob/';
    if (link.startsWith('http://') || link.startsWith('https://')) return link;
    return `https://sites.google.com/view/tiwkhosoob/${link.replace('.html', '')}`;
  };

  const handleOpenStudyPage = (e: React.MouseEvent) => {
    const url = getFullExternalUrl(subject.externalLink);
    if (onOpenInAppBrowser) {
      e.preventDefault();
      onOpenInAppBrowser(url, `หน้าติว: ${subject.name}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-2xl space-y-3.5 max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-lg shadow-xs flex-shrink-0 ${
              isArmy ? 'bg-[#ECFDF5] text-[#059669]' : 'bg-[#EFF6FF] text-[#2563EB]'
            }`}>
              {subject.id === 'interview' && <Award className="w-6 h-6" />}
              {subject.id === 'math' && <Calculator className="w-6 h-6" />}
              {subject.id === 'thai' && <BookOpen className="w-6 h-6" />}
              {subject.id === 'english' && <Languages className="w-6 h-6" />}
              {subject.id === 'science' && <FlaskConical className="w-6 h-6" />}
              {subject.id === 'general' && <Globe className="w-6 h-6" />}
              {subject.id === 'computer' && <Laptop className="w-6 h-6" />}
              {subject.id === 'society' && <Users className="w-6 h-6" />}
              {subject.id === 'law' && <Scale className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] font-bold px-2 py-0.2 rounded ${
                  isArmy ? 'bg-[#ECFDF5] text-[#065F46]' : 'bg-[#EFF6FF] text-[#1E40AF]'
                }`}>
                  {isArmy ? 'ทหารบก (นนส.)' : 'ตำรวจ (นสต.)'}
                </span>
                <span className="text-[10px] text-[#94A3B8] font-semibold">น้ำหนัก {subject.weightPercent}%</span>
              </div>
              <h3 className="font-display font-bold text-[#0F172A] text-sm sm:text-base leading-tight mt-0.5">
                {subject.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close details"
            className="w-7 h-7 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] flex items-center justify-center text-xs transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Short Description */}
        <p className="text-xs text-[#475569] leading-relaxed font-sans">
          {subject.shortDesc}
        </p>

        {/* Summary Points */}
        <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0] space-y-2">
          <div className="flex items-center gap-1.5 font-display font-bold text-xs text-[#0F172A]">
            <BookMarked className="w-4 h-4 text-[#2563EB]" />
            <span>หัวข้อสำคัญที่มักออกสอบ:</span>
          </div>
          <ul className="space-y-1.5 text-xs text-[#334155] pl-1">
            {subject.summaryNotes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 flex-shrink-0" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Key Formulas */}
        {subject.keyFormulas && subject.keyFormulas.length > 0 && (
          <div className="bg-[#FFFBEB] p-3.5 rounded-2xl border border-[#FDE68A] space-y-2">
            <div className="flex items-center gap-1.5 font-display font-bold text-xs text-[#92400E]">
              <Sparkles className="w-4 h-4 text-[#D97706]" />
              <span>สูตรลัด / กฎหลักที่ต้องจำ:</span>
            </div>
            <div className="space-y-1.5">
              {subject.keyFormulas.map((f, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded-xl border border-[#FDE68A] text-xs">
                  <div className="font-display font-bold text-[#B45309] text-[11px]">{f.title}</div>
                  <div className="font-mono text-[#78350F] text-[11px] mt-0.5">{f.detail}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons - Direct Link to Study Page */}
        <div className="pt-2 space-y-2">
          <a
            href={getFullExternalUrl(subject.externalLink)}
            onClick={handleOpenStudyPage}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full py-3 text-white font-display font-bold text-xs sm:text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer ${
              isArmy ? 'bg-gradient-to-r from-[#059669] to-[#047857] hover:brightness-105' : 'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:brightness-105'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>เข้าสู่หน้าติว & แนวข้อสอบวิชานี้</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </a>

          {onNavigateToCurriculum && (
            <button
              onClick={() => {
                onNavigateToCurriculum(isArmy ? 'subjects-army' : 'subjects-police');
                onClose();
              }}
              className="w-full py-2.5 px-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#334155] hover:text-[#0F172A] border border-[#E2E8F0] font-display text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>ดูหมวดวิชาทั้งหมดของ{isArmy ? 'ทหารบก (นนส.)' : 'ตำรวจ (นสต.)'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
