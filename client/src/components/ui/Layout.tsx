import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { BrainCircuit, Compass, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: BrainCircuit },
    { href: "/roadmap", label: "AI Roadmap", icon: Compass },
    { href: "/interview", label: "Mock Interview", icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl text-primary hover:opacity-90 transition-opacity">
            <BrainCircuit className="w-8 h-8" />
            <span>Talent<span className="text-foreground">AI</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
                  location === item.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
            <button className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all shadow-md shadow-primary/25">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-muted-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-b border-border bg-background overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "text-base font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-3",
                      location === item.href 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto bg-card">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground text-sm">
          <p>© 2024 TalentAI. Empowering careers with Artificial Intelligence.</p>
        </div>
      </footer>
    </div>
  );
}
