import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/ui/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, X, GraduationCap, Clock, Briefcase, Video, Mic, Maximize, AlertCircle, Timer, ChevronRight } from "lucide-react";

const DOMAINS = [
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "Data Science",
  "Machine Learning",
  "Product Management",
  "UI/UX Design",
  "Mobile Development",
  "Cloud Engineering",
  "Cybersecurity"
];

const DOMAIN_QUESTIONS: Record<string, string[]> = {
  "Frontend Development": [
    "What are the main differences between React and other frontend frameworks like Vue or Angular?",
    "How do you optimize a website's performance and core web vitals?",
    "Explain the concept of 'State Management' and when you'd use tools like Redux or Context API."
  ],
  "Backend Development": [
    "What is the difference between SQL and NoSQL databases, and how do you choose between them?",
    "Explain the concepts of REST and GraphQL. When would you use one over the other?",
    "How do you handle authentication and authorization in a distributed system?"
  ],
  "Full Stack Development": [
    "Describe the process of building a feature from frontend to backend.",
    "How do you manage database migrations in a production environment?",
    "What are some common security vulnerabilities in web applications and how do you prevent them?"
  ],
  "Data Science": [
    "Explain the bias-variance tradeoff in machine learning models.",
    "What is cross-validation and why is it important in model building?",
    "How do you handle missing data or outliers in a dataset?"
  ],
  "Machine Learning": [
    "What is the difference between supervised and unsupervised learning?",
    "How does a neural network learn? Explain backpropagation.",
    "What are some common metrics used to evaluate the performance of a classification model?"
  ],
  "Product Management": [
    "How do you prioritize features in a product roadmap?",
    "Describe a time you had to make a difficult product decision based on limited data.",
    "What is your approach to gathering and incorporating user feedback into a product?"
  ],
  "UI/UX Design": [
    "What are the key principles of responsive design?",
    "Describe your process for conducting user research and testing.",
    "How do you balance aesthetic design with functional usability?"
  ],
  "Mobile Development": [
    "What are the main differences between native and cross-platform mobile development?",
    "How do you handle offline data storage and synchronization in a mobile app?",
    "Explain the mobile application lifecycle and how you manage state within it."
  ],
  "Cloud Engineering": [
    "What are the benefits of using a serverless architecture?",
    "Explain the difference between IaaS, PaaS, and SaaS.",
    "How do you design for high availability and disaster recovery in the cloud?"
  ],
  "Cybersecurity": [
    "What is the difference between symmetric and asymmetric encryption?",
    "How do you prevent SQL injection and Cross-Site Scripting (XSS) attacks?",
    "Explain the concept of Zero Trust security and its core principles."
  ]
};

const COMMON_QUESTIONS = [
  "Tell me about yourself and your background.",
  "Why are you interested in this role and our company?",
  "What is your greatest professional achievement so far?",
  "How do you handle conflict or disagreement in a team setting?",
  "Where do you see yourself in five years?"
];

// Extend window for Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function InterviewDashboard() {
  const [name, setName] = useState("");
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [duration, setDuration] = useState("10");
  const [view, setView] = useState<"dashboard" | "greeting" | "interview">("dashboard");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  // Interview state
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleDomain = (domain: string) => {
    if (selectedDomains.includes(domain)) {
      setSelectedDomains(selectedDomains.filter(d => d !== domain));
    } else if (selectedDomains.length < 5) {
      setSelectedDomains([...selectedDomains, domain]);
    }
  };

  const startInterview = async () => {
    try {
      setError(null);
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen().catch(e => console.error("Fullscreen failed", e));
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setStream(mediaStream);
      
      // Build question set: mix common and domain-specific
      let questionSet = [COMMON_QUESTIONS[0]]; // Always start with "Tell me about yourself"
      
      selectedDomains.forEach(domain => {
        const domainQs = DOMAIN_QUESTIONS[domain] || [];
        // Add up to 1-2 questions per domain
        questionSet.push(...domainQs.slice(0, 1));
      });
      
      // Fill the rest with common questions if needed, up to a reasonable amount (e.g., 5-6 total)
      const additionalCommon = COMMON_QUESTIONS.slice(1).filter(q => !questionSet.includes(q));
      questionSet.push(...additionalCommon.slice(0, Math.max(0, 5 - questionSet.length)));
      
      setQuestions(questionSet);
      setView("greeting");

      const greeting = `Hello ${name}. Welcome to your AI Mock Interview focused on ${selectedDomains.join(", ")}. I am your interviewer today. Let's begin when you are ready. Please say "Ready" or "I am ready" to start.`;
      const utterance = new SpeechSynthesisUtterance(greeting);
      
      utterance.onend = () => {
        startConfirmationDetection();
      };
      
      window.speechSynthesis.speak(utterance);
    } catch (err: any) {
      console.error("Error starting interview:", err);
      setError("Failed to access camera/microphone. Please ensure permissions are granted.");
    }
  };

  const startConfirmationDetection = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (recognitionRef.current) recognitionRef.current.stop();

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let currentTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }
      
      const lowerTranscript = currentTranscript.toLowerCase();
      setTranscript(lowerTranscript);
      
      const keywords = ["yes", "ready", "okay", "ok", "begin", "start"];
      if (keywords.some(word => lowerTranscript.includes(word))) {
        setIsConfirmed(true);
        setTimeout(() => {
          startQuestionLoop();
        }, 1500);
      }
    };

    recognition.onend = () => {
      if (view === "greeting" && !isConfirmed) {
        try { recognition.start(); } catch (e) {}
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const startQuestionLoop = () => {
    setView("interview");
    setCurrentQuestionIndex(0);
    setTimeLeft(parseInt(duration) * 60);
    setAnswers([]);
    setTranscript("");
    
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleSubmitInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    speakQuestion(questions[0]);
  };

  const speakQuestion = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const nextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setTranscript("");
      speakQuestion(questions[nextIndex]);
    } else {
      handleSubmitInterview();
    }
  };

  const handleSubmitInterview = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    window.speechSynthesis.cancel();
    alert("Interview completed! (Report UI coming soon)");
    setView("dashboard");
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  };

  useEffect(() => {
    if (view !== "dashboard" && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [view, stream]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerRef.current) clearInterval(timerRef.current);
      window.speechSynthesis.cancel();
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (view === "greeting" || view === "interview") {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto h-[calc(100vh-12rem)] flex flex-col items-center justify-center space-y-8">
          <div className="w-full h-full relative rounded-3xl overflow-hidden bg-black shadow-2xl border-4 border-primary/10 flex flex-col md:flex-row">
            
            <div className="relative flex-1 bg-slate-900 overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              <div className="absolute top-6 left-6 flex gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-xs border border-white/20">
                  <Video className="w-4 h-4 text-green-400" />
                  Camera ON
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-xs border border-white/20">
                  <Mic className="w-4 h-4 text-green-400" />
                  Mic ON
                </div>
              </div>

              {view === "interview" && (
                <div className="absolute top-6 right-6">
                  <div className={`flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white font-bold border border-white/20 ${timeLeft < 60 ? 'text-red-400 animate-pulse' : ''}`}>
                    <Timer className="w-4 h-4" />
                    {formatTime(timeLeft)}
                  </div>
                </div>
              )}
            </div>

            <div className="w-full md:w-[400px] bg-card flex flex-col border-l border-border">
              <div className="p-6 border-b border-border bg-slate-50/50">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  {view === "greeting" ? "System Greeting" : `Question ${currentQuestionIndex + 1} of ${questions.length}`}
                </h3>
              </div>

              <div className="flex-1 p-8 flex flex-col">
                {view === "greeting" ? (
                  <div className="space-y-6">
                    <p className="text-xl font-medium leading-relaxed italic text-foreground">
                      {`"Hello ${name}. Welcome to your AI Mock Interview focused on ${selectedDomains.join(", ")}. I am your interviewer today. Let's begin when you are ready."`}
                    </p>
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-3 h-3 rounded-full ${isConfirmed ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-primary animate-pulse'}`} />
                        <p className={`${isConfirmed ? 'text-green-400' : 'text-primary/80'} text-sm font-semibold uppercase tracking-wider`}>
                          {isConfirmed ? "Confirmed!" : "Listening..."}
                        </p>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {isConfirmed ? "Initializing interview session..." : "Please say \"Ready\", \"Start\", or \"Yes\" to begin your practice."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-foreground leading-snug mb-8">
                        {questions[currentQuestionIndex]}
                      </h4>
                      
                      <div className="space-y-4">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your Response (Live Transcript)</Label>
                        <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-100 min-h-[150px] relative">
                          <p className="text-foreground leading-relaxed">
                            {transcript || "Waiting for your response..."}
                          </p>
                          {!transcript && <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none"><Mic className="w-12 h-12" /></div>}
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={nextQuestion}
                      className="w-full h-14 mt-8 text-lg font-bold group shadow-xl shadow-primary/20"
                    >
                      {currentQuestionIndex === questions.length - 1 ? "Finish Interview" : "Next Question"}
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-3">AI Mock Interview</h1>
          <p className="text-muted-foreground text-lg">
            Practice with our AI interviewer to sharpen your skills and boost your confidence.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-1 pb-8">
            <CardTitle className="text-2xl">Session Configuration</CardTitle>
            <CardDescription>
              Set up your interview preferences before we begin the session.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-base font-semibold flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" />
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11"
                data-testid="input-name"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  Target Domains
                </Label>
                <span className="text-xs text-muted-foreground font-medium bg-secondary px-2 py-1 rounded">
                  {selectedDomains.length}/5 selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {DOMAINS.map((domain) => {
                  const isSelected = selectedDomains.includes(domain);
                  return (
                    <Badge
                      key={domain}
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer px-3 py-1.5 text-sm transition-all hover:scale-105 active:scale-95 ${
                        isSelected 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-primary/5 hover:border-primary/50"
                      }`}
                      onClick={() => toggleDomain(domain)}
                      data-testid={`badge-domain-${domain.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {domain}
                      {isSelected ? <X className="w-3 h-3 ml-2" /> : <Check className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100" />}
                    </Badge>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Interview Duration (minutes)
              </Label>
              <RadioGroup
                value={duration}
                onValueChange={setDuration}
                className="grid grid-cols-3 gap-4"
                data-testid="radio-group-duration"
              >
                {["5", "10", "15"].map((val) => (
                  <div key={val}>
                    <RadioGroupItem value={val} id={`duration-${val}`} className="peer sr-only" />
                    <Label
                      htmlFor={`duration-${val}`}
                      className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                    >
                      <span className="text-xl font-bold">{val}</span>
                      <span className="text-xs font-medium text-muted-foreground mt-1 uppercase tracking-wider">Mins</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="pt-6 pb-8">
            <Button 
              size="lg" 
              className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
              disabled={!name || selectedDomains.length === 0}
              onClick={startInterview}
              data-testid="button-start-interview"
            >
              Start Practice Session
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
