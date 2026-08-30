import React from 'react';
import { Home, BookOpen, Dices, ScanLine, PenTool, Users } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    {
      id: 'home' as ActiveTab,
      label: 'หน้าหลัก',
      icon: Home,
      accent: 'text-[#2563EB]',
      activeBg: 'bg-[#EFF6FF]'
    },
    {
      id: 'books' as ActiveTab,
      label: 'หนังสือ',
      icon: BookOpen,
      accent: 'text-[#2563EB]',
      activeBg: 'bg-[#EFF6FF]'
    },
    {
      id: 'scanner' as ActiveTab,
      label: 'สแกนโจทย์',
      icon: ScanLine,
      accent: 'text-[#2563EB]',
      activeBg: 'bg-[#EFF6FF]'
    },
    {
      id: 'scratchpad' as ActiveTab,
      label: 'กระดาษทด',
      icon: PenTool,
      accent: 'text-[#10B981]',
      activeBg: 'bg-[#ECFDF5]'
    },
    {
      id: 'community' as ActiveTab,
      label: 'ชุมชน',
      icon: Users,
      accent: 'text-[#2563EB]',
      activeBg: 'bg-[#EFF6FF]'
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-16 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] shadow-lg flex items-center justify-around z-40 px-0.5 sm:rounded-b-[36px]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => {
              onSelectTab(tab.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-150 py-1 cursor-pointer ${
              isActive ? `${tab.accent} font-bold` : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${isActive ? tab.activeBg : ''}`}>
              <Icon className={`w-4.5 h-4.5 ${isActive ? 'scale-105' : ''} transition-transform`} />
            </div>
            <span className="font-display text-[9.5px] sm:text-[10px] tracking-tight mt-0.5 truncate max-w-[56px]">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
