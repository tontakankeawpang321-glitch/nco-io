import React from 'react';
import { 
  X, 
  Home, 
  Dices, 
  ScanLine, 
  PenTool, 
  Bot, 
  Users, 
  Shield, 
  Award, 
  BookOpen, 
  Calculator, 
  Scale, 
  Laptop, 
  Globe, 
  Sparkles, 
  ExternalLink, 
  ChevronRight, 
  Flame,
  BookMarked
} from 'lucide-react';
import { ActiveTab, BranchType } from '../types';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface LeftSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  branchFilter: BranchType;
  onSetBranch: (branch: BranchType) => void;
  onOpenAI: () => void;
  streakCount: number;
}

export const LeftSidebarDrawer: React.FC<LeftSidebarDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  branchFilter,
  onSetBranch,
  onOpenAI,
  streakCount
}) => {
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const handleNav = (tab: ActiveTab) => {
    onSelectTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-[300px] max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-250 border-r border-[#E2E8F0]">
        
        {/* Header with Cadet Profile */}
        <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#1E3A8A] text-white p-5 pt-7 relative overflow-hidden">
          <button 
            onClick={onClose}
            aria-label="Close menu"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-[#0F172A] rounded-[14px] flex items-center justify-center text-blue-400 font-black text-xl">
                <Award className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider bg-blue-500/20 px-2 py-0.5 rounded border border-blue-400/30">PREP PASS</span>
              </div>
              <h2 className="font-display font-bold text-base text-white leading-tight">ศูนย์รวมข้อสอบ</h2>
              <p className="text-[11px] text-slate-300">นนส. ทหารบก & นสต. ตำรวจ</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 flex items-center justify-between text-xs border border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-500/30 text-blue-300 flex items-center justify-center font-bold">
                <Flame className="w-3.5 h-3.5 text-blue-300 animate-pulse" />
              </div>
              <div>
                <div className="text-[10px] text-slate-300">ความสม่ำเสมอ</div>
                <div className="font-display font-bold text-blue-200 text-xs">{streakCount} วันฝึกฝน</div>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
              ปี 2569
            </span>
          </div>
        </div>

        {/* Branch Filter Switcher */}
        <div className="p-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <div className="text-[11px] font-semibold text-[#64748B] mb-1.5 px-1">เลือกสังกัดที่เตรียมสอบ</div>
          <div className="grid grid-cols-3 gap-1 bg-[#E2E8F0]/80 p-1 rounded-xl text-xs font-display font-semibold">
            <button 
              onClick={() => onSetBranch('both')}
              className={`py-1.5 rounded-lg transition-all cursor-pointer ${branchFilter === 'both' ? 'bg-white text-[#0F172A] shadow-xs font-bold' : 'text-[#64748B] hover:text-[#0F172A]'}`}
            >
              ทั้งหมด
            </button>
            <button 
              onClick={() => onSetBranch('army')}
              className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${branchFilter === 'army' ? 'bg-[#10B981] text-white shadow-xs font-bold' : 'text-[#64748B] hover:text-[#10B981]'}`}
            >
              ทหาร (นนส.)
            </button>
            <button 
              onClick={() => onSetBranch('police')}
              className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${branchFilter === 'police' ? 'bg-[#2563EB] text-white shadow-xs font-bold' : 'text-[#64748B] hover:text-[#2563EB]'}`}
            >
              ตำรวจ (นสต.)
            </button>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
          
          {/* Main Features */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider px-2 py-1">เครื่องมือหลัก</div>
            
            <button
              onClick={() => handleNav('home')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'home' 
                  ? 'bg-[#EFF6FF] text-[#1E40AF] font-semibold border border-[#BFDBFE] shadow-xs' 
                  : 'text-[#334155] hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Home className="w-4 h-4 text-[#2563EB]" />
                <span className="font-display text-xs">หน้าหลัก / คลังข้อสอบ</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
            </button>

            {/* Books Menu Item */}
            <button
              onClick={() => handleNav('books')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'books' 
                  ? 'bg-[#EFF6FF] text-[#1E40AF] font-semibold border border-[#BFDBFE] shadow-xs' 
                  : 'text-[#334155] hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-[#2563EB]" />
                <div className="text-left">
                  <div className="font-display text-xs">คลังหนังสือ & สรุป PDF</div>
                  <div className="text-[10px] text-[#64748B]">เปิดอ่าน E-Book จาก Google Sheet</div>
                </div>
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">PDF</span>
            </button>

            <button
              onClick={() => handleNav('random-quiz')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'random-quiz' 
                  ? 'bg-[#EFF6FF] text-[#1E40AF] font-semibold border border-[#BFDBFE] shadow-xs' 
                  : 'text-[#334155] hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Dices className="w-4 h-4 text-[#2563EB]" />
                <div className="text-left">
                  <div className="font-display text-xs">ระบบสุ่มคำถามจำลอง</div>
                  <div className="text-[10px] text-[#64748B]">สุ่มข้อสอบจับเวลา เฉลยละเอียด</div>
                </div>
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">NEW</span>
            </button>

            <button
              onClick={() => handleNav('scanner')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'scanner' 
                  ? 'bg-[#EFF6FF] text-[#1E40AF] font-semibold border border-[#BFDBFE] shadow-xs' 
                  : 'text-[#334155] hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center gap-3">
                <ScanLine className="w-4 h-4 text-[#2563EB]" />
                <div className="text-left">
                  <div className="font-display text-xs">สแกนโจทย์ปัญหา AI</div>
                  <div className="text-[10px] text-[#64748B]">ถ่ายรูป/อัปโหลดภาพ เฉลยทันที</div>
                </div>
              </div>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded">AI</span>
            </button>

            <button
              onClick={() => handleNav('scratchpad')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'scratchpad' 
                  ? 'bg-[#ECFDF5] text-[#065F46] font-semibold border border-[#A7F3D0] shadow-xs' 
                  : 'text-[#334155] hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center gap-3">
                <PenTool className="w-4 h-4 text-[#10B981]" />
                <div className="text-left">
                  <div className="font-display text-xs">กระดาษทด & เครื่องคิดเลข</div>
                  <div className="text-[10px] text-[#64748B]">วาด พิมพ์ แคปหน้าทด บันทึก</div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
            </button>

            <button
              onClick={() => handleNav('community')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'community' 
                  ? 'bg-[#EFF6FF] text-[#1E40AF] font-semibold border border-[#BFDBFE] shadow-xs' 
                  : 'text-[#334155] hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-[#2563EB]" />
                <span className="font-display text-xs">ชุมชนกระดานถาม-ตอบ</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenAI();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 text-[#1E3A8A] hover:bg-blue-100/80 transition-all border border-blue-200/80 shadow-2xs cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Bot className="w-4 h-4 text-[#2563EB]" />
                <div className="text-left">
                  <div className="font-display text-xs font-semibold">AI ผู้ช่วยติว 24 ชม.</div>
                  <div className="text-[10px] text-[#2563EB]">ถามได้ทุกวิชา สูตร & วิธีคิด</div>
                </div>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            </button>
          </div>

          {/* Military Subjects (นนส.) */}
          <div className="space-y-1 pt-2 border-t border-[#E2E8F0]">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#10B981]" /> ทหารบก (นนส.) 6 วิชา
              </span>
              <button 
                onClick={() => handleNav('subjects-army')}
                className="text-[10px] text-[#10B981] hover:underline font-semibold cursor-pointer"
              >
                ดูทั้งหมด
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <button 
                onClick={() => handleNav('subjects-army')}
                className="p-2 bg-[#F8FAFC] hover:bg-emerald-50 border border-[#E2E8F0] hover:border-emerald-300 rounded-lg text-left transition-colors cursor-pointer"
              >
                <div className="font-display font-semibold text-[#0F172A] text-[11px]">สอบสัมภาษณ์</div>
                <div className="text-[9px] text-[#64748B]">จิตวิทยา & ท่าทาง</div>
              </button>
              <button 
                onClick={() => handleNav('subjects-army')}
                className="p-2 bg-[#F8FAFC] hover:bg-emerald-50 border border-[#E2E8F0] hover:border-emerald-300 rounded-lg text-left transition-colors cursor-pointer"
              >
                <div className="font-display font-semibold text-[#0F172A] text-[11px]">คณิตศาสตร์</div>
                <div className="text-[9px] text-[#64748B]">สูตร & การคำนวณ</div>
              </button>
              <button 
                onClick={() => handleNav('subjects-army')}
                className="p-2 bg-[#F8FAFC] hover:bg-emerald-50 border border-[#E2E8F0] hover:border-emerald-300 rounded-lg text-left transition-colors cursor-pointer"
              >
                <div className="font-display font-semibold text-[#0F172A] text-[11px]">ภาษาไทย</div>
                <div className="text-[9px] text-[#64748B]">หลักภาษา & การอ่าน</div>
              </button>
              <button 
                onClick={() => handleNav('subjects-army')}
                className="p-2 bg-[#F8FAFC] hover:bg-emerald-50 border border-[#E2E8F0] hover:border-emerald-300 rounded-lg text-left transition-colors cursor-pointer"
              >
                <div className="font-display font-semibold text-[#0F172A] text-[11px]">ภาษาอังกฤษ</div>
                <div className="text-[9px] text-[#64748B]">Grammar & Vocab</div>
              </button>
              <button 
                onClick={() => handleNav('subjects-army')}
                className="p-2 bg-[#F8FAFC] hover:bg-emerald-50 border border-[#E2E8F0] hover:border-emerald-300 rounded-lg text-left transition-colors cursor-pointer"
              >
                <div className="font-display font-semibold text-[#0F172A] text-[11px]">วิทยาศาสตร์</div>
                <div className="text-[9px] text-[#64748B]">ฟิสิกส์ เคมี ชีวะ</div>
              </button>
              <button 
                onClick={() => handleNav('subjects-army')}
                className="p-2 bg-[#F8FAFC] hover:bg-emerald-50 border border-[#E2E8F0] hover:border-emerald-300 rounded-lg text-left transition-colors cursor-pointer"
              >
                <div className="font-display font-semibold text-[#0F172A] text-[11px]">ความรู้ทั่วไป</div>
                <div className="text-[9px] text-[#64748B]">เหตุการณ์ปัจจุบัน</div>
              </button>
            </div>
          </div>

          {/* Police Subjects (นสต.) */}
          <div className="space-y-1 pt-2 border-t border-[#E2E8F0]">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#2563EB]" /> ตำรวจ (นสต.) 7 วิชา
              </span>
              <button 
                onClick={() => handleNav('subjects-police')}
                className="text-[10px] text-[#2563EB] hover:underline font-semibold cursor-pointer"
              >
                ดูทั้งหมด
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <button 
                onClick={() => handleNav('subjects-police')}
                className="p-2 bg-[#F8FAFC] hover:bg-blue-50 border border-[#E2E8F0] hover:border-blue-300 rounded-lg text-left transition-colors cursor-pointer"
              >
                <div className="font-display font-semibold text-[#0F172A] text-[11px]">สัมภาษณ์ตำรวจ</div>
                <div className="text-[9px] text-[#64748B]">อุดมคติ 9 ข้อ</div>
              </button>
              <button 
                onClick={() => handleNav('subjects-police')}
                className="p-2 bg-[#F8FAFC] hover:bg-blue-50 border border-[#E2E8F0] hover:border-blue-300 rounded-lg text-left transition-colors cursor-pointer"
              >
                <div className="font-display font-semibold text-[#0F172A] text-[11px]">ความสามารถทั่วไป</div>
                <div className="text-[9px] text-[#64748B]">คณิต & ตรรกศาสตร์</div>
              </button>
              <button 
                onClick={() => handleNav('subjects-police')}
                className="p-2 bg-[#F8FAFC] hover:bg-blue-50 border border-[#E2E8F0] hover:border-blue-300 rounded-lg text-left transition-colors cursor-pointer"
              >
                <div className="font-display font-semibold text-[#0F172A] text-[11px]">ภาษาไทย</div>
                <div className="text-[9px] text-[#64748B]">จับใจความ & สะกด</div>
              </button>
              <button 
                onClick={() => handleNav('subjects-police')}
                className="p-2 bg-[#F8FAFC] hover:bg-blue-50 border border-[#E2E8F0] hover:border-blue-300 rounded-lg text-left transition-colors cursor-pointer"
              >
                <div className="font-display font-semibold text-[#0F172A] text-[11px]">ภาษาอังกฤษ</div>
                <div className="text-[9px] text-[#64748B]">Reading & Structure</div>
              </button>
              <button 
                onClick={() => handleNav('subjects-police')}
                className="p-2 bg-[#F8FAFC] hover:bg-blue-50 border border-[#E2E8F0] hover:border-blue-300 rounded-lg text-left transition-colors cursor-pointer"
              >
                <div className="font-display font-semibold text-[#0F172A] text-[11px]">คอมพิวเตอร์</div>
                <div className="text-[9px] text-[#64748B]">สารสนเทศ & Cyber</div>
              </button>
              <button 
                onClick={() => handleNav('subjects-police')}
                className="p-2 bg-[#F8FAFC] hover:bg-blue-50 border border-[#E2E8F0] hover:border-blue-300 rounded-lg text-left transition-colors cursor-pointer"
              >
                <div className="font-display font-semibold text-[#0F172A] text-[11px]">สังคม & จริยธรรม</div>
                <div className="text-[9px] text-[#64748B]">อาเซียน & วัฒนธรรม</div>
              </button>
              <button 
                onClick={() => handleNav('subjects-police')}
                className="col-span-2 p-2 bg-[#F8FAFC] hover:bg-blue-50 border border-[#E2E8F0] hover:border-blue-300 rounded-lg text-left transition-colors cursor-pointer"
              >
                <div className="font-display font-semibold text-[#0F172A] text-[11px]">กฎหมายที่ประชาชนควรรู้</div>
                <div className="text-[9px] text-[#64748B]">ป.อาญา / ป.วิอาญา / จราจร</div>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom App Info */}
        <div className="p-3 bg-[#F8FAFC] border-t border-[#E2E8F0] text-[10px] text-[#64748B] flex items-center justify-between">
          <span>เวอร์ชัน 2026 Pro</span>
          <span className="font-semibold text-[#2563EB]">Prep Pass Academy</span>
        </div>

      </div>
    </div>
  );
};
