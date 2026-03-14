import { useNavigate } from "react-router";
import { Sparkles, Trophy, Target, Users, Zap, BookOpen, ArrowRight, Star } from "lucide-react";
import { motion } from "motion/react";

export function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: "Level Up Your Knowledge",
      description: "Complete quests and assignments to gain XP and advance through levels",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Target,
      title: "Quest-Based Learning",
      description: "Transform your tasks into exciting quests with rewards and achievements",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: Trophy,
      title: "Compete & Climb",
      description: "Rise through the ranks on the leaderboard and prove your mastery",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Users,
      title: "Guild System",
      description: "Join forces with other students and tackle challenges together",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: BookOpen,
      title: "Skill Trees",
      description: "Unlock new abilities and customize your learning path",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: Star,
      title: "Epic Achievements",
      description: "Earn rare badges and titles as you master different subjects",
      color: "from-red-500 to-rose-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden relative">
      {/* Animated background grid */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      ></div>

      {/* Glowing orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-[120px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pt-20 pb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-semibold">LEVEL UP YOUR EDUCATION</span>
          </div>

          <h1 className="text-7xl font-bold text-white mb-6 drop-shadow-[0_0_40px_rgba(34,211,238,0.8)]">
            STUDY LEVELING
          </h1>
          
          <p className="text-3xl text-cyan-400 mb-4 font-semibold">
            Transform Learning Into An Epic Adventure
          </p>
          
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-12 px-4">
            Experience education like never before. Complete quests, earn XP, unlock achievements, 
            and rise through the ranks as you master your subjects in this gamified learning platform.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="relative group"
          >
            <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-5 px-10 rounded-lg border-2 border-cyan-400 hover:border-cyan-300 transition-all">
              <span className="flex items-center justify-center gap-3 text-lg">
                BEGIN YOUR JOURNEY
                <ArrowRight className="w-6 h-6" />
              </span>
            </div>
          </motion.button>
        </motion.div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-8 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-center text-white mb-4">
              Embark On Your Quest
            </h2>
            <p className="text-center text-cyan-400 mb-16 text-lg">
              Discover the features that make Study Leveling the ultimate learning experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group"
              >
                <div 
                  className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"
                  style={{
                    backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`
                  }}
                ></div>
                
                <div 
                  className="relative bg-slate-800/50 backdrop-blur-sm border-2 border-cyan-500/30 rounded-lg p-8 h-full overflow-hidden group-hover:border-cyan-400/50 transition-all"
                  style={{
                    clipPath: 'polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))'
                  }}
                >
                  {/* Corner decorations */}
                  <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-cyan-400/50"></div>
                  <div className="absolute top-1 right-1 w-3 h-3 border-t border-r border-cyan-400/50"></div>
                  <div className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-cyan-400/50"></div>
                  <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-cyan-400/50"></div>

                  <div className="relative z-10">
                    <div className={`inline-flex p-4 bg-gradient-to-br ${feature.color} rounded-lg mb-4`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3">
                      {feature.title}
                    </h3>
                    
                    <p className="text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="py-20 text-center"
        >
          <div className="max-w-4xl mx-auto px-8">
            <div 
              className="relative bg-gradient-to-br from-blue-900/40 via-cyan-900/30 to-blue-900/40 backdrop-blur-sm border-2 p-16 overflow-hidden"
              style={{
                clipPath: 'polygon(0 20px, 20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px))',
                borderImage: 'linear-gradient(135deg, #60a5fa, #3b82f6, #2563eb, #60a5fa) 1',
                boxShadow: '0 0 60px rgba(59, 130, 246, 0.3), inset 0 0 80px rgba(59, 130, 246, 0.1)'
              }}
            >
              {/* Corner Decorations */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-400"></div>
              <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-cyan-400"></div>
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-cyan-400"></div>
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-cyan-400"></div>

              <div className="relative">
                <h2 className="text-4xl font-bold text-white mb-6">
                  Ready To Level Up?
                </h2>
                <p className="text-xl text-cyan-400 mb-10">
                  Join thousands of students who are already transforming their education
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-5 px-12 rounded-lg border-2 border-cyan-400 hover:border-cyan-300 transition-all">
                    <span className="flex items-center justify-center gap-3 text-lg">
                      START YOUR ADVENTURE
                      <ArrowRight className="w-6 h-6" />
                    </span>
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center py-12 text-slate-500 border-t border-slate-800">
          <p>&copy; 2026 Study Leveling. Transform your education into an epic quest.</p>
        </div>
      </div>
    </div>
  );
}
