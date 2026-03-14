import { useState } from "react";
import { CharacterModal } from "./CharacterModal";
import { BookOpen, Award, ExternalLink, Target, Pencil, Check, X } from "lucide-react";
import characterImg from "../../assets/characterPlaceholder";
import { useUser } from "../contexts/UserContext";

export function StudentProfile() {
  const { profile, updateProfile } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<"degree" | "fieldOfStudy" | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);

  const xp = profile?.xp ?? 0;
  const level = profile?.level ?? 1;
  const name = profile?.name || "Hunter";
  const degree = profile?.degree || "Click to set your degree";
  const fieldOfStudy = profile?.field_of_study || "Click to set your field of study";
  const xpForCurrentLevel = (level - 1) * 500;
  const xpForNextLevel = level * 500;
  const xpProgress = xp - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const xpPercent = Math.min((xpProgress / xpNeeded) * 100, 100);

  const startEdit = (field: "degree" | "fieldOfStudy") => {
    setEditingField(field);
    setEditValue(field === "degree" ? (profile?.degree || "") : (profile?.field_of_study || ""));
  };

  const saveEdit = async () => {
    if (!editingField) return;
    setSaving(true);
    await updateProfile(editingField === "degree" ? { degree: editValue.trim() } : { field_of_study: editValue.trim() });
    setSaving(false);
    setEditingField(null);
  };

  const units = [
    { code: "FIT2004", name: "Algorithms and Data Structures", grade: "A", links: [{ name: "Ed", url: "https://edstem.org" }, { name: "Moodle", url: "https://moodle.vle.monash.edu" }] },
    { code: "FIT3170", name: "Software Engineering Practice", grade: "A+", links: [{ name: "Ed", url: "https://edstem.org" }, { name: "Moodle", url: "https://moodle.vle.monash.edu" }] },
    { code: "FIT3171", name: "Databases", grade: "A", links: [{ name: "Ed", url: "https://edstem.org" }, { name: "OnTrack", url: "https://ontrack.deakin.edu.au" }] },
    { code: "FIT3152", name: "Data Analytics", grade: "A-", links: [{ name: "Moodle", url: "https://moodle.vle.monash.edu" }, { name: "OnTrack", url: "https://ontrack.deakin.edu.au" }] },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="relative mb-8">
        <div className="relative bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-blue-900/40 backdrop-blur-sm border-2 overflow-hidden"
          style={{
            clipPath: 'polygon(0 20px, 20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px))',
            borderImage: 'linear-gradient(135deg, #60a5fa, #3b82f6, #2563eb, #60a5fa) 1',
            boxShadow: '0 0 40px rgba(59, 130, 246, 0.3), inset 0 0 60px rgba(59, 130, 246, 0.1)'
          }}>
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>

          <div className="relative p-8">
            <div className="flex items-center gap-8">
              <div className="flex-shrink-0">
                <button onClick={() => setIsModalOpen(true)} className="relative group cursor-pointer transition-transform hover:scale-105">
                  <div className="absolute inset-0 bg-cyan-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-36 h-36 rounded-full border-4 border-cyan-400/50 group-hover:border-cyan-400 overflow-hidden bg-slate-900 transition-all flex items-center justify-center">
                    <img src={characterImg} alt={name} className="w-full h-full" style={{ imageRendering: 'pixelated', objectFit: 'contain' }} />
                    <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/20 transition-colors flex items-center justify-center">
                      <span className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity text-sm">View Stats</span>
                    </div>
                  </div>
                  <div className="absolute -top-2 -left-2 w-5 h-5 border-t-2 border-l-2 border-cyan-400"></div>
                  <div className="absolute -top-2 -right-2 w-5 h-5 border-t-2 border-r-2 border-cyan-400"></div>
                  <div className="absolute -bottom-2 -left-2 w-5 h-5 border-b-2 border-l-2 border-cyan-400"></div>
                  <div className="absolute -bottom-2 -right-2 w-5 h-5 border-b-2 border-r-2 border-cyan-400"></div>
                </button>
              </div>

              <div className="flex-1 space-y-2 text-white">
                <h2 className="text-3xl font-bold">{name}</h2>
                <p className="text-slate-400 text-sm">{profile?.email || ""}</p>

                {/* Degree (editable) */}
                <div className="flex items-center gap-2 mt-1">
                  {editingField === "degree" ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input className="flex-1 bg-slate-800/50 border border-cyan-400/50 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-cyan-400"
                        value={editValue} onChange={e => setEditValue(e.target.value)}
                        placeholder="e.g. Bachelor of Computer Science" autoFocus
                        onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditingField(null); }} />
                      <button onClick={saveEdit} disabled={saving} className="p-1.5 bg-green-500/20 border border-green-400/30 rounded text-green-400 hover:bg-green-500/30 transition-all"><Check className="w-4 h-4" /></button>
                      <button onClick={() => setEditingField(null)} className="p-1.5 bg-red-500/20 border border-red-400/30 rounded text-red-400"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <>
                      <span className="text-cyan-400 text-sm font-mono">{degree}</span>
                      <button onClick={() => startEdit("degree")} className="p-1 text-slate-500 hover:text-cyan-400 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                    </>
                  )}
                </div>

                {/* Field of Study (editable) */}
                <div className="flex items-center gap-2">
                  {editingField === "fieldOfStudy" ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input className="flex-1 bg-slate-800/50 border border-cyan-400/50 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-cyan-400"
                        value={editValue} onChange={e => setEditValue(e.target.value)}
                        placeholder="e.g. Artificial Intelligence" autoFocus
                        onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditingField(null); }} />
                      <button onClick={saveEdit} disabled={saving} className="p-1.5 bg-green-500/20 border border-green-400/30 rounded text-green-400 hover:bg-green-500/30 transition-all"><Check className="w-4 h-4" /></button>
                      <button onClick={() => setEditingField(null)} className="p-1.5 bg-red-500/20 border border-red-400/30 rounded text-red-400"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <>
                      <span className="text-slate-300 text-sm flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-blue-400" />{fieldOfStudy}</span>
                      <button onClick={() => startEdit("fieldOfStudy")} className="p-1 text-slate-500 hover:text-cyan-400 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                    </>
                  )}
                </div>
              </div>

              <div className="hidden lg:flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-lg bg-cyan-500/10 border-2 border-cyan-400/40 flex flex-col items-center justify-center">
                  <p className="text-[10px] text-cyan-400/70 uppercase tracking-widest">Level</p>
                  <p className="text-3xl font-bold text-white">{level}</p>
                </div>
                <p className="text-xs text-cyan-400 font-mono">{xp.toLocaleString()} XP</p>
              </div>
            </div>

            {/* XP Bar */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between items-center text-xs text-cyan-400">
                <span className="font-semibold tracking-wider uppercase">Experience — Level {level}</span>
                <span className="font-mono">{xpProgress.toLocaleString()} / {xpNeeded.toLocaleString()} XP to next level</span>
              </div>
              <div className="relative h-3 bg-slate-800/50 rounded-full overflow-hidden border border-cyan-400/30">
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700" style={{ width: `${xpPercent}%` }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2"><div className="w-1 h-6 bg-blue-500 rounded"></div>Academic Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between"><span className="text-slate-400">GPA</span><span className="text-2xl font-bold text-cyan-400">3.95</span></div>
              <div className="flex items-center justify-between"><span className="text-slate-400">Total XP</span><span className="text-lg font-bold text-yellow-400">{xp.toLocaleString()}</span></div>
              <div className="flex items-center justify-between"><span className="text-slate-400">Level</span><span className="text-lg font-bold text-white">{level}</span></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2"><div className="w-1 h-6 bg-blue-500 rounded"></div>Current Units</h2>
            <div className="space-y-3">
              {units.map((unit, i) => (
                <div key={i} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50 hover:border-blue-500/50 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <BookOpen className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-cyan-400 font-mono text-sm font-semibold">{unit.code}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${unit.grade.startsWith('A') ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>{unit.grade}</span>
                      </div>
                      <span className="text-slate-200 text-sm">{unit.name}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-8">
                    {unit.links.map((link, li) => (
                      <a key={li} href={link.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 hover:border-cyan-400 text-cyan-400 rounded text-xs font-semibold transition-all">
                        {link.name}<ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2"><div className="w-1 h-6 bg-blue-500 rounded"></div>Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["National Merit Scholar Finalist", "Science Olympiad Gold Medalist", "Programming Competition Winner"].map((a, i) => (
                <div key={i} className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  <Award className="w-6 h-6 text-yellow-400 mb-2" />
                  <div className="text-sm text-slate-200">{a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <CharacterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} characterImage={characterImg} characterName={name} />
    </div>
  );
}