import { Layout } from "@/components/ui/Layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRoadmapSchema, type InsertRoadmap, type Roadmap as RoadmapType } from "@shared/schema";
import { useGenerateRoadmap, useRoadmaps } from "@/hooks/use-roadmap";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, CheckCircle2, ChevronRight, Loader2, Target, ExternalLink, History, PlusCircle, Compass, Sparkles, Zap, Cpu } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Curated resources to augment generated roadmap steps
const RESOURCE_MAP: Record<string, { title: string; url: string; type: "article" | "course" | "book" | "docs" | "video" }[]> = {
  react: [
    { title: "React Official Docs", url: "https://react.dev/", type: "docs" },
    { title: "Fullstack Open - React", url: "https://fullstackopen.com/en/", type: "course" },
    { title: "Epic React (paid)", url: "https://epicreact.dev/", type: "course" },
    { title: "React Patterns (book)", url: "https://reactpatterns.com/", type: "book" }
  ],
  "system design": [
    { title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", type: "article" },
    { title: "Grokking the System Design Interview (course)", url: "https://www.educative.io/courses/grokking-the-system-design-interview", type: "course" },
    { title: "Designing Data-Intensive Applications (book)", url: "https://dataintensive.net/", type: "book" }
  ],
  sql: [
    { title: "SQLZoo Tutorials", url: "https://sqlzoo.net/", type: "course" },
    { title: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial/", type: "course" }
  ],
  javascript: [
    { title: "You Don't Know JS (book)", url: "https://github.com/getify/You-Dont-Know-JS", type: "book" },
    { title: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", type: "docs" }
  ],
  frontend: [
    { title: "SuperSimpleDev - Frontend Basics (YouTube)", url: "https://www.youtube.com/c/SuperSimpleDev", type: "video" },
    { title: "SuperSimpleDev - Frontend Tutorials (YouTube)", url: "https://www.youtube.com/c/SuperSimpleDev/videos", type: "video" }
  ],
  jsfrontend: [
    { title: "SuperSimpleDev - JavaScript Tutorials (YouTube)", url: "https://www.youtube.com/c/SuperSimpleDev/playlists", type: "video" }
  ],
  testing: [
    { title: "Testing JavaScript (Kent C. Dodds)", url: "https://testingjavascript.com/", type: "course" },
    { title: "Jest Docs", url: "https://jestjs.io/", type: "docs" }
  ]
};

const getResourcesForStep = (step: any) => {
  let resources: { title: string; url: string; type: string }[] = [];
  if (Array.isArray(step?.resources)) {
    resources = resources.concat(step.resources.map((r: any) => ({ title: r.title || r.name || 'Resource', url: r.url || r.link, type: r.type || 'article' })));
  }
  if (step?.youtubeLink) {
    resources.push({ title: 'YouTube Tutorial', url: step.youtubeLink, type: 'video' });
  }
  const title = (step?.title || '').toLowerCase();
  Object.keys(RESOURCE_MAP).forEach((k) => {
    if (title.includes(k)) {
      resources = resources.concat(RESOURCE_MAP[k]);
    }
  });
  // remove duplicates by url
  const seen = new Set<string>();
  const uniq = resources.filter(r => {
    if (!r.url) return false;
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });
  return uniq;
};

export default function Roadmap() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"create" | "history">("create");
  const [selectedRoadmap, setSelectedRoadmap] = useState<RoadmapType | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<InsertRoadmap>({
    resolver: zodResolver(insertRoadmapSchema),
    defaultValues: {
      role: "",
      experienceLevel: "Beginner",
      goals: ""
    }
  });

  const generateMutation = useGenerateRoadmap();
  const { data: history, isLoading: loadingHistory } = useRoadmaps();

  const onSubmit = (data: InsertRoadmap) => {
    generateMutation.mutate(data, {
      onSuccess: (result) => {
        setSelectedRoadmap(result);
        toast({
          title: "Protocol Success",
          description: "Your mastery roadmap has been synthesized.",
        });
      },
      onError: (error) => {
        toast({
          title: "Protocol Failure",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8 pb-20 fade-in px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight">
              Mastery <span className="text-gradient">Roadmap</span>
            </h1>
            <p className="text-indigo-500 dark:text-indigo-300/60 font-medium tracking-wide text-sm sm:text-base">
              Synthesize your personalized learning vector.
            </p>
          </div>

          <div className="flex glass p-1.5 rounded-2xl border-border/40 shadow-lg w-full sm:w-auto">
            <Button
              variant={activeTab === "create" ? "default" : "ghost"}
              onClick={() => setActiveTab("create")}
              className={`rounded-xl px-4 sm:px-8 h-11 flex-1 sm:flex-none transition-all duration-300 ${activeTab === 'create' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <PlusCircle className="w-4 h-4 mr-2" /> <span className="hidden xs:inline">New</span> Vector
            </Button>
            <Button
              variant={activeTab === "history" ? "default" : "ghost"}
              onClick={() => setActiveTab("history")}
              className={`rounded-xl px-4 sm:px-8 h-11 flex-1 sm:flex-none transition-all duration-300 ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <History className="w-4 h-4 mr-2" /> History ({history?.length || 0})
            </Button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10 items-start">

          {/* Left Column: Form or History List */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {activeTab === "create" ? (
                <motion.div
                  key="create-form"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="space-y-6"
                >
                  <Card className="glass-card border-border/40 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-cyan-400" />
                    <CardHeader className="pb-8">
                      <CardTitle className="text-2xl flex items-center gap-3 text-foreground font-black">
                        <Cpu className="w-6 h-6 text-indigo-500 dark:text-indigo-400" /> Parameters
                      </CardTitle>
                      <CardDescription className="text-muted-foreground text-base">Define your developmental trajectory.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-3">
                          <label className="text-xs font-black uppercase tracking-[0.25em] text-indigo-600 dark:text-indigo-400/80">Target Designation</label>
                          <input
                            {...register("role")}
                            placeholder="e.g. System Architect"
                            className="w-full px-5 py-4 text-base rounded-2xl glass border-border/40 focus:border-indigo-500/50 focus:bg-muted/50 transition-all outline-none text-foreground font-semibold bg-transparent placeholder:text-muted-foreground/40"
                          />
                          {errors.role && <p className="text-xs text-rose-400 font-bold">{errors.role.message}</p>}
                        </div>

                        <div className="space-y-3">
                          <label className="text-xs font-black uppercase tracking-[0.25em] text-indigo-600 dark:text-indigo-400/80">Seniority Level</label>
                          <select
                            {...register("experienceLevel")}
                            className="w-full px-5 py-4 text-base rounded-2xl glass border border-border/40 focus:border-indigo-500/50 transition-all outline-none appearance-none text-foreground font-semibold cursor-pointer bg-background"
                          >
                            <option value="Beginner">Beginner (0-2y)</option>
                            <option value="Intermediate">Mid-Tier (3-5y)</option>
                            <option value="Advanced">Elite (5y+)</option>
                          </select>
                        </div>

                        <div className="space-y-3">
                          <label className="text-xs font-black uppercase tracking-[0.25em] text-indigo-600 dark:text-indigo-400/80">Specific Objectives</label>
                          <textarea
                            {...register("goals")}
                            rows={5}
                            placeholder="Specify technical constraints or goals..."
                            className="w-full px-5 py-4 text-base rounded-2xl glass border border-border/40 focus:border-indigo-500/50 focus:bg-muted/50 transition-all outline-none resize-none text-foreground font-semibold bg-transparent placeholder:text-muted-foreground/40"
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={generateMutation.isPending}
                          className="w-full h-14 btn-primary rounded-2xl font-black uppercase tracking-widest text-base"
                        >
                          {generateMutation.isPending ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin mr-3" />
                              Processing...
                            </>
                          ) : (
                            <>
                              Initialize Synthesis <Zap className="w-5 h-5 ml-2" />
                            </>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="history-list"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="space-y-3 max-h-56 lg:max-h-[600px] overflow-y-auto pr-1"
                >
                  {loadingHistory ? (
                    Array(3).fill(0).map((_, i) => (
                      <div key={i} className="h-20 rounded-2xl glass border-border/30 animate-pulse" />
                    ))
                  ) : history && history.length > 0 ? (
                    history.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedRoadmap(item)}
                        className={`p-4 rounded-2xl glass border transition-all duration-300 group cursor-pointer ${
                          selectedRoadmap?.id === item.id
                            ? "border-indigo-500/50 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
                            : "border-border/30 hover:border-indigo-500/30 hover:bg-muted/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${selectedRoadmap?.id === item.id ? 'bg-indigo-500 text-white' : 'bg-muted/50 text-indigo-500 group-hover:bg-muted'}`}>
                            <Compass className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-foreground truncate text-sm">{item.role}</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 dark:text-indigo-400/60 mt-0.5">
                              {new Date(item.createdAt!).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 px-6 glass border-2 border-dashed border-border/30 rounded-3xl">
                      <History className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground/50 text-xs font-bold uppercase tracking-widest">Archive Empty</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Result Display */}
          <div className="lg:col-span-3 relative">
            <AnimatePresence mode="wait">
              {selectedRoadmap ? (
                <motion.div
                  key={selectedRoadmap.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card border-border/20 p-0 overflow-hidden flex flex-col min-h-[500px] lg:h-[750px]"
                >
                  {/* Roadmap Header */}
                  <div className="p-5 sm:p-8 border-b border-border/20 bg-gradient-to-r from-indigo-500/10 via-transparent to-cyan-500/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                      <Sparkles className="w-24 h-24" />
                    </div>
                    <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-2xl sm:text-3xl font-display font-black text-foreground">{selectedRoadmap.role}</h3>
                          <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border-indigo-500/30 font-black uppercase tracking-widest text-[10px]">
                            {selectedRoadmap.experienceLevel}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground max-w-2xl font-medium italic text-sm">
                          "Protocol Objectives: {selectedRoadmap.goals || "Full Technical Mastery"}"
                        </p>
                      </div>
                      <div className="px-3 py-1.5 glass rounded-xl border-border/40 text-[10px] font-black text-indigo-600 dark:text-indigo-300 uppercase tracking-widest shrink-0">
                        {new Date(selectedRoadmap.createdAt!).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Roadmap Steps */}
                  <div className="p-4 sm:p-8 overflow-y-auto space-y-6 sm:space-y-10 flex-1">
                    {Array.isArray(selectedRoadmap.generatedContent) ? (
                      selectedRoadmap.generatedContent.map((step: any, index: number) => (
                        <div key={index} className="flex gap-4 sm:gap-6 relative group">
                          <div className="flex flex-col items-center shrink-0">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-500 text-white flex items-center justify-center font-black text-sm sm:text-lg shadow-[0_0_20px_rgba(99,102,241,0.4)] z-10 ring-4 ring-indigo-500/10"
                            >
                              {index + 1}
                            </motion.div>
                            {index !== (selectedRoadmap.generatedContent as any).length - 1 && (
                              <div className="w-0.5 h-full bg-indigo-500/10 mt-3 rounded-full" />
                            )}
                          </div>
                          <div className="glass-card flex-1 p-4 sm:p-6 border-border/40 hover:border-indigo-500/30 transition-all duration-500">
                            <h4 className="font-display font-black text-base sm:text-xl text-foreground mb-2 sm:mb-3 tracking-tight">{step.title}</h4>
                            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base mb-4 sm:mb-6 font-medium italic border-l-2 border-indigo-500/30 pl-3 bg-indigo-500/5 py-2 rounded-r-xl">
                              "{step.description}"
                            </p>

                            {(() => {
                              const resources = getResourcesForStep(step);
                              if (!resources || resources.length === 0) return null;
                              return (
                                <div className="space-y-4">
                                  <div className="flex items-center gap-3">
                                    <div className="h-0.5 w-4 bg-indigo-500/40" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 dark:text-indigo-400">Resource Nodes</span>
                                    <div className="h-0.5 flex-1 bg-indigo-500/10" />
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {resources.map((r, i) => (
                                      <motion.a
                                        key={i}
                                        href={r.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ y: -2 }}
                                        className="flex items-center justify-between p-3 rounded-xl glass border-border/30 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group/node"
                                      >
                                        <div className="flex items-center gap-3 min-w-0">
                                          <div className="p-2 rounded-lg bg-muted/50 hover:bg-indigo-500/20 transition-colors shrink-0">
                                            <ExternalLink className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                                          </div>
                                          <span className="text-xs font-bold text-foreground truncate">{r.title}</span>
                                        </div>
                                        <Badge variant="secondary" className="text-[9px] uppercase font-black bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/20 px-2 py-0.5 ml-2 shrink-0">
                                          {r.type}
                                        </Badge>
                                      </motion.a>
                                    ))}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-24 text-muted-foreground/30 italic font-medium">Syllabus vectors not found.</div>
                    )}
                  </div>
                </motion.div>
              ) : (
                /* Empty state — fully visible in both light & dark mode */
                <div className="min-h-[400px] lg:min-h-[600px] flex flex-col items-center justify-center p-8 sm:p-16 text-center glass border-2 border-dashed border-border/40 rounded-3xl">
                  <motion.div
                    animate={{
                      y: [0, -12, 0],
                      rotate: [2, -2, 2]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="w-20 h-20 sm:w-28 sm:h-28 glass rounded-3xl border-border/40 shadow-2xl flex items-center justify-center mb-8"
                  >
                    <Compass className="w-10 h-10 sm:w-14 sm:h-14 text-indigo-500/50" />
                  </motion.div>
                  <h3 className="text-2xl sm:text-3xl font-display font-black text-foreground mb-4">Awaiting Parameters</h3>
                  <p className="text-muted-foreground max-w-sm mb-8 font-medium text-sm sm:text-base">
                    {activeTab === "create"
                      ? "Initialize a new developmental vector to synthesize your personalized mastery roadmap."
                      : "Select a previously synthesized vector from the archive to view terminal data."}
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Badge variant="outline" className="px-4 py-2 glass border-border/40 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-300">AI Synthesized</Badge>
                    <Badge variant="outline" className="px-4 py-2 glass border-border/40 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-300">Trajectory Optimized</Badge>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 py-8 border-t border-border/20 text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Compass className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            <span className="font-display font-black text-sm tracking-widest text-foreground uppercase">TalentAI</span>
          </div>
          <p className="text-xs font-medium text-muted-foreground/50 tracking-tighter">
            © {new Date().getFullYear()} TalentAI // Empowering Careers via Neural Intelligence.
          </p>
        </footer>
      </div>
    </Layout>
  );
}

function Badge({ children, variant = "default", className }: { children: React.ReactNode, variant?: "default" | "outline" | "secondary", className?: string }) {
  const variants = {
    default: "bg-primary text-primary-foreground",
    outline: "border border-border text-foreground",
    secondary: "bg-secondary text-secondary-foreground"
  };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
