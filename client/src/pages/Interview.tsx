import { useState } from "react";
import { Layout } from "@/components/ui/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, X, GraduationCap, Clock, Briefcase } from "lucide-react";

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

export default function InterviewDashboard() {
  const [name, setName] = useState("");
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [duration, setDuration] = useState("10");

  const toggleDomain = (domain: string) => {
    if (selectedDomains.includes(domain)) {
      setSelectedDomains(selectedDomains.filter(d => d !== domain));
    } else if (selectedDomains.length < 5) {
      setSelectedDomains([...selectedDomains, domain]);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-3">AI Mock Interview</h1>
          <p className="text-muted-foreground text-lg">
            Practice with our AI interviewer to sharpen your skills and boost your confidence.
          </p>
        </div>

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
