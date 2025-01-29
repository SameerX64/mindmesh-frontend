import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import QuizSetup from "@/components/quiz/QuizSetup";
import QuizResult from "@/components/quiz/QuizResult";
import QuestionCard from "@/components/quiz/QuestionCard";
import { questions } from "@/data/quizQuestions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const Quiz = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const [showWarning, setShowWarning] = useState(false);
  const { toast } = useToast();

  const handleStartQuiz = (topic: string, selectedDifficulty: string) => {
    setDifficulty(selectedDifficulty.toLowerCase());
    setShowQuiz(true);
    setAnswers({});
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      setShowWarning(true);
      return;
    }
    setShowResults(true);
  };

  const calculateScore = () => {
    const correctAnswers = questions.filter(
      (q) => answers[q.id] === q.answer
    ).length;
    return Math.round((correctAnswers / questions.length) * 100);
  };

  const handleRetry = () => {
    setShowResults(false);
    setShowQuiz(false);
    setAnswers({});
  };

  const handleAnalyze = () => {
    toast({
      title: "Coming Soon",
      description: "Performance analysis will be available in the next update.",
    });
  };

  if (!showQuiz) {
    return <QuizSetup onStartQuiz={handleStartQuiz} />;
  }

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-8">
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              selectedAnswer={answers[question.id] || ""}
              onAnswerChange={(answer) =>
                setAnswers((prev) => ({ ...prev, [question.id]: answer }))
              }
            />
          ))}

          <Button
            onClick={handleSubmit}
            className="w-full animate-fade-up"
            style={{ animationDelay: `${(questions.length + 1) * 100}ms` }}
          >
            Submit Quiz
          </Button>
        </div>
      </div>

      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Warning</DialogTitle>
            <DialogDescription>
              Please answer all questions before submitting.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowWarning(false)}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <QuizResult
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        score={calculateScore()}
        onRetry={handleRetry}
        onAnalyze={handleAnalyze}
      />
    </div>
  );
};

export default Quiz;