import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/ui/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, X, GraduationCap, Clock, Briefcase, Video, Mic, Maximize, AlertCircle } from "lucide-react";

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
  const [isGreeting, setIsGreeting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);

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
      // 1. Fullscreen
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen().catch(e => console.error("Fullscreen failed", e));
      }

      // 2. Camera & Mic
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setStream(mediaStream);
      setIsGreeting(true);

      // 3. Speech Synthesis Greeting
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
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

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
      console.log("Transcript detected:", lowerTranscript);
      
      const keywords = ["yes", "ready", "okay", "ok", "begin", "start"];
      if (keywords.some(word => lowerTranscript.includes(word))) {
        console.log("confirmed");
        setIsConfirmed(true);
        // In a real app, this would trigger state machine transition
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === 'not-allowed') {
        setError("Microphone permission denied for speech recognition.");
      }
    };

    recognition.onend = () => {
      if (isGreeting && !isConfirmed) {
        try {
          recognition.start();
        } catch (e) {
          console.error("Failed to restart recognition:", e);
        }
      }
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.error("Initial start failed:", e);
    }
  };

  useEffect(() => {
    if (isGreeting && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [isGreeting, stream]);

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
      window.speechSynthesis.cancel();
    };
  }, []);

  if (isGreeting) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col items-center justify-center space-y-8">
          <div className="w-full h-full relative rounded-2xl overflow-hidden bg-black shadow-2xl border-4 border-primary/10">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            <div className="absolute top-6 left-6 flex gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-sm border border-white/20">
                <Video className="w-4 h-4 text-green-400" />
                Camera ON
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-sm border border-white/20">
                <Mic className="w-4 h-4 text-green-400" />
                Mic ON
              </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <div className="bg-black/50 backdrop-blur-md p-6 rounded-2xl border border-white/10 max-w-2xl">
                <p className="text-white text-xl font-medium leading-relaxed italic">
                  {`"Hello ${name}. Welcome to your AI Mock Interview focused on ${selectedDomains.join(", ")}. I am your interviewer today. Let's begin when you are ready."`}
                </p>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${isConfirmed ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-primary animate-pulse'}`} />
                    <p className={`${isConfirmed ? 'text-green-400' : 'text-primary/80'} text-sm font-semibold`}>
                      {isConfirmed ? "Confirmed! Getting ready..." : "Listening... try saying \"READY\" loud and clear."}
                    </p>
                  </div>
                  {transcript && !isConfirmed && (
                    <p className="text-white/40 text-xs italic ml-6">
                      Hearing: "{transcript}"
                    </p>
                  )}
                  {error && (
                    <div className="flex items-center gap-2 text-red-400 text-xs mt-2">
                      <AlertCircle className="w-3 h-3" />
                      {error}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-sm border border-white/20">
                <Maximize className="w-4 h-4" />
                Fullscreen
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
            {/* Name Input */}
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

            {/* Domain Selection */}
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
                      {isSelected ? (
                        <X className="w-3 h-3 ml-2" />
                      ) : (
                        <Check className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100" />
                      )}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Duration Selector */}
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
                    <RadioGroupItem
                      value={val}
                      id={`duration-${val}`}
                      className="peer sr-only"
                    />
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
