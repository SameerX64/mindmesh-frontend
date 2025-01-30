import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Module {
  name: string;
  description: string;
  topicsCovered: string[];
  difficultyLevel: "Easy" | "Medium" | "Hard";
}

const CurriculumGenerator = () => {
  const [subject, setSubject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [curriculum, setCurriculum] = useState<Module[]>([]);
  const { toast } = useToast();

  const generateCurriculum = async () => {
    if (!subject.trim()) {
      toast({
        title: "Error",
        description: "Please enter a subject",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-curriculum", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject }),
      });

      if (!response.ok) throw new Error("Failed to generate curriculum");

      const data = await response.json();
      setCurriculum(data.curriculum);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate curriculum. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex gap-4 mb-8">
        <Input
          placeholder="Enter a subject (e.g., Machine Learning)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="flex-1"
        />
        <Button onClick={generateCurriculum} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Curriculum"
          )}
        </Button>
      </div>

      {curriculum.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {curriculum.map((module, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {module.name}
                  <span className="text-sm font-normal px-2 py-1 rounded-full bg-accent">
                    {module.difficultyLevel}
                  </span>
                </CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {module.topicsCovered.map((topic, i) => (
                    <span
                      key={i}
                      className="text-sm px-2 py-1 rounded-full bg-secondary"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurriculumGenerator;