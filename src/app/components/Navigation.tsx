import { useNavigate, useLocation } from "react-router";
import { Home, LogIn, Bell, MessageCircle, ArrowLeft, LogOut } from "lucide-react";
import characterImg from "../../assets/characterPlaceholder";
import { useState } from "react";
import { useUser } from "../contexts/UserContext";

interface NavigationProps {
  isLoggedIn: boolean;
  onLogout?: () => void;
}

export function Navigation({ isLoggedIn, onLogout }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useUser();
  const [unreadNotifications] = useState(3);
  const [unreadMessages] = useState(2);

  const handleLogout = () => {
    if (onLogout) onLogout();
  };

  const showBackButton = isLoggedIn && location.pathname !== '/portal' && location.pathname !== '/login' && location.pathname !== '/';

  return (
    <div className="w-full bg-slate-900/50 backdrop-blur-sm border-b border-cyan-400/30">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {isLoggedIn && (
              <button onClick={() => navigate('/portal')} className="relative w-12 h-12 rounded-full border-2 border-cyan-400/50 overflow-hidden bg-slate-900 flex-shrink-0 hover:border-cyan-400 transition-all">
                <div className="absolute inset-0 bg-cyan-500/20 blur-sm"></div>
                <img src={characterImg} alt="Character" className="relative w-full h-full" style={{ imageRendering: 'pixelated', objectFit: 'contain' }} />
              </button>
            )}

            <button onClick={() => navigate(isLoggedIn ? '/portal' : '/')} className="flex flex-col cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-50"></div>
                <h1 className="relative text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-wider">
                  STUDY LEVELING
                </h1>
              </div>
              {isLoggedIn && profile?.name && (
                <p className="text-xs text-cyan-400/60 tracking-wider">
                  {profile.name} · Level {profile.level} · {profile.xp.toLocaleString()} XP
                </p>
              )}
            </button>

            {isLoggedIn && (
              <div className="flex items-center gap-2 ml-4">
                <button onClick={() => navigate('/notifications')}
                  className="relative p-2.5 rounded-lg border border-cyan-400/30 bg-slate-800/50 hover:border-cyan-400 hover:bg-slate-800/80 transition-all">
                  <Bell className="w-5 h-5 text-cyan-400" />
                  {unreadNotifications > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{unreadNotifications}</span>
                    </div>
                  )}
                </button>

                <button onClick={() => navigate('/social')}
                  className="relative p-2.5 rounded-lg border border-cyan-400/30 bg-slate-800/50 hover:border-cyan-400 hover:bg-slate-800/80 transition-all">
                  <MessageCircle className="w-5 h-5 text-cyan-400" />
                  {unreadMessages > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{unreadMessages}</span>
                    </div>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button onClick={() => navigate('/portal')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all bg-slate-800/50 border-cyan-400/40 text-cyan-400 hover:border-cyan-400 hover:bg-cyan-500/10">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-semibold">Back</span>
              </button>
            )}

            {isLoggedIn && (
              <button onClick={() => navigate('/portal')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  location.pathname === '/portal'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400'
                    : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-cyan-400/50 hover:text-cyan-400'
                }`}>
                <Home className="w-4 h-4" />
                <span className="text-sm font-semibold">Home</span>
              </button>
            )}

            {location.pathname !== '/login' && (
              <button
                onClick={isLoggedIn ? handleLogout : () => navigate('/login')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all bg-slate-800/50 border-slate-700 text-slate-300 hover:border-red-400/50 hover:text-red-400">
                {isLoggedIn ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                <span className="text-sm font-semibold">{isLoggedIn ? 'Logout' : 'Login'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}