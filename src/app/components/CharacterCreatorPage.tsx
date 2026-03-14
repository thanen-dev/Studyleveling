import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight, Check, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useCharacter } from "../contexts/CharacterContext";
import supabase from "../../supabaseClient";

interface OutfitVariation {
  shirtColor: string;
  pantsColor: string;
  name: string;
}

const outfitVariations: OutfitVariation[] = [
  { shirtColor: '#FFFFFF', pantsColor: '#3B82F6', name: 'Classic' },
  { shirtColor: '#EF4444', pantsColor: '#1F2937', name: 'Bold Red' },
  { shirtColor: '#22C55E', pantsColor: '#92400E', name: 'Forest' },
  { shirtColor: '#A855F7', pantsColor: '#334155', name: 'Royal' },
  { shirtColor: '#F59E0B', pantsColor: '#065F46', name: 'Autumn' },
];

type Stage = "welcome" | "signup" | "avatar" | "complete";

export function CharacterCreatorPage() {
  const navigate = useNavigate();
  const { setCharacterData } = useCharacter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stage, setStage] = useState<Stage>("welcome");
  const [animateFadeOut, setAnimateFadeOut] = useState(false);

  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "", degree: "", fieldOfStudy: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupLoading, setSignupLoading] = useState(false);

  const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);
  const [hasChangedOutfit, setHasChangedOutfit] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [walkFrame, setWalkFrame] = useState(0);
  const [walkingOut, setWalkingOut] = useState(false);
  const [walkPos, setWalkPos] = useState(50);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const scale = 27;
    const outfit = outfitVariations[currentOutfitIndex];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    const legOffset = (walkFrame === 1 || walkFrame === 3) ? 1 : 0;
    ctx.fillStyle = '#FFDBAC'; ctx.fillRect(7*scale, 2*scale, 2*scale, 2*scale);
    ctx.fillStyle = '#4A3728'; ctx.fillRect(7*scale, 2*scale, 2*scale, 1*scale);
    ctx.fillStyle = '#000000';
    ctx.fillRect(7*scale, 3*scale, 0.5*scale, 0.5*scale);
    ctx.fillRect(8.5*scale, 3*scale, 0.5*scale, 0.5*scale);
    ctx.fillStyle = outfit.shirtColor;
    ctx.fillRect(6*scale, 4*scale, 4*scale, 3*scale);
    ctx.fillRect(5*scale, 4*scale, 1*scale, 2*scale);
    ctx.fillRect(10*scale, 4*scale, 1*scale, 2*scale);
    ctx.fillStyle = '#FFDBAC';
    ctx.fillRect(5*scale, 6*scale, 1*scale, 1*scale);
    ctx.fillRect(10*scale, 6*scale, 1*scale, 1*scale);
    ctx.fillStyle = outfit.pantsColor;
    ctx.fillRect(6*scale, 7*scale, 4*scale, 3*scale);
    if (legOffset === 0) {
      ctx.fillRect(6.5*scale, 10*scale, 1.5*scale, 2*scale);
      ctx.fillRect(8*scale, 10*scale, 1.5*scale, 2*scale);
    } else {
      ctx.fillRect(6.5*scale, 10*scale, 1.5*scale, 2*scale);
      ctx.fillRect(8*scale, 10.5*scale, 1.5*scale, 1.5*scale);
    }
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(6.5*scale, 11.5*scale, 1.5*scale, 0.5*scale);
    ctx.fillRect(8*scale, 11.5*scale, 1.5*scale, 0.5*scale);
  }, [walkFrame, currentOutfitIndex]);

  useEffect(() => {
    if (walkingOut) {
      const fi = setInterval(() => setWalkFrame(p => (p+1)%4), 200);
      return () => clearInterval(fi);
    }
  }, [walkingOut]);

  useEffect(() => {
    if (walkingOut) {
      const mi = setInterval(() => {
        setWalkPos(p => {
          if (p >= 150) { clearInterval(mi); setStage("complete"); return p; }
          return p + 1.5;
        });
      }, 30);
      return () => clearInterval(mi);
    }
  }, [walkingOut]);

  const goToNextStage = (next: Stage) => {
    setAnimateFadeOut(true);
    setTimeout(() => { setStage(next); setAnimateFadeOut(false); }, 400);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    if (!formData.name.trim()) { setSignupError("Please enter your name."); return; }
    if (formData.password.length < 6) { setSignupError("Password must be at least 6 characters."); return; }
    if (formData.password !== formData.confirmPassword) { setSignupError("Passwords don't match."); return; }
    if (!formData.degree.trim()) { setSignupError("Please enter your degree."); return; }
    if (!formData.fieldOfStudy.trim()) { setSignupError("Please enter your field of study."); return; }

    setSignupLoading(true);
    const { data, error: authError } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.password,
      options: { data: { name: formData.name.trim() } },
    });

    if (authError) {
      setSignupError(authError.message.includes("already registered")
        ? "This email is already registered. Please log in instead."
        : authError.message);
      setSignupLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        name: formData.name.trim(),
        degree: formData.degree.trim(),
        field_of_study: formData.fieldOfStudy.trim(),
        xp: 0,
        level: 1,
      });
    }

    setSignupLoading(false);
    goToNextStage("avatar");
  };

  const handleConfirmAvatar = () => {
    setIsConfirmed(true);
    setCharacterData({ skinColor: '#FFDBAC', hairColor: '#4A3728', eyeColor: '#000000', outfit: outfitVariations[currentOutfitIndex] });
    setIsZooming(true);
    setTimeout(() => setIsZooming(false), 600);
    setTimeout(() => setWalkingOut(true), 1500);
  };

  const updateField = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(p => ({ ...p, [field]: e.target.value }));
    setSignupError(null);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)`, backgroundSize: '50px 50px' }}></div>

      {/* Welcome */}
      {stage === "welcome" && (
        <div className={`absolute inset-0 z-40 flex items-center justify-center cursor-pointer transition-opacity duration-400 ${animateFadeOut ? 'opacity-0' : 'opacity-100'}`} onClick={() => goToNextStage("signup")}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
          <div className="relative z-50 text-center px-8 animate-in fade-in duration-700">
            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-[0_0_30px_rgba(34,211,238,0.8)]">It looks like it's your first time here!</h1>
            <p className="text-2xl text-cyan-400 animate-pulse">Click anywhere to create your account</p>
          </div>
        </div>
      )}

      {/* Signup Form */}
      {stage === "signup" && (
        <div className={`absolute inset-0 z-40 flex items-center justify-center transition-opacity duration-400 ${animateFadeOut ? 'opacity-0' : 'opacity-100'}`}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
          <div className="relative z-50 animate-in zoom-in duration-500 w-full max-w-lg mx-4">
            <div className="relative bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-slate-900/95 backdrop-blur-sm border-2 p-8 overflow-hidden"
              style={{ clipPath: 'polygon(0 20px, 20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px))', borderImage: 'linear-gradient(135deg, #60a5fa, #3b82f6, #2563eb, #60a5fa) 1', boxShadow: '0 0 60px rgba(59, 130, 246, 0.5), inset 0 0 80px rgba(59, 130, 246, 0.2)' }}>
              <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-cyan-400"></div>
              <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-cyan-400"></div>
              <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-cyan-400"></div>
              <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-cyan-400"></div>

              <h2 className="text-3xl font-bold text-center mb-6 text-white drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">CREATE ACCOUNT</h2>

              {signupError && (
                <div className="mb-4 flex items-start gap-2 p-3 bg-red-500/10 border border-red-400/30 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm">{signupError}</p>
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-cyan-400 text-xs font-bold mb-1 uppercase tracking-wider">Display Name</label>
                  <input className="w-full bg-slate-800/50 border-2 border-cyan-500/50 rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                    type="text" placeholder="e.g. Kael" required value={formData.name} onChange={updateField('name')} />
                </div>

                <div>
                  <label className="block text-cyan-400 text-xs font-bold mb-1 uppercase tracking-wider">Email</label>
                  <input className="w-full bg-slate-800/50 border-2 border-cyan-500/50 rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                    type="email" placeholder="your@email.com" required value={formData.email} onChange={updateField('email')} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-cyan-400 text-xs font-bold mb-1 uppercase tracking-wider">Password</label>
                    <div className="relative">
                      <input className="w-full bg-slate-800/50 border-2 border-cyan-500/50 rounded px-4 py-2.5 pr-10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                        type={showPassword ? "text" : "password"} placeholder="min 6 chars" required value={formData.password} onChange={updateField('password')} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-cyan-400 text-xs font-bold mb-1 uppercase tracking-wider">Confirm</label>
                    <input className="w-full bg-slate-800/50 border-2 border-cyan-500/50 rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                      type={showPassword ? "text" : "password"} placeholder="repeat" required value={formData.confirmPassword} onChange={updateField('confirmPassword')} />
                  </div>
                </div>

                <div>
                  <label className="block text-cyan-400 text-xs font-bold mb-1 uppercase tracking-wider">Degree</label>
                  <input className="w-full bg-slate-800/50 border-2 border-cyan-500/50 rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                    type="text" placeholder="e.g. Bachelor of Computer Science" required value={formData.degree} onChange={updateField('degree')} />
                </div>

                <div>
                  <label className="block text-cyan-400 text-xs font-bold mb-1 uppercase tracking-wider">Field of Study</label>
                  <input className="w-full bg-slate-800/50 border-2 border-cyan-500/50 rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                    type="text" placeholder="e.g. Artificial Intelligence & Cybersecurity" required value={formData.fieldOfStudy} onChange={updateField('fieldOfStudy')} />
                </div>

                <button type="submit" disabled={signupLoading} className="relative group w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-12 rounded-lg border-2 border-cyan-400 hover:border-cyan-300 transition-all">
                    {signupLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Creating account...
                      </span>
                    ) : "CREATE ACCOUNT & CHOOSE AVATAR →"}
                  </div>
                </button>

                <p className="text-center text-slate-400 text-xs">
                  Already have an account?{" "}
                  <button type="button" onClick={() => navigate('/login')} className="text-cyan-400 hover:underline">Sign in</button>
                </p>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Stage */}
      {stage === "avatar" && (
        <>
          <div className="fixed top-1/2 z-50"
            style={{
              left: walkingOut ? `${walkPos}vw` : '50%',
              transform: `translate(-50%, -50%) scale(${isZooming ? 1.1 : 1})`,
              transition: walkingOut ? 'left 0.03s linear, transform 150ms' : 'transform 150ms',
              marginTop: '30px',
            }}>
            <div className="flex flex-col items-center">
              <canvas ref={canvasRef} width={432} height={432} />
              <div className="w-64 h-8 mt-4 bg-black/30 rounded-full blur-md"></div>
            </div>
          </div>

          {/* Outfit label */}
          {!isConfirmed && (
            <div className="fixed top-[calc(50%-260px)] left-1/2 -translate-x-1/2 z-50">
              <div className="bg-slate-800/80 border border-cyan-400/40 rounded-lg px-4 py-2 text-center">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Outfit</p>
                <p className="text-cyan-400 font-semibold">{outfitVariations[currentOutfitIndex].name}</p>
              </div>
            </div>
          )}

          {!isConfirmed && (
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none" style={{ width: '900px', height: '432px' }}>
              <div className="absolute top-1/2 -translate-y-1/2 left-0 pointer-events-auto">
                <button onClick={() => { setCurrentOutfitIndex(p => (p-1+outfitVariations.length)%outfitVariations.length); setHasChangedOutfit(true); setIsZooming(true); setTimeout(() => setIsZooming(false), 300); }}
                  className="bg-slate-800/80 border-2 border-cyan-400/50 hover:border-cyan-400 rounded-lg p-4 transition-all">
                  <ChevronLeft className="w-12 h-12 text-cyan-400" />
                </button>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-0 pointer-events-auto">
                <button onClick={() => { setCurrentOutfitIndex(p => (p+1)%outfitVariations.length); setHasChangedOutfit(true); setIsZooming(true); setTimeout(() => setIsZooming(false), 300); }}
                  className="bg-slate-800/80 border-2 border-cyan-400/50 hover:border-cyan-400 rounded-lg p-4 transition-all">
                  <ChevronRight className="w-12 h-12 text-cyan-400" />
                </button>
              </div>
            </div>
          )}

          {!isConfirmed && !hasChangedOutfit && (
            <div className="fixed top-[calc(50%+280px)] left-1/2 -translate-x-1/2 z-50">
              <p className="text-cyan-400/70 text-sm animate-pulse">← Use arrows to choose your outfit →</p>
            </div>
          )}

          {hasChangedOutfit && !isConfirmed && (
            <div className="fixed left-1/2 -translate-x-1/2 z-50" style={{ top: 'calc(50% + 270px)' }}>
              <button onClick={handleConfirmAvatar} className="relative group">
                <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-8 rounded-lg border-2 border-cyan-400 hover:border-cyan-300 transition-all hover:scale-110 active:scale-95">
                  <span className="flex items-center gap-2"><Check className="w-5 h-5" /> Confirm Avatar</span>
                </div>
              </button>
            </div>
          )}
        </>
      )}

      {/* Complete Stage */}
      {stage === "complete" && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 animate-in zoom-in duration-500">
          <div className="relative bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-blue-900/90 backdrop-blur-sm border-2 overflow-hidden"
            style={{ clipPath: 'polygon(0 20px, 20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px))', borderImage: 'linear-gradient(135deg, #60a5fa, #3b82f6, #2563eb, #60a5fa) 1', boxShadow: '0 0 60px rgba(59, 130, 246, 0.5)' }}>
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>
            <div className="relative p-12 text-center">
              <div className="mb-8">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-green-500 blur-2xl opacity-50 animate-pulse"></div>
                  <Check className="relative w-20 h-20 text-green-400" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">Welcome, {formData.name || "Hunter"}!</h2>
                <p className="text-cyan-400 text-lg">Your account and avatar are ready.</p>
                <p className="text-slate-400 text-sm mt-2">Check your email to confirm your account, then sign in to begin.</p>
              </div>
              <button onClick={() => navigate('/login')} className="relative group">
                <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-4 px-8 rounded-lg border-2 border-cyan-400 hover:border-cyan-300 transition-all">
                  Go to Login
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}