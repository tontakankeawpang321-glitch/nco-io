import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  ScanLine, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  PenTool, 
  Bot, 
  Copy, 
  RotateCcw, 
  Image as ImageIcon,
  BookOpen,
  ArrowRight,
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import { ScannedResult } from '../types';
import { SAMPLE_SCAN_IMAGES } from '../data/curriculumData';

interface ImageScannerViewProps {
  onOpenScratchpadWithNote?: (note: string) => void;
  onAskAIWithQuestion?: (questionText: string) => void;
}

export const ImageScannerView: React.FC<ImageScannerViewProps> = ({
  onOpenScratchpadWithNote,
  onAskAIWithQuestion
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [subjectHint, setSubjectHint] = useState<string>('อัตโนมัติ (ตรวจจับเอง)');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<ScannedResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setScanResult(null);
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_SCAN_IMAGES[0]) => {
    setSelectedImage(sample.dataUrl);
    setSubjectHint(sample.subject);
    setScanResult(null);
    setErrorMessage(null);
  };

  const handleStartScan = async () => {
    if (!selectedImage) return;

    setIsScanning(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/scan-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: 'image/jpeg',
          subjectHint: subjectHint === 'อัตโนมัติ (ตรวจจับเอง)' ? '' : subjectHint
        })
      });

      if (!res.ok) {
        throw new Error('เกิดข้อผิดพลาดในการวิเคราะห์รูปภาพ');
      }

      const data: ScannedResult = await res.json();
      setScanResult(data);
    } catch (err: any) {
      console.error('Scan error:', err);
      setErrorMessage(err.message || 'ไม่สามารถสแกนภาพได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsScanning(false);
    }
  };

  const handleCopySolution = () => {
    if (!scanResult) return;
    const textToCopy = `[เฉลยข้อสอบ AI Scan]\nโจทย์: ${scanResult.questionText}\nคำตอบ: ${scanResult.correctAnswer}\nวิธีทำ:\n${scanResult.steps.join('\n')}\n${scanResult.formula ? `สูตร: ${scanResult.formula}\n` : ''}${scanResult.tip ? `ทริค: ${scanResult.tip}` : ''}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleSendToScratchpad = () => {
    if (!scanResult || !onOpenScratchpadWithNote) return;
    const note = `[โจทย์สแกน]: ${scanResult.questionText}\n[คำตอบ]: ${scanResult.correctAnswer}\n[วิธีคิด]:\n${scanResult.steps.join('\n')}\n${scanResult.formula ? `[สูตร]: ${scanResult.formula}` : ''}`;
    onOpenScratchpadWithNote(note);
  };

  const handleAskAI = () => {
    if (!scanResult || !onAskAIWithQuestion) return;
    const prompt = `ช่วยอธิบายโจทย์ข้อสอบนี้เพิ่มเติมและแนะนำโจทย์แนวคล้ายกันให้ฝึกทำหน่อยครับ: "${scanResult.questionText}" คำตอบคือ: ${scanResult.correctAnswer}`;
    onAskAIWithQuestion(prompt);
  };

  return (
    <div className="space-y-4 pb-12">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1E3A8A] text-white rounded-2xl p-4 shadow-sm relative overflow-hidden border border-slate-700/80">
        <div className="absolute right-2 -bottom-4 opacity-10 text-white pointer-events-none">
          <ScanLine className="w-28 h-28" />
        </div>

        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-xs border border-blue-400/30">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>AI Multimodal Vision</span>
          </div>
          <h2 className="font-display font-bold text-base text-white">สแกนภาพ หาคำตอบจากโจทย์</h2>
          <p className="text-xs text-slate-300 font-light">
            ถ่ายรูปข้อสอบ หรืออัปโหลดภาพโจทย์ AI จะเฉลยวิธีคิดทีละขั้นตอนทันที
          </p>
        </div>
      </div>

      {/* Hidden Inputs */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileChange} 
      />
      <input 
        type="file" 
        ref={cameraInputRef} 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        onChange={handleFileChange} 
      />

      {/* Upload / Capture Section */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-2xs space-y-3">
        
        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white rounded-xl font-display font-semibold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Camera className="w-4 h-4 text-blue-200" />
            <span>ถ่ายภาพโจทย์</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 p-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#1E293B] rounded-xl font-display font-semibold text-xs border border-[#E2E8F0] transition-all active:scale-95 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-[#64748B]" />
            <span>เลือกรูปจากคลัง</span>
          </button>
        </div>

        {/* Quick Sample Questions to try */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] font-semibold text-[#64748B] flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>หรือเลือกภาพโจทย์ตัวอย่างทดลองสแกน:</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {SAMPLE_SCAN_IMAGES.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSample(sample)}
                className="px-2.5 py-1.5 bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#E2E8F0] hover:border-[#93C5FD] rounded-lg text-left text-[10px] text-[#334155] whitespace-nowrap transition-colors flex items-center gap-1.5"
              >
                <ImageIcon className="w-3 h-3 text-[#2563EB]" />
                <span>{sample.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Image Preview */}
        {selectedImage && (
          <div className="space-y-3 pt-2">
            <div className="relative rounded-xl overflow-hidden border-2 border-[#BFDBFE] bg-[#0F172A] flex justify-center items-center max-h-60 group">
              <img 
                src={selectedImage} 
                alt="ภาพโจทย์ที่เลือก" 
                className="w-full object-contain max-h-60"
              />

              {/* Scanning Laser Animation */}
              {isScanning && (
                <div className="absolute inset-0 bg-blue-500/10 pointer-events-none flex flex-col justify-between">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-bounce duration-700" />
                </div>
              )}

              <button
                onClick={() => {
                  setSelectedImage(null);
                  setScanResult(null);
                }}
                className="absolute top-2 right-2 px-2.5 py-1 bg-[#0F172A]/80 hover:bg-[#0F172A] text-white rounded-lg text-[10px] font-display font-semibold backdrop-blur-xs transition-all"
              >
                เปลี่ยนรูป
              </button>
            </div>

            {/* Subject Selector & Trigger Button */}
            <div className="flex gap-2">
              <select
                value={subjectHint}
                onChange={(e) => setSubjectHint(e.target.value)}
                className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-display text-[#334155] focus:outline-none focus:border-[#2563EB]"
              >
                <option value="อัตโนมัติ (ตรวจจับเอง)">🔍 หมวด: ตรวจจับอัตโนมัติ</option>
                <option value="คณิตศาสตร์">📐 หมวด: คณิตศาสตร์</option>
                <option value="ภาษาไทย">📖 หมวด: ภาษาไทย</option>
                <option value="ภาษาอังกฤษ">🔤 หมวด: ภาษาอังกฤษ</option>
                <option value="กฎหมาย">⚖️ หมวด: กฎหมาย</option>
                <option value="วิทยาศาสตร์">🔬 หมวด: วิทยาศาสตร์</option>
                <option value="คอมพิวเตอร์">💻 หมวด: คอมพิวเตอร์</option>
              </select>

              <button
                onClick={handleStartScan}
                disabled={isScanning}
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] hover:brightness-105 text-white font-display font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                <ScanLine className={`w-4 h-4 text-blue-200 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? 'กำลังวิเคราะห์โจทย์...' : 'เริ่มสแกนเฉลยทันที'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* SCAN RESULT CARD */}
      {scanResult && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden animate-in slide-in-from-bottom duration-300 space-y-3 p-4">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
              <span className="font-display font-bold text-[#0F172A] text-xs sm:text-sm">ผลการวิเคราะห์โจทย์และเฉลย</span>
            </div>
            <span className="text-[10px] font-bold bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE] px-2 py-0.5 rounded-full">
              วิชา: {scanResult.subject || 'ความสามารถทั่วไป'}
            </span>
          </div>

          {/* Question Text from OCR */}
          <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] space-y-1">
            <span className="text-[10px] font-bold text-[#64748B] block uppercase tracking-wider">โจทย์ที่อ่านได้จากภาพ:</span>
            <p className="text-xs font-semibold text-[#1E293B] leading-relaxed">
              {scanResult.questionText}
            </p>
          </div>

          {/* Correct Answer Highlight */}
          <div className="bg-gradient-to-r from-[#ECFDF5] to-[#D1FAE5]/60 p-3.5 rounded-xl border border-[#A7F3D0] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#065F46] uppercase tracking-wider block">คำตอบที่ถูกต้อง:</span>
              <div className="font-display font-extrabold text-sm sm:text-base text-[#064E3B] mt-0.5">
                {scanResult.correctAnswer}
              </div>
            </div>
            <CheckCircle2 className="w-6 h-6 text-[#10B981] flex-shrink-0" />
          </div>

          {/* Step-by-Step Breakdown */}
          {scanResult.steps && scanResult.steps.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-display font-bold text-[#0F172A] flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#2563EB]" />
                <span>ขั้นตอนการคิดและวิธีทำอย่างละเอียด:</span>
              </span>
              <div className="space-y-1.5 bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                {scanResult.steps.map((step, sIdx) => (
                  <div key={sIdx} className="text-xs text-[#334155] flex items-start gap-2 leading-relaxed">
                    <span className="w-4 h-4 rounded-full bg-[#EFF6FF] text-[#2563EB] font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {sIdx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Formula */}
          {scanResult.formula && (
            <div className="bg-[#FFFBEB] p-3 rounded-xl border border-[#FDE68A] space-y-0.5 text-xs text-[#92400E]">
              <span className="font-display font-bold text-[#B45309] block text-[11px]">📐 สูตรและหลักการที่เกี่ยวข้อง:</span>
              <p className="font-mono text-xs text-[#78350F]">{scanResult.formula}</p>
            </div>
          )}

          {/* Tip / Trick */}
          {scanResult.tip && (
            <div className="bg-[#F0F9FF] p-3 rounded-xl border border-[#BAE6FD] space-y-0.5 text-xs text-[#0369A1]">
              <span className="font-display font-bold text-[#0284C7] block text-[11px]">💡 เทคนิคทำข้อสอบให้เร็ว:</span>
              <p className="text-xs text-[#0C4A6E]">{scanResult.tip}</p>
            </div>
          )}

          {/* Action Toolbar */}
          <div className="pt-2 grid grid-cols-3 gap-1.5 text-xs">
            <button
              onClick={handleSendToScratchpad}
              className="py-2.5 px-2 bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0] rounded-xl font-display font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <PenTool className="w-3.5 h-3.5 text-[#059669]" />
              <span className="text-[11px]">ทดในกระดาษ</span>
            </button>

            <button
              onClick={handleAskAI}
              className="py-2.5 px-2 bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#3730A3] border border-[#C7D2FE] rounded-xl font-display font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <Bot className="w-3.5 h-3.5 text-[#4F46E5]" />
              <span className="text-[11px]">ถาม AI เพิ่ม</span>
            </button>

            <button
              onClick={handleCopySolution}
              className="py-2.5 px-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#334155] border border-[#E2E8F0] rounded-xl font-display font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="text-[11px]">{copySuccess ? 'คัดลอกแล้ว!' : 'คัดลอก'}</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
