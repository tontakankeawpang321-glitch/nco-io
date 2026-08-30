import React, { useState } from 'react';
import { 
  Award, 
  ChevronRight, 
  ChevronDown, 
  Dices, 
  ScanLine, 
  PenTool, 
  Bot, 
  Sparkles, 
  Shield, 
  Star, 
  Calculator, 
  BookOpen, 
  Languages, 
  FlaskConical, 
  Globe, 
  Laptop, 
  Users, 
  Scale, 
  FileText,
  ExternalLink,
  Flame,
  CheckCircle2,
  BookMarked
} from 'lucide-react';
import { BranchType, ActiveTab, SubjectInfo } from '../types';
import { ARMY_SUBJECTS, POLICE_SUBJECTS } from '../data/curriculumData';
import { ShortsSection } from './ShortsSection';

interface HomeViewProps {
  branchFilter: BranchType;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenAI: () => void;
  onOpenSubjectModal: (subject: SubjectInfo) => void;
  onOpenInAppBrowser?: (url: string, title?: string) => void;
  streakCount: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  branchFilter,
  onSelectTab,
  onOpenAI,
  onOpenSubjectModal,
  onOpenInAppBrowser,
  streakCount
}) => {
  // Accordions are collapsed by default as requested
  const [openArmyAccordion, setOpenArmyAccordion] = useState<boolean>(false);
  const [openPoliceAccordion, setOpenPoliceAccordion] = useState<boolean>(false);

  const handleOpenStandardQuiz = (e: React.MouseEvent) => {
    const url = 'https://sites.google.com/view/tiwkhosoob/แบบทดสอบ-100-ขอ';
    if (onOpenInAppBrowser) {
      e.preventDefault();
      onOpenInAppBrowser(url, 'แบบทดสอบมาตรฐาน 100 ข้อ');
    }
  };

  return (
    <div className="space-y-4 pb-12">
      
      {/* 100-Question Standard Simulation Banner */}
      <a 
        href="https://sites.google.com/view/tiwkhosoob/แบบทดสอบ-100-ขอ" 
        onClick={handleOpenStandardQuiz}
        target="_blank" 
        rel="noopener noreferrer"
        className="group relative block w-full rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1E3A8A] p-4 text-white shadow-sm hover:shadow-md transition-all duration-300 transform active:scale-[0.99] border border-slate-700/80 overflow-hidden cursor-pointer"
      >
        <div className="absolute -right-3 -bottom-3 opacity-10 text-white text-8xl font-black pointer-events-none font-display">100</div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-xs border border-blue-400/30">
              <Star className="w-3 h-3 text-amber-300 fill-amber-300" /> 
              <span>คลังจำลองข้อสอบจริง</span>
            </div>
            <h2 className="font-display text-base sm:text-lg font-bold leading-snug text-white">ชุดเก็งข้อสอบมาตรฐาน 100 ข้อ</h2>
            <p className="text-xs text-slate-300 font-light">วัดระดับความพร้อมเสมือนลงสนามสอบจริง (คลิกทำข้อสอบ)</p>
          </div>
          
          <div className="w-9 h-9 rounded-xl bg-white text-[#2563EB] flex items-center justify-center font-bold shadow-xs group-hover:translate-x-1 transition-transform flex-shrink-0">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </a>

      {/* QUICK TOOLS ACTION GRID */}
      <div className="grid grid-cols-2 gap-2.5">
        
        {/* Random Quiz Launcher */}
        <button
          onClick={() => onSelectTab('random-quiz')}
          className="p-3.5 bg-white hover:bg-[#EFF6FF]/60 border border-[#E2E8F0] hover:border-[#93C5FD] rounded-2xl text-left transition-all shadow-2xs group active:scale-98"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Dices className="w-5 h-5" />
            </div>
            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
              สุ่มข้อสอบ
            </span>
          </div>
          <div className="font-display font-bold text-[#0F172A] text-xs sm:text-sm group-hover:text-[#2563EB] transition-colors">ระบบสุ่มคำถาม</div>
          <p className="text-[10px] text-[#64748B] mt-0.5">ฝึกทำโจทย์จับเวลา เฉลยละเอียด</p>
        </button>

        {/* Books / E-Books Launcher */}
        <button
          onClick={() => onSelectTab('books')}
          className="p-3.5 bg-white hover:bg-[#EFF6FF]/60 border border-[#E2E8F0] hover:border-[#93C5FD] rounded-2xl text-left transition-all shadow-2xs group active:scale-98"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
              PDF E-Book
            </span>
          </div>
          <div className="font-display font-bold text-[#0F172A] text-xs sm:text-sm group-hover:text-[#2563EB] transition-colors">คลังหนังสือ & สรุป</div>
          <p className="text-[10px] text-[#64748B] mt-0.5">เปิดอ่านเอกสาร PDF Google Sheet</p>
        </button>

        {/* Image Scanner Launcher */}
        <button
          onClick={() => onSelectTab('scanner')}
          className="p-3.5 bg-white hover:bg-[#EEF2FF]/60 border border-[#E2E8F0] hover:border-[#C7D2FE] rounded-2xl text-left transition-all shadow-2xs group active:scale-98"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <ScanLine className="w-5 h-5" />
            </div>
            <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
              AI Vision
            </span>
          </div>
          <div className="font-display font-bold text-[#0F172A] text-xs sm:text-sm group-hover:text-[#4F46E5] transition-colors">สแกนโจทย์ AI</div>
          <p className="text-[10px] text-[#64748B] mt-0.5">ถ่ายรูปข้อสอบ เฉลยวิธีคิดทันที</p>
        </button>

        {/* Scratchpad Launcher */}
        <button
          onClick={() => onSelectTab('scratchpad')}
          className="p-3.5 bg-white hover:bg-[#ECFDF5]/60 border border-[#E2E8F0] hover:border-[#A7F3D0] rounded-2xl text-left transition-all shadow-2xs group active:scale-98"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <PenTool className="w-5 h-5" />
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              วาด/คิดเลข
            </span>
          </div>
          <div className="font-display font-bold text-[#0F172A] text-xs sm:text-sm group-hover:text-[#059669] transition-colors">กระดาษทด & คำนวณ</div>
          <p className="text-[10px] text-[#64748B] mt-0.5">วาดเขียน พิมพ์สูตร แคปหน้าทด</p>
        </button>

        {/* AI Tutor Launcher */}
        <button
          onClick={onOpenAI}
          className="p-3.5 bg-white hover:bg-[#EFF6FF]/60 border border-[#E2E8F0] hover:border-[#93C5FD] rounded-2xl text-left transition-all shadow-2xs group active:scale-98"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full border border-blue-200">
              24 ชม.
            </span>
          </div>
          <div className="font-display font-bold text-[#0F172A] text-xs sm:text-sm group-hover:text-[#2563EB] transition-colors">AI ผู้ช่วยติวสอบ</div>
          <p className="text-[10px] text-[#64748B] mt-0.5">ปรึกษาข้อสอบ เทคนิคสัมภาษณ์</p>
        </button>

        {/* Community Forum Launcher */}
        <button
          onClick={() => onSelectTab('community')}
          className="p-3.5 bg-white hover:bg-[#EFF6FF]/60 border border-[#E2E8F0] hover:border-[#93C5FD] rounded-2xl text-left transition-all shadow-2xs group active:scale-98"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full border border-blue-200">
              ถาม-ตอบ
            </span>
          </div>
          <div className="font-display font-bold text-[#0F172A] text-xs sm:text-sm group-hover:text-[#2563EB] transition-colors">ชุมชนนักเรียนเตรียม</div>
          <p className="text-[10px] text-[#64748B] mt-0.5">แลกเปลี่ยนข้อสอบ เฉลยโจทย์</p>
        </button>

      </div>

      {/* MILITARY ARMY (นนส.) ACCORDION */}
      {(branchFilter === 'both' || branchFilter === 'army') && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
          
          <div 
            onClick={() => setOpenArmyAccordion(prev => !prev)}
            className="flex items-center justify-between p-4 cursor-pointer select-none bg-gradient-to-r from-emerald-50/50 via-white to-white hover:bg-emerald-50/70 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] flex items-center justify-center text-xl shadow-xs">
                <Shield className="w-5 h-5 text-[#059669]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-[#0F172A] text-sm sm:text-base">นายสิบทหารบก (นนส.)</h3>
                  <span className="text-[10px] bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] px-2 py-0.2 rounded font-bold">6 วิชาหลัก</span>
                </div>
                <p className="text-xs text-[#64748B] font-light mt-0.5">รวมแนวข้อสอบ & สัมภาษณ์ เข้ากองทัพบก (คลิกเพื่อขยาย)</p>
              </div>
            </div>
            
            <div className="w-7 h-7 rounded-full bg-[#F8FAFC] text-[#64748B] flex items-center justify-center text-xs border border-[#E2E8F0]">
              {openArmyAccordion ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
          </div>

          {openArmyAccordion && (
            <div className="p-3.5 pt-1 border-t border-[#E2E8F0] bg-[#F8FAFC]/60 animate-in fade-in duration-200">
              <div className="grid grid-cols-2 gap-2.5 mt-2">
                {ARMY_SUBJECTS.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => onOpenSubjectModal(sub)}
                    className="flex items-center gap-2.5 p-3 bg-white hover:bg-emerald-50/80 border border-[#E2E8F0] hover:border-emerald-300 rounded-xl transition-all shadow-2xs text-left group cursor-pointer active:scale-98"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#059669] flex items-center justify-center text-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                      {sub.id === 'interview' && <Award className="w-4 h-4" />}
                      {sub.id === 'math' && <Calculator className="w-4 h-4" />}
                      {sub.id === 'thai' && <BookOpen className="w-4 h-4" />}
                      {sub.id === 'english' && <Languages className="w-4 h-4" />}
                      {sub.id === 'science' && <FlaskConical className="w-4 h-4" />}
                      {sub.id === 'general' && <Globe className="w-4 h-4" />}
                    </div>
                    <div className="overflow-hidden">
                      <span className="font-display font-semibold text-xs text-[#0F172A] block truncate group-hover:text-emerald-700">
                        {sub.name.replace(' (นนส.)', '')}
                      </span>
                      <span className="text-[10px] text-[#64748B] block truncate">
                        {sub.shortDesc.split(' ')[0]}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* POLICE (นสต.) ACCORDION */}
      {(branchFilter === 'both' || branchFilter === 'police') && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
          
          <div 
            onClick={() => setOpenPoliceAccordion(prev => !prev)}
            className="flex items-center justify-between p-4 cursor-pointer select-none bg-gradient-to-r from-blue-50/50 via-white to-white hover:bg-blue-50/70 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] flex items-center justify-center text-xl shadow-xs">
                <Shield className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-[#0F172A] text-sm sm:text-base">นายสิบตำรวจ (นสต.)</h3>
                  <span className="text-[10px] bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE] px-2 py-0.2 rounded font-bold">7 หมวดวิชา</span>
                </div>
                <p className="text-xs text-[#64748B] font-light mt-0.5">คลังข้อสอบสายปราบปราม & อำนวยการ (คลิกเพื่อขยาย)</p>
              </div>
            </div>
            
            <div className="w-7 h-7 rounded-full bg-[#F8FAFC] text-[#64748B] flex items-center justify-center text-xs border border-[#E2E8F0]">
              {openPoliceAccordion ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
          </div>

          {openPoliceAccordion && (
            <div className="p-3.5 pt-1 border-t border-[#E2E8F0] bg-[#F8FAFC]/60 animate-in fade-in duration-200">
              <div className="grid grid-cols-2 gap-2.5 mt-2">
                {POLICE_SUBJECTS.map((sub) => {
                  const isFullWidth = sub.id === 'law';
                  return (
                    <button
                      key={sub.id}
                      onClick={() => onOpenSubjectModal(sub)}
                      className={`${isFullWidth ? 'col-span-2' : ''} flex items-center gap-2.5 p-3 bg-white hover:bg-blue-50/80 border border-[#E2E8F0] hover:border-blue-300 rounded-xl transition-all shadow-2xs text-left group cursor-pointer active:scale-98`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center text-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                        {sub.id === 'interview' && <Award className="w-4 h-4" />}
                        {sub.id === 'math' && <Calculator className="w-4 h-4" />}
                        {sub.id === 'thai' && <BookOpen className="w-4 h-4" />}
                        {sub.id === 'english' && <Languages className="w-4 h-4" />}
                        {sub.id === 'computer' && <Laptop className="w-4 h-4" />}
                        {sub.id === 'society' && <Users className="w-4 h-4" />}
                        {sub.id === 'law' && <Scale className="w-4 h-4" />}
                      </div>
                      <div className="overflow-hidden">
                        <span className="font-display font-semibold text-xs text-[#0F172A] block truncate group-hover:text-blue-700">
                          {sub.name.replace(' (นสต.)', '')}
                        </span>
                        <span className="text-[10px] text-[#64748B] block truncate">
                          {sub.shortDesc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

      {/* SHORTS VIDEO COLUMN (Placed at the bottom below police accordion as requested) */}
      <ShortsSection />

    </div>
  );
};
