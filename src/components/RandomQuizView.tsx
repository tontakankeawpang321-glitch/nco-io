import React, { useState, useEffect } from 'react';
import { 
  Dices, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Sparkles, 
  ArrowRight, 
  PenTool, 
  Bot, 
  Timer, 
  Flame, 
  Award,
  Filter,
  Layers,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ExamQuestion, SubjectId, BranchType } from '../types';
import { INITIAL_QUESTIONS } from '../data/mockQuestions';

interface RandomQuizViewProps {
  branchFilter: BranchType;
  onOpenScratchpadWithNote?: (note: string) => void;
  onAskAIWithQuestion?: (questionText: string) => void;
  onIncrementStreak?: () => void;
}

export const RandomQuizView: React.FC<RandomQuizViewProps> = ({
  branchFilter,
  onOpenScratchpadWithNote,
  onAskAIWithQuestion,
  onIncrementStreak
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>('all');
  const [quizSize, setQuizSize] = useState<number>(5);
  const [activeQuestions, setActiveQuestions] = useState<ExamQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Filter pool of questions based on branch and subject
  const getFilteredPool = (subject: SubjectId | 'all', branch: BranchType): ExamQuestion[] => {
    return INITIAL_QUESTIONS.filter(q => {
      const matchBranch = branch === 'both' || q.branch === 'both' || q.branch === branch;
      const matchSubject = subject === 'all' || q.subjectId === subject;
      return matchBranch && matchSubject;
    });
  };

  // Start or restart a randomized quiz
  const startQuiz = (customList?: ExamQuestion[]) => {
    let pool = customList || getFilteredPool(selectedSubject, branchFilter);
    if (pool.length === 0) {
      pool = INITIAL_QUESTIONS;
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const count = Math.min(quizSize, shuffled.length);
    const chosen = shuffled.slice(0, count);

    setActiveQuestions(chosen);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setUserScore(0);
    setIsQuizCompleted(false);
    setTimerSeconds(0);
    setIsTimerRunning(true);
  };

  // Trigger on initial load or subject change
  useEffect(() => {
    startQuiz();
  }, [selectedSubject, branchFilter, quizSize]);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && !isQuizCompleted) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isQuizCompleted]);

  const handleSelectOption = (idx: number) => {
    if (isAnswerRevealed) return;
    setSelectedOption(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null || isAnswerRevealed) return;
    
    setIsAnswerRevealed(true);
    const currentQ = activeQuestions[currentIndex];
    const isCorrect = selectedOption === currentQ.correctIndex;

    if (isCorrect) {
      setUserScore(prev => prev + 1);
      if (onIncrementStreak) onIncrementStreak();
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
    } else {
      setIsQuizCompleted(true);
      setIsTimerRunning(false);
      // Trigger Confetti if passed (>= 60%)
      if ((userScore + (selectedOption === activeQuestions[currentIndex]?.correctIndex ? 1 : 0)) / activeQuestions.length >= 0.6) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }
    }
  };

  // Generate extra unlimited AI questions
  const generateAIQuestions = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/generate-random-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch: branchFilter,
          subject: selectedSubject === 'all' ? 'all' : selectedSubject,
          count: quizSize
        })
      });
      const data = await res.json();
      if (data && data.questions && data.questions.length > 0) {
        const formatted: ExamQuestion[] = data.questions.map((q: any, i: number) => ({
          id: `ai_${Date.now()}_${i}`,
          branch: q.branch || branchFilter,
          subjectId: selectedSubject === 'all' ? 'math' : selectedSubject,
          subjectName: q.subject || 'ข้อสอบ AI สุ่มใหม่',
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex ?? 0,
          explanation: q.explanation || 'เฉลยโดยระบบ AI',
          formula: q.formula || '',
          difficulty: q.difficulty || 'ปานกลาง',
          year: '2569 (AI Live)'
        }));
        startQuiz(formatted);
      } else {
        startQuiz();
      }
    } catch (err) {
      startQuiz();
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const currentQ = activeQuestions[currentIndex];
  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const subjectsList = [
    { id: 'all', name: 'สุ่มทุกวิชา' },
    { id: 'math', name: 'คณิตศาสตร์' },
    { id: 'thai', name: 'ภาษาไทย' },
    { id: 'english', name: 'ภาษาอังกฤษ' },
    { id: 'law', name: 'กฎหมาย' },
    { id: 'science', name: 'วิทยาศาสตร์' },
    { id: 'computer', name: 'คอมพิวเตอร์' },
    { id: 'interview', name: 'สอบสัมภาษณ์' },
  ];

  return (
    <div className="space-y-4 pb-12">
      
      {/* Control Bar: Subject Filter & Quiz Size */}
      <div className="bg-white rounded-2xl p-3.5 border border-[#E2E8F0] shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold">
              <Dices className="w-4 h-4 text-[#2563EB]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-[#0F172A] text-xs leading-tight">ระบบสุ่มคำถามจำลอง</h2>
              <p className="text-[10px] text-[#64748B]">แทนการเช็คชื่อ ฝึกฝนตรงจุดทุกวัน</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-[#F8FAFC] px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold text-[#334155] border border-[#E2E8F0]">
            <Timer className="w-3.5 h-3.5 text-[#2563EB] animate-pulse" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {subjectsList.map(sub => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubject(sub.id as any)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-[11px] font-display transition-all ${
                selectedSubject === sub.id
                  ? 'bg-[#2563EB] text-white font-bold shadow-xs'
                  : 'bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569]'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>

        {/* Quiz Length Selector & AI Gen Button */}
        <div className="flex items-center justify-between pt-1 text-xs border-t border-[#F1F5F9]">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-[#64748B] font-medium">จำนวนข้อ:</span>
            {[1, 5, 10].map(sz => (
              <button
                key={sz}
                onClick={() => setQuizSize(sz)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                  quizSize === sz ? 'bg-[#0F172A] text-white' : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                }`}
              >
                {sz} ข้อ
              </button>
            ))}
          </div>

          <button
            onClick={generateAIQuestions}
            disabled={isGeneratingAI}
            className="flex items-center gap-1 text-[11px] font-display font-semibold text-[#4338CA] bg-[#EEF2FF] hover:bg-[#E0E7FF] border border-[#C7D2FE] px-2.5 py-1 rounded-lg transition-all active:scale-95 disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 text-[#4F46E5] ${isGeneratingAI ? 'animate-spin' : ''}`} />
            <span>{isGeneratingAI ? 'กำลังสุ่มข้อสอบ AI...' : 'AI สุ่มโจทย์ใหม่'}</span>
          </button>
        </div>
      </div>

      {/* QUIZ IN PROGRESS */}
      {!isQuizCompleted && currentQ && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden animate-in fade-in duration-200">
          
          {/* Top Progress & Meta Bar */}
          <div className="bg-[#F8FAFC] px-4 py-2.5 border-b border-[#E2E8F0] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-[#1E40AF] bg-[#EFF6FF] px-2 py-0.5 rounded text-[11px] border border-[#BFDBFE]">
                ข้อ {currentIndex + 1} / {activeQuestions.length}
              </span>
              <span className="text-[11px] text-[#334155] font-semibold truncate max-w-[140px]">
                {currentQ.subjectName}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#64748B]">
              <span className="bg-[#F1F5F9] px-2 py-0.5 rounded-full border border-[#E2E8F0]">{currentQ.difficulty || 'ปานกลาง'}</span>
              <span className="bg-[#F1F5F9] px-1.5 py-0.5 rounded-full text-[#475569] border border-[#E2E8F0]">ปี {currentQ.year || '2569'}</span>
            </div>
          </div>

          {/* Question Body */}
          <div className="p-4 space-y-4">
            
            {/* Question Text */}
            <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
              <h3 className="font-display font-semibold text-[#0F172A] text-sm sm:text-base leading-relaxed">
                {currentQ.question}
              </h3>
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-2">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedOption === optIdx;
                const isCorrect = optIdx === currentQ.correctIndex;
                
                let optionStyle = 'bg-white hover:bg-[#F8FAFC] border-[#E2E8F0] text-[#334155]';
                
                if (isAnswerRevealed) {
                  if (isCorrect) {
                    optionStyle = 'bg-[#ECFDF5] border-[#10B981] text-[#065F46] font-bold shadow-2xs';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-[#FEF2F2] border-[#EF4444] text-[#991B1B]';
                  } else {
                    optionStyle = 'bg-[#F8FAFC]/60 border-[#E2E8F0] text-[#94A3B8]';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-[#EFF6FF] border-[#2563EB] text-[#1E3A8A] font-semibold ring-1 ring-[#2563EB]';
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={isAnswerRevealed}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs sm:text-sm flex items-start gap-2.5 ${optionStyle}`}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${
                      isAnswerRevealed && isCorrect 
                        ? 'bg-[#10B981] text-white'
                        : isAnswerRevealed && isSelected && !isCorrect
                        ? 'bg-[#EF4444] text-white'
                        : isSelected
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]'
                    }`}>
                      {String.fromCharCode(65 + optIdx)}
                    </div>
                    <span className="flex-1 leading-snug">{opt}</span>
                    {isAnswerRevealed && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                    )}
                    {isAnswerRevealed && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Confirm or Next Action */}
            {!isAnswerRevealed ? (
              <button
                onClick={handleConfirmAnswer}
                disabled={selectedOption === null}
                className="w-full py-3 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] disabled:opacity-50 text-white font-display font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer disabled:cursor-not-allowed"
              >
                ตรวจคำตอบ
              </button>
            ) : (
              <div className="space-y-3 pt-2">
                
                {/* Step-by-Step Explanation Box */}
                <div className="bg-[#F0F9FF] p-3.5 rounded-xl border border-[#BAE6FD] space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-display font-bold text-[#0369A1]">
                    <HelpCircle className="w-4 h-4 text-[#0284C7]" />
                    <span>เฉลย & วิธีคิดละเอียด:</span>
                  </div>
                  
                  <p className="text-[#0C4A6E] whitespace-pre-line leading-relaxed pl-1">
                    {currentQ.explanation}
                  </p>

                  {currentQ.formula && (
                    <div className="bg-white/90 p-2.5 rounded-lg border border-[#BAE6FD] text-[11px] text-[#0369A1] font-mono">
                      <span className="font-bold font-sans text-[#0284C7] block mb-0.5">📌 สูตร / กฎที่ต้องจำ:</span>
                      {currentQ.formula}
                    </div>
                  )}
                </div>

                {/* Question Helper Shortcuts */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => onOpenScratchpadWithNote && onOpenScratchpadWithNote(`โจทย์: ${currentQ.question}\nคำตอบ: ${currentQ.options[currentQ.correctIndex]}\nวิธีคิด: ${currentQ.explanation}`)}
                    className="p-2 bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] text-[#065F46] rounded-xl font-display font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <PenTool className="w-3.5 h-3.5 text-[#059669]" />
                    <span>ทดเลขในกระดาษทด</span>
                  </button>

                  <button
                    onClick={() => onAskAIWithQuestion && onAskAIWithQuestion(`ช่วยอธิบายข้อสอบข้อนี้เพิ่มเติมอย่างละเอียดหน่อยครับ: "${currentQ.question}" ตัวเลือกคือ ${currentQ.options.join(', ')}`)}
                    className="p-2 bg-[#EEF2FF] hover:bg-[#E0E7FF] border border-[#C7D2FE] text-[#3730A3] rounded-xl font-display font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Bot className="w-3.5 h-3.5 text-[#4F46E5]" />
                    <span>ถาม AI ให้สอนข้อนี้</span>
                  </button>
                </div>

                <button
                  onClick={handleNextQuestion}
                  className="w-full py-3 bg-gradient-to-r from-[#0F172A] to-[#1E293B] hover:from-[#1E293B] hover:to-[#334155] text-white font-display font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <span>{currentIndex + 1 < activeQuestions.length ? 'ทำข้อถัดไป' : 'ดูสรุปผลคะแนน'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* QUIZ COMPLETED SUMMARY SCREEN */}
      {isQuizCompleted && (
        <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm text-center space-y-4 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white flex items-center justify-center text-3xl mx-auto shadow-sm">
            <Award className="w-9 h-9" />
          </div>

          <div>
            <h3 className="font-display font-bold text-lg text-[#0F172A]">สรุปผลการทำข้อสอบสุ่ม</h3>
            <p className="text-xs text-[#64748B]">หมวด {selectedSubject === 'all' ? 'ทุกวิชา' : selectedSubject} ({branchFilter === 'army' ? 'ทหารบก' : branchFilter === 'police' ? 'ตำรวจ' : 'ทหาร-ตำรวจ'})</p>
          </div>

          <div className="bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF] p-4 rounded-2xl border border-[#BFDBFE] max-w-xs mx-auto">
            <span className="text-xs text-[#64748B] font-semibold block">คะแนนที่ทำได้</span>
            <div className="font-display font-black text-4xl text-[#2563EB] my-1">
              {userScore} <span className="text-xl text-[#94A3B8] font-normal">/ {activeQuestions.length}</span>
            </div>
            <div className="text-xs font-semibold text-[#334155]">
              ความถูกต้อง {Math.round((userScore / activeQuestions.length) * 100)}%
            </div>
          </div>

          <p className="text-xs text-[#475569] px-4 leading-relaxed">
            {userScore === activeQuestions.length 
              ? '🌟 ยอดเยี่ยมมากครับ! ความรู้แน่นปึ้ก พร้อมลงสนามสอบจริงอย่างมั่นใจ' 
              : userScore >= activeQuestions.length * 0.6 
              ? '👍 ผ่านเกณฑ์มาตรฐานครับ แนะนำฝึกฝนข้อที่ไม่มั่นใจเพิ่มเติมในกระดาษทด' 
              : '💪 อย่ายอมแพ้ครับ! กดปุ่มเริ่มใหม่เพื่อฝึกฝนซ้ำ หรือใช้ AI ช่วยอธิบายโจทย์'}
          </p>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => startQuiz()}
              className="w-full py-3 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white font-display font-bold text-xs sm:text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 active:scale-98"
            >
              <RotateCcw className="w-4 h-4" />
              <span>สุ่มทำข้อสอบชุดใหม่อีกครั้ง</span>
            </button>

            <button
              onClick={generateAIQuestions}
              disabled={isGeneratingAI}
              className="w-full py-2.5 bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#3730A3] border border-[#C7D2FE] font-display font-semibold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#4F46E5]" />
              <span>ให้ AI ออกข้อสอบใหม่ไม่ซ้ำ</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
