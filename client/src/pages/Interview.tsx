import { Layout } from "@/components/ui/Layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInterviewSchema, type InsertInterview } from "@shared/schema";
import { useStartInterview } from "@/hooks/use-interview";
import { useState, useEffect } from "react";
import { Camera, Check, Mic, Play, Settings, ShieldAlert, Video } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type PermissionState = "prompt" | "granted" | "denied";

export default function Interview() {
  const { toast } = useToast();
  const [activeSession, setActiveSession] = useState(false);
  const [permissions, setPermissions] = useState<{ video: PermissionState; audio: PermissionState }>({
    video: "prompt",
    audio: "prompt"
  });
  const [checking, setChecking] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<InsertInterview>({
    resolver: zodResolver(insertInterviewSchema),
    defaultValues: {
      topic: "",
      difficulty: "Medium"
    }
  });

  const mutation = useStartInterview();

  const checkPermissions = async () => {
    setChecking(true);
    // Simulate permission check delay
    setTimeout(() => {
      setPermissions({ video: "granted", audio: "granted" });
      setChecking(false);
      toast({
        title: "Devices Ready",
        description: "Camera and microphone access granted.",
      });
    }, 1500);
  };

  const onSubmit = (data: InsertInterview) => {
    mutation.mutate(data, {
      onSuccess: () => {
        setActiveSession(true);
      },
      onError: (error) => {
        toast({
          title: "Failed to start",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  };

  const isReady = permissions.video === "granted" && permissions.audio === "granted";

  if (activeSession) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto h-[80vh] flex flex-col">
          <header className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              Live Interview Session
            </h1>
            <button 
              onClick={() => setActiveSession(false)}
              className="px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-medium transition-colors"
            >
              End Session
            </button>
          </header>
          
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Video Area */}
            <div className="lg:col-span-2 bg-black rounded-2xl relative overflow-hidden shadow-2xl flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              
              {/* Fake AI Video Feed */}
              <img 
                src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80" 
                alt="AI Interviewer"
                className="w-full h-full object-cover opacity-80"
              />
              {/* Descriptive comment: AI Interviewer abstract tech background or friendly avatar */}
              
              <div className="absolute bottom-8 left-8 right-8 z-20">
                <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white">
                  <p className="font-medium text-blue-300 mb-1">AI Interviewer</p>
                  <p className="text-lg">Could you explain the difference between REST and GraphQL?</p>
                </div>
              </div>
            </div>

            {/* Sidebar Controls */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4 shadow-sm h-1/3 relative overflow-hidden">
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 rounded text-xs text-white z-10">You</div>
                <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center text-slate-500">
                  <Camera className="w-8 h-8" />
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex-1 flex flex-col">
                <h3 className="font-semibold mb-4">Live Feedback</h3>
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  <div className="p-3 rounded-lg bg-green-50 text-green-700 text-sm border border-green-100">
                    <p className="font-bold mb-1">Good Pace</p>
                    Your speaking rate is optimal.
                  </div>
                  <div className="p-3 rounded-lg bg-yellow-50 text-yellow-700 text-sm border border-yellow-100">
                    <p className="font-bold mb-1">Tip</p>
                    Try to provide a concrete example.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 border-b border-border bg-slate-50/50">
            <h1 className="text-3xl font-display font-bold text-foreground">Interview Setup</h1>
            <p className="text-muted-foreground mt-2">Configure your session settings and verify your equipment.</p>
          </div>

          <div className="p-8 space-y-8">
            {/* Step 1: Configuration */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm">1</div>
                <h2>Session Details</h2>
              </div>
              
              <form id="setup-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 pl-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Topic</label>
                    <input
                      {...register("topic")}
                      placeholder="e.g. System Design"
                      className="w-full px-4 py-2.5 rounded-lg bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                    />
                    {errors.topic && <p className="text-sm text-destructive">{errors.topic.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Difficulty</label>
                    <select
                      {...register("difficulty")}
                      className="w-full px-4 py-2.5 rounded-lg bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                    >
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>
                </div>
              </form>
            </section>

            <div className="h-px bg-border/50" />

            {/* Step 2: Permissions */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm">2</div>
                <h2>Equipment Check</h2>
              </div>

              <div className="pl-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={cn(
                  "p-4 rounded-xl border-2 transition-all flex items-center gap-4",
                  permissions.video === "granted" ? "border-green-500 bg-green-50/50" : "border-border bg-background"
                )}>
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    permissions.video === "granted" ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-500"
                  )}>
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Camera</p>
                    <p className="text-xs text-muted-foreground">
                      {permissions.video === "granted" ? "Connected" : "Access required"}
                    </p>
                  </div>
                  {permissions.video === "granted" && <Check className="ml-auto w-5 h-5 text-green-500" />}
                </div>

                <div className={cn(
                  "p-4 rounded-xl border-2 transition-all flex items-center gap-4",
                  permissions.audio === "granted" ? "border-green-500 bg-green-50/50" : "border-border bg-background"
                )}>
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    permissions.audio === "granted" ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-500"
                  )}>
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Microphone</p>
                    <p className="text-xs text-muted-foreground">
                      {permissions.audio === "granted" ? "Connected" : "Access required"}
                    </p>
                  </div>
                   {permissions.audio === "granted" && <Check className="ml-auto w-5 h-5 text-green-500" />}
                </div>
              </div>

              {!isReady && (
                <div className="pl-8 pt-2">
                  <button
                    type="button"
                    onClick={checkPermissions}
                    disabled={checking}
                    className="text-sm font-semibold text-primary hover:underline flex items-center gap-2"
                  >
                    {checking ? "Checking devices..." : "Check Permissions"}
                    {checking && <Settings className="w-3 h-3 animate-spin" />}
                  </button>
                </div>
              )}
            </section>
            
            {/* Warning if not ready */}
            {!isReady && !checking && (
              <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl flex items-start gap-3 text-sm">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <p>Please allow camera and microphone access to start the interview session. Your data is processed locally.</p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-8 border-t border-border bg-slate-50/50 flex justify-end">
            <button
              form="setup-form"
              disabled={!isReady || mutation.isPending}
              className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all flex items-center gap-2"
            >
              Start Interview <Play className="w-4 h-4 fill-current" />
            </button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
