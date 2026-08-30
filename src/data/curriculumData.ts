import { SubjectInfo } from '../types';

export const ARMY_SUBJECTS: SubjectInfo[] = [
  {
    id: 'interview',
    name: 'สอบสัมภาษณ์ & ท่วงท่าทหาร',
    shortDesc: 'เทคนิคการตอบคำถาม จิตวิทยา ท่าทาง และการควบคุมอารมณ์',
    iconName: 'Award',
    branch: 'army',
    color: 'emerald',
    accentColor: '#10b981',
    weightPercent: 15,
    totalTopics: 8,
    summaryNotes: [
      'การแนะนำตัว: ชื่อ-สกุล ภูมิลำเนา วุฒิการศึกษา และเหตุผลที่อยากเป็นทหารบก (เน้นความชัดถ้อยชัดคำ)',
      'ท่วงท่า: ท่ายืนตรง ส้นเท้าชิด ปลายเท้าเปิด 45 องศา อกผายไหล่ผึ่ง สายตามองตรง',
      'คำถามยอดฮิต: ถ้าเจอสถานการณ์วิกฤต หรือคำสั่งที่ยากลำบาก จะตัดสินใจอย่างไร',
      'ความรู้เกี่ยวกับกองทัพบก: ผู้บัญชาการทหารบก (ผบ.ทบ.), วิสัยทัศน์ และประวัติศาสตร์การทหาร'
    ],
    keyFormulas: [
      { title: 'เทคนิค STAR ในการตอบสัมภาษณ์', detail: 'Situation (สถานการณ์) -> Task (เป้าหมาย) -> Action (การลงมือทำ) -> Result (ผลลัพธ์ที่ได้)' },
      { title: 'ค่านิยมกองทัพ', detail: 'วินัย เสียสละ อดทน จงรักภักดี และซื่อสัตย์' }
    ],
    sampleQuestionsCount: 20,
    externalLink: 'sompasnco.html'
  },
  {
    id: 'math',
    name: 'คณิตศาสตร์ (นนส.)',
    shortDesc: 'อนุกรม สมการ ร้อยละ ความน่าจะเป็น เรขาคณิต และการคำนวณ',
    iconName: 'Calculator',
    branch: 'army',
    color: 'emerald',
    accentColor: '#059669',
    weightPercent: 25,
    totalTopics: 12,
    summaryNotes: [
      'อนุกรม: มองหาผลต่างชั้นที่ 1 และ 2, อนุกรมผสม, อนุกรมยกกำลัง',
      'ร้อยละ & กำไรขาดทุน: ทุน x (1 + กำไร%) = ราคาขาย',
      'สมการงานและคน: คน1 x วัน1 = คน2 x วัน2',
      'พื้นที่ & ปริมาตร: วงกลม πr², สามเหลี่ยม 1/2 x ฐาน x สูง'
    ],
    keyFormulas: [
      { title: 'สูตรหาผลรวม 1 ถึง n', detail: 'Sum = n(n + 1) / 2' },
      { title: 'สูตรความเร็ว', detail: 'v = s / t (ความเร็ว = ระยะทาง / เวลา)' }
    ],
    sampleQuestionsCount: 45,
    externalLink: 'kanitnco.html'
  },
  {
    id: 'thai',
    name: 'ภาษาไทย (นนส.)',
    shortDesc: 'หลักภาษา การสะกดคำ คำสมาสสนธิ ราชาศัพท์ และการอ่านจับใจความ',
    iconName: 'BookOpen',
    branch: 'army',
    color: 'emerald',
    accentColor: '#16a34a',
    weightPercent: 20,
    totalTopics: 10,
    summaryNotes: [
      'คำสมาส-สนธิ: สมาสชน สนธิเชื่อม (สมาสไม่มีทัณฑฆาต สนธิมีการกลืนเสียง)',
      'คำราชาศัพท์: หมวดร่างกาย, กิริยา, ห้ามใช้ "ทรงมี/ทรงเป็น" ซ้อนคำราชาศัพท์',
      'การอ่านจับใจความ: หาประโยคใจความสำคัญ (ต้น กลาง หรือท้ายย่อหน้า)',
      'สำนวนไทย: สุภาษิต คำพังเพยที่มักออกสอบบ่อย'
    ],
    keyFormulas: [
      { title: 'หลักการจำสมาส', detail: 'บาลี+สันสกฤต แปลจากหลังไปหน้า ออกเสียงเชื่อมคำ' },
      { title: 'สะกดคำยอดฮิต', detail: 'กะเพรา / อนุญาต / สังเกต / โควตา / คะ-ค่ะ' }
    ],
    sampleQuestionsCount: 35,
    externalLink: 'thainco.html'
  },
  {
    id: 'english',
    name: 'ภาษาอังกฤษ (นนส.)',
    shortDesc: 'ไวยากรณ์ 12 Tenses, คำศัพท์ทางทหาร, Reading และ Conversation',
    iconName: 'Languages',
    branch: 'army',
    color: 'emerald',
    accentColor: '#047857',
    weightPercent: 15,
    totalTopics: 9,
    summaryNotes: [
      'Tenses หลัก: Present Simple, Past Simple, Present Perfect, Past Perfect',
      'Passive Voice: Subject + Verb to be + V.3',
      'If-Clause 3 แบบ: Type 1 (อนาคต), Type 2 (สมมุติปัจจุบัน), Type 3 (สมมุติอดีต)',
      'Military Vocabulary: Soldier, Weapon, Defense, Mission, Strategy'
    ],
    keyFormulas: [
      { title: 'If-Clause Type 3', detail: 'If + S + had + V.3, S + would have + V.3' },
      { title: 'Prepositions of Place', detail: 'In (พื้นที่กว้าง/ปี), On (วัน/ถนน), At (จุดเฉพาะ/เวลา)' }
    ],
    sampleQuestionsCount: 30,
    externalLink: 'englishnco.html'
  },
  {
    id: 'science',
    name: 'วิทยาศาสตร์ (นนส.)',
    shortDesc: 'ฟิสิกส์การเคลื่อนที่ แรง เคมีสารละลาย และชีววิทยาระบบร่างกาย',
    iconName: 'FlaskConical',
    branch: 'army',
    color: 'emerald',
    accentColor: '#0f766e',
    weightPercent: 15,
    totalTopics: 11,
    summaryNotes: [
      'ฟิสิกส์: กฎการเคลื่อนที่ของนิวตัน (F = ma), แรงโน้มถ่วง, งานและพลังงาน',
      'เคมี: กรด-เบส (pH < 7 กรด, pH > 7 เบส), การแยกสาร',
      'ชีววิทยา: ระบบหมุนเวียนโลหิต ระบบหายใจ เซลล์พืชและสัตว์'
    ],
    keyFormulas: [
      { title: 'กฎข้อ 2 นิวตัน', detail: 'ΣF = ma' },
      { title: 'พลังงานศักย์ & จลน์', detail: 'Ep = mgh, Ek = 1/2 mv²' }
    ],
    sampleQuestionsCount: 25,
    externalLink: 'vitayachadnco.html'
  },
  {
    id: 'general',
    name: 'ความรู้ทั่วไป & เหตุการณ์ปัจจุบัน',
    shortDesc: 'ภูมิศาสตร์ ประวัติศาสตร์ ความมั่นคง ยุทธศาสตร์ชาติ และอาเซียน',
    iconName: 'Globe',
    branch: 'army',
    color: 'emerald',
    accentColor: '#065f46',
    weightPercent: 10,
    totalTopics: 7,
    summaryNotes: [
      'ยุทธศาสตร์ชาติ 20 ปี (2561-2580) 6 ด้านหลัก',
      'ประวัติศาสตร์ไทย: สมัยอยุธยา ธนบุรี และรัตนโกสินทร์',
      'องค์กรระหว่างประเทศ: ASEAN, UN, ความร่วมมือทางทหาร'
    ],
    keyFormulas: [
      { title: 'วันสำคัญทางทหาร', detail: '18 ม.ค. วันกองทัพไทย (วันสมเด็จพระนเรศวรมหาราชชนช้าง)' }
    ],
    sampleQuestionsCount: 20,
    externalLink: 'alllearn.html'
  }
];

export const POLICE_SUBJECTS: SubjectInfo[] = [
  {
    id: 'interview',
    name: 'สัมภาษณ์ตำรวจ & จิตวิทยา',
    shortDesc: 'การทดสอบทัศนคติ อุดมคติตำรวจ การแก้ปัญหาเฉพาะหน้า และบุคลิกภาพ',
    iconName: 'ShieldCheck',
    branch: 'police',
    color: 'blue',
    accentColor: '#2563eb',
    weightPercent: 15,
    totalTopics: 8,
    summaryNotes: [
      'อุดมคติตำรวจ 9 ประการ (เคารพเอื้อเฟื้อต่อหน้าที่, กรุณาปราณีต่อประชาชน ฯลฯ)',
      'การตอบคำถามเรื่องสิทธิมนุษยชนและการใช้กำลังตามสัดส่วน (Use of Force)',
      'ความอดทนต่อแรงกดดันและสถานการณ์ยั่วยุ'
    ],
    keyFormulas: [
      { title: 'อุดมคติตำรวจข้อ 1', detail: 'เคารพเอื้อเฟื้อต่อหน้าที่ กรุณาปราณีต่อประชาชน' },
      { title: 'อุดมคติตำรวจข้อสุดท้าย', detail: 'เสียสละสุขส่วนตนเพื่อประโยชน์ประชาชนและประเทศชาติ' }
    ],
    sampleQuestionsCount: 20,
    externalLink: 'sompaspolice.html'
  },
  {
    id: 'math',
    name: 'ความสามารถทั่วไป / คณิตศาสตร์',
    shortDesc: 'อนุกรม ตรรกศาสตร์ มิติสัมพันธ์ ร้อยละ สมการ ความน่าจะเป็น',
    iconName: 'Calculator',
    branch: 'police',
    color: 'blue',
    accentColor: '#1d4ed8',
    weightPercent: 25,
    totalTopics: 12,
    summaryNotes: [
      'ตรรกศาสตร์ & ข้อสอบเงื่อนไขสัญลักษณ์: การแปลงประพจน์จริง/เท็จ',
      'มิติสัมพันธ์: การพับกล่อง การหมุนภาพ 2D/3D',
      'อนุกรมเลข & อนุกรมภาพ 4 ตัวเลือก'
    ],
    keyFormulas: [
      { title: 'เงื่อนไขสัญลักษณ์', detail: 'ถ้า P -> Q จริง และ ~Q จริง สรุปได้ว่า ~P จริง' },
      { title: 'สูตรค่าเฉลี่ยเลขคณิต', detail: 'x̄ = Σx / n' }
    ],
    sampleQuestionsCount: 50,
    externalLink: 'PoliceNCOMath.html'
  },
  {
    id: 'thai',
    name: 'ภาษาไทย (นสต.)',
    shortDesc: 'การสะกดคำ การเรียงประโยค สำนวน การเขียนหนังสือราชการ',
    iconName: 'BookOpen',
    branch: 'police',
    color: 'blue',
    accentColor: '#1e40af',
    weightPercent: 20,
    totalTopics: 10,
    summaryNotes: [
      'การสะกดคำในบันทึกข้อความและรายงานประจำวันตำรวจ',
      'การจัดลำดับประโยค 1-2-3-4 ให้เป็นข้อความที่สมบูรณ์',
      'การใช้ภาษาทางการและภาษาเขียน'
    ],
    keyFormulas: [
      { title: 'เทคนิคเรียงประโยค', detail: 'หาประโยคเปิด (ประธาน/กว้าง) -> ขยาย -> ผลลัพธ์/สรุป' }
    ],
    sampleQuestionsCount: 35,
    externalLink: 'policethai.html'
  },
  {
    id: 'english',
    name: 'ภาษาอังกฤษ (นสต.)',
    shortDesc: 'Conversation ในชีวิตประจำวันและงานตำรวจ, Grammar, Reading',
    iconName: 'Languages',
    branch: 'police',
    color: 'blue',
    accentColor: '#1e3a8a',
    weightPercent: 15,
    totalTopics: 9,
    summaryNotes: [
      'บทสนทนาแจ้งความและการให้ความช่วยเหลือนักท่องเที่ยว',
      'คำศัพท์เกี่ยวกับคดี กฎหมาย และการสอบสวน (Crime, Arrest, Witness, Evidence)'
    ],
    keyFormulas: [
      { title: 'คำศัพท์ตำรวจออกสอบ', detail: 'Suspect (ผู้ต้องสงสัย), Victim (ผู้เสียหาย), Officer (เจ้าหน้าที่)' }
    ],
    sampleQuestionsCount: 30,
    externalLink: 'policeenglish.html'
  },
  {
    id: 'computer',
    name: 'เทคโนโลยีสารสนเทศ & คอมพิวเตอร์',
    shortDesc: 'ระบบคอมพิวเตอร์ ระบบเครือข่าย พรบ.คอมพิวเตอร์ และโปรแกรมสำนักงาน',
    iconName: 'Laptop',
    branch: 'police',
    color: 'blue',
    accentColor: '#0284c7',
    weightPercent: 15,
    totalTopics: 8,
    summaryNotes: [
      'พรบ.ว่าด้วยการกระทำความผิดเกี่ยวกับคอมพิวเตอร์ พ.ศ. 2560',
      'ความมั่นคงปลอดภัยไซเบอร์ (Cybersecurity, Phishing, Malware)',
      'คีย์ลัด MS Office (Ctrl+C, Ctrl+V, Ctrl+Z, Ctrl+F, Ctrl+H)'
    ],
    keyFormulas: [
      { title: 'พรบ.คอม ม.14', detail: 'นำเข้าข้อมูลเท็จ/ลามก/กระทบความมั่นคง โทษจำคุกไม่เกิน 5 ปี หรือปรับไม่เกิน 1 แสน' }
    ],
    sampleQuestionsCount: 25,
    externalLink: 'policecomputer.html'
  },
  {
    id: 'society',
    name: 'สังคม วัฒนธรรม จริยธรรม และอาเซียน',
    shortDesc: 'หลักธรรม จรรยาบรรณตำรวจ วัฒนธรรมไทย และประชาคมอาเซียน',
    iconName: 'Users',
    branch: 'police',
    color: 'blue',
    accentColor: '#3b82f6',
    weightPercent: 10,
    totalTopics: 7,
    summaryNotes: [
      'หลักธรรมาภิบาล 6 ประการ: นิติธรรม คุณธรรม โปร่งใส มีส่วนร่วม รับผิดชอบ คุ้มค่า',
      '10 ประเทศสมาชิกอาเซียน และเสาหลัก 3 ด้าน'
    ],
    keyFormulas: [
      { title: 'ธรรมาภิบาล', detail: 'Good Governance = นิติธรรม + คุณธรรม + โปร่งใส + คุ้มค่า' }
    ],
    sampleQuestionsCount: 20,
    externalLink: 'PoliceNCOSociety.html'
  },
  {
    id: 'law',
    name: 'กฎหมายที่ประชาชนควรรู้ (นสต.)',
    shortDesc: 'ประมวลกฎหมายอาญา, ป.วิอาญา, รัฐธรรมนูญ, กฎหมายจราจรทางบก',
    iconName: 'Scale',
    branch: 'police',
    color: 'blue',
    accentColor: '#1d4ed8',
    weightPercent: 20,
    totalTopics: 12,
    summaryNotes: [
      'ป.อาญา: ม.59 (เจตนา/ประมาท), ม.67-68 (จำเป็น/ป้องกันตัว), ม.80 (พยายามทำผิด)',
      'ป.วิอาญา: การจับ (ความผิดซึ่งหน้า), การค้น (หมายค้น/ข้อยกเว้น), สิทธิของผู้ต้องหา',
      'พรบ.จราจรทางบก: สัญญาณไฟ ข้อบังคับการขับขี่ และอัตราโทษ'
    ],
    keyFormulas: [
      { title: 'ป.อาญา ม.68 ป้องกันตัว', detail: 'มีภยันตรายใกล้ถึง + กระทำพอสมควรแก่เหตุ = ไม่มีความผิด' },
      { title: 'ป.อาญา ม.67 จำเป็น', detail: 'หลีกเลี่ยงไม่ได้ + ไม่เกินสมควร = ไม่ต้องรับโทษ' }
    ],
    sampleQuestionsCount: 40,
    externalLink: 'PoliceLaw.html'
  }
];

// Sample images for testing the scanner immediately
export const SAMPLE_SCAN_IMAGES = [
  {
    title: 'ตัวอย่างโจทย์คณิตศาสตร์ (อนุกรม & สมการ)',
    subject: 'คณิตศาสตร์',
    // SVG data URL of a sample math problem question
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360" viewBox="0 0 600 360" fill="%23ffffff"><rect width="600" height="360" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="4" rx="16"/><text x="40" y="55" font-family="sans-serif" font-size="20" font-weight="bold" fill="%231e293b">ข้อสอบเก็ง นายสิบทหาร/ตำรวจ 2567</text><text x="40" y="110" font-family="sans-serif" font-size="22" font-weight="bold" fill="%230f172a">โจทย์: จงหาจำนวนถัดไปของอนุกรม 2, 6, 12, 20, 30, ... ?</text><text x="60" y="170" font-family="sans-serif" font-size="19" fill="%23334155">ก. 40</text><text x="60" y="210" font-family="sans-serif" font-size="19" fill="%23334155">ข. 42</text><text x="60" y="250" font-family="sans-serif" font-size="19" fill="%23334155">ค. 44</text><text x="60" y="290" font-family="sans-serif" font-size="19" fill="%23334155">ง. 48</text></svg>'
  },
  {
    title: 'ตัวอย่างโจทย์กฎหมาย (ป.อาญา เจตนา)',
    subject: 'กฎหมาย',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360" viewBox="0 0 600 360" fill="%23ffffff"><rect width="600" height="360" fill="%23eff6ff" stroke="%2393c5fd" stroke-width="4" rx="16"/><text x="40" y="55" font-family="sans-serif" font-size="20" font-weight="bold" fill="%231e3a8a">ข้อสอบนายสิบตำรวจ (นสต.) สายปราบปราม</text><text x="40" y="105" font-family="sans-serif" font-size="18" font-weight="bold" fill="%230f172a">นายดำขับรถด้วยความเร็ว 140 กม./ชม. ในเขตชุมชน</text><text x="40" y="135" font-family="sans-serif" font-size="18" font-weight="bold" fill="%230f172a">ชนคนข้ามถนนเสียชีวิต การกระทำของนายดำเป็นความผิดลักษณะใด?</text><text x="60" y="185" font-family="sans-serif" font-size="17" fill="%23334155">ก. ฆ่าผู้อื่นโดยเจตนาตาม ป.อ. ม.288</text><text x="60" y="225" font-family="sans-serif" font-size="17" fill="%23334155">ข. กระทำโดยประมาทเป็นเหตุให้ผู้อื่นถึงแก่ความตายตาม ป.อ. ม.291</text><text x="60" y="265" font-family="sans-serif" font-size="17" fill="%23334155">ค. เป็นการกระทำโดยจำเป็น ไม่ต้องรับโทษ</text><text x="60" y="305" font-family="sans-serif" font-size="17" fill="%23334155">ง. เป็นเหตุสุดวิสัย ไม่มีความผิดทางอาญา</text></svg>'
  },
  {
    title: 'ตัวอย่างโจทย์ภาษาอังกฤษ (Grammar)',
    subject: 'ภาษาอังกฤษ',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360" viewBox="0 0 600 360" fill="%23ffffff"><rect width="600" height="360" fill="%23f0fdf4" stroke="%2386efac" stroke-width="4" rx="16"/><text x="40" y="55" font-family="sans-serif" font-size="20" font-weight="bold" fill="%23166534">NCO Army / Police Exam - English Section</text><text x="40" y="110" font-family="sans-serif" font-size="20" font-weight="bold" fill="%230f172a">Question: By the time the commander arrived,</text><text x="40" y="140" font-family="sans-serif" font-size="20" font-weight="bold" fill="%230f172a">the squad ________ the perimeter.</text><text x="60" y="195" font-family="sans-serif" font-size="18" fill="%23334155">A. secures</text><text x="60" y="235" font-family="sans-serif" font-size="18" fill="%23334155">B. has secured</text><text x="60" y="275" font-family="sans-serif" font-size="18" fill="%23334155">C. had secured</text><text x="60" y="315" font-family="sans-serif" font-size="18" fill="%23334155">D. will secure</text></svg>'
  }
];
