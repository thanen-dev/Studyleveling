import { useEffect, useState } from "react";
import { Trophy, Medal, TrendingUp, Zap, Loader2 } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import supabase from "../../supabaseClient";

interface LeaderboardEntry {
  id: string;
  name: string;
  degree: string;
  xp: number;
  level: number;
}

export function LeaderboardPage() {
  const { user } = useUser();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, degree, xp, level')
      .order('xp', { ascending: false })
      .limit(20);

    if (!error && data) {
      setLeaderboard(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();

    // Real-time subscription — leaderboard updates live when anyone gains XP
    const channel = supabase
      .channel('leaderboard-realtime')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, () => {
        fetchLeaderboard();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const currentUserRank = leaderboard.findIndex(e => e.id === user?.id) + 1;

  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-yellow-400 to-yellow-600";
    if (rank === 2) return "from-slate-300 to-slate-400";
    if (rank === 3) return "from-orange-400 to-orange-600";
    return "from-cyan-400 to-blue-500";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-slate-300" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-400" />;
    return <div className="w-6 h-6 flex items-center justify-center text-cyan-400 font-bold text-sm">#{rank}</div>;
  };

  const top3 = leaderboard.slice(0, 3);
  // Reorder for podium: 2nd, 1st, 3rd
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;
  const podiumHeights = ['h-32', 'h-40', 'h-28'];
  const podiumRanks = [2, 1, 3];

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
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
          <div className="relative p-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">LEADERBOARD</h1>
              <p className="text-cyan-400 text-sm">Live XP rankings — updates in real time</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-xs uppercase tracking-wider">Live</span>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
          <p className="text-slate-400">Loading rankings...</p>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-20">
          <Trophy className="w-16 h-16 text-cyan-400/30 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No players yet — be the first to earn XP!</p>
          <p className="text-slate-500 text-sm mt-2">Complete tasks on the Taskboard to appear here.</p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {top3.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              {podiumOrder.map((entry, idx) => {
                const rank = podiumRanks[idx];
                const isMe = entry.id === user?.id;
                return (
                  <div key={entry.id} className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <div className={`absolute inset-0 bg-gradient-to-r ${getRankColor(rank)} blur-lg opacity-50`}></div>
                      <div className={`relative bg-gradient-to-r ${getRankColor(rank)} p-4 rounded-full`}>
                        {getRankIcon(rank)}
                      </div>
                    </div>
                    <div className={`w-full bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-t-lg border-2 p-4 ${podiumHeights[idx]} flex flex-col justify-end items-center ${
                      rank === 1 ? 'border-yellow-400' : rank === 2 ? 'border-slate-300' : 'border-orange-400'
                    } ${isMe ? 'ring-2 ring-cyan-400' : ''}`}>
                      <div className="text-center">
                        <div className={`font-bold mb-1 ${isMe ? 'text-cyan-400' : 'text-white'}`}>{entry.name || "Anonymous"}</div>
                        <div className="text-xs text-cyan-400 mb-1">Level {entry.level}</div>
                        <div className="text-sm text-yellow-400 font-semibold">{entry.xp.toLocaleString()} XP</div>
                        {isMe && <div className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded border border-cyan-400/30 mt-1">YOU</div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full Table */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 overflow-hidden">
            <div className="bg-slate-900/50 border-b border-slate-700/50 px-6 py-4">
              <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                <div className="col-span-1">Rank</div>
                <div className="col-span-4">Student</div>
                <div className="col-span-3">Degree</div>
                <div className="col-span-2">Level</div>
                <div className="col-span-2">XP</div>
              </div>
            </div>

            <div className="divide-y divide-slate-700/50">
              {leaderboard.map((entry, index) => {
                const rank = index + 1;
                const isMe = entry.id === user?.id;
                return (
                  <div key={entry.id}
                    className={`px-6 py-4 hover:bg-slate-700/30 transition-colors ${isMe ? 'bg-cyan-500/10 border-l-4 border-cyan-400' : ''}`}>
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-1">{getRankIcon(rank)}</div>
                      <div className="col-span-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${isMe ? 'text-cyan-400' : 'text-white'}`}>
                            {entry.name || "Anonymous"}
                          </span>
                          {isMe && <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded border border-cyan-400/30">YOU</span>}
                        </div>
                      </div>
                      <div className="col-span-3">
                        <span className="text-slate-400 text-xs truncate">{entry.degree || "—"}</span>
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center gap-1">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <span className="text-white font-semibold">{entry.level}</span>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-cyan-400 font-mono">{entry.xp.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50 text-center">
              <div className="text-xs text-slate-400 mb-1">Your Rank</div>
              <div className="text-2xl font-bold text-cyan-400">{currentUserRank > 0 ? `#${currentUserRank}` : '—'}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50 text-center">
              <div className="text-xs text-slate-400 mb-1">Total Players</div>
              <div className="text-2xl font-bold text-white">{leaderboard.length}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50 text-center">
              <div className="text-xs text-slate-400 mb-1">Your XP</div>
              <div className="text-2xl font-bold text-yellow-400">{(leaderboard.find(e => e.id === user?.id)?.xp || 0).toLocaleString()}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}