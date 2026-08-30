import React, { useState, useEffect } from 'react';
import { LeftSidebarDrawer } from './components/LeftSidebarDrawer';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { BooksView } from './components/BooksView';
import { RandomQuizView } from './components/RandomQuizView';
import { ImageScannerView } from './components/ImageScannerView';
import { ScratchpadCalculatorView } from './components/ScratchpadCalculatorView';
import { CommunityView } from './components/CommunityView';
import { SubjectCurriculumView } from './components/SubjectCurriculumView';
import { SubjectDetailModal } from './components/SubjectDetailModal';
import { AITutorDrawer } from './components/AITutorDrawer';
import { InAppBrowserModal } from './components/InAppBrowserModal';
import { ActiveTab, BranchType, SubjectInfo } from './types';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const STREAK_KEY = 'preppass_quiz_streak_v2';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [branchFilter, setBranchFilter] = useState<BranchType>('both');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState<boolean>(false);
  const [selectedSubjectModal, setSelectedSubjectModal] = useState<SubjectInfo | null>(null);
  
  // In-App Browser modal for external subject / quiz links
  const [inAppBrowserState, setInAppBrowserState] = useState<{ url: string | null; title?: string }>({
    url: null,
    title: ''
  });

  // Cross-module states
  const [scratchpadNote, setScratchpadNote] = useState<string>('');
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [streakCount, setStreakCount] = useState<number>(0);

  // Toast Notification state
  const [toast, setToast] = useState<{ message: string; isError?: boolean } | null>(null);

  const showToast = (message: string, isError: boolean = false) => {
    setToast({ message, isError });
    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  // Load streak from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STREAK_KEY);
      if (saved) {
        setStreakCount(parseInt(saved, 10) || 0);
      } else {
        setStreakCount(3); // Initial streak
      }
    } catch (e) {
      setStreakCount(3);
    }
  }, []);

  const handleIncrementStreak = () => {
    const next = streakCount + 1;
    setStreakCount(next);
    try {
      localStorage.setItem(STREAK_KEY, String(next));
    } catch (e) {}
    showToast('ตอบถูก! +1 แต้มความสม่ำเสมอ 🔥');
  };

  const handleOpenScratchpadWithNote = (note: string) => {
    setScratchpadNote(note);
    setActiveTab('scratchpad');
    showToast('ส่งข้อมูลไปยังกระดาษทดแล้ว');
  };

  const handleAskAIWithQuestion = (promptText: string) => {
    setAiPrompt(promptText);
    setIsAIDrawerOpen(true);
  };

  const handleLaunchQuizForSubject = (subjectId: string) => {
    setActiveTab('random-quiz');
    showToast(`เริ่มสุ่มข้อสอบหมวดวิชานี้`);
  };

  const handleOpenInAppBrowser = (url: string, title?: string) => {
    setInAppBrowserState({ url, title: title || 'คลังข้อสอบและเอกสารเตรียมสอบ' });
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] sm:bg-[#E2E8F0]/70 flex justify-center items-start sm:py-6 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-4 py-2 bg-[#0F172A] text-white font-display text-xs font-semibold rounded-full shadow-2xl flex items-center gap-2 border border-slate-700/80 backdrop-blur-md">
            {toast.isError ? (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Mobile App Frame */}
      <div className="w-full max-w-md bg-[#F8FAFC] min-h-screen sm:min-h-[880px] sm:rounded-[36px] shadow-2xl sm:shadow-slate-300/60 relative overflow-hidden flex flex-col pb-20 border-[#E2E8F0] sm:border">
        
        {/* Header Bar */}
        <Header
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenAI={() => setIsAIDrawerOpen(true)}
          onOpenRandomQuiz={() => setActiveTab('random-quiz')}
          branchFilter={branchFilter}
          onSetBranch={setBranchFilter}
          streakCount={streakCount}
          activeTab={activeTab}
        />

        {/* Content Area */}
        <main className="flex-1 px-4 pt-3.5 relative z-10 bg-slate-50/80">
          {activeTab === 'home' && (
            <HomeView
              branchFilter={branchFilter}
              onSelectTab={setActiveTab}
              onOpenAI={() => setIsAIDrawerOpen(true)}
              onOpenSubjectModal={setSelectedSubjectModal}
              onOpenInAppBrowser={handleOpenInAppBrowser}
              streakCount={streakCount}
            />
          )}

          {activeTab === 'books' && (
            <BooksView onShowToast={showToast} />
          )}

          {activeTab === 'random-quiz' && (
            <RandomQuizView
              branchFilter={branchFilter}
              onOpenScratchpadWithNote={handleOpenScratchpadWithNote}
              onAskAIWithQuestion={handleAskAIWithQuestion}
              onIncrementStreak={handleIncrementStreak}
            />
          )}

          {activeTab === 'scanner' && (
            <ImageScannerView
              onOpenScratchpadWithNote={handleOpenScratchpadWithNote}
              onAskAIWithQuestion={handleAskAIWithQuestion}
            />
          )}

          {activeTab === 'scratchpad' && (
            <ScratchpadCalculatorView
              initialNote={scratchpadNote}
              onClearInitialNote={() => setScratchpadNote('')}
            />
          )}

          {activeTab === 'community' && (
            <CommunityView onShowToast={showToast} />
          )}

          {activeTab === 'subjects-army' && (
            <SubjectCurriculumView
              branch="army"
              onOpenSubjectModal={setSelectedSubjectModal}
              onLaunchQuizForSubject={handleLaunchQuizForSubject}
              onSelectTab={setActiveTab}
            />
          )}

          {activeTab === 'subjects-police' && (
            <SubjectCurriculumView
              branch="police"
              onOpenSubjectModal={setSelectedSubjectModal}
              onLaunchQuizForSubject={handleLaunchQuizForSubject}
              onSelectTab={setActiveTab}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        {/* Left Slide Sidebar Drawer */}
        <LeftSidebarDrawer
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          branchFilter={branchFilter}
          onSetBranch={setBranchFilter}
          onOpenAI={() => setIsAIDrawerOpen(true)}
          streakCount={streakCount}
        />

        {/* AI Tutor Chat Assistant Drawer */}
        <AITutorDrawer
          isOpen={isAIDrawerOpen}
          onClose={() => setIsAIDrawerOpen(false)}
          initialPrompt={aiPrompt}
          onClearInitialPrompt={() => setAiPrompt('')}
          onOpenScratchpadWithNote={handleOpenScratchpadWithNote}
        />

        {/* Subject Detail & Curriculum Modal */}
        <SubjectDetailModal
          subject={selectedSubjectModal}
          onClose={() => setSelectedSubjectModal(null)}
          onNavigateToCurriculum={(branchTab) => setActiveTab(branchTab)}
          onOpenInAppBrowser={handleOpenInAppBrowser}
        />

        {/* In-App Browser / External Link Viewer Modal */}
        <InAppBrowserModal
          url={inAppBrowserState.url}
          title={inAppBrowserState.title}
          onClose={() => setInAppBrowserState({ url: null, title: '' })}
        />

      </div>
    </div>
  );
}
