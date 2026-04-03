import { Layout } from "@/components/ui/Layout";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Compass, LayoutDashboard, Sparkles, Target, Zap, Shield, Cpu } from "lucide-react";

export default function Home() {
  return (
    <Layout>
      <div className="relative isolate px-6 pt-14 lg:px-8 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>

        <div className="mx-auto max-w-4xl py-20 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass border border-border/50 text-indigo-500 dark:text-indigo-300 font-medium text-sm mb-8 animate-glow">
              <Sparkles className="w-4 h-4" />
              <span>Next-Gen Career Intelligence</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8 leading-[1.05] text-foreground">
              Accelerate Your Career with <br/>
              <span className="text-gradient">AI-Driven Mastery</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12">
              Transform your professional journey with hyper-personalized learning roadmaps and high-fidelity mock interviews powered by advanced AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/roadmap">
                <button className="btn-primary flex items-center group px-8 py-4 rounded-xl font-bold text-lg">
                  Step-by-Step Roadmap 
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/interview">
                <button className="glass px-8 py-4 rounded-xl font-bold text-lg border border-border/50 hover:bg-primary/5 transition-all duration-300 flex items-center text-foreground">
                  Mock Interview Terminal
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1: Roadmap */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-card group border-border/50"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                <Compass className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Hyper-Personalized Roadmaps</h3>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Our AI deep-scans industry requirements to build a tailored syllabus that evolves with your specific goals and skill level.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                  Skill Gap Identification
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                  Curated Resource Links
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                  Weekly Progress Milestones
                </li>
              </ul>
            </motion.div>

            {/* Feature 2: Interview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-card group border-border/50"
            >
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                <LayoutDashboard className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">High-Fidelity Mock Interviews</h3>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Simulate high-stakes interviews with an adaptive AI terminal that analyzes your voice, content, and structure in real-time.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                  Real-time Speech Transcription
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                  Context-Aware Questioning
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                  Rubric-Based Performance Scoring
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mx-auto max-w-7xl px-6 lg:px-8 pb-32"
        >
          <div className="glass rounded-[3rem] p-12 md:p-20 text-center border-border/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              <div className="space-y-4">
                <div className="flex justify-center"><Zap className="w-8 h-8 text-yellow-500 dark:text-yellow-400" /></div>
                <div className="text-5xl font-bold text-foreground tracking-tight">Instant</div>
                <div className="text-indigo-500 dark:text-indigo-300 font-medium uppercase tracking-[0.2em] text-xs">AI Evaluation</div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-center"><Shield className="w-8 h-8 text-emerald-600 dark:text-emerald-400" /></div>
                <div className="text-5xl font-bold text-foreground tracking-tight">Expert</div>
                <div className="text-indigo-500 dark:text-indigo-300 font-medium uppercase tracking-[0.2em] text-xs">Level Guidance</div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-center"><Cpu className="w-8 h-8 text-purple-600 dark:text-purple-400" /></div>
                <div className="text-5xl font-bold text-foreground tracking-tight">Adaptive</div>
                <div className="text-indigo-500 dark:text-indigo-300 font-medium uppercase tracking-[0.2em] text-xs">Difficulty Scaling</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
