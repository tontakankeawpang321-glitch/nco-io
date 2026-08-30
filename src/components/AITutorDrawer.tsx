import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Lightbulb, 
  Calculator, 
  Calendar, 
  Award, 
  Scale, 
  PenTool,
  RotateCcw
} from 'lucide-react';
import { ChatMessage } from '../types';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface AITutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
  onOpenScratchpadWithNote?: (note: string) => void;
}

export const AITutorDrawer: React.FC<AITutorDrawerProps> = ({
  isOpen,
  onClose,
  initialPrompt,
  onClearInitialPrompt,
  onOpenScratchpadWithNote
}) => {
  useBodyScrollLock(isOpen);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: 'สวัสดีครับ! ผมคือ **ครูฝึก AI ผู้ช่วยติวสอบ นนส. และ นสต.** ยินดีช่วยเหลือแนะนำแนวข้อสอบ สูตรคำนวณ เทคนิคสัมภาษณ์ และการเตรียมตัวสอบตลอด 24 ชั่วโมงครับ 🎖️',
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Handle initial prompt from other views (e.g. from quiz or scanner)
  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          messages: messages.slice(-6).map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await res.json();
      const aiReply = data.reply || 'ขออภัยครับ ไม่สามารถสร้างคำตอบได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง';

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'model',
        content: aiReply,
        timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'model',
        content: 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่อีกครั้งครับ',
        timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-[#0F172A]/60 backdrop-blur-xs">
      
      {/* Drawer Container */}
      <div className="w-full max-w-md mx-auto bg-white rounded-t-[32px] h-[85vh] max-h-[640px] flex flex-col shadow-2xl overflow-hidden border-t border-[#E2E8F0] animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="bg-[#0F172A] text-white px-4 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white font-bold shadow-xs">
              <Bot className="w-5 h-5 text-blue-100" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xs sm:text-sm text-white">AI ผู้ช่วยติวสอบอัจฉริยะ</h3>
              <p className="text-[10px] text-[#94A3B8] font-light">เฉลยโจทย์ แนะนำเทคนิค และวางแผนการสอบ</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            aria-label="Close AI Chat"
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 text-xs transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-[#F8FAFC] border-b border-[#E2E8F0] flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
          <button 
            onClick={() => handleSendMessage('ขอเทคนิคการเตรียมสอบสัมภาษณ์ นนส. และ นสต. หน่อยครับ')}
            className="px-2.5 py-1 bg-white border border-[#E2E8F0] text-[#1E293B] rounded-full whitespace-nowrap hover:bg-[#F1F5F9] transition-colors shadow-2xs flex items-center gap-1 font-display"
          >
            <Award className="w-3 h-3 text-[#2563EB]" />
            <span>เทคนิคสอบสัมภาษณ์</span>
          </button>

          <button 
            onClick={() => handleSendMessage('สรุปสูตรคณิตศาสตร์และอนุกรมที่ออกสอบบ่อยที่สุดพร้อมตัวอย่าง')}
            className="px-2.5 py-1 bg-white border border-[#E2E8F0] text-[#1E293B] rounded-full whitespace-nowrap hover:bg-[#F1F5F9] transition-colors shadow-2xs flex items-center gap-1 font-display"
          >
            <Calculator className="w-3 h-3 text-[#2563EB]" />
            <span>สูตรคณิตที่ต้องจำ</span>
          </button>

          <button 
            onClick={() => handleSendMessage('ขอสรุปประมวลกฎหมายอาญา มาตรา 59 เรื่องเจตนาและประมาทอย่างกระชับ')}
            className="px-2.5 py-1 bg-white border border-[#E2E8F0] text-[#1E293B] rounded-full whitespace-nowrap hover:bg-[#F1F5F9] transition-colors shadow-2xs flex items-center gap-1 font-display"
          >
            <Scale className="w-3 h-3 text-[#2563EB]" />
            <span>สรุปกฎหมายอาญา ม.59</span>
          </button>

          <button 
            onClick={() => handleSendMessage('วางแผนตารางอ่านหนังสือสอบ 30 วันให้หน่อยครับ')}
            className="px-2.5 py-1 bg-white border border-[#E2E8F0] text-[#1E293B] rounded-full whitespace-nowrap hover:bg-[#F1F5F9] transition-colors shadow-2xs flex items-center gap-1 font-display"
          >
            <Calendar className="w-3 h-3 text-[#059669]" />
            <span>แผนติว 30 วัน</span>
          </button>
        </div>

        {/* Chat Message Stream */}
        <div ref={chatBodyRef} className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#F8FAFC] text-xs">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div key={m.id} className={`flex gap-2.5 items-start ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-[#2563EB] text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                
                <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed space-y-1.5 shadow-2xs ${
                  isUser 
                    ? 'bg-[#2563EB] text-white rounded-tr-none' 
                    : 'bg-white border border-[#E2E8F0] text-[#1E293B] rounded-tl-none'
                }`}>
                  <div className="whitespace-pre-line font-normal">{m.content}</div>
                  <div className={`text-[9px] text-right ${isUser ? 'text-blue-100' : 'text-[#94A3B8]'}`}>
                    {m.timestamp}
                  </div>

                  {!isUser && onOpenScratchpadWithNote && m.id !== 'welcome' && (
                    <div className="pt-1 border-t border-[#F1F5F9] flex justify-end">
                      <button
                        onClick={() => {
                          onOpenScratchpadWithNote(m.content);
                          onClose();
                        }}
                        className="text-[10px] text-[#065F46] bg-[#ECFDF5] hover:bg-[#D1FAE5] px-2 py-0.5 rounded-md border border-[#A7F3D0] flex items-center gap-1 font-display font-semibold transition-colors"
                      >
                        <PenTool className="w-3 h-3 text-[#059669]" />
                        <span>คัดลอกไปกระดาษทด</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-2.5 items-start">
              <div className="w-7 h-7 rounded-lg bg-[#2563EB] text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5 shadow-xs">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="bg-white border border-[#E2E8F0] rounded-2xl rounded-tl-none p-3 shadow-2xs flex items-center gap-2 text-[#64748B] text-xs">
                <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] font-display ml-1 text-[#0F172A]">ครูฝึก AI กำลังเรียบเรียงคำตอบ...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-[#E2E8F0] flex items-center gap-2">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ถามข้อสอบ สูตร หรือวิชาที่สงสัย..." 
            className="flex-1 bg-[#F8FAFC] border border-[#CBD5E1] rounded-full px-4 py-2.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all font-sans"
          />
          <button 
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white flex items-center justify-center text-xs shadow-xs active:scale-95 transition-all flex-shrink-0 disabled:opacity-40 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
