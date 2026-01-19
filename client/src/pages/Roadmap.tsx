import { Layout } from "@/components/ui/Layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRoadmapSchema, type InsertRoadmap } from "@shared/schema";
import { useGenerateRoadmap } from "@/hooks/use-roadmap";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, ChevronRight, Loader2, Target } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Roadmap() {
  const { toast } = useToast();
  const [roadmapResult, setRoadmapResult] = useState<any>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<InsertRoadmap>({
    resolver: zodResolver(insertRoadmapSchema),
    defaultValues: {
      role: "",
      experienceLevel: "Beginner",
      goals: ""
    }
  });

  const mutation = useGenerateRoadmap();

  const onSubmit = (data: InsertRoadmap) => {
    mutation.mutate(data, {
      onSuccess: (result) => {
        setRoadmapResult(result);
        toast({
          title: "Roadmap Generated!",
          description: "Your personalized learning path is ready.",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12">
        
        {/* Left Column: Form */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Create Your Roadmap</h1>
            <p className="text-muted-foreground">
              Tell us about your career aspirations, and our AI will chart the perfect course for you.
            </p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-lg border border-border/50">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Target Role</label>
                <input
                  {...register("role")}
                  placeholder="e.g. Frontend Engineer, Product Manager"
                  className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                />
                {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Experience Level</label>
                <select
                  {...register("experienceLevel")}
                  className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none"
                >
                  <option value="Beginner">Beginner (0-2 years)</option>
                  <option value="Intermediate">Intermediate (3-5 years)</option>
                  <option value="Advanced">Advanced (5+ years)</option>
                </select>
                {errors.experienceLevel && <p className="text-sm text-destructive">{errors.experienceLevel.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Specific Goals</label>
                <textarea
                  {...register("goals")}
                  rows={4}
                  placeholder="e.g. I want to learn React deeply and understand system design principles..."
                  className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none"
                />
                {errors.goals && <p className="text-sm text-destructive">{errors.goals.message}</p>}
              </div>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all flex items-center justify-center gap-2"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Roadmap <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Result or Placeholder */}
        <div className="relative">
          {roadmapResult ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl border border-border shadow-xl overflow-hidden h-full max-h-[800px] flex flex-col"
            >
              <div className="p-6 border-b border-border bg-slate-50">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Target className="text-primary w-5 h-5" />
                  Your Personalized Path
                </h3>
              </div>
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {/* Mock display of generated content - in real app this would parse the JSON/Markdown */}
                <div className="prose prose-blue max-w-none">
                  <p className="text-lg text-foreground font-medium">
                    Based on your goal to become a <span className="text-primary">{roadmapResult.role}</span>, here is your roadmap:
                  </p>
                  
                  {/* Visual Timeline Mockup */}
                  <div className="space-y-6 mt-6">
                    {[1, 2, 3, 4].map((step) => (
                      <div key={step} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                            {step}
                          </div>
                          {step !== 4 && <div className="w-0.5 h-full bg-border mt-2" />}
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 w-full border border-border/50">
                          <h4 className="font-bold text-foreground">Phase {step}: Foundations</h4>
                          <p className="text-sm text-muted-foreground mt-1">Focus on core principles and syntax mastery.</p>
                          <ul className="mt-3 space-y-1">
                            <li className="flex items-center gap-2 text-sm text-slate-700">
                              <CheckCircle2 className="w-4 h-4 text-green-500" /> Topic A
                            </li>
                            <li className="flex items-center gap-2 text-sm text-slate-700">
                              <CheckCircle2 className="w-4 h-4 text-green-500" /> Topic B
                            </li>
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-border min-h-[400px]">
              <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
                <BookOpen className="w-10 h-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-xl font-bold text-muted-foreground">Ready to start?</h3>
              <p className="text-muted-foreground mt-2 max-w-xs">
                Fill out the form to generate your custom AI-powered learning roadmap.
              </p>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}
