import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON with generous limit for photo/image uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Lazy Gemini AI Client helper
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set in environment.');
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// AI Tutor Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, message, subject } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Graceful fallback if key is not configured in preview
      return res.json({
        reply: `🎖️ **คำแนะนำจากครูฝึก AI (โหมดออฟไลน์)**\n\nสำหรับวิชา ${subject || 'เตรียมสอบราชการ'} แนะนำให้เน้นการฝึกทำโจทย์จับเวลา 1 นาทีต่อข้อ โดยเฉพาะวิชาคณิตศาสตร์และภาษาไทยซึ่งเป็นวิชาตัดเชือกของทั้ง นนส. และ นสต. ครับ! (เชื่อมต่อ Gemini API เพื่อรับคำตอบวิเคราะห์รายข้อแบบเรียลไทม์)`,
      });
    }

    const systemPrompt = `คุณคือ "ครูฝึก AI & ติวเตอร์ผู้เชี่ยวชาญข้อสอบ นนส. (นายสิบทหารบก) และ นสต. (นายสิบตำรวจ)" ของ Prep Pass Academy
คุณมีความรู้ลึกซึ้งในทุกวิชา:
1. คณิตศาสตร์ & ความสามารถทั่วไป (อนุกรม ตรรกศาสตร์ มิติสัมพันธ์ ร้อยละ สมการ ความน่าจะเป็น)
2. ภาษาไทย (หลักภาษา การสะกดคำ ราชาศัพท์ สำนวน การอ่านจับใจความ)
3. ภาษาอังกฤษ (Grammar, Vocabulary, Reading, Conversation)
4. กฎหมายที่ประชาชนควรรู้ (ป.อาญา, ป.วิอาญา, รัฐธรรมนูญ, พรบ.จราจร)
5. สารสนเทศและคอมพิวเตอร์
6. วิทยาศาสตร์ (ฟิสิกส์ เคมี ชีววิทยา วิทย์กายภาพ)
7. สังคม วัฒนธรรม จริยธรรม และเหตุการณ์ปัจจุบัน
8. การเตรียมตัวสอบสัมภาษณ์ ท่วงท่าทหาร-ตำรวจ และการทดสอบสมรรถภาพร่างกาย

รูปแบบการตอบ:
- ตอบเป็นภาษาไทยด้วยน้ำเสียงกระตือรือร้น หนักแน่น อบอุ่น มีความเป็นครูฝึกมืออาชีพ
- อธิบายวิธีคิดเป็นขั้นเป็นตอน (Step-by-step) เข้าใจง่าย
- หากมีสูตร ให้สรุปสูตรลัดหรือเทคนิคจำง่าย
- กระชับ ตรงประเด็น เหมาะสำหรับอ่านบนหน้าจอมือถือ`;

    let promptContent = '';
    if (messages && Array.isArray(messages) && messages.length > 0) {
      promptContent = messages.map((m: any) => `${m.role === 'user' ? 'นักเรียน' : 'ครูฝึก AI'}: ${m.content}`).join('\n') + `\nนักเรียน: ${message || ''}`;
    } else {
      promptContent = message || 'ขอเทคนิคการเตรียมสอบนายสิบหน่อยครับ';
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: [
        { text: `${systemPrompt}\n\nข้อความจากนักเรียน:\n${promptContent}` }
      ],
      config: {
        temperature: 0.6,
      }
    });

    const reply = response.text || 'ขออภัยครับ ไม่สามารถสร้างคำตอบได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง';
    return res.json({ reply });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({
      error: 'เกิดข้อผิดพลาดในการประมวลผลคำตอบ',
      details: error?.message || String(error)
    });
  }
});

// AI Question Photo / Image Scanner Endpoint
app.post('/api/scan-question', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', subjectHint = '' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'กรุณาแนบรูปภาพโจทย์' });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Fallback preview explanation
      return res.json({
        questionText: 'โจทย์จากภาพตัวอย่าง (ตัวอย่างระบบสแกน)',
        subject: subjectHint || 'คณิตศาสตร์',
        choices: [
          'ก. 24',
          'ข. 36',
          'ค. 48',
          'ง. 60'
        ],
        correctAnswer: 'ข. 36',
        steps: [
          'ขั้นที่ 1: วิเคราะห์รูปแบบอนุกรมหรือตัวแปรในโจทย์',
          'ขั้นที่ 2: ใช้สูตรความสัมพันธ์ผลต่างชั้นที่ 2',
          'ขั้นที่ 3: แทนค่าและคำนวณผลลัพธ์สุดท้ายได้ 36'
        ],
        formula: 'สูตรผลต่างลำดับเลขคณิต d = a_n - a_(n-1)',
        tip: 'ในห้องสอบ นนส./นสต. ให้มองหาผลต่างชั้นแรกก่อนเสมอ หากไม่คงที่ให้มองชั้นที่สองทันที',
        rawExplanation: 'นี่คือตัวอย่างผลการวิเคราะห์โจทย์ กรุณาตั้งค่า GEMINI_API_KEY เพื่อเปิดใช้งานระบบสแกนรูปภาพ AI อัจฉริยะแบบสมบูรณ์'
      });
    }

    // Clean base64 data if it contains data URI prefix
    const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const scanPrompt = `คุณคือผู้เชี่ยวชาญเฉลยข้อสอบ นนส. (นายสิบทหารบก) และ นสต. (นายสิบตำรวจ)
หน้าที่ของคุณคือ:
1. อ่านข้อความโจทย์ ตัวเลือก ก ข ค ง หรือ 1 2 3 4 จากภาพอย่างละเอียดและถูกต้องแม่นยำ
2. ตรวจสอบวิชา (คณิตศาสตร์, ภาษาไทย, ภาษาอังกฤษ, กฎหมาย, วิทยาศาสตร์, คอมพิวเตอร์, สังคม)
3. เฉลยคำตอบที่ถูกต้องที่สุด พร้อมแสดงวิธีทำเป็นขั้นตอนอย่างละเอียด (Step-by-Step)
4. สรุปสูตรหรือหลักการที่ใช้ พร้อมเทคนิคจำลัดในห้องสอบ

กรุณาตอบกลับในรูปแบบ JSON ที่ถูกต้องเท่านั้น ตามโครงสร้างดังนี้:
{
  "questionText": "ข้อความโจทย์ที่อ่านได้จากภาพ",
  "subject": "ชื่อวิชา เช่น คณิตศาสตร์, ภาษาอังกฤษ, ภาษาไทย, กฎหมาย ฯลฯ",
  "choices": ["ก. ...", "ข. ...", "ค. ...", "ง. ..."],
  "correctAnswer": "ก./ข./ค./ง. หรือ A/B/C/D ที่ถูกต้อง พร้อมข้อความสั้นๆ",
  "steps": [
    "ขั้นตอนที่ 1: ...",
    "ขั้นตอนที่ 2: ...",
    "ขั้นตอนที่ 3: ..."
  ],
  "formula": "สูตรหรือหลักไวยากรณ์/มาตรากฎหมายสำคัญที่เกี่ยวข้อง",
  "tip": "เทคนิคลัดหรือจุดหลอกที่ต้องระวังในสนามสอบจริง",
  "rawExplanation": "คำอธิบายสรุปภาพรวมทั้งหมดอย่างเข้าใจง่าย"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: scanPrompt },
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType || 'image/jpeg'
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    let resultJson: any = null;
    const textOutput = response.text || '';

    try {
      resultJson = JSON.parse(textOutput);
    } catch (parseErr) {
      // Fallback json extraction regex if markdown json blocks exist
      const jsonMatch = textOutput.match(/```json\n([\s\S]*?)\n```/) || textOutput.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        resultJson = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        resultJson = {
          questionText: 'ตรวจพบโจทย์จากภาพ',
          subject: subjectHint || 'ความสามารถทั่วไป',
          choices: [],
          correctAnswer: 'ดูคำอธิบายด้านล่าง',
          steps: [textOutput],
          formula: '',
          tip: 'ตรวจสอบความชัดเจนของภาพหากตัวหนังสือเลือนราง',
          rawExplanation: textOutput
        };
      }
    }

    return res.json(resultJson);
  } catch (error: any) {
    console.error('Error in /api/scan-question:', error);
    return res.status(500).json({
      error: 'ไม่สามารถสแกนภาพโจทย์ได้ กรุณาตรวจสอบความคมชัดของภาพ',
      details: error?.message || String(error)
    });
  }
});

// Dynamic AI Question Generator (for unlimited fresh random practice questions)
app.post('/api/generate-random-questions', async (req, res) => {
  try {
    const { branch = 'both', subject = 'all', count = 3 } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({ questions: [] });
    }

    const genPrompt = `สร้างข้อสอบจำลองเตรียมสอบ ${branch === 'army' ? 'นายสิบทหารบก (นนส.)' : branch === 'police' ? 'นายสิบตำรวจ (นสต.)' : 'นายสิบทหาร-ตำรวจ'} 
วิชา: ${subject === 'all' ? 'สุ่มคละทุกวิชา (คณิต, ไทย, อังกฤษ, กฎหมาย, วิทย์, คอมพิวเตอร์)' : subject}
จำนวน: ${Math.min(5, Math.max(1, count))} ข้อ
ระดับความยาก: เสมือนข้อสอบจริง มีตัวเลือก 4 ช้อยส์ (ก ข ค ง) เฉลยและวิธีคิดละเอียด

ตอบกลับเป็น JSON array เท่านั้น ตามรูปแบบ:
[
  {
    "id": "gen_1",
    "branch": "army" หรือ "police" หรือ "both",
    "subject": "ชื่อวิชา",
    "question": "คำถามโจทย์ข้อสอบ",
    "options": ["ก. ...", "ข. ...", "ค. ...", "ง. ..."],
    "correctIndex": 0, // 0 = ก, 1 = ข, 2 = ค, 3 = ง
    "explanation": "เฉลยและวิธีคิดเป็นขั้นเป็นตอนอย่างละเอียด",
    "formula": "สูตรหรือข้อควรจำ (ถ้ามี)",
    "difficulty": "ปานกลาง"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: [{ text: genPrompt }],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7
      }
    });

    const parsed = JSON.parse(response.text || '[]');
    return res.json({ questions: parsed });
  } catch (error: any) {
    console.error('Error generating questions:', error);
    return res.json({ questions: [] });
  }
});

async function startServer() {
  // Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Prep Pass Server running at http://localhost:${PORT}`);
  });
}

startServer();
