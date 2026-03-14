import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronRight, ChevronLeft, Zap, BookOpen, Trophy, Users } from "lucide-react";
import supabase from "../../supabaseClient";

const DEGREES = [
  "Bachelor of Science",
  "Bachelor of Arts",
  "Bachelor of Engineering",
  "Bachelor of Commerce",
  "Bachelor of Laws",
  "Bachelor of Medicine",
  "Bachelor of Education",
  "Master's Degree",
  "PhD / Doctorate",
  "Diploma / Certificate",
];

const FIELDS = [
  "Computer Science & IT",
  "Engineering",
  "Business & Commerce",
  "Medicine & Health",
  "Law",
  "Arts & Humanities",
  "Science & Mathematics",
  "Education",
  "Psychology",
  "Architecture & Design",
];

const SUBJECTS_BY_FIELD: Record<string, string[]> = {
  "Computer Science & IT": ["Algorithms", "Web Development", "AI & Machine Learning", "Databases", "Cybersecurity", "Software Engineering", "Networks", "Data Science"],
  "Engineering": ["Mechanical Engineering", "Electrical Engineering", "Civil Engineering", "Chemical Engineering", "Aerospace", "Robotics", "Systems Engineering"],
  "Business & Commerce": ["Accounting", "Finance", "Marketing", "Management", "Economics", "Entrepreneurship", "Business Analytics", "Supply Chain"],
  "Medicine & Health": ["Anatomy", "Physiology", "Pharmacology", "Pathology", "Nursing", "Public Health", "Biochemistry", "Clinical Practice"],
  "Law": ["Criminal Law", "Contract Law", "Constitutional Law", "International Law", "Corporate Law", "Human Rights", "Property Law"],
  "Arts & Humanities": ["History", "Philosophy", "Literature", "Linguistics", "Media Studies", "Cultural Studies", "Fine Arts", "Music"],
  "Science & Mathematics": ["Calculus", "Statistics", "Physics", "Chemistry", "Biology", "Ecology", "Genetics", "Astrophysics"],
  "Education": ["Pedagogy", "Curriculum Design", "Early Childhood", "Special Education", "Educational Psychology", "STEM Education"],
  "Psychology": ["Cognitive Psychology", "Clinical Psychology", "Neuroscience", "Developmental Psychology", "Social Psychology", "Research Methods"],
  "Architecture & Design": ["Urban Planning", "Interior Design", "Structural Design", "Landscape Architecture", "Graphic Design", "Industrial Design"],
};

export function LandingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"hero" | "signup">("hero");
  const [signupStep, setSignupStep] = useState(0);
  const [selectedDegree, setSelectedDegree] = useState("");
  const [selectedField, setSelectedField] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : prev.length < 6 ? [...prev, subject] : prev
    );
  };

  const handleFinish = async () => {
    if (!username) return;
    setSaving(true);
    try {
      await supabase.from("profile_changes").insert({
        user_id: username,
        field_changed: "signup",
        old_value: "",
        new_value: JSON.stringify({ degree: selectedDegree, field: selectedField, subjects: selectedSubjects }),
      });
    } catch (err) {
      console.error("Supabase insert failed:", err);
    } finally {
      setSaving(false);
      navigate("/login");
    }
  };

  const subjects = SUBJECTS_BY_FIELD[selectedField] || [];

  return (
    <div className="min-h-screen bg-[#050d1a] text-white overflow-x-hidden">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {step === "hero" && (
        <div className="relative min-h-screen flex flex-col">
          <nav className="flex items-center justify-between px-8 py-6">
            <div className="text-cyan-400 font-bold text-xl tracking-widest uppercase">
              ⚡ Study Leveling
            </div>
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-cyan-400/70 hover:text-cyan-400 border border-cyan-400/30 hover:border-cyan-400 px-4 py-2 rounded transition-all"
            >
              Login
            </button>
          </nav>

          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/30 rounded-full px-4 py-1.5 text-cyan-400 text-xs tracking-widest uppercase mb-8">
              <Zap className="w-3 h-3" /> Level Up Your Academic Life
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none tracking-tight">
              <span className="text-white">STUDY</span>
              <br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #22d3ee, #3b82f6, #22d3ee)" }}>
                LEVELING
              </span>
            </h1>

            <p className="text-slate-400 text-lg max-w-xl mb-12 leading-relaxed">
              Transform your university experience into an RPG. Track XP, earn ranks, complete quests, and rise to the top of the leaderboard.
            </p>

            <button onClick={() => setStep("signup")} className="relative group mb-16">
              <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-40 group-hover:opacity-70 transition-opacity rounded-lg" />
              <div className="relative bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 px-10 rounded-lg border border-cyan-400 text-lg flex items-center gap-3 hover:scale-105 transition-transform">
                Start Your Journey
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full">
              {[
                { icon: <Zap className="w-6 h-6" />, title: "Earn XP", desc: "Complete tasks and assignments to gain experience points" },
                { icon: <Trophy className="w-6 h-6" />, title: "Rank Up", desc: "Rise through the ranks from Bronze to Legend" },
                { icon: <Users className="w-6 h-6" />, title: "Compete", desc: "See how you stack up on the global leaderboard" },
              ].map((f, i) => (
                <div key={i} className="bg-blue-900/20 border border-cyan-400/20 rounded-xl p-6 text-left hover:border-cyan-400/40 transition-colors">
                  <div className="text-cyan-400 mb-3">{f.icon}</div>
                  <div className="font-bold text-white mb-1">{f.title}</div>
                  <div className="text-slate-400 text-sm">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === "signup" && (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-xl mb-8">
            <div className="flex justify-between text-xs text-cyan-400/60 mb-2">
              <span>Step {signupStep + 1} of 4</span>
              <span>{Math.round(((signupStep + 1) / 4) * 100)}%</span>
            </div>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${((signupStep + 1) / 4) * 100}%` }}
              />
            </div>
          </div>

          <div className="relative w-full max-w-xl bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-blue-900/40 backdrop-blur-sm border border-cyan-400/30 rounded-2xl p-8" style={{ boxShadow: "0 0 40px rgba(34,211,238,0.1)" }}>
            {signupStep === 0 && (
              <div>
                <BookOpen className="w-10 h-10 text-cyan-400 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">What's your name?</h2>
                <p className="text-slate-400 text-sm mb-6">This will be your player name in the system.</p>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full bg-slate-800/50 border border-cyan-400/30 focus:border-cyan-400 rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none transition-all mb-6"
                />
                <button
                  onClick={() => username && setSignupStep(1)}
                  disabled={!username}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-30 hover:scale-105 transition-transform"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {signupStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">What's your degree?</h2>
                <p className="text-slate-400 text-sm mb-6">Select the type of degree you're studying.</p>
                <div className="grid grid-cols-2 gap-3 mb-6 max-h-72 overflow-y-auto pr-1">
                  {DEGREES.map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDegree(d)}
                      className={`text-left px-4 py-3 rounded-lg border text-sm transition-all ${selectedDegree === d ? "bg-cyan-500/20 border-cyan-400 text-cyan-300" : "bg-slate-800/40 border-slate-700 text-slate-300 hover:border-cyan-400/50"}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setSignupStep(0)} className="px-4 py-3 border border-slate-700 rounded-lg text-slate-400 hover:border-cyan-400/50 transition-all">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => selectedDegree && setSignupStep(2)}
                    disabled={!selectedDegree}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-30 hover:scale-105 transition-transform"
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {signupStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Field of Study</h2>
                <p className="text-slate-400 text-sm mb-6">What area are you specialising in?</p>
                <div className="grid grid-cols-2 gap-3 mb-6 max-h-72 overflow-y-auto pr-1">
                  {FIELDS.map((f) => (
                    <button
                      key={f}
                      onClick={() => { setSelectedField(f); setSelectedSubjects([]); }}
                      className={`text-left px-4 py-3 rounded-lg border text-sm transition-all ${selectedField === f ? "bg-cyan-500/20 border-cyan-400 text-cyan-300" : "bg-slate-800/40 border-slate-700 text-slate-300 hover:border-cyan-400/50"}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setSignupStep(1)} className="px-4 py-3 border border-slate-700 rounded-lg text-slate-400 hover:border-cyan-400/50 transition-all">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => selectedField && setSignupStep(3)}
                    disabled={!selectedField}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-30 hover:scale-105 transition-transform"
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {signupStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Your Subjects</h2>
                <p className="text-slate-400 text-sm mb-1">Pick up to 6 subjects you're currently studying.</p>
                <p className="text-cyan-400/60 text-xs mb-6">{selectedSubjects.length}/6 selected</p>
                <div className="grid grid-cols-2 gap-3 mb-6 max-h-64 overflow-y-auto pr-1">
                  {subjects.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleSubject(s)}
                      className={`text-left px-4 py-3 rounded-lg border text-sm transition-all ${selectedSubjects.includes(s) ? "bg-cyan-500/20 border-cyan-400 text-cyan-300" : "bg-slate-800/40 border-slate-700 text-slate-300 hover:border-cyan-400/50"} ${!selectedSubjects.includes(s) && selectedSubjects.length >= 6 ? "opacity-40 cursor-not-allowed" : ""}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setSignupStep(2)} className="px-4 py-3 border border-slate-700 rounded-lg text-slate-400 hover:border-cyan-400/50 transition-all">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleFinish}
                    disabled={selectedSubjects.length === 0 || saving}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-30 hover:scale-105 transition-transform"
                  >
                    {saving ? "Saving..." : "Enter the Portal ⚡"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}