import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertUserSchema, InsertUser } from "@shared/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, BrainCircuit, Shield, Sparkles, ChevronRight, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const loginForm = useForm<Pick<InsertUser, "username" | "password">>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      name: "",
    },
  });

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Left Column: Form */}
      <div className="flex flex-col items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/20 mb-6"
            >
              <BrainCircuit className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-4xl font-display font-black tracking-tight text-foreground">Talent<span className="text-indigo-500">AI</span></h1>
            <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Neural Intelligence Interface</p>
          </div>

          <Card className="glass-card border-border/40 overflow-hidden relative">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-cyan-400" />
            <CardContent className="p-8">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 glass p-1 rounded-xl">
                  <TabsTrigger value="login" className="rounded-lg font-bold data-[state=active]:bg-indigo-500 data-[state=active]:text-white">Authenticate</TabsTrigger>
                  <TabsTrigger value="register" className="rounded-lg font-bold data-[state=active]:bg-indigo-500 data-[state=active]:text-white">Initialize</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-0">
                  <Form {...loginForm}>
                    <form
                      onSubmit={loginForm.handleSubmit((data) =>
                        loginMutation.mutate(data)
                      )}
                      className="space-y-5"
                    >
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Terminal Username</FormLabel>
                            <FormControl>
                              <Input {...field} className="h-14 px-5 rounded-2xl glass border-border/40 focus:border-indigo-500/50 focus:bg-muted/50 transition-all font-semibold" />
                            </FormControl>
                            <FormMessage className="text-xs font-bold text-rose-500" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Security Key</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} className="h-14 px-5 rounded-2xl glass border-border/40 focus:border-indigo-500/50 focus:bg-muted/50 transition-all font-semibold" />
                            </FormControl>
                            <FormMessage className="text-xs font-bold text-rose-500" />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full h-14 btn-primary rounded-2xl font-black uppercase tracking-widest text-sm mt-4"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Login Session <ChevronRight className="ml-2 w-5 h-5" />
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="register" className="mt-0">
                  <Form {...registerForm}>
                    <form
                      onSubmit={registerForm.handleSubmit((data) =>
                        registerMutation.mutate(data)
                      )}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={registerForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="John Doe" className="h-12 px-4 rounded-xl glass border-border/40 focus:border-indigo-500/50 focus:bg-muted/50 font-medium" />
                              </FormControl>
                              <FormMessage className="text-[10px] text-rose-500 font-bold" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Username</FormLabel>
                              <FormControl>
                                <Input {...field} className="h-12 px-4 rounded-xl glass border-border/40 focus:border-indigo-500/50 focus:bg-muted/50 font-medium" />
                              </FormControl>
                              <FormMessage className="text-[10px] text-rose-500 font-bold" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Email Signature</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} placeholder="john@example.com" className="h-12 px-4 rounded-xl glass border-border/40 focus:border-indigo-500/50 focus:bg-muted/50 font-medium" />
                            </FormControl>
                            <FormMessage className="text-[10px] text-rose-500 font-bold" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Master Key</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} className="h-12 px-4 rounded-xl glass border-border/40 focus:border-indigo-500/50 focus:bg-muted/50 font-medium" />
                            </FormControl>
                            <FormMessage className="text-[10px] text-rose-500 font-bold" />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full h-14 btn-primary rounded-2xl font-black uppercase tracking-widest text-sm mt-6"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Compiling...
                          </>
                        ) : (
                          <>
                            Create Identity <Zap className="ml-2 w-5 h-5" />
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Column: Graphic/Info */}
      <div className="hidden lg:flex flex-col justify-center p-16 relative bg-[#0a0a0a] overflow-hidden border-l border-border/10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/5" />
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#4f46e5_1px,transparent_1px),linear-gradient(to_bottom,#4f46e5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        <div className="max-w-xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-8">
              <Shield className="w-3.5 h-3.5" /> Security Protocol Active
            </div>
            
            <h1 className="text-5xl font-display font-black text-white mb-6 leading-[1.1] tracking-tight">
              Synthesize Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Career Trajectory</span>
            </h1>
            
            <p className="text-lg text-indigo-200/60 font-medium mb-12 leading-relaxed">
              Deploy our neural network to generate personalized roadmaps, execute high-fidelity mock interviews, and evaluate your technical proficiencies in real-time.
            </p>
            
            <div className="space-y-6">
              {[
                { title: "Dynamic Logic Assessment", desc: "Real-time algorithmic evaluation." },
                { title: "Adaptive Career Vectors", desc: "Syllabus mapping tailored to goal parameters." },
                { title: "Terminal-Level Feedback", desc: "Granular scoring and code efficiency reviews." }
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold tracking-wide">{feature.title}</h3>
                    <p className="text-indigo-200/40 text-sm font-medium">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
