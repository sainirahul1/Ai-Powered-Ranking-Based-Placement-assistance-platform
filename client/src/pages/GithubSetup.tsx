import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Github, Copy, Check, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function GithubSetup() {
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [repoName, setRepoName] = useState("");
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState(false);

  const command = `git init && git add . && git commit -m "Initial commit" && git remote add origin https://${username || "YOUR_USERNAME"}:${token || "YOUR_TOKEN"}@github.com/${username || "YOUR_USERNAME"}/${repoName || "YOUR_REPO_NAME"}.git && git branch -M main && git push -u origin main`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    toast({
      title: "Command Copied!",
      description: "Paste this into your Replit Shell to push your code.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Github className="h-6 w-6" />
            <CardTitle>GitHub Setup</CardTitle>
          </div>
          <CardDescription>
            Fill in your GitHub details to generate the push command.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">GitHub Username</Label>
              <Input
                id="username"
                placeholder="e.g. octocat"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                data-testid="input-github-username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="repo">Repository Name</Label>
              <Input
                id="repo"
                placeholder="e.g. my-awesome-project"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                data-testid="input-github-repo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="token">Personal Access Token (PAT)</Label>
              <Input
                id="token"
                type="password"
                placeholder="ghp_xxxxxxxxxxxx"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                data-testid="input-github-token"
              />
              <p className="text-xs text-muted-foreground">
                Your token is only used locally to generate the command and is not stored on our servers.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <Label>Generated Push Command</Label>
            <div className="relative">
              <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap break-all pr-12">
                {command}
              </pre>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={copyToClipboard}
                data-testid="button-copy-command"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>How to use:</strong>
                <ol className="list-decimal ml-4 mt-2 space-y-1">
                  <li>Fill in your details above.</li>
                  <li>Click the copy icon to copy the generated command.</li>
                  <li>Open the <strong>Shell</strong> tab in the Replit editor (at the bottom).</li>
                  <li>Paste the command and press <strong>Enter</strong>.</li>
                </ol>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
