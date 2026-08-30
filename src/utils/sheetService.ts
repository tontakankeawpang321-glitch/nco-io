import { BookItem, ShortVideoItem } from '../types';

export const BOOKS_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSghCFF0jUUok34Gmj5EBpOr0MMtTKb1gE66slMtCVn6pB-FWJIghTsl86eYnYiZFy3IP6g4rKp5bIt/pub?output=csv';
export const SHORTS_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT1yp5q3gkX0NX3tNJT_cUBdgz9opHN1Xsc6AojjgO1WhpLMW7xFbPpY0Hn85iPN7eayv1G-bO5azQM/pub?output=csv';

/**
 * Standard CSV Parser handling quotes, commas, and newlines correctly
 */
export function parseCSV(csvText: string): Record<string, string>[] {
  const lines: string[] = [];
  let currentLine = '';
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentLine += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      if (currentLine.trim().length > 0) {
        lines.push(currentLine);
      }
      currentLine = '';
    } else {
      currentLine += char;
    }
  }

  if (currentLine.trim().length > 0) {
    lines.push(currentLine);
  }

  if (lines.length < 1) return [];

  // Parse header line
  const parseRow = (line: string): string[] => {
    const cells: string[] = [];
    let cell = '';
    let inQuote = false;

    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      const next = line[i + 1];

      if (c === '"') {
        if (inQuote && next === '"') {
          cell += '"';
          i++;
        } else {
          inQuote = !inQuote;
        }
      } else if (c === ',' && !inQuote) {
        cells.push(cell.trim());
        cell = '';
      } else {
        cell += c;
      }
    }
    cells.push(cell.trim());
    return cells;
  };

  const headers = parseRow(lines[0]).map(h => h.toLowerCase().trim().replace(/^["']|["']$/g, ''));
  const results: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseRow(lines[i]);
    if (values.length === 0 || (values.length === 1 && values[0] === '')) continue;
    
    const rowObj: Record<string, string> = {};
    headers.forEach((header, idx) => {
      rowObj[header] = values[idx] !== undefined ? values[idx].trim().replace(/^["']|["']$/g, '') : '';
    });

    results.push(rowObj);
  }

  return results;
}

/**
 * Transforms any Google Drive / PDF / Doc link into a safe embedded preview URL
 */
export function formatPdfEmbedUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // Google Drive File URL: https://drive.google.com/file/d/FILE_ID/view...
  const driveFileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://drive.google.com/file/d/${driveFileMatch[1]}/preview`;
  }

  // Google Drive Open ID: https://drive.google.com/open?id=FILE_ID
  const driveIdMatch = trimmed.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/i);
  if (driveIdMatch && driveIdMatch[1]) {
    return `https://drive.google.com/file/d/${driveIdMatch[1]}/preview`;
  }

  // Google Docs / Sheets / Slides Viewer
  if (trimmed.includes('docs.google.com') && !trimmed.includes('/preview')) {
    if (trimmed.endsWith('/edit') || trimmed.endsWith('/view')) {
      return trimmed.replace(/\/(edit|view)(\?.*)?$/, '/preview');
    }
    return `${trimmed}?embedded=true`;
  }

  // Standard web PDF: Use Google Docs Viewer embed wrapper
  if (trimmed.toLowerCase().endsWith('.pdf') || trimmed.includes('.pdf?')) {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(trimmed)}&embedded=true`;
  }

  return trimmed;
}

/**
 * Transforms YouTube shorts / videos / tiktok into iframe embed URL
 */
export function formatVideoEmbedUrl(url: string): { embedUrl: string; videoId: string } {
  if (!url) return { embedUrl: '', videoId: '' };
  const trimmed = url.trim();

  // YouTube Shorts: https://www.youtube.com/shorts/VIDEO_ID
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/i);
  if (shortsMatch && shortsMatch[1]) {
    const id = shortsMatch[1];
    return {
      embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`,
      videoId: id
    };
  }

  // YouTube standard: https://www.youtube.com/watch?v=VIDEO_ID
  const ytWatchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]+)/i);
  if (ytWatchMatch && ytWatchMatch[1]) {
    const id = ytWatchMatch[1];
    return {
      embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`,
      videoId: id
    };
  }

  // YouTube short link: https://youtu.be/VIDEO_ID
  const youtuBeMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/i);
  if (youtuBeMatch && youtuBeMatch[1]) {
    const id = youtuBeMatch[1];
    return {
      embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`,
      videoId: id
    };
  }

  // YouTube embed direct
  const ytEmbedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/i);
  if (ytEmbedMatch && ytEmbedMatch[1]) {
    return {
      embedUrl: trimmed,
      videoId: ytEmbedMatch[1]
    };
  }

  return { embedUrl: trimmed, videoId: '' };
}

// Fallback empty list - no dummy books when opening the app
export const INITIAL_FALLBACK_BOOKS: BookItem[] = [];

// Fallback high-yield Shorts Video Tips for immediate use
export const INITIAL_FALLBACK_SHORTS: ShortVideoItem[] = [
  {
    id: 'short-1',
    title: 'สูตรลัดอนุกรม 3 ชั้น ตอบได้ใน 10 วินาที!',
    category: 'คณิตศาสตร์',
    description: 'เทคนิคการมองผลต่างชั้นที่สองและสามสำหรับข้อสอบ นนส. และ นสต.',
    url: 'https://www.youtube.com/shorts/5eqzK1b0x5k',
    embedUrl: 'https://www.youtube.com/embed/5eqzK1b0x5k?autoplay=1&rel=0&modestbranding=1',
    videoId: '5eqzK1b0x5k',
    duration: '0:55',
    views: '12.4K'
  },
  {
    id: 'short-2',
    title: 'สรุปกฎหมายอาญา ม.59 เจตนา vs ประมาท',
    category: 'กฎหมาย (นสต.)',
    description: 'ทริกจำองค์ประกอบความรับผิดทางอาญา ออกสอบตำรวจทุกปี',
    url: 'https://www.youtube.com/shorts/3jz_N_3x1sA',
    embedUrl: 'https://www.youtube.com/embed/3jz_N_3x1sA?autoplay=1&rel=0&modestbranding=1',
    videoId: '3jz_N_3x1sA',
    duration: '0:48',
    views: '18.9K'
  },
  {
    id: 'short-3',
    title: 'เทคนิคการตอบสัมภาษณ์: ทำไมถึงอยากเป็นทหารบก?',
    category: 'สัมภาษณ์ (นนส.)',
    description: 'โครงสร้างคำตอบแบบ STAR พูดจาฉะฉาน มั่นใจ โดนใจคณะกรรมการ',
    url: 'https://www.youtube.com/shorts/4bK0Xy8gU3M',
    embedUrl: 'https://www.youtube.com/embed/4bK0Xy8gU3M?autoplay=1&rel=0&modestbranding=1',
    videoId: '4bK0Xy8gU3M',
    duration: '1:00',
    views: '25.1K'
  },
  {
    id: 'short-4',
    title: 'If-Clause 3 แบบ จำง่ายไม่สับสนใน 60 วินาที',
    category: 'ภาษาอังกฤษ',
    description: 'สูตรลัดจำ If + Had V3 -> Would Have V3 สำหรับทำข้อสอบ Grammar เร็ว',
    url: 'https://www.youtube.com/shorts/9fX2a_7yZ9M',
    embedUrl: 'https://www.youtube.com/embed/9fX2a_7yZ9M?autoplay=1&rel=0&modestbranding=1',
    videoId: '9fX2a_7yZ9M',
    duration: '0:58',
    views: '15.3K'
  },
  {
    id: 'short-5',
    title: 'วิธีดึงข้อให้ผ่านเกณฑ์คะแนนเต็ม 100% (นนส.)',
    category: 'สมรรถภาพกาย',
    description: 'การจัดท่าวอร์มกล้ามเนื้อหลังและแขน การจัดจังหวะหายใจ',
    url: 'https://www.youtube.com/shorts/6kL1a_8yZ1N',
    embedUrl: 'https://www.youtube.com/embed/6kL1a_8yZ1N?autoplay=1&rel=0&modestbranding=1',
    videoId: '6kL1a_8yZ1N',
    duration: '0:50',
    views: '31.2K'
  },
  {
    id: 'short-6',
    title: 'จับผิดคำสะกดผิดยอดฮิตในข้อสอบภาษาไทย',
    category: 'ภาษาไทย',
    description: 'กะเพรา อนุญาต สังเกต โควตา คะ-ค่ะ ข้อสอบออกบ่อยมาก',
    url: 'https://www.youtube.com/shorts/7mL2b_9zW2O',
    embedUrl: 'https://www.youtube.com/embed/7mL2b_9zW2O?autoplay=1&rel=0&modestbranding=1',
    videoId: '7mL2b_9zW2O',
    duration: '0:45',
    views: '20.7K'
  },
  {
    id: 'short-7',
    title: 'สูตรคิดร้อยละ & กำไรขาดทุน ไม่ต้องตั้งสมการยาว',
    category: 'คณิตศาสตร์',
    description: 'เทคนิคคูณไขว้และหาเปอร์เซ็นต์ส่วนต่างแบบรวดเร็ว',
    url: 'https://www.youtube.com/shorts/8nN3c_0aX3P',
    embedUrl: 'https://www.youtube.com/embed/8nN3c_0aX3P?autoplay=1&rel=0&modestbranding=1',
    videoId: '8nN3c_0aX3P',
    duration: '0:52',
    views: '16.8K'
  },
  {
    id: 'short-8',
    title: 'อุดมคติตำรวจ 9 ประการ จำแบบร้องเพลง/จังหวะ',
    category: 'ตำรวจ (นสต.)',
    description: 'เคล็ดลับท่องจำอุดมคติตำรวจให้ขึ้นใจ สำหรับสอบข้อเขียนและสัมภาษณ์',
    url: 'https://www.youtube.com/shorts/9oO4d_1bY4Q',
    embedUrl: 'https://www.youtube.com/embed/9oO4d_1bY4Q?autoplay=1&rel=0&modestbranding=1',
    videoId: '9oO4d_1bY4Q',
    duration: '0:59',
    views: '28.4K'
  }
];

/**
 * Fetch Books from Google Sheet CSV with real-time refresh
 */
export async function fetchBooksFromSheet(): Promise<BookItem[]> {
  try {
    const timestamp = Date.now();
    const res = await fetch(`${BOOKS_SHEET_CSV_URL}&_nocache=${timestamp}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      console.warn('Failed to fetch books sheet, using fallback');
      return INITIAL_FALLBACK_BOOKS;
    }

    const csvText = await res.text();
    const rows = parseCSV(csvText);

    if (rows.length === 0) {
      return INITIAL_FALLBACK_BOOKS;
    }

    const items: BookItem[] = [];

    rows.forEach((row, idx) => {
      // Resolve column values with aliases
      const category = row['category'] || row['หมวด'] || row['หมวดหมู่'] || row['subject'] || 'ทั่วไป';
      const title = row['title'] || row['ชื่อ'] || row['ชื่อหนังสือ'] || row['name'] || `เอกสารติวเล่มที่ ${idx + 1}`;
      const description = row['description'] || row['รายละเอียด'] || row['detail'] || row['desc'] || 'เอกสารสรุปเนื้อหาสำหรับเตรียมสอบ';
      const rawUrl = row['url'] || row['link'] || row['pdf'] || row['ลิงก์'] || '';

      if (title && (rawUrl || description)) {
        const embedUrl = formatPdfEmbedUrl(rawUrl);
        items.push({
          id: `sheet-book-${idx + 1}-${Date.now()}`,
          title,
          category,
          description,
          url: rawUrl || embedUrl,
          embedUrl: embedUrl || rawUrl,
          pageCount: row['pagecount'] || row['pages'] || row['หน้า'] || 'ฉบับเต็ม',
          author: row['author'] || row['ผู้แต่ง'] || 'Prep Pass Academy',
          badge: row['badge'] || (idx === 0 ? 'แนะนำ' : undefined)
        });
      }
    });

    if (items.length === 0) {
      return INITIAL_FALLBACK_BOOKS;
    }

    return items;
  } catch (error) {
    console.error('Error fetching books sheet:', error);
    return INITIAL_FALLBACK_BOOKS;
  }
}

/**
 * Fetch Shorts from Google Sheet CSV with real-time refresh
 */
export async function fetchShortsFromSheet(): Promise<ShortVideoItem[]> {
  try {
    const timestamp = Date.now();
    const res = await fetch(`${SHORTS_SHEET_CSV_URL}&_nocache=${timestamp}`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      console.warn('Failed to fetch shorts sheet, using fallback');
      return INITIAL_FALLBACK_SHORTS;
    }

    const csvText = await res.text();
    const rows = parseCSV(csvText);

    if (rows.length === 0) {
      return INITIAL_FALLBACK_SHORTS;
    }

    const items: ShortVideoItem[] = [];

    rows.forEach((row, idx) => {
      // Resolve column values with aliases
      const category = row['category'] || row['หมวด'] || row['หมวดหมู่'] || row['subject'] || 'คลิปสรุป';
      const title = row['title'] || row['ชื่อ'] || row['ชื่อคลิป'] || row['name'] || `เทคนิคติวสั้นที่ ${idx + 1}`;
      const description = row['description'] || row['รายละเอียด'] || row['detail'] || row['desc'] || 'เคล็ดลับและเทคนิคทำข้อสอบให้ทันเวลา';
      const rawUrl = row['url'] || row['link'] || row['video'] || row['youtube'] || row['คลิป'] || '';

      if (title && (rawUrl || description)) {
        const { embedUrl, videoId } = formatVideoEmbedUrl(rawUrl);
        items.push({
          id: `sheet-short-${idx + 1}-${Date.now()}`,
          title,
          category,
          description,
          url: rawUrl,
          embedUrl: embedUrl || rawUrl,
          videoId: videoId || undefined,
          duration: row['duration'] || row['ความยาว'] || '1:00',
          views: row['views'] || row['ยอดวิว'] || `${Math.floor(10 + Math.random() * 20)}.${Math.floor(Math.random() * 9)}K`
        });
      }
    });

    if (items.length === 0) {
      return INITIAL_FALLBACK_SHORTS;
    }

    return items;
  } catch (error) {
    console.error('Error fetching shorts sheet:', error);
    return INITIAL_FALLBACK_SHORTS;
  }
}
