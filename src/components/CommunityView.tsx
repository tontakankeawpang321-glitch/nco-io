import React, { useState, useEffect } from 'react';
import { 
  Users, 
  PenSquare, 
  RotateCw, 
  Heart, 
  Share2, 
  Trash2, 
  MessageSquare, 
  Sparkles, 
  ExternalLink,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Tag,
  Radio
} from 'lucide-react';
import { CommunityPost } from '../types';

interface CommunityViewProps {
  onShowToast: (msg: string, isError?: boolean) => void;
}

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyqiIK3CsuYfLRMxDfXhkuT5RddSNdL6KKtnCrqPeh_xNg7tDgHswtV6Azw_EROU5lC/exec";

const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'p1',
    author: 'นสต. ชัยวัฒน์ (สายปราบปราม)',
    subject: 'คณิตศาสตร์',
    content: 'สูตรอนุกรมแบบสองชั้นและอนุกรมยกกำลัง มีเทคนิคสังเกตยังไงให้ไวขึ้นบ้างครับ เวลาทำในห้องสอบรู้สึกคิดไม่ทันเลยครับ?',
    likes: 18,
    time: '15 นาทีที่แล้ว',
    likedByMe: false
  },
  {
    id: 'p2',
    author: 'นนส. พงศกร (ทหารราบ)',
    subject: 'กฎหมาย',
    content: 'แชร์สรุปประมวลกฎหมายอาญา ม.59 เรื่องเจตนาและประมาท ออกสอบบ่อยมากครับ จำง่ายๆ คือ "คิด+ทำ = เจตนา / ไม่คิดแต่เลินเล่อ = ประมาท"',
    likes: 34,
    time: '1 ชั่วโมงที่แล้ว',
    likedByMe: true
  },
  {
    id: 'p3',
    author: 'ว่าที่ นนส. ธนากร',
    subject: 'ภาษาอังกฤษ',
    content: 'If-Clause ทั้ง 3 แบบ ท่องแบบนี้ไม่เคยผิด: 1. If V1, will V1 / 2. If V2, would V1 / 3. If had V3, would have V3 ครับ เซฟไว้ทบทวนกันนะครับ!',
    likes: 29,
    time: '3 ชั่วโมงที่แล้ว',
    likedByMe: false
  }
];

export const CommunityView: React.FC<CommunityViewProps> = ({ onShowToast }) => {
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [filterSubject, setFilterSubject] = useState<string>('ทั้งหมด');

  // Form State
  const [authorName, setAuthorName] = useState<string>('');
  const [postSubject, setPostSubject] = useState<string>('คณิตศาสตร์');
  const [postContent, setPostContent] = useState<string>('');
  const [postImage, setPostImage] = useState<string>('');

  // Fetch posts from Google Apps Script if available
  const fetchPosts = async () => {
    setIsRefreshing(true);
    try {
      if (APPS_SCRIPT_URL && !APPS_SCRIPT_URL.includes('YOUR_APPS_SCRIPT_ID_HERE')) {
        const res = await fetch(`${APPS_SCRIPT_URL}?action=getPosts`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data);
          onShowToast('อัปเดตกระดานสนทนาล่าสุดแล้ว');
        }
      }
    } catch (err) {
      console.log('Apps Script fetch failed:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !postContent.trim()) {
      onShowToast('กรุณากรอกชื่อและเนื้อหาคำถาม', true);
      return;
    }

    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      author: authorName.trim(),
      subject: postSubject,
      content: postContent.trim(),
      image: postImage.trim() || undefined,
      likes: 0,
      time: 'เมื่อสักครู่',
      likedByMe: false
    };

    setPosts(prev => [newPost, ...prev]);

    // Send to Apps Script in background
    if (APPS_SCRIPT_URL && !APPS_SCRIPT_URL.includes('YOUR_APPS_SCRIPT_ID_HERE')) {
      fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'createPost', post: newPost })
      }).catch(err => console.log('Apps Script sync error:', err));
    }

    // Reset Form
    setPostContent('');
    setPostImage('');
    setIsCreateModalOpen(false);
    onShowToast('โพสต์คำถามสำเร็จแล้ว!');
  };

  const handleToggleLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextLiked = !p.likedByMe;
        const nextLikes = nextLiked ? p.likes + 1 : Math.max(0, p.likes - 1);
        return { ...p, likedByMe: nextLiked, likes: nextLikes };
      }
      return p;
    }));

    if (APPS_SCRIPT_URL && !APPS_SCRIPT_URL.includes('YOUR_APPS_SCRIPT_ID_HERE')) {
      fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'likePost', id: postId })
      }).catch(() => {});
    }
  };

  const handleSharePost = (post: CommunityPost) => {
    const shareText = `[คำถามเตรียมสอบ ${post.subject}] โดย ${post.author}: "${post.content}" - เตรียมสอบราชการ Prep Pass Academy`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      onShowToast('คัดลอกข้อความแชร์เรียบร้อย');
    } else {
      onShowToast('คัดลอกข้อความแชร์เรียบร้อย');
    }
  };

  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    onShowToast('ลบโพสต์เรียบร้อยแล้ว');
  };

  const filteredPosts = filterSubject === 'ทั้งหมด' 
    ? posts 
    : posts.filter(p => p.subject === filterSubject);

  return (
    <div className="space-y-4 pb-12">
      
      {/* Community Top Header */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-[#0F172A] text-sm">กระดานสนทนาเพื่อนสอบ</h2>
              <p className="text-[11px] text-[#64748B]">พูดคุย สอบถาม แลกเปลี่ยนแนวข้อสอบ</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-[#ECFDF5] px-2.5 py-1 rounded-full border border-[#A7F3D0]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="text-[10px] text-[#065F46] font-semibold">ออนไลน์</span>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex-1 py-2.5 px-4 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white font-display text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <PenSquare className="w-4 h-4 text-blue-200" />
            <span>ตั้งคำถาม / แชร์ข้อสอบ</span>
          </button>

          <button
            onClick={fetchPosts}
            title="รีเฟรชข้อมูล"
            className="w-10 h-10 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#64748B] flex items-center justify-center transition-colors border border-[#E2E8F0]"
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Category Pills Filter */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {['ทั้งหมด', 'คณิตศาสตร์', 'ภาษาไทย', 'ภาษาอังกฤษ', 'กฎหมาย', 'สัมภาษณ์', 'คอมพิวเตอร์', 'ทั่วไป'].map(sub => (
            <button
              key={sub}
              onClick={() => setFilterSubject(sub)}
              className={`px-3 py-1 rounded-xl whitespace-nowrap text-[11px] font-display transition-all ${
                filterSubject === sub
                  ? 'bg-[#0F172A] text-white font-bold shadow-xs'
                  : 'bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B]'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-3">
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-[#CBD5E1] space-y-2">
            <MessageSquare className="w-10 h-10 text-[#94A3B8] mx-auto" />
            <div className="font-display font-bold text-[#334155] text-sm">ยังไม่มีคำถามในหมวดนี้</div>
            <p className="text-xs text-[#64748B]">เป็นคนแรกที่เริ่มตั้งคำถามหรือแชร์สรุปข้อสอบ!</p>
          </div>
        ) : (
          filteredPosts.map(post => {
            const isLiked = post.likedByMe;
            return (
              <div 
                key={post.id}
                className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-2xs space-y-3 animate-in fade-in duration-200"
              >
                {/* Author Info */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white font-display font-extrabold flex items-center justify-center text-sm shadow-xs">
                      {post.author ? post.author.substring(0, 1) : '?'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-display font-bold text-xs text-[#0F172A]">{post.author}</span>
                        <span className="text-[9px] bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] px-2 py-0.2 rounded font-semibold">
                          {post.subject}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#94A3B8] block mt-0.5">{post.time}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="text-[#94A3B8] hover:text-[#EF4444] p-1 transition-colors"
                    title="ลบคำถามนี้"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Content */}
                <p className="text-xs text-[#1E293B] leading-relaxed whitespace-pre-line font-normal">
                  {post.content}
                </p>

                {/* Optional Attached Image */}
                {post.image && (
                  <div className="rounded-xl overflow-hidden border border-[#E2E8F0] bg-[#F8FAFC] max-h-52">
                    <img 
                      src={post.image} 
                      alt="รูปภาพแนบ" 
                      className="w-full object-cover max-h-52"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                )}

                {/* Interaction Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] text-xs">
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all active:scale-95 ${
                      isLiked 
                        ? 'bg-[#FEF2F2] border-[#FECACA] text-[#DC2626] font-bold' 
                        : 'bg-[#F8FAFC] hover:bg-[#F1F5F9] border-[#E2E8F0] text-[#64748B]'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#EF4444] text-[#EF4444]' : ''}`} />
                    <span>ถูกใจ ({post.likes || 0})</span>
                  </button>

                  <button
                    onClick={() => handleSharePost(post)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0] transition-all active:scale-95"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>แชร์</span>
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Official Facebook Page Section */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold">
              f
            </div>
            <div>
              <h3 className="font-display font-bold text-[#0F172A] text-sm">เพจข่าวสาร & ข้อมูลติวสอบ</h3>
              <p className="text-[10px] text-[#64748B]">ข้อมูลเรียลไทม์จากศูนย์ติว</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] text-[#065F46] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0] font-bold">
            <Radio className="w-3 h-3 text-[#10B981] animate-pulse" /> LIVE
          </span>
        </div>

        <a
          href="https://www.facebook.com/s0ldier02/"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-3.5 bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE]/40 border border-[#BFDBFE] rounded-xl hover:bg-[#EFF6FF] transition-all text-xs text-[#1E3A8A] font-display flex items-center justify-between"
        >
          <div className="space-y-0.5">
            <div className="font-bold flex items-center gap-1.5">
              <span>ติดตามเพจ Facebook ศูนย์ติวทหาร-ตำรวจ</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#2563EB]" />
            </div>
            <div className="text-[10px] text-[#64748B] font-sans">อัปเดตวันรับสมัคร กำหนดการ และประกาศผลสอบอย่างเป็นทางการ</div>
          </div>
          <span className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors">
            ไปที่เพจ
          </span>
        </a>
      </div>

      {/* CREATE POST MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-2xl space-y-3 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold">
                  <PenSquare className="w-4 h-4" />
                </div>
                <h3 className="font-display font-bold text-[#0F172A] text-sm">ตั้งคำถาม / แชร์ข้อสอบ</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#334155] mb-1">ชื่อผู้โพสต์ / ยศจำลอง</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="เช่น นสต. สมชาย, นนส. เตรียมพร้อม"
                  required
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#334155] mb-1">หมวดวิชา</label>
                <select
                  value={postSubject}
                  onChange={(e) => setPostSubject(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#1E293B] focus:outline-none focus:border-[#2563EB] font-display"
                >
                  <option value="คณิตศาสตร์">📐 คณิตศาสตร์ / คำนวณ</option>
                  <option value="ภาษาไทย">📖 ภาษาไทย</option>
                  <option value="ภาษาอังกฤษ">🔤 ภาษาอังกฤษ</option>
                  <option value="กฎหมาย">⚖️ กฎหมาย</option>
                  <option value="สัมภาษณ์">🎖️ สอบสัมภาษณ์ / ท่าทาง</option>
                  <option value="คอมพิวเตอร์">💻 คอมพิวเตอร์</option>
                  <option value="ทั่วไป">💬 พูดคุยทั่วไป</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#334155] mb-1">เนื้อหาคำถาม / โจทย์ข้อสอบ</label>
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  rows={4}
                  placeholder="พิมพ์ข้อสอบ หรือคำถามที่ต้องการให้เพื่อนๆ หรือติวเตอร์ช่วยตอบ..."
                  required
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-[#1E293B] focus:outline-none focus:border-[#2563EB] leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#334155] mb-1">แนบลิงก์รูปภาพ (ตัวเลือก)</label>
                <input
                  type="url"
                  value={postImage}
                  onChange={(e) => setPostImage(e.target.value)}
                  placeholder="https://example.com/question.jpg"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] font-display font-semibold rounded-xl"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white font-display font-bold rounded-xl shadow-xs"
                >
                  โพสต์คำถาม
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
