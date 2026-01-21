import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/ui/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Video, Maximize } from "lucide-react";

export default function Interview() {
  const [hasStarted, setHasStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startGreeting = async () => {
    try {
      // 1. Fullscreen
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }

      // 2. Camera & Mic
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // 3. Speech Synthesis Greeting
      const greeting = "Welcome to your AI Mock Interview. I am your interviewer today. Let's begin when you are ready.";
      const utterance = new SpeechSynthesisUtterance(greeting);
      window.speechSynthesis.speak(utterance);

      setHasStarted(true);
    } catch (err) {
      console.error("Error starting greeting:", err);
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [stream]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col items-center justify-center space-y-8">
        {!hasStarted ? (
          <Card className="p-8 text-center space-y-6 max-w-md w-full border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardHeader className="p-0 space-y-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Mic className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold">Ready for your Interview?</CardTitle>
                <CardDescription className="text-muted-foreground">
                  We'll need access to your camera and microphone. The session will start in fullscreen mode.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Button 
                onClick={startGreeting}
                size="lg" 
                className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20"
                data-testid="button-start-interview"
              >
                Start Interview
              </Button>
            </CardContent>
          </Card>
        ) : (
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
                  "Welcome to your AI Mock Interview. I am your interviewer today. Let's begin when you are ready."
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-sm border border-white/20">
                <Maximize className="w-4 h-4" />
                Fullscreen
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
