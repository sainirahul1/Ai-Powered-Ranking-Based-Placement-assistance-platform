import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertInterview, type Interview } from "@shared/schema";
import { useInterviews } from "@/hooks/use-interview";
import { Layout } from "@/components/ui/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, X, GraduationCap, Clock, Briefcase, Video, Mic, Maximize, AlertCircle, Timer, ChevronRight, ArrowRight, Sparkles, Trophy, Star, History, PlusCircle, Shield, Zap, Cpu } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { EXTENDED_DOMAIN_QUESTIONS } from "@/data/extendedQuestions";
import { motion, AnimatePresence } from "framer-motion";

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

interface EvaluationResult {
  question: string;
  answer: string;
  score: number;
  feedback: string;
  referenceAnswer: string;
}

const VoiceVisualizer = ({ isActive }: { isActive: boolean }) => (
  <div className="voice-visualizer">
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="voice-bar"
        animate={isActive ? {
          height: [4, Math.random() * 20 + 4, 4],
          opacity: [0.3, 1, 0.3]
        } : { height: 4, opacity: 0.3 }}
        transition={{
          duration: 0.5 + Math.random() * 0.5,
          repeat: Infinity,
          delay: i * 0.05
        }}
      />
    ))}
  </div>
);

const CircularProgress = ({ value, color, label }: { value: number, color: string, label: string }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48" cy="48" r={radius}
            className="stroke-muted fill-none"
            strokeWidth="8"
          />
          <motion.circle
            cx="48" cy="48" r={radius}
            className={`fill-none ${color}`}
            strokeWidth="8"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-black">{value}%</span>
        </div>
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
    </div>
  );
};

export default function InterviewDashboard() {
  const [name, setName] = useState("");
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [duration, setDuration] = useState("10");
  const [view, setView] = useState<"dashboard" | "greeting" | "interview" | "report" | "history">("dashboard");
  const { data: history, isLoading: loadingHistory } = useInterviews();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false); // Track if currently listening
  const [recordingTime, setRecordingTime] = useState(0); // Track recording duration
  const [isPaused, setIsPaused] = useState(false); // Track if paused
  
  // Interview state
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [evaluations, setEvaluations] = useState<EvaluationResult[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef<string>(""); // Store FINAL (confirmed) transcript only
  const interimTranscriptRef = useRef<string>(""); // Store interim (preview) text only
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

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
      
      // Build question bank ensuring at least 50 items per domain
      const normalizeBank = () => {
        const bank: Record<string, string[]> = {};
        Object.keys(DOMAIN_QUESTIONS).forEach((d) => {
          const existing = (EXTENDED_DOMAIN_QUESTIONS[d] || []).map(q => (typeof q === 'string' ? q : q.text));
          const base = existing.length ? existing : (DOMAIN_QUESTIONS[d] || []);
          const list = [...base];
          // Fill up to 50 with templated questions if needed
          for (let i = list.length; i < 50; i++) {
            list.push(`${d} - Additional practice question ${i + 1}`);
          }
          bank[d] = list;
        });
        return bank;
      };

      const bank = normalizeBank();

      // Build initial question set: include first common question plus a few per selected domain
      let questionSet = [COMMON_QUESTIONS[0]];
      selectedDomains.forEach(domain => {
        const domainQs = bank[domain] || [];
        // take the first 5 questions for initial session (plenty to choose from)
        questionSet.push(...domainQs.slice(0, 5));
      });
      const additionalCommon = COMMON_QUESTIONS.slice(1).filter(q => !questionSet.includes(q));
      questionSet.push(...additionalCommon.slice(0, Math.max(0, 10 - questionSet.length)));

      setQuestions(questionSet);
      setView("greeting");

      const greeting = `Hello ${name}. Welcome to your AI Mock Interview focused on ${selectedDomains.join(", ")}. I am your interviewer today. Let's begin when you are ready. Please say Ready to start.`;
      
      // Cancel any previous speech to ensure clean start
      window.speechSynthesis.cancel();
      
      let greetingPlayed = false;
      
      // Function to speak greeting - called only once
      const speakGreeting = () => {
        if (greetingPlayed) return; // Prevent multiple plays
        greetingPlayed = true;
        
        const utterance = new SpeechSynthesisUtterance(greeting);
        
        // Configure speech synthesis
        utterance.volume = 1;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        
        // Try to get voices
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          utterance.voice = voices[0];
        }
        
        utterance.onstart = () => {
          console.log("✓ Greeting playing...");
        };
        
        utterance.onend = () => {
          console.log("✓ Greeting finished - Starting voice confirmation detection");
          startConfirmationDetection();
        };
        
        utterance.onerror = (event) => {
          console.error("Speech error:", event.error);
          startConfirmationDetection();
        };
        
        try {
          window.speechSynthesis.speak(utterance);
        } catch (e) {
          console.error("Failed to speak greeting:", e);
          startConfirmationDetection();
        }
      };
      
      // Remove old event listener if exists to prevent duplicates
      window.speechSynthesis.onvoiceschanged = null;
      
      // Speak immediately if voices are ready, otherwise wait for voiceschanged
      if (window.speechSynthesis.getVoices().length > 0) {
        speakGreeting();
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          speakGreeting();
          window.speechSynthesis.onvoiceschanged = null; // Remove listener after first call
        };
      }
      
      // Timeout: if greeting didn't play after 3 seconds, start listening anyway
      setTimeout(() => {
        if (!greetingPlayed) {
          console.log("Greeting timeout, starting confirmation detection...");
          startConfirmationDetection();
        }
      }, 3000);
    } catch (err: any) {
      console.error("Error starting interview:", err);
      setError("Failed to access camera/microphone. Please ensure permissions are granted.");
    }
  };

  const startConfirmationDetection = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("❌ Speech Recognition not supported");
      setError('Speech Recognition not supported. Please use Chrome, Edge, or Firefox.');
      return;
    }
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false; // Stop after each phrase
      recognition.interimResults = false; // Only final results
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 3; // Get multiple alternative interpretations

      let confirmationDetected = false;
      let listeningStartTime = Date.now();

      recognition.onstart = () => {
        listeningStartTime = Date.now();
        console.log("🎤 LISTENING - Say 'Ready' now...");
      };

      recognition.onresult = (event: any) => {
        console.log("📊 Recognition event received with", event.results.length, "results");
        
        // Get all transcripts with confidence scores
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript.toLowerCase().trim();
          const confidence = event.results[i][0].confidence;
          
          console.log(`  [${i}] "${transcript}" (confidence: ${(confidence * 100).toFixed(0)}%)`);
          
          // Check if "ready" or "start" is detected
          if (transcript.includes("ready") || transcript.includes("start")) {
            console.log("✅ MATCH FOUND: '" + transcript + "'");
            
            if (!confirmationDetected) {
              confirmationDetected = true;
              setIsConfirmed(true);
              setTranscript(transcript);
              
              try {
                recognition.abort();
              } catch (e) {}
              
              console.log("🚀 Starting interview...");
              startQuestionLoop();
              return;
            }
          }
        }
      };

      recognition.onend = () => {
        const listeningDuration = Date.now() - listeningStartTime;
        console.log(`⏹️  Recognition ended after ${listeningDuration}ms`);
        
        // Restart recognition if not confirmed yet
        if (!confirmationDetected && view === "greeting") {
          console.log("🔄 Restarting recognition...");
          setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {
              console.error("Failed to restart:", e);
            }
          }, 500);
        }
      };

      recognition.onerror = (e: any) => {
        console.error('❌ ERROR:', e.error);
        
        if (e.error === 'not-allowed' || e.error === 'permission-denied') {
          setError('❌ Microphone access denied. Please allow microphone permissions.');
        } else if (e.error === 'no-speech') {
          console.log("⏱️  No speech detected, listening again...");
        } else if (e.error === 'network' || e.error === 'offline') {
          setError('⚠️ Network issue detected. Please check your internet connection and try again.');
          console.log("🌐 Network issue with Google Speech API - check internet connectivity.");
        } else if (e.error === 'audio-capture') {
          setError('❌ No microphone found or access denied.');
        }
        
        // Restart on error if not confirmed
        if (!confirmationDetected && view === "greeting") {
          setTimeout(() => {
            try {
              recognition.start();
            } catch (ex) {}
          }, 500);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
      
    } catch (e) {
      console.error('Failed to start listening', e);
      setError('Failed to access microphone. Please refresh and try again.');
    }
  };

  const startQuestionLoop = () => {
    setView("interview");
    setCurrentQuestionIndex(0);
    setTimeLeft(parseInt(duration) * 60);
    setEvaluations([]);
    setTranscript("");
    setIsListening(false); // Reset listening state
    
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

    // Speak the first question - user will click button to start listening
    speakQuestion(questions[0]);
  };

  const startAnswerRecognition = () => {
    try {
      console.log("🔍 Checking Speech Recognition API...");
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        console.error("❌ Speech Recognition API not available");
        setError('Speech Recognition not supported. Use Chrome, Edge, or Firefox.');
        return;
      }

      console.log("✓ Speech Recognition API found");

      // Abort any existing recognition
      if (recognitionRef.current) {
        try { 
          recognitionRef.current.abort();
          console.log("✓ Previous recognition aborted");
        } catch (e) {
          console.error("Error aborting previous recognition:", e);
        }
      }

      // Reset for completely fresh recording - CLEAR REFS FIRST
      finalTranscriptRef.current = "";
      interimTranscriptRef.current = "";
      setTranscript("");
      setRecordingTime(0);
      setIsPaused(false);
      setIsListening(true);

      console.log(`🎤 Starting FRESH recording for Question ${currentQuestionIndex + 1} (Final refs cleared)`);

      // Start recording timer
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      // Create new recognition instance
      const recognition = new SpeechRecognition();
      
      // Configure recognition - use continuous=false to prevent infinite restarts
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.language = 'en-US';
      recognition.maxAlternatives = 1;

      let hasResult = false;
      let restartTimeout: NodeJS.Timeout;

      recognition.onstart = () => {
        console.log("🎤 Speech recognition started - Listening now...");
        hasResult = false;
      };

      recognition.onresult = (event: any) => {
        hasResult = true;
        console.log(`📝 Result event - ${event.results.length} results total`);
        
        // Process ONLY FINAL results for the stored transcript
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence;
          const isFinal = event.results[i].isFinal;
          
          console.log(`  [${i}] "${transcript}" | Confidence: ${(confidence * 100).toFixed(0)}% | Final: ${isFinal}`);
          
          if (isFinal && confidence > 0.3) {
            // ONLY add final, high-confidence results to the stored transcript
            if (!finalTranscriptRef.current.includes(transcript.trim())) {
              finalTranscriptRef.current += (finalTranscriptRef.current ? " " : "") + transcript.trim();
              console.log(`✅ FINAL result added: "${transcript}" (Confidence: ${(confidence * 100).toFixed(0)}%)`);
            }
          } else if (!isFinal) {
            // Store interim ONLY for preview
            interimTranscriptRef.current = transcript;
            console.log(`💭 Interim preview: "${transcript}"`);
          }
        }
        
        // Display: Final text + interim preview
        const displayText = (finalTranscriptRef.current + (interimTranscriptRef.current ? " " + interimTranscriptRef.current : "")).trim();
        console.log(`📄 DISPLAY TEXT: "${displayText}"`);
        setTranscript(displayText);
      };

      recognition.onerror = (event: any) => {
        console.error(`❌ Speech recognition error: ${event.error}`);
        
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setError('❌ Microphone access denied. Please allow microphone in browser settings.');
        } else if (event.error === 'audio-capture') {
          setError('❌ No microphone found. Please check your audio device and try again.');
        } else if (event.error === 'network') {
          setError('⚠️ Network issue detected. Please check your internet connection and refresh the page.');
          console.log('🌐 Network error - Google Speech API unreachable. Check internet connectivity.');
        } else if (event.error === 'no-speech') {
          console.log('📭 No speech detected yet - keep speaking...');
        } else if (event.error === 'bad-grammar') {
          console.log('⚠️ Grammar issue - trying again...');
        }
      };

      recognition.onend = () => {
        console.log(`⏹️  Recognition ended (had results: ${hasResult})`);
        console.log(`📊 FINAL TRANSCRIPT AT END: "${finalTranscriptRef.current}"`);
        
        // Only auto-restart if we were listening and haven't captured anything yet
        // AND we're still in interview mode
        if (view === 'interview' && isListening && !isPaused && !hasResult) {
          // Set a timeout to restart (avoid infinite immediate restarts)
          console.log("⏱️  No results yet - scheduling restart in 500ms...");
          restartTimeout = setTimeout(() => {
            if (recognitionRef.current && view === 'interview' && isListening) {
              console.log("🔄 Restarting recognition after timeout...");
              try { 
                recognitionRef.current.start();
              } catch (e) { 
                console.error("Failed to restart:", e);
              }
            }
          }, 500);
        }
      };

      // Start recognition
      recognition.start();
      recognitionRef.current = recognition;
      console.log("✅ Recognition started successfully (CLEAN STATE)");

    } catch (error) {
      console.error('❌ Critical error in startAnswerRecognition:', error);
      setError('Failed to initialize microphone. Please refresh and try again.');
    }
  };

  const pauseRecording = () => {
    console.log("⏸️  Pausing recording");
    setIsPaused(true);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (recognitionRef.current) {
      try { 
        recognitionRef.current.abort();
        console.log("✓ Recognition paused");
      } catch (e) {
        console.error("Error pausing:", e);
      }
    }
  };

  const resumeRecording = () => {
    console.log("▶️  Resuming recording");
    setIsPaused(false);
    
    // Restart timer
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    recordingTimerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
    
    // Restart recognition with fresh object
    if (recognitionRef.current) {
      try {
        const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
        const newRecognition = new SpeechRecognition();
        
        newRecognition.continuous = false;
        newRecognition.interimResults = true;
        newRecognition.language = 'en-US';

        let hasResult = false;

        newRecognition.onstart = () => {
          console.log("🎯 Recognition resumed - Listening...");
          hasResult = false;
        };

        newRecognition.onresult = (event: any) => {
          hasResult = true;
          // Process ONLY FINAL results
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            const confidence = event.results[i][0].confidence;
            const isFinal = event.results[i].isFinal;
            
            if (isFinal && confidence > 0.5) {
              // ONLY add final, high-confidence results
              if (!finalTranscriptRef.current.includes(transcript.trim())) {
                finalTranscriptRef.current += (finalTranscriptRef.current ? " " : "") + transcript.trim();
                console.log(`✅ FINAL resumed: "${transcript}" (${(confidence * 100).toFixed(0)}%)`);
              }
            } else if (!isFinal) {
              interimTranscriptRef.current = transcript;
            }
          }
          
          const displayText = (finalTranscriptRef.current + (interimTranscriptRef.current ? " " + interimTranscriptRef.current : "")).trim();
          setTranscript(displayText);
        };

        newRecognition.onerror = (event: any) => {
          console.error('Error during resume:', event.error);
        };

        newRecognition.onend = () => {
          console.log("Recognition ended after resume");
          if (view === 'interview' && !isPaused && !hasResult) {
            console.log("Restarting after resume...");
            try { newRecognition.start(); } catch (e) { }
          }
        };

        newRecognition.start();
        recognitionRef.current = newRecognition;
        console.log("✓ Recognition resumed (Using final results only)");
      } catch (e) {
        console.error("Failed to resume:", e);
      }
    }
  };

  const redoRecording = () => {
    console.log("🔄 Redoing recording");
    // Stop current recording
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (e) {}
    }
    
    // Reset ALL refs and state for completely fresh start
    finalTranscriptRef.current = "";
    interimTranscriptRef.current = "";
    setTranscript("");
    setRecordingTime(0);
    setIsPaused(false);
    console.log("🆕 All refs cleared. Starting fresh recording...");
    startAnswerRecognition();
  };

  const speakQuestion = (text: string) => {
    try {
      window.speechSynthesis.cancel();
      
      // Get available voices
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        console.warn("No voices available");
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = 1;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.voice = voices[0];
      
      utterance.onstart = () => console.log("✓ Question playing");
      utterance.onend = () => console.log("✓ Question finished");
      utterance.onerror = (event) => console.error("Speech error:", event.error);
      
      // Small delay to ensure browser is ready
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 100);
    } catch (error) {
      console.error("Failed to speak:", error);
    }
  };

  const nextQuestion = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Stop listening completely for CLEAN slate
      setIsListening(false);
      setIsPaused(false);
      setRecordingTime(0);
      
      // Stop recording timer immediately
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      
      // Completely abort speech recognition - force stop
      if (recognitionRef.current) {
        try { 
          recognitionRef.current.abort();
          console.log("✓ Recognition completely stopped for question transition");
        } catch (e) {
          console.error("Error stopping recognition:", e);
        }
      }

      // Evaluate current answer (even if empty - user skipped)
      // USE FINAL TRANSCRIPT ONLY - NO INTERIM/PREVIEW TEXT
      const userAnswer = finalTranscriptRef.current.trim().length > 0 
        ? finalTranscriptRef.current.trim() 
        : "(Skipped - No answer provided)";
      const currentQuestion = questions[currentQuestionIndex];
      
      console.log(`📊 Evaluating Q${currentQuestionIndex + 1}:`);
      console.log(`    Question: "${currentQuestion}"`);
      console.log(`    FINAL Answer: "${userAnswer}"`);
      console.log(`    Word Count: ${getWordCount(finalTranscriptRef.current)}`);
      console.log(`    (Live display text was: "${transcript}")`);
      
      // Send to evaluation API
      const res = await apiRequest("POST", "/api/interview/answer", {
        question: currentQuestion,
        answer: userAnswer
      });
      const data = await res.json();
      
      setEvaluations(prev => [...prev, { 
        question: currentQuestion,
        answer: userAnswer,
        score: data.score, 
        feedback: data.feedback,
        referenceAnswer: data.referenceAnswer
      }]);

      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < questions.length) {
        // IMPORTANT: Reset everything for fresh question
        console.log(`\n✨ FRESH START - Moving to Q${nextIndex + 1}/${questions.length}`);
        
        // Clear BOTH final and interim refs for completely fresh state
        finalTranscriptRef.current = "";
        interimTranscriptRef.current = "";
        setTranscript("");
        
        // Reset all recording states
        setIsListening(false);
        setIsPaused(false);
        setRecordingTime(0);
        
        // Update question index
        setCurrentQuestionIndex(nextIndex);
        
        // Speak new question (recognition will restart when user clicks button)
        speakQuestion(questions[nextIndex]);
        
        console.log("✓ Question reset complete - All refs cleared for fresh recording");
      } else {
        // All questions completed
        console.log("\n🏁 All questions completed!");
        handleSubmitInterview();
      }
    } catch (err) {
      console.error("❌ Failed to evaluate:", err);
      setError("Error evaluating answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitInterview = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    window.speechSynthesis.cancel();
    
    // Stop listening
    setIsListening(false);
    
    // Stop all media streams (camera and microphone)
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
    }
    
    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    // Clear video source
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Save for persistence
    try {
      const totalScore = evaluations.reduce((acc, curr) => acc + curr.score, 0);
      const averageScore = evaluations.length > 0 ? Math.round(totalScore / evaluations.length) : 0;
      
      await apiRequest("POST", "/api/interview/start", {
        topic: selectedDomains[0] || "General Technical",
        difficulty: duration === "15" ? "Hard" : duration === "10" ? "Medium" : "Easy",
        answers: evaluations,
        feedback: { 
          averageScore, 
          summary: `Completed session in ${selectedDomains.join(", ")}.` 
        }
      });
      console.log("✓ Interview session saved to database");
    } catch (err) {
      console.error("Failed to save interview session:", err);
    }
    
    setView("report");
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  };

  useEffect(() => {
    if (view !== "dashboard" && view !== "report" && videoRef.current && stream) {
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

  // Keyboard shortcut for next question
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Listen for Enter key during interview view (allow skipping even without speaking)
      if (view === 'interview' && e.key === 'Enter' && isListening && !isSubmitting) {
        e.preventDefault();
        console.log("⌨️ Enter key pressed - Moving to next question (Final transcript: '" + finalTranscriptRef.current + "')");
        nextQuestion();
      }
    };

    if (view === 'interview') {
      window.addEventListener('keydown', handleKeyPress);
      console.log("✓ Keyboard shortcut enabled - Press Enter anytime to move to next question (even if skipping)");
      
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
        console.log("Keyboard shortcut disabled");
      };
    }
  }, [view, isListening, transcript]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
  };

  const getAnswerQuality = (text: string) => {
    const wordCount = getWordCount(text);
    if (wordCount === 0) return { level: 'empty', color: 'text-gray-400', label: 'No answer yet' };
    if (wordCount < 10) return { level: 'short', color: 'text-yellow-500', label: 'Too short (aim for 30+ words)' };
    if (wordCount < 30) return { level: 'fair', color: 'text-orange-500', label: 'Good start (consider more detail)' };
    if (wordCount < 100) return { level: 'good', color: 'text-blue-500', label: 'Good answer' };
    return { level: 'excellent', color: 'text-green-500', label: 'Comprehensive answer' };
  };

  const downloadFeedbackPDF = async () => {
    if (!evaluations || evaluations.length === 0) {
      alert('No feedback available to download.');
      return;
    }
    try {
      // Load jsPDF at runtime via CDN if not available locally to avoid build-time resolution errors
      const loadJsPDF = async () => {
        const win = window as any;
        if (win.jspdf && win.jspdf.jsPDF) return win.jspdf;
        return new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
          s.async = true;
          s.onload = () => {
            if (win.jspdf && win.jspdf.jsPDF) resolve(win.jspdf);
            else reject(new Error('jsPDF loaded but global not found'));
          };
          s.onerror = () => reject(new Error('Failed to load jsPDF'));
          document.head.appendChild(s);
        });
      };

      const jspdfLib = await loadJsPDF();
      const jsPDF = jspdfLib.jsPDF;
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(`Interview Report - ${name || 'Candidate'}`, 14, 20);
      doc.setFontSize(11);
      let y = 30;
      evaluations.forEach((e, idx) => {
        const q = `Q${idx + 1}: ${e.question}`;
        const a = `Answer: ${e.answer}`;
        const f = `Feedback: ${e.feedback}`;
        doc.setFontSize(12);
        doc.text(q, 14, y);
        y += 8;
        doc.setFontSize(10);
        // split text into lines using jsPDF splitTextToSize
        const aLines = doc.splitTextToSize(a, 180);
        doc.text(aLines, 14, y);
        y += aLines.length * 6 + 2;
        const fLines = doc.splitTextToSize(f, 180);
        doc.text(fLines, 14, y);
        y += fLines.length * 6 + 4;
        doc.text(`Score: ${e.score}`, 14, y);
        y += 12;
        if (y > 260) {
          doc.addPage();
          y = 20;
        }
      });
      doc.save(`${(name || 'candidate').replace(/\s+/g, '_')}_interview_feedback.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  if (view === "report") {
    const totalScore = evaluations.reduce((acc, curr) => acc + curr.score, 0);
    const averageScore = evaluations.length > 0 ? Math.round(totalScore / evaluations.length) : 0;
    const performanceLevel = averageScore >= 90 ? "Expert" : averageScore >= 75 ? "Professional" : averageScore >= 50 ? "Developing" : "Needs Practice";
    const performanceColor = averageScore >= 75 ? "text-emerald-400" : averageScore >= 50 ? "text-yellow-400" : "text-rose-400";

    return (
      <Layout>
        <div className="max-w-5xl mx-auto py-8 sm:py-12 px-4 space-y-8 sm:space-y-12 fade-in">
          <div className="text-center space-y-3 sm:space-y-4">
            <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="inline-block p-4 rounded-full bg-primary/10 border border-primary/20 mb-4"
            >
              <Trophy className="w-12 h-12 text-primary" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight">Interview Performance Report</h1>
            <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto">
              Comprehensive analysis of your interview session in <span className="text-primary font-semibold">{selectedDomains.join(", ")}</span> for <span className="text-foreground font-bold">{name}</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 px-8 glass-card border-border/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Trophy className="w-48 h-48" />
            </div>
            <CircularProgress value={averageScore} color="stroke-primary" label="Overall Score" />
            <div className="flex flex-col items-center justify-center text-center">
              <div className={`text-4xl font-black mb-2 text-glow ${performanceColor}`}>{performanceLevel}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Proficiency Level</div>
            </div>
            <CircularProgress 
              value={Math.round((evaluations.length / questions.length) * 100)} 
              color="stroke-cyan-500" 
              label="Completion Rate" 
            />
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Star className="w-8 h-8 text-yellow-400" /> Detailed Session Breakdown
            </h2>
            
            <div className="space-y-6">
              {evaluations.map((evalItem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-card overflow-hidden border-border/30 hover:border-primary/30 transition-all duration-500 group">
                    <div className="flex flex-col lg:flex-row gap-10">
                      <div className="flex-1 space-y-8">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">
                               <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                               Question {index + 1}
                            </div>
                            <h3 className="text-2xl font-bold leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors">
                               {evalItem.question}
                            </h3>
                          </div>
                          <div className={`shrink-0 px-4 py-2 rounded-xl glass border-border/40 font-black text-xl ${evalItem.score >= 75 ? 'text-emerald-400' : evalItem.score >= 50 ? 'text-yellow-400' : 'text-rose-400'}`}>
                             {evalItem.score}%
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-3">
                              <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                 <Mic className="w-3 h-3" /> Candidate Response
                              </Label>
                              <div className="text-foreground/90 text-sm leading-relaxed p-5 rounded-2xl bg-muted/20 border border-border/20 italic font-medium">
                                 "{evalItem.answer}"
                              </div>
                           </div>

                           <div className="space-y-3">
                              <Label className="text-[10px] font-black text-emerald-500 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                 <Sparkles className="w-3 h-3" /> Optimized Reference
                              </Label>
                              <div className="text-emerald-950 dark:text-emerald-50/90 text-sm leading-relaxed p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 font-medium">
                                 {evalItem.referenceAnswer}
                              </div>
                           </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
                           <Label className="text-[10px] font-black text-indigo-500 dark:text-indigo-300 uppercase tracking-widest flex items-center gap-2">
                              <Shield className="w-3 h-3" /> AI Expert Feedback
                           </Label>
                           <p className="text-sm text-indigo-900 dark:text-indigo-200/90 leading-relaxed font-medium">
                              {evalItem.feedback}
                           </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 pt-8 sm:pt-12 pb-12 sm:pb-20">
            <Button
              size="lg"
              variant="outline"
              className="glass px-6 sm:px-10 rounded-xl h-11 sm:h-14 w-full sm:w-auto"
              onClick={downloadFeedbackPDF}
            >
              Download PDF Report
            </Button>
            <Button 
              size="lg" 
              onClick={() => window.location.reload()}
              className="btn-primary h-12 sm:h-14"
            >
              Practice Again
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => setView("dashboard")}
              className="glass px-6 sm:px-10 rounded-xl h-11 sm:h-14 w-full sm:w-auto"
            >
              Exit Terminal
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (view === "greeting" || view === "interview") {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto h-[calc(100vh-10rem)] flex flex-col items-center justify-center p-4 fade-in">
          <div className="w-full h-full relative rounded-[2rem] overflow-hidden glass border border-border/40 shadow-2xl flex flex-col md:flex-row transition-all duration-500">
            
            {/* Camera / Video Feed Section */}
            <div className="relative flex-1 bg-slate-950 overflow-hidden group">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Scanning Effect */}
              <div className="scanning-line" />
              
              {/* Terminal Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/20" />
              
              <div className="absolute top-6 left-6 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 glass border-border/40 rounded-full text-foreground text-xs font-bold ring-1 ring-border/20">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  SENSOR: VIDEO_ACTIVE
                </div>
                <div className="flex items-center gap-2 px-4 py-2 glass border-border/40 rounded-full text-foreground text-xs font-bold ring-1 ring-border/20">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  SENSOR: AUDIO_ACTIVE
                </div>
              </div>

              {view === "interview" && (
                <div className="absolute top-6 right-6">
                  <div className={`flex items-center gap-3 px-6 py-2 glass border-border/40 rounded-full text-foreground font-mono text-lg font-black tracking-tighter ${timeLeft < 60 ? 'text-rose-500 animate-pulse' : ''}`}>
                    <Timer className="w-5 h-5" />
                    {formatTime(timeLeft)}
                  </div>
                </div>
              )}

              {/* AI Status Indicator */}
              <div className="absolute bottom-8 left-8">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-indigo-500 animate-glow" />
                    <span className="text-foreground font-display font-bold tracking-widest text-xs uppercase">AI Processor Online</span>
                  </div>
                  <div className="w-64 h-1 bg-muted-foreground/20 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Content / Interaction Panel */}
            <div className="w-full md:w-[450px] bg-background/80 backdrop-blur-3xl flex flex-col border-l border-border/40 overflow-hidden">
              <div className="p-8 border-b border-border/40 flex-shrink-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-black text-xl uppercase tracking-widest text-indigo-600 dark:text-indigo-300">
                    {view === "greeting" ? "Initial Handshake" : "Terminal Session"}
                  </h3>
                  {view === "interview" && (
                    <span className="text-xs font-mono text-indigo-600/60 dark:text-indigo-400/60 bg-indigo-500/5 px-2 py-1 rounded border border-indigo-500/20">
                      STEP_{currentQuestionIndex + 1}/{questions.length}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 flex flex-col space-y-8">
                {view === "greeting" ? (
                  <div className="space-y-8">
                    <motion.div 
                      className="space-y-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p className="text-2xl font-bold leading-relaxed text-foreground font-display">
                        {`"Protocol initialized. Hello ${name}. Welcome to the high-fidelity assessment for ${selectedDomains.join(", ")}."`}
                      </p>
                      
                      <div className="p-6 rounded-2xl glass border-indigo-500/20 bg-indigo-500/5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-3 h-3 rounded-full ${isConfirmed ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-amber-500 animate-pulse'}`} />
                          <p className={`${isConfirmed ? 'text-emerald-500' : 'text-amber-500'} text-sm font-black uppercase tracking-[0.2em]`}>
                            {isConfirmed ? "CONNECTION_ESTABLISHED" : "WAITING_FOR_VOICE..."}
                          </p>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {isConfirmed ? "Initializing secure interview session. Please hold..." : "To begin the assessment, please say \"Ready\", \"Start\", or \"Yes\"."}
                        </p>
                      </div>
                    </motion.div>

                    {!isConfirmed && (
                      <Button 
                        onClick={() => startQuestionLoop()}
                        className="w-full h-14 btn-primary"
                        variant="default"
                      >
                        Force Manual Start
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col h-full gap-8">
                    {/* Progress Monitor */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600/60 dark:text-indigo-400/60">
                        <span>Progress Monitor</span>
                        <span>{Math.round((currentQuestionIndex / questions.length) * 100)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden border border-border/40">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-[0_0_10px_#6366f1]"
                          initial={{ width: 0 }}
                          animate={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col space-y-8">
                      <motion.h4 
                        key={currentQuestionIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl font-bold text-foreground leading-tight font-display"
                      >
                        {questions[currentQuestionIndex]}
                      </motion.h4>
                      
                      {!isListening ? (
                        <div className="flex flex-col items-center justify-center flex-1 space-y-6 text-center glass border-border/40 rounded-3xl p-8">
                          <p className="text-muted-foreground text-sm font-medium">
                            Synthesizing response path... <br/> Click initialize to begin recording.
                          </p>
                          <Button
                            onClick={startAnswerRecognition}
                            className="w-full h-16 btn-primary rounded-2xl"
                          >
                            <Mic className="w-6 h-6 mr-3" />
                            Initialize Recording
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-6 flex-1 flex flex-col">
                          {/* Recording Monitor */}
                          <div className="flex items-center justify-between glass border-rose-500/50 p-4 rounded-2xl bg-rose-500/5 border-glow">
                            <div className="flex items-center gap-3">
                              <VoiceVisualizer isActive={isListening} />
                              <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">Live Capture</span>
                            </div>
                            <span className="text-xs font-mono text-foreground font-bold">{formatTime(recordingTime)}</span>
                          </div>

                          {/* Live Transcript Terminal */}
                          <div className="relative flex-1 flex flex-col">
                            <div className="absolute top-4 right-4 pointer-events-none opacity-20">
                              <Mic className="w-12 h-12 text-indigo-400" />
                            </div>
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600/60 dark:text-indigo-400/60 mb-3">Response Buffer</Label>
                            <div className="flex-1 p-6 rounded-2xl glass border-border/40 bg-muted/5 overflow-y-auto max-h-[250px]">
                              <p className="text-foreground font-medium leading-relaxed text-lg">
                                {transcript || <span className="animate-pulse opacity-40">Analyzing voice input...</span>}
                              </p>
                            </div>
                          </div>

                          {/* Answer Metrics */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl glass border-border/40 flex flex-col gap-1">
                              <span className="text-[9px] font-bold text-indigo-600/60 dark:text-indigo-400/60 uppercase">Complexity</span>
                              <span className={`text-sm font-black ${getAnswerQuality(transcript).color}`}>
                                {getAnswerQuality(transcript).label.split(' ')[0]}
                              </span>
                            </div>
                            <div className="p-4 rounded-2xl glass border-border/40 flex flex-col gap-1">
                              <span className="text-[9px] font-bold text-indigo-600/60 dark:text-indigo-400/60 uppercase">Tokens</span>
                              <span className="text-sm font-black text-foreground">{getWordCount(transcript)} words</span>
                            </div>
                          </div>

                          <Button
                            onClick={redoRecording}
                            variant="outline"
                            className="w-full h-12 glass border-border/40 text-xs font-bold uppercase tracking-widest hover:bg-rose-500/10 hover:text-rose-500 transition-all duration-300"
                          >
                            <X className="w-4 h-4 mr-2" /> Reset Buffer
                          </Button>
                        </div>
                      )}
                    </div>

                    <Button 
                      onClick={nextQuestion}
                      disabled={isSubmitting}
                      className={`w-full h-16 text-lg font-black rounded-2xl transition-all duration-500 ${
                        getWordCount(transcript) > 20 
                        ? 'btn-primary' 
                        : 'glass border-border/40 text-indigo-600 dark:text-indigo-300'
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-3">
                          <Cpu className="w-5 h-5 animate-spin" />
                          Analyzing...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {currentQuestionIndex === questions.length - 1 ? "COMMIT_SESSION" : "NEXT_STEP"}
                          <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                        </div>
                      )}
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

  if (view === "history") {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">Interview History</h1>
              <p className="text-muted-foreground text-sm sm:text-lg">Review your past performance and growth.</p>
            </div>
            <Button 
              onClick={() => setView("dashboard")} 
              className="rounded-2xl h-12 px-6 font-bold"
            >
              <PlusCircle className="w-5 h-5 mr-2" /> New Session
            </Button>
          </div>

          <div className="grid gap-4">
            {loadingHistory ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-32 rounded-3xl bg-muted animate-pulse" />
              ))
            ) : history && history.length > 0 ? (
              history.map((item) => {
                const avgScore = (item.feedback as any)?.averageScore || 0;
                return (
                  <Card key={item.id} className="rounded-3xl border-2 hover:border-primary/50 transition-all cursor-pointer group">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <Trophy className="w-7 h-7" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{item.topic}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(item.createdAt!).toLocaleDateString()} • {item.difficulty} Level
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Avg. Score</p>
                          <p className="text-2xl font-black text-primary">{avgScore}%</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-xl group-hover:translate-x-1 transition-transform"
                          onClick={() => {
                            // In a full implementation, this would open the detailed report for this session
                            setEvaluations(item.answers as any || []);
                            setView("report");
                          }}
                        >
                          <ChevronRight className="w-6 h-6" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-border/50">
                <History className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold">No interviews yet</h3>
                <p className="text-muted-foreground mt-2">Complete your first practice session to see it here.</p>
                <Button 
                  onClick={() => setView("dashboard")} 
                  variant="outline" 
                  className="mt-6 rounded-xl"
                >
                  New Assessment
                </Button>
              </div>
            )}
        </div>
      </div>
    </Layout>
  );
}

  if (view === "dashboard") {
    return (
      <Layout>
      <div className="max-w-4xl mx-auto py-10 sm:py-20 px-4 sm:px-6 fade-in">
        <div className="text-center mb-10 sm:mb-16 space-y-3 sm:space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-border/50 text-indigo-500 dark:text-indigo-300 text-sm font-medium mb-4"
          >
            <Shield className="w-4 h-4" />
            <span>Secure AI Assessment Environment</span>
          </motion.div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight">
            Interview <span className="text-gradient">Terminal</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Configure your session parameters to begin a high-fidelity AI-powered technical assessment.
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 p-4 glass border-rose-500/30 rounded-2xl flex items-center gap-3 text-rose-300"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}

        <Card className="glass-card border-border/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Cpu className="w-32 h-32" />
          </div>
          
          <CardHeader className="pb-8">
            <CardTitle className="text-3xl flex items-center gap-4 text-foreground font-black tracking-tight">
              <Zap className="w-8 h-8 text-yellow-500 dark:text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
              Session Configuration
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Establish your target parameters for a high-fidelity assessment session.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-10">
            <div className="space-y-4">
              <Label htmlFor="name" className="text-sm font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-300 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Candidate Identity
              </Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 sm:h-14 bg-background/50 border-border/40 rounded-xl focus:ring-primary focus:border-primary text-base sm:text-lg"
                data-testid="input-name"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <Label className="text-sm font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-300 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Target Domains
                </Label>
                <span className="text-xs text-indigo-500/60 dark:text-indigo-300/60 font-medium">
                  {selectedDomains.length}/5 selected
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {DOMAINS.map((domain) => {
                  const isSelected = selectedDomains.includes(domain);
                  return (
                    <Badge
                      key={domain}
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer px-4 py-2.5 text-sm rounded-xl transition-all duration-300 border-border/50 ${
                        isSelected 
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 border-indigo-500" 
                          : "glass hover:border-indigo-500/50 hover:bg-muted/50"
                      }`}
                      onClick={() => toggleDomain(domain)}
                    >
                      {domain}
                      {isSelected && <Check className="w-3 h-3 ml-2" />}
                    </Badge>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-600 dark:text-indigo-300 flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4" />
                Assessment Depth
              </Label>
              <RadioGroup
                value={duration}
                onValueChange={setDuration}
                className="grid grid-cols-3 gap-4"
              >
                {["5", "10", "15"].map((val) => (
                  <div key={val}>
                    <RadioGroupItem value={val} id={`duration-${val}`} className="peer sr-only" />
                    <Label
                      htmlFor={`duration-${val}`}
                      className="flex flex-col items-center justify-center rounded-2xl glass border-border/40 p-6 hover:bg-muted/50 peer-data-[state=checked]:border-indigo-500 peer-data-[state=checked]:bg-indigo-500/10 peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-indigo-500/30 cursor-pointer transition-all duration-300 group"
                    >
                      <span className="text-3xl font-black text-foreground group-hover:scale-110 transition-transform">{val}</span>
                      <span className="text-[10px] font-bold text-indigo-500/60 dark:text-indigo-300/60 mt-2 uppercase tracking-widest">Minutes</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>

          <CardFooter className="pt-6 pb-8">
            <Button 
              size="lg" 
              className="w-full h-12 sm:h-16 text-base sm:text-xl font-black btn-primary"
              disabled={!name || selectedDomains.length === 0}
              onClick={startInterview}
            >
              Initialize Assessment
            </Button>
          </CardFooter>
        </Card>

        {history && history.length > 0 && (
          <div className="mt-12 text-center">
            <button 
              onClick={() => setView("history")}
              className="text-indigo-500 dark:text-indigo-300/60 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors flex items-center gap-2 mx-auto font-medium"
            >
              <History className="w-4 h-4" />
              View Assessment History ({history.length})
            </button>
          </div>
        )}
        
        <footer className="mt-20 py-10 border-t border-border/20 text-center space-y-4">
          <div className="flex items-center justify-center gap-3 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-indigo-400" />
             </div>
             <span className="font-display font-black text-sm tracking-widest text-foreground uppercase">TalentAI</span>
          </div>
          <p className="text-xs font-medium text-muted-foreground tracking-tighter opacity-40">
            © {new Date().getFullYear()} TalentAI // Precision Assessment Engine // Neural Intelligence Interface
          </p>
        </footer>
      </div>
    </Layout>
  );
}
}
