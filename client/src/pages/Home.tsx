import { Layout } from "@/components/ui/Layout";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Compass, LayoutDashboard, Sparkles, Target, Github } from "lucide-react";

export default function Home() {
  return (
    <Layout>
      <div className="space-y-20 pb-20">
        
        {/* Hero Section */}
        <section className="text-center space-y-8 pt-10 md:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4 border border-primary/20">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Career Acceleration</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-foreground leading-[1.1]">
              Master Your Career Path with <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Intelligent Guidance</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Generate personalized learning roadmaps and practice with our AI interviewer to land your dream job in tech.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link href="/roadmap" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                Create Roadmap <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link href="/interview" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-card border border-border text-foreground font-bold text-lg shadow-sm hover:border-primary/50 hover:text-primary transition-all duration-300">
                Start Mock Interview
              </Link>
              <Link href="/github-setup" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-card border border-border text-foreground font-bold text-lg shadow-sm hover:border-primary/50 hover:text-primary transition-all duration-300">
                <Github className="mr-2 w-5 h-5" /> Push to GitHub
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Roadmap Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group relative overflow-hidden rounded-3xl bg-card border border-border p-8 shadow-2xl shadow-black/5 hover:shadow-3xl hover:border-primary/50 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Compass className="w-32 h-32 text-primary" />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Compass className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold font-display">AI Career Roadmap</h2>
              <p className="text-muted-foreground text-lg">
                Input your target role and experience level. Our AI analyzes industry trends to generate a tailored step-by-step learning path just for you.
              </p>
              <ul className="space-y-2 text-muted-foreground mt-4">
                <li className="flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Personalized milestones</li>
                <li className="flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Resource recommendations</li>
                <li className="flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Skill gap analysis</li>
              </ul>
              <div className="pt-4">
                <Link href="/roadmap" className="text-primary font-semibold group-hover:translate-x-1 inline-flex items-center transition-transform">
                  Generate Now <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Interview Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="group relative overflow-hidden rounded-3xl bg-card border border-border p-8 shadow-2xl shadow-black/5 hover:shadow-3xl hover:border-primary/50 transition-all duration-500"
          >
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <LayoutDashboard className="w-32 h-32 text-indigo-600" />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold font-display">AI Mock Interview</h2>
              <p className="text-muted-foreground text-lg">
                Practice makes perfect. Simulate real interview scenarios with our AI interviewer that adapts to your responses and provides instant feedback.
              </p>
               <ul className="space-y-2 text-muted-foreground mt-4">
                <li className="flex items-center gap-2"><Target className="w-4 h-4 text-indigo-600" /> Real-time speech analysis</li>
                <li className="flex items-center gap-2"><Target className="w-4 h-4 text-indigo-600" /> Technical & behavioral questions</li>
                <li className="flex items-center gap-2"><Target className="w-4 h-4 text-indigo-600" /> Performance scoring</li>
              </ul>
              <div className="pt-4">
                <Link href="/interview" className="text-indigo-600 font-semibold group-hover:translate-x-1 inline-flex items-center transition-transform">
                  Start Practice <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Stats / Trust Section */}
        <section className="bg-white rounded-2xl p-10 shadow-sm border border-border/50 text-center max-w-5xl mx-auto">
            <h3 className="text-xl font-semibold mb-8 text-muted-foreground">Why choose our platform?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-foreground">24/7</div>
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Availability</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-foreground">100+</div>
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Tech Roles</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-foreground">Instant</div>
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Feedback Loop</div>
              </div>
            </div>
        </section>
      </div>
    </Layout>
  );
}
