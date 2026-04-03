import { Layout } from "@/components/ui/Layout";
import { useAuth } from "@/hooks/use-auth";
import { useRoadmaps } from "@/hooks/use-roadmap";
import { useInterviews } from "@/hooks/use-interview";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, Calendar, MapPin, Briefcase, FileText, PlayCircle, Clock, Compass, Zap, Cpu, Sparkles, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: roadmaps, isLoading: loadingRoadmaps } = useRoadmaps();
  const { data: interviews, isLoading: loadingInterviews } = useInterviews();

  if (!user) return null;

  const roadmapCount = roadmaps?.length || 0;
  const interviewCount = interviews?.length || 0;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-12 pb-20 fade-in">
        
        {/* Profile Header Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-transparent to-cyan-500/10 rounded-[2.5rem] blur-3xl -z-10" />
          
          <div className="glass-card overflow-hidden border-border/40 relative bg-muted/5 dark:bg-white/[0.02]">
            <div className="h-48 bg-gradient-to-br from-slate-200 via-indigo-100 to-slate-300 dark:from-[#0f172a] dark:via-[#1e1b4b] dark:to-[#020617] relative overflow-hidden">
               <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)]" />
                  <div className="grid grid-cols-8 gap-4 p-4">
                     {Array(32).fill(0).map((_, i) => (
                       <Cpu key={i} className="w-12 h-12 text-indigo-500/20" />
                     ))}
                  </div>
               </div>
               <div className="absolute top-0 right-0 p-8">
                  <Sparkles className="w-16 h-16 text-indigo-400/20" />
               </div>
            </div>
            
            <div className="px-10 pb-10 relative">
              <div className="flex flex-col md:flex-row items-end gap-8 -mt-16">
                <div className="relative group">
                   <div className="absolute inset-0 bg-indigo-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                   <Avatar className="w-32 h-32 border-4 border-indigo-500/30 shadow-2xl relative z-10 rounded-3xl">
                     <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                     <AvatarFallback className="text-3xl bg-indigo-500 text-white font-black">
                       {user.name.charAt(0)}
                     </AvatarFallback>
                   </Avatar>
                </div>
                
                <div className="flex-1 space-y-2 text-center md:text-left mb-2">
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <h1 className="text-4xl font-display font-black text-foreground tracking-tight">{user.name}</h1>
                    <div className="px-3 py-1 glass border-indigo-500/30 rounded-full text-[10px] font-black text-indigo-600 dark:text-indigo-300 uppercase tracking-widest bg-indigo-500/10">
                      Level {Math.floor(roadmapCount + interviewCount / 2) + 1} EXPERT
                    </div>
                  </div>
                  <p className="text-indigo-600/40 dark:text-indigo-200/40 font-mono tracking-widest text-sm uppercase">
                    USER_ID: {user.username} // PROTOCOL: ACTIVATED
                  </p>
                </div>
                
                <div className="flex gap-3 sm:gap-4 mb-2 w-full sm:w-auto">
                  <Button className="btn-primary flex-1 sm:flex-none px-6 sm:px-8 h-12 rounded-xl text-xs sm:text-sm font-black uppercase tracking-widest">
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Identity Parameters */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card border-white/5 bg-white/[0.02]">
                <CardHeader className="pb-8">
                  <CardTitle className="text-xl font-display font-black text-foreground flex items-center gap-3 uppercase tracking-widest">
                    <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Identity Matrix
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400/60">Full Name</label>
                    <p className="text-lg font-bold text-foreground font-display">{user.name}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400/60">Digital Signature</label>
                    <div className="flex items-center gap-3 text-lg font-bold text-foreground font-display">
                      <Mail className="w-4 h-4 text-indigo-600/60 dark:text-indigo-400/60" />
                      {user.email}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400/60">Terminal Username</label>
                    <p className="text-lg font-bold text-indigo-600 dark:text-indigo-300 font-mono">@{user.username}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400/60">System Status</label>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-glow shadow-[0_0_10px_#10b981]" />
                      <span className="text-lg font-black text-emerald-400 uppercase tracking-widest">Online</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Career Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass-card border-indigo-500/20 bg-indigo-500/5 overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Zap className="w-24 h-24" />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-display font-black text-foreground uppercase tracking-widest flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Deployment Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-6 glass border-border/40 rounded-2xl flex items-center gap-5 group hover:bg-muted/50 transition-colors">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-2xl font-black text-foreground">{roadmapCount}</p>
                        <p className="text-xs font-bold text-indigo-500/40 dark:text-indigo-300/40 uppercase tracking-widest">Syllabus Vectors</p>
                      </div>
                    </div>
                    <div className="p-6 glass border-border/40 rounded-2xl flex items-center gap-5 group hover:bg-muted/50 transition-colors">
                      <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                        <PlayCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-2xl font-black text-foreground">{interviewCount}</p>
                        <p className="text-xs font-bold text-cyan-500/40 dark:text-cyan-300/40 uppercase tracking-widest">Live Engagements</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Activity Stream */}
            {(roadmapCount > 0 || interviewCount > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="glass-card border-border/40 bg-muted/5 dark:bg-white/[0.02]">
                  <CardHeader>
                    <CardTitle className="text-xl font-display font-black text-foreground uppercase tracking-widest flex items-center gap-3">
                      <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Sequence History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {roadmaps?.slice(0, 3).map((roadmap) => (
                      <div 
                        key={roadmap.id} 
                        className="flex items-center justify-between p-5 rounded-2xl glass border-border/40 hover:bg-muted/50 transition-all group"
                      >
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all">
                            <Compass className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{roadmap.role}</p>
                            <p className="text-[10px] font-black text-indigo-500/40 dark:text-indigo-300/40 uppercase tracking-widest mt-1">
                              {new Date(roadmap.createdAt!).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Link href="/roadmap">
                          <Button variant="ghost" size="sm" className="text-xs font-black text-indigo-400 uppercase tracking-widest hover:text-white">Access</Button>
                        </Link>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar Components */}
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="glass-card border-border/40 bg-muted/5 dark:bg-white/[0.02]">
                <CardHeader>
                  <CardTitle className="text-xl font-display font-black text-indigo-600 dark:text-indigo-300 uppercase tracking-widest flex items-center gap-3">
                    <Shield className="w-5 h-5" /> Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-5 rounded-2xl glass border-border/40 flex items-center gap-5">
                    <div className="p-3 rounded-xl bg-indigo-500/10">
                      <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-indigo-500/40 dark:text-indigo-300/40 uppercase tracking-widest">Protocol Start</p>
                      <p className="text-sm font-bold text-foreground tracking-tight">Active Member</p>
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl glass border-border/40 flex items-center gap-5">
                    <div className="p-3 rounded-xl bg-cyan-500/10">
                      <Globe className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-cyan-500/40 dark:text-cyan-300/40 uppercase tracking-widest">Origin Point</p>
                      <p className="text-sm font-bold text-foreground tracking-tight">Global Node</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/5 space-y-4">
                    <Button variant="ghost" className="w-full justify-start text-[10px] font-black uppercase tracking-[0.2em] text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all">
                      Terminate Session
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-[10px] font-black uppercase tracking-[0.2em] text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all">
                      Expunge Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions / Achievements Preview */}
            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.6 }}
               className="glass border-indigo-500/30 p-8 rounded-[2rem] bg-indigo-500/5 text-center space-y-4"
            >
               <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                 <Zap className="w-8 h-8 text-white" />
               </div>
               <h4 className="text-lg font-black text-white uppercase tracking-widest">Boost Active</h4>
               <p className="text-xs font-medium text-indigo-200/40 leading-relaxed italic">
                 "Your analytical vector is performing at peak efficiency. Ready for deployment."
               </p>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
