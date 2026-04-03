import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { BrainCircuit, Compass, LayoutDashboard, Menu, X, User, LogOut, Settings, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  
  // Theme management
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme");
    return (saved as "light" | "dark") || "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const navItems = [
    { href: "/", label: "Home", icon: BrainCircuit },
    { href: "/roadmap", label: "AI Roadmap", icon: Compass },
    { href: "/interview", label: "Mock Interview", icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-500">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 glass">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl text-primary hover:opacity-90 transition-opacity">
            <BrainCircuit className="w-8 h-8" />
            <span className="text-foreground tracking-tight">Talent<span className="text-primary">AI</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "text-sm font-bold transition-all hover:text-primary flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/5",
                  location === item.href ? "text-primary bg-primary/10" : "text-muted-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
            
            <div className="h-6 w-px bg-border/50 mx-2" />

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full w-10 h-10 border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all text-foreground"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 border-2 border-primary/20 hover:border-primary transition-all">
                    <Avatar className="h-full w-full">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                      <AvatarFallback className="bg-primary/10 text-primary">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-2 glass-card rounded-2xl border-white/10" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal px-2 py-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold font-display">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">@{user.username}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuItem asChild className="focus:bg-primary/10 focus:text-primary rounded-lg mx-1 cursor-pointer transition-colors p-3 font-bold">
                    <Link href="/profile" className="flex items-center w-full">
                      <User className="mr-3 h-4 w-4" />
                      <span>Profile Matrix</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuItem 
                    className="text-rose-400 focus:bg-rose-500/10 focus:text-rose-400 rounded-lg mx-1 cursor-pointer transition-colors p-3 font-bold"
                    onClick={() => logoutMutation.mutate()}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Terminate Session</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                className="btn-primary px-6 h-10 rounded-full text-xs uppercase tracking-widest font-black"
                onClick={() => setLocation('/auth')}
              >
                Launch Protocol
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full w-10 h-10 border border-border/50 text-foreground"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
            <button 
              className="p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-b border-border glass overflow-hidden"
            >
              <div className="container mx-auto px-4 py-8 flex flex-col gap-4">
                {user && (
                    <div className="flex items-center gap-4 px-6 py-4 bg-primary/5 rounded-2xl border border-primary/10 mb-2">
                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-black text-foreground uppercase tracking-tight">{user.name}</p>
                            <p className="text-xs text-muted-foreground">@{user.username} // ACTIVE</p>
                        </div>
                    </div>
                )}
                {navItems.map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "text-sm uppercase tracking-widest font-black py-4 px-6 rounded-xl transition-all flex items-center gap-4",
                      location === item.href 
                        ? "bg-primary/10 text-primary border border-primary/20" 
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ))}
                
                {user ? (
                   <button 
                   onClick={() => logoutMutation.mutate()}
                   className="text-sm uppercase tracking-widest font-black py-5 px-6 rounded-xl text-rose-400 hover:bg-rose-500/10 flex items-center gap-4 mt-4 transition-all"
                 >
                   <LogOut className="w-5 h-5" />
                   Terminate Session
                 </button>
                ) : (
                    <Button 
                    className="btn-primary py-6 rounded-xl text-xs uppercase tracking-[0.2em] font-black mt-4"
                    onClick={() => {
                        setLocation("/auth");
                        setMobileMenuOpen(false);
                    }}
                  >
                    Launch Protocol
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 md:py-16 relative">
        {/* Ambient background glows */}
        <div className="fixed top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="fixed bottom-1/4 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-auto glass py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 font-display font-bold text-xl text-primary mb-2">
                <BrainCircuit className="w-6 h-6" />
                <span className="text-foreground">Talent<span className="text-primary">AI</span></span>
            </div>
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-[0.2em]">© TalentAI // Empowering Careers via Neural Intelligence.</p>
          </div>
          <div className="flex gap-8">
             <a href="#" className="text-xs font-black text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors">Documentation</a>
             <a href="#" className="text-xs font-black text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors">Privacy</a>
             <a href="#" className="text-xs font-black text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
