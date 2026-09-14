import React, { useState } from "react";
import { X, BookOpen, Search, CheckCircle, Plus, Sparkles, Layers } from "lucide-react";
import { WIKI_PLAYBOOKS } from "../data/wikiKnowledge";

export default function WikiModal({ isOpen, onClose }) {
  const [selectedPlaybook, setSelectedPlaybook] = useState(WIKI_PLAYBOOKS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [customNotes, setCustomNotes] = useState(() => {
    return JSON.parse(localStorage.getItem("user_wiki_notes") || "[]");
  });
  const [newNote, setNewNote] = useState("");

  if (!isOpen) return null;

  const filteredPlaybooks = WIKI_PLAYBOOKS.filter(p => 
    p.title.includes(searchQuery) || p.subtitle.includes(searchQuery) || p.content.includes(searchQuery)
  );

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const updated = [...customNotes, { id: Date.now(), text: newNote.trim(), date: new Date().toLocaleDateString("fa-IR") }];
    setCustomNotes(updated);
    localStorage.setItem("user_wiki_notes", JSON.stringify(updated));
    setNewNote("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 text-white">
      <div className="relative w-full max-w-5xl bg-[#08080a] border border-white/20 rounded-3xl shadow-glass overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 hairline-b bg-black/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 text-white border border-white/20 shadow-white-subtle">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white tracking-tight">
                پایگاه دانش بازاریابی و تصمیم‌گیری راهبردی (۱۶۵ منبع)
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                پلی‌بوک‌ها و شواهد دانشگاهی جهت استخراج راهکارهای عملیاتی و دقیق
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white obsidian-card obsidian-card-hover rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 hairline-b bg-black/80 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute right-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در فریم‌ورک‌های قیمت‌گذاری، کانال‌ها، کهن‌الگوها، جایگاه‌یابی و بافتار کسب‌وکار..."
              className="w-full bg-[#0d0d12] border border-white/15 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-sans"
            />
          </div>
        </div>

        {/* Content Body: Sidebar + Main Viewer */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Sidebar Tabs */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-l border-white/[0.08] overflow-y-auto p-3 space-y-2 bg-black/40">
            {filteredPlaybooks.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedPlaybook(item)}
                className={`w-full text-right p-3.5 rounded-xl border text-xs transition-all flex flex-col gap-1.5 ${
                  selectedPlaybook?.id === item.id
                    ? "bg-[#14141a] border-blue-500/80 text-white font-bold ring-1 ring-blue-500/30 shadow-cobalt-sm"
                    : "obsidian-surface text-zinc-400 hover:text-zinc-200 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white truncate">{item.title}</span>
                  <span className="text-[10px] text-blue-300 bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 rounded-full font-mono">
                    {item.category}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 line-clamp-1 leading-relaxed">
                  {item.subtitle}
                </span>
              </button>
            ))}
          </div>

          {/* Main Playbook Content */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-[#08080a]">
            {selectedPlaybook ? (
              <div className="space-y-5">
                <div className="hairline-b pb-5">
                  <span className="text-[11px] text-blue-300 bg-blue-500/15 border border-blue-500/30 px-3 py-1 rounded-full font-mono mb-2.5 inline-block">
                    {selectedPlaybook.category}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    {selectedPlaybook.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 font-mono">
                    {selectedPlaybook.subtitle}
                  </p>
                </div>

                <div className="prose prose-invert prose-xs sm:prose-sm max-w-none text-zinc-200 leading-relaxed space-y-3.5">
                  {selectedPlaybook.content.split("\n\n").map((para, i) => (
                    <div key={i} className="p-4 rounded-xl obsidian-card space-y-2">
                      <p className="whitespace-pre-line text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans">
                        {para}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-zinc-500 font-mono text-xs">
                یک پلی‌بوک راهبردی را از منوی سمت راست انتخاب فرمایید.
              </div>
            )}

            {/* Custom Notes Section */}
            <div className="mt-8 pt-6 hairline-t">
              <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>یادداشت‌ها و تجارب کاربردی کسب‌وکار شما:</span>
              </h4>

              <form onSubmit={handleAddNote} className="flex gap-2.5 mb-4">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="نکته یا مثال اختصاصی کسب‌وکار خود را اضافه کنید..."
                  className="flex-1 bg-black border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-sans"
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-white text-black hover:bg-zinc-200 font-black text-xs rounded-xl flex items-center gap-1 shrink-0 shadow-white-subtle transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ثبت</span>
                </button>
              </form>

              <div className="space-y-2">
                {customNotes.map((note) => (
                  <div key={note.id} className="p-3 rounded-xl obsidian-card text-xs text-zinc-300 flex justify-between items-center">
                    <span>{note.text}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{note.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
