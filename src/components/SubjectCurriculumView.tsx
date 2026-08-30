import React from 'react';
import { 
  Shield, 
  Award, 
  Calculator, 
  BookOpen, 
  Languages, 
  FlaskConical, 
  Globe, 
  Laptop, 
  Users, 
  Scale, 
  ChevronRight, 
  Dices, 
  PenTool, 
  Bot,
  ExternalLink,
  BookMarked,
  Lightbulb
} from 'lucide-react';
import { SubjectInfo, ActiveTab } from '../types';
import { ARMY_SUBJECTS, POLICE_SUBJECTS } from '../data/curriculumData';

interface SubjectCurriculumViewProps {
  branch: 'army' | 'police';
  onOpenSubjectModal: (subject: SubjectInfo) => void;
  onLaunchQuizForSubject: (subjectId: string) => void;
  onSelectTab: (tab: ActiveTab) => void;
}

export const SubjectCurriculumView: React.FC<SubjectCurriculumViewProps> = ({
  branch,
  onOpenSubjectModal,
  onLaunchQuizForSubject,
  onSelectTab
}) => {
  const subjects = branch === 'army' ? ARMY_SUBJECTS : POLICE_SUBJECTS;
  const isArmy = branch === 'army';

  return (
    <div className="space-y-4 pb-12">
      
      {/* Header Banner */}
      <div className={`p-4 rounded-2xl text-white shadow-sm relative overflow-hidden border border-slate-700/60 ${
        isArmy 
          ? 'bg-gradient-to-r from-[#0F172A] via-[#064E3B] to-[#047857]' 
          : 'bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#2563EB]'
      }`}>
        <div className="absolute right-0 -bottom-3 opacity-10 text-white pointer-events-none">
          <Shield className="w-28 h-28" />
        </div>

        <div className="relative z-10 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full border border-white/20 backdrop-blur-xs">
            {isArmy ? 'ทหารบก (นนส.)' : 'ตำรวจ (นสต.)'}
          </span>
          <h2 className="font-display font-bold text-base text-white">
            {isArmy ? 'หลักสูตร 6 วิชาหลัก นายสิบทหารบก' : 'หลักสูตร 7 หมวดวิชา นายสิบตำรวจ'}
          </h2>
          <p className="text-xs text-slate-200 font-light">
            สรุปหัวข้อออกสอบ คลังสูตรลัด และแนวข้อสอบพร้อมเฉลย
          </p>
        </div>
      </div>

      {/* Subject Cards List */}
      <div className="space-y-3">
        {subjects.map((sub, idx) => (
          <div 
            key={sub.id}
            className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-2xs space-y-3 hover:border-[#CBD5E1] transition-all"
          >
            {/* Title & Badge */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shadow-xs ${
                  isArmy ? 'bg-[#ECFDF5] text-[#059669]' : 'bg-[#EFF6FF] text-[#2563EB]'
                }`}>
                  {sub.id === 'interview' && <Award className="w-5 h-5" />}
                  {sub.id === 'math' && <Calculator className="w-5 h-5" />}
                  {sub.id === 'thai' && <BookOpen className="w-5 h-5" />}
                  {sub.id === 'english' && <Languages className="w-5 h-5" />}
                  {sub.id === 'science' && <FlaskConical className="w-5 h-5" />}
                  {sub.id === 'general' && <Globe className="w-5 h-5" />}
                  {sub.id === 'computer' && <Laptop className="w-5 h-5" />}
                  {sub.id === 'society' && <Users className="w-5 h-5" />}
                  {sub.id === 'law' && <Scale className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-display font-bold text-[#0F172A] text-sm">
                    {sub.name}
                  </h3>
                  <p className="text-[11px] text-[#64748B]">{sub.shortDesc}</p>
                </div>
              </div>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                isArmy ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]' : 'bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]'
              }`}>
                สัดส่วน {sub.weightPercent}%
              </span>
            </div>

            {/* Key Summary Notes Preview */}
            <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] space-y-1.5 text-xs text-[#334155]">
              <span className="font-display font-semibold text-[#0F172A] block text-[11px] flex items-center gap-1">
                <BookMarked className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>หัวข้อที่มักออกสอบบ่อย:</span>
              </span>
              <ul className="space-y-1 pl-1">
                {sub.summaryNotes.slice(0, 2).map((note, nIdx) => (
                  <li key={nIdx} className="text-[11px] text-[#64748B] flex items-start gap-1.5">
                    <span className="text-[#2563EB] font-bold">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 pt-1 text-xs">
              <button
                onClick={() => onOpenSubjectModal(sub)}
                className="flex-1 py-2 px-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#1E293B] border border-[#E2E8F0] rounded-xl font-display font-semibold transition-colors text-center"
              >
                ดูสรุปสูตร & หัวข้อเต็ม
              </button>

              <button
                onClick={() => onLaunchQuizForSubject(sub.id)}
                className={`py-2 px-3 rounded-xl font-display font-semibold text-white flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 ${
                  isArmy ? 'bg-[#059669] hover:bg-[#047857]' : 'bg-[#2563EB] hover:bg-[#1D4ED8]'
                }`}
              >
                <Dices className="w-3.5 h-3.5" />
                <span>สุ่มทำโจทย์วิชานี้</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
