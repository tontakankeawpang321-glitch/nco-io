import React from 'react';
import { Menu, Award, Bot, Dices, Shield, Sparkles } from 'lucide-react';
import { BranchType, ActiveTab } from '../types';

interface HeaderProps {
  onOpenSidebar: () => void;
  onOpenAI: () => void;
  onOpenRandomQuiz: () => void;
  branchFilter: BranchType;
  onSetBranch: (branch: BranchType) => void;
  streakCount: number;
  activeTab: ActiveTab;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSidebar,
  onOpenAI,
  onOpenRandomQuiz,
  branchFilter,
  onSetBranch,
  streakCount,
  activeTab,
}) => {
  return (
    <header className="relative bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1E3A8A] text-white pt-3 pb-3.5 px-4 shadow-md z-30 overflow-hidden border-b border-slate-800">
      {/* Background Subtle Emblem Pattern */}
      <div className="absolute -right-6 -top-6 opacity-10 text-white pointer-events-none">
        <Shield className="w-36 h-36" />
      </div>

      {/* Top Action Row */}
      <div className="flex items-center justify-between relative z-10">
        
        {/* Left: Hamburger Menu Button + Brand */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSidebar}
            aria-label="Open sidebar menu"
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all border border-white/15 shadow-xs"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] p-0.5 shadow-sm flex items-center justify-center">
              <div className="w-full h-full bg-[#0F172A] rounded-[9px] flex items-center justify-center text-blue-400 font-bold">
                <Award className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[9px] uppercase font-extrabold tracking-wider text-blue-300 bg-blue-500/20 px-1.5 py-0.2 rounded border border-blue-400/30">PREP PASS</span>
                <span className="text-[9px] text-slate-300 font-light">ศูนย์สอบราชการ</span>
              </div>
              <h1 className="font-display font-bold text-sm leading-none text-white tracking-wide">นนส. ทหารบก / นสต. ตำรวจ</h1>
            </div>
          </div>
        </div>

        {/* Right: Quick Random Quiz Launcher & AI Tutor */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenRandomQuiz}
            title="เริ่มทำข้อสอบสุ่ม"
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#2563EB]/25 border border-blue-400/40 rounded-full text-blue-200 font-display text-xs font-bold hover:bg-[#2563EB]/40 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Dices className="w-3.5 h-3.5 text-blue-400" />
            <span>สุ่มข้อสอบ</span>
            <span className="bg-[#2563EB] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full ml-0.5 shadow-xs">
              {streakCount}
            </span>
          </button>

          <button
            onClick={onOpenAI}
            title="เปิด AI ติวเตอร์ 24 ชม."
            className="w-8 h-8 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center justify-center transition-all border border-blue-300/40 shadow-sm active:scale-95"
          >
            <Bot className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Branch Segment Filter */}
      <div className="mt-2.5 flex items-center justify-between gap-1 bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/15 text-[11px] font-display">
        <button
          onClick={() => onSetBranch('both')}
          className={`flex-1 py-1 rounded-lg transition-all text-center ${
            branchFilter === 'both' 
              ? 'bg-white text-[#0F172A] font-bold shadow-sm' 
              : 'text-slate-200 hover:bg-white/10'
          }`}
        >
          ทั้งหมด (รวม)
        </button>
        <button
          onClick={() => onSetBranch('army')}
          className={`flex-1 py-1 rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
            branchFilter === 'army' 
              ? 'bg-[#10B981] text-white font-bold shadow-sm' 
              : 'text-slate-200 hover:bg-white/10'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-200"></span>
          ทหารบก (นนส.)
        </button>
        <button
          onClick={() => onSetBranch('police')}
          className={`flex-1 py-1 rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
            branchFilter === 'police' 
              ? 'bg-[#2563EB] text-white font-bold shadow-sm' 
              : 'text-slate-200 hover:bg-white/10'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-200"></span>
          ตำรวจ (นสต.)
        </button>
      </div>
    </header>
  );
};
