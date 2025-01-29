import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface QuizSetupProps {
  onStartQuiz: (topic: string, difficulty: string) => void;
}

const QuizSetup = ({ onStartQuiz }: QuizSetupProps) => {
  const [step, setStep] = useState(1);
  const [topic, setTopic] = useState("Python");
  const [difficulty, setDifficulty] = useState("");

  const handleDifficultySelect = (level: string) => {
    setDifficulty(level);
    setStep(3);
  };

  const handleStartQuiz = () => {
    onStartQuiz(topic, difficulty);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 animate-fade-up">
      <div className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-1 glass p-4 rounded-lg">
                <p>What topic would you like to be tested on?</p>
              </div>
            </div>
            <div className="ml-14">
              <Button 
                onClick={() => setStep(2)}
                className="w-full md:w-auto"
              >
                Python
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-1 glass p-4 rounded-lg">
                <p>Select the difficulty level:</p>
              </div>
            </div>
            <div className="ml-14 grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Easy", "Medium", "Hard"].map((level) => (
                <Button
                  key={level}
                  onClick={() => handleDifficultySelect(level)}
                  variant={difficulty === level ? "default" : "outline"}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-1 glass p-4 rounded-lg">
                <p>Ready to start your {difficulty} Python quiz?</p>
              </div>
            </div>
            <div className="ml-14">
              <Button onClick={handleStartQuiz}>Start Quiz</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizSetup;