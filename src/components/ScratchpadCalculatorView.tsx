import React, { useState, useRef, useEffect } from 'react';
import { 
  PenTool, 
  Eraser, 
  Trash2, 
  Download, 
  Calculator, 
  Type, 
  Undo, 
  RotateCcw, 
  Grid, 
  AlignJustify, 
  Square, 
  Check, 
  Copy, 
  Sparkles,
  Camera,
  History,
  Delete
} from 'lucide-react';

interface ScratchpadCalculatorViewProps {
  initialNote?: string;
  onClearInitialNote?: () => void;
}

export const ScratchpadCalculatorView: React.FC<ScratchpadCalculatorViewProps> = ({
  initialNote,
  onClearInitialNote
}) => {
  // Drawing Canvas State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [penColor, setPenColor] = useState<string>('#1e293b'); // Navy/slate
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [backgroundType, setBackgroundType] = useState<'grid' | 'lines' | 'blank'>('grid');
  const [historyStates, setHistoryStates] = useState<ImageData[]>([]);

  // Note Text Area
  const [typedNote, setTypedNote] = useState<string>(initialNote || '');
  const [activeMode, setActiveMode] = useState<'draw' | 'type' | 'both'>('both');

  // Calculator State
  const [calcDisplay, setCalcDisplay] = useState<string>('0');
  const [calcEquation, setCalcEquation] = useState<string>('');
  const [calcHistory, setCalcHistory] = useState<{ eq: string; res: string }[]>([]);
  const [isSciMode, setIsSciMode] = useState<boolean>(false);
  const [showCalc, setShowCalc] = useState<boolean>(true);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Sync initial note when passed
  useEffect(() => {
    if (initialNote) {
      setTypedNote(prev => prev ? `${prev}\n\n${initialNote}` : initialNote);
      if (onClearInitialNote) onClearInitialNote();
    }
  }, [initialNote]);

  // Canvas setup and background rendering
  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    if (backgroundType === 'grid') {
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      const step = 20;
      for (let x = step; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = step; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    } else if (backgroundType === 'lines') {
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      const step = 26;
      for (let y = step; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }
  };

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high DPI canvas resolution
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Set actual buffer size
    canvas.width = rect.width * dpr;
    canvas.height = (rect.height || 360) * dpr;
    ctx.scale(dpr, dpr);

    drawBackground(ctx, rect.width, rect.height || 360);

    // Save initial state for undo
    const initialImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistoryStates([initialImageData]);
  }, [backgroundType]);

  // Save current stroke for Undo
  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistoryStates(prev => [...prev.slice(-15), currentState]);
  };

  // Undo stroke
  const handleUndo = () => {
    if (historyStates.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...historyStates];
    newHistory.pop(); // Remove current
    const previousState = newHistory[newHistory.length - 1];
    ctx.putImageData(previousState, 0, 0);
    setHistoryStates(newHistory);
  };

  // Clear Canvas
  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(ctx, rect.width, rect.height || 360);
    saveState();
  };

  // Canvas drawing handlers
  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    saveState();
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isEraser ? '#ffffff' : penColor;
    ctx.lineWidth = isEraser ? strokeWidth * 3 : strokeWidth;
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.closePath();
  };

  // Capture / Screenshot Scratchpad ("แคปหน้าทดได้")
  const handleCaptureScratchpad = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a temporary export canvas merging canvas drawing and typed note
    const exportCanvas = document.createElement('canvas');
    const expCtx = exportCanvas.getContext('2d');
    if (!expCtx) return;

    const noteHeight = typedNote.trim() ? 160 : 0;
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height + noteHeight * (window.devicePixelRatio || 1);

    // Draw main canvas
    expCtx.fillStyle = '#ffffff';
    expCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    expCtx.drawImage(canvas, 0, 0);

    // If there is typed note, append it nicely at the bottom
    if (typedNote.trim()) {
      const dpr = window.devicePixelRatio || 1;
      expCtx.fillStyle = '#f8fafc';
      expCtx.fillRect(0, canvas.height, exportCanvas.width, noteHeight * dpr);
      expCtx.strokeStyle = '#e2e8f0';
      expCtx.lineWidth = 2;
      expCtx.beginPath();
      expCtx.moveTo(0, canvas.height);
      expCtx.lineTo(exportCanvas.width, canvas.height);
      expCtx.stroke();

      expCtx.fillStyle = '#1e293b';
      expCtx.font = `${14 * dpr}px Sarabun, sans-serif`;
      expCtx.fillText('บันทึกกระดาษทด (Prep Pass Academy)', 15 * dpr, canvas.height + 25 * dpr);

      expCtx.fillStyle = '#475569';
      expCtx.font = `${12 * dpr}px Sarabun, sans-serif`;
      
      const lines = typedNote.split('\n');
      lines.slice(0, 4).forEach((line, lIdx) => {
        expCtx.fillText(line, 15 * dpr, canvas.height + (50 + lIdx * 20) * dpr);
      });
    }

    const dataUrl = exportCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `prep_pass_scratchpad_${Date.now()}.png`;
    a.click();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  // Calculator Logic
  const handleCalcInput = (val: string) => {
    if (calcDisplay === '0' && val !== '.') {
      setCalcDisplay(val);
    } else {
      setCalcDisplay(prev => prev + val);
    }
  };

  const handleCalcClear = () => {
    setCalcDisplay('0');
    setCalcEquation('');
  };

  const handleCalcBackspace = () => {
    if (calcDisplay.length <= 1) {
      setCalcDisplay('0');
    } else {
      setCalcDisplay(prev => prev.slice(0, -1));
    }
  };

  const handleCalcOp = (op: string) => {
    setCalcEquation(`${calcDisplay} ${op} `);
    setCalcDisplay('0');
  };

  const handleCalcSci = (func: string) => {
    const num = parseFloat(calcDisplay);
    if (isNaN(num)) return;

    let res = 0;
    switch (func) {
      case 'sqrt': res = Math.sqrt(num); break;
      case 'sq': res = Math.pow(num, 2); break;
      case 'cube': res = Math.pow(num, 3); break;
      case 'inv': res = 1 / num; break;
      case 'sin': res = Math.sin((num * Math.PI) / 180); break;
      case 'cos': res = Math.cos((num * Math.PI) / 180); break;
      case 'tan': res = Math.tan((num * Math.PI) / 180); break;
      case 'log': res = Math.log10(num); break;
      case 'pi': res = Math.PI; break;
    }
    const rounded = Math.round(res * 1000000) / 1000000;
    setCalcDisplay(String(rounded));
  };

  const handleCalcEqual = () => {
    try {
      const fullEq = calcEquation + calcDisplay;
      // Sanitize equation before eval
      const cleanEq = fullEq.replace(/×/g, '*').replace(/÷/g, '/');
      // eslint-disable-next-line no-eval
      const result = Function(`'use strict'; return (${cleanEq})`)();
      const rounded = Math.round(result * 1000000) / 1000000;
      
      setCalcHistory(prev => [{ eq: fullEq, res: String(rounded) }, ...prev.slice(0, 5)]);
      setCalcDisplay(String(rounded));
      setCalcEquation('');
    } catch (e) {
      setCalcDisplay('Error');
    }
  };

  // Insert calculator result to typed note
  const insertCalcResult = (res: string) => {
    setTypedNote(prev => `${prev} ${res}`);
  };

  // Math symbol quick inserts
  const mathSymbols = ['²', '³', '√', 'π', '±', '÷', '×', 'Σ', 'θ', '°', '≠', '≤', '≥'];

  return (
    <div className="space-y-4 pb-12">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-3.5 border border-[#E2E8F0] shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center font-bold">
            <PenTool className="w-4 h-4 text-[#059669]" />
          </div>
          <div>
            <h2 className="font-display font-bold text-[#0F172A] text-xs sm:text-sm">กระดาษทด & เครื่องคิดเลข</h2>
            <p className="text-[10px] text-[#64748B]">วาดเขียน พิมพ์สูตร และแคปบันทึกได้</p>
          </div>
        </div>

        {/* Action: Screenshot / Save */}
        <button
          onClick={handleCaptureScratchpad}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white font-display text-xs font-bold rounded-xl shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{downloadSuccess ? 'แคปสำเร็จแล้ว!' : 'แคปหน้าทด'}</span>
        </button>
      </div>

      {/* Mode Selector & Canvas Tools */}
      <div className="bg-white rounded-2xl p-3 border border-[#E2E8F0] shadow-2xs space-y-2.5">
        
        {/* Top Controls: Background & View Mode */}
        <div className="flex items-center justify-between text-xs pb-1 border-b border-[#F1F5F9]">
          
          {/* Mode Switcher */}
          <div className="flex items-center bg-[#F1F5F9] p-0.5 rounded-lg text-[11px] font-display font-semibold">
            <button
              onClick={() => setActiveMode('both')}
              className={`px-2.5 py-1 rounded-md transition-all ${activeMode === 'both' ? 'bg-white text-[#0F172A] shadow-xs font-bold' : 'text-[#64748B]'}`}
            >
              วาด+พิมพ์
            </button>
            <button
              onClick={() => setActiveMode('draw')}
              className={`px-2.5 py-1 rounded-md transition-all ${activeMode === 'draw' ? 'bg-white text-[#0F172A] shadow-xs font-bold' : 'text-[#64748B]'}`}
            >
              วาดอย่างเดียว
            </button>
            <button
              onClick={() => setActiveMode('type')}
              className={`px-2.5 py-1 rounded-md transition-all ${activeMode === 'type' ? 'bg-white text-[#0F172A] shadow-xs font-bold' : 'text-[#64748B]'}`}
            >
              พิมพ์โน้ต
            </button>
          </div>

          {/* Background Grid Selector */}
          <div className="flex items-center gap-1 text-[11px]">
            <button
              onClick={() => setBackgroundType('grid')}
              title="กระดาษตารางกราฟ"
              className={`p-1.5 rounded-lg border ${backgroundType === 'grid' ? 'bg-[#EFF6FF] border-[#93C5FD] text-[#1E40AF]' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]'}`}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setBackgroundType('lines')}
              title="กระดาษมีเส้น"
              className={`p-1.5 rounded-lg border ${backgroundType === 'lines' ? 'bg-[#EFF6FF] border-[#93C5FD] text-[#1E40AF]' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]'}`}
            >
              <AlignJustify className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setBackgroundType('blank')}
              title="กระดาษเปล่า"
              className={`p-1.5 rounded-lg border ${backgroundType === 'blank' ? 'bg-[#EFF6FF] border-[#93C5FD] text-[#1E40AF]' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]'}`}
            >
              <Square className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Pen, Color & Eraser Palette (Visible when draw is active) */}
        {(activeMode === 'draw' || activeMode === 'both') && (
          <div className="flex items-center justify-between gap-2 pt-0.5">
            
            {/* Color Swatches */}
            <div className="flex items-center gap-1.5">
              {[
                { color: '#0f172a', name: 'ดำ' },
                { color: '#1d4ed8', name: 'น้ำเงิน' },
                { color: '#dc2626', name: 'แดง' },
                { color: '#16a34a', name: 'เขียว' },
                { color: '#d97706', name: 'ส้ม' }
              ].map(c => (
                <button
                  key={c.color}
                  onClick={() => {
                    setPenColor(c.color);
                    setIsEraser(false);
                  }}
                  className={`w-6 h-6 rounded-full transition-transform flex items-center justify-center ${
                    !isEraser && penColor === c.color ? 'scale-115 ring-2 ring-[#2563EB] ring-offset-1' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.color }}
                >
                  {!isEraser && penColor === c.color && <Check className="w-3 h-3 text-white" />}
                </button>
              ))}

              {/* Eraser */}
              <button
                onClick={() => setIsEraser(prev => !prev)}
                className={`p-1.5 rounded-lg border transition-all ${
                  isEraser ? 'bg-[#FEF2F2] border-[#EF4444] text-[#B91C1C]' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9]'
                }`}
                title="ยางลบ"
              >
                <Eraser className="w-4 h-4" />
              </button>
            </div>

            {/* Stroke Width Selector & Clear/Undo */}
            <div className="flex items-center gap-1.5">
              <select
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="text-[10px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2 py-1 text-[#334155] font-display"
              >
                <option value={2}>เส้นบาง</option>
                <option value={4}>เส้นกลาง</option>
                <option value={8}>เส้นหนา</option>
              </select>

              <button
                onClick={handleUndo}
                className="p-1.5 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#64748B] text-xs"
                title="ย้อนกลับ (Undo)"
              >
                <Undo className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleClearCanvas}
                className="p-1.5 rounded-lg bg-[#F8FAFC] hover:bg-[#FEF2F2] border border-[#E2E8F0] hover:border-[#FECACA] text-[#64748B] hover:text-[#EF4444] text-xs"
                title="ล้างกระดาษทั้งหมด"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

      </div>

      {/* DRAWING CANVAS SECTION */}
      {(activeMode === 'draw' || activeMode === 'both') && (
        <div className="bg-white rounded-2xl border-2 border-[#CBD5E1] shadow-2xs overflow-hidden relative">
          <canvas
            ref={canvasRef}
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerLeave={stopDrawing}
            className="w-full h-80 sm:h-96 touch-none cursor-crosshair block"
          />
          <div className="absolute bottom-2 right-2 text-[9px] text-[#64748B] bg-white/90 px-2 py-0.5 rounded backdrop-blur-xs pointer-events-none border border-[#E2E8F0]">
            {isEraser ? '🧹 โหมดยางลบ' : '✏️ ใช้นิ้วหรือปากกาวาดทดเลขได้'}
          </div>
        </div>
      )}

      {/* TYPING NOTE SECTION */}
      {(activeMode === 'type' || activeMode === 'both') && (
        <div className="bg-white rounded-2xl p-3.5 border border-[#E2E8F0] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs pb-1">
            <span className="font-display font-bold text-[#0F172A] flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>พิมพ์โน้ตทดเลข & สูตร:</span>
            </span>
            <button
              onClick={() => setTypedNote('')}
              className="text-[10px] text-[#94A3B8] hover:text-[#EF4444] transition-colors"
            >
              ล้างข้อความ
            </button>
          </div>

          {/* Quick Math Symbols */}
          <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar text-xs">
            {mathSymbols.map(sym => (
              <button
                key={sym}
                onClick={() => setTypedNote(prev => prev + sym)}
                className="px-2 py-0.5 bg-[#F1F5F9] hover:bg-[#EFF6FF] hover:text-[#2563EB] rounded-md font-mono text-xs text-[#334155] transition-colors flex-shrink-0"
              >
                {sym}
              </button>
            ))}
          </div>

          <textarea
            value={typedNote}
            onChange={(e) => setTypedNote(e.target.value)}
            rows={3}
            placeholder="พิมพ์โจทย์ สูตรลัด หรือตัวเลขที่ต้องการทดไว้ตรงนี้..."
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-xs text-[#1E293B] focus:outline-none focus:border-[#2563EB] font-sans leading-relaxed"
          />
        </div>
      )}

      {/* BUILT-IN CALCULATOR */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
        
        {/* Calc Header Toggle */}
        <div 
          onClick={() => setShowCalc(prev => !prev)}
          className="p-3.5 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1E3A8A] text-white flex items-center justify-between cursor-pointer select-none border-b border-slate-700/50"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xs">เครื่องคิดเลขคำนวณเร็ว</h3>
              <p className="text-[10px] text-slate-300">รองรับฟังก์ชันพื้นฐานและวิทยาศาสตร์</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsSciMode(prev => !prev);
              }}
              className={`text-[10px] font-display font-semibold px-2 py-1 rounded-lg border transition-all ${
                isSciMode ? 'bg-[#2563EB] text-white border-blue-400' : 'bg-white/10 text-slate-200 border-white/20'
              }`}
            >
              {isSciMode ? 'ฟังก์ชันขั้นสูง ON' : 'โหมดปกติ'}
            </button>
          </div>
        </div>

        {showCalc && (
          <div className="p-3.5 space-y-3 bg-[#F8FAFC]">
            
            {/* Display Screen */}
            <div className="bg-[#0F172A] text-white rounded-xl p-3 text-right font-mono border border-slate-800 shadow-inner">
              <div className="text-[11px] text-[#94A3B8] h-4 overflow-hidden truncate">
                {calcEquation || ' '}
              </div>
              <div className="text-xl font-bold tracking-wider text-[#60A5FA] truncate">
                {calcDisplay}
              </div>
            </div>

            {/* Scientific Row (if enabled) */}
            {isSciMode && (
              <div className="grid grid-cols-5 gap-1.5 text-xs font-mono">
                <button onClick={() => handleCalcSci('sqrt')} className="p-2 bg-[#E2E8F0] hover:bg-[#CBD5E1] rounded-lg text-[#1E293B] font-bold">√</button>
                <button onClick={() => handleCalcSci('sq')} className="p-2 bg-[#E2E8F0] hover:bg-[#CBD5E1] rounded-lg text-[#1E293B] font-bold">x²</button>
                <button onClick={() => handleCalcSci('cube')} className="p-2 bg-[#E2E8F0] hover:bg-[#CBD5E1] rounded-lg text-[#1E293B] font-bold">x³</button>
                <button onClick={() => handleCalcSci('sin')} className="p-2 bg-[#E2E8F0] hover:bg-[#CBD5E1] rounded-lg text-[#1E293B] font-bold">sin</button>
                <button onClick={() => handleCalcSci('cos')} className="p-2 bg-[#E2E8F0] hover:bg-[#CBD5E1] rounded-lg text-[#1E293B] font-bold">cos</button>
                <button onClick={() => handleCalcSci('tan')} className="p-2 bg-[#E2E8F0] hover:bg-[#CBD5E1] rounded-lg text-[#1E293B] font-bold">tan</button>
                <button onClick={() => handleCalcSci('log')} className="p-2 bg-[#E2E8F0] hover:bg-[#CBD5E1] rounded-lg text-[#1E293B] font-bold">log</button>
                <button onClick={() => handleCalcSci('pi')} className="p-2 bg-[#E2E8F0] hover:bg-[#CBD5E1] rounded-lg text-[#1E293B] font-bold">π</button>
                <button onClick={() => handleCalcInput('(')} className="p-2 bg-[#E2E8F0] hover:bg-[#CBD5E1] rounded-lg text-[#1E293B] font-bold">(</button>
                <button onClick={() => handleCalcInput(')')} className="p-2 bg-[#E2E8F0] hover:bg-[#CBD5E1] rounded-lg text-[#1E293B] font-bold">)</button>
              </div>
            )}

            {/* Standard Keypad Grid */}
            <div className="grid grid-cols-4 gap-2 text-sm font-display font-semibold">
              <button onClick={handleCalcClear} className="p-2.5 bg-[#FEE2E2] hover:bg-[#FECACA] text-[#DC2626] rounded-xl font-bold">C</button>
              <button onClick={handleCalcBackspace} className="p-2.5 bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[#334155] rounded-xl">⌫</button>
              <button onClick={() => handleCalcOp('%')} className="p-2.5 bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[#334155] rounded-xl">%</button>
              <button onClick={() => handleCalcOp('÷')} className="p-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold">÷</button>

              <button onClick={() => handleCalcInput('7')} className="p-2.5 bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#1E293B] rounded-xl shadow-2xs">7</button>
              <button onClick={() => handleCalcInput('8')} className="p-2.5 bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#1E293B] rounded-xl shadow-2xs">8</button>
              <button onClick={() => handleCalcInput('9')} className="p-2.5 bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#1E293B] rounded-xl shadow-2xs">9</button>
              <button onClick={() => handleCalcOp('×')} className="p-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold">×</button>

              <button onClick={() => handleCalcInput('4')} className="p-2.5 bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#1E293B] rounded-xl shadow-2xs">4</button>
              <button onClick={() => handleCalcInput('5')} className="p-2.5 bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#1E293B] rounded-xl shadow-2xs">5</button>
              <button onClick={() => handleCalcInput('6')} className="p-2.5 bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#1E293B] rounded-xl shadow-2xs">6</button>
              <button onClick={() => handleCalcOp('-')} className="p-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold">-</button>

              <button onClick={() => handleCalcInput('1')} className="p-2.5 bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#1E293B] rounded-xl shadow-2xs">1</button>
              <button onClick={() => handleCalcInput('2')} className="p-2.5 bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#1E293B] rounded-xl shadow-2xs">2</button>
              <button onClick={() => handleCalcInput('3')} className="p-2.5 bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#1E293B] rounded-xl shadow-2xs">3</button>
              <button onClick={() => handleCalcOp('+')} className="p-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold">+</button>

              <button onClick={() => handleCalcInput('0')} className="col-span-2 p-2.5 bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#1E293B] rounded-xl shadow-2xs">0</button>
              <button onClick={() => handleCalcInput('.')} className="p-2.5 bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#1E293B] rounded-xl shadow-2xs">.</button>
              <button onClick={handleCalcEqual} className="p-2.5 bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-xl font-bold shadow-xs hover:brightness-110">=</button>
            </div>

            {/* Quick action: Insert Calc result into note */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-[10px] text-[#64748B]">คำนวณได้: <b>{calcDisplay}</b></span>
              <button
                type="button"
                onClick={() => insertCalcResult(calcDisplay)}
                className="text-[10px] font-display font-semibold text-[#065F46] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] px-2 py-1 rounded-lg transition-colors"
              >
                + แทรกลงในโน้ตทด
              </button>
            </div>

          </div>
        )}
      </div>

    </div>
  );
};
