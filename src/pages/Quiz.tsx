import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is the primary design philosophy of Python?",
    options: [
      "Code readability with significant indentation",
      "Object-oriented programming",
      "Functional programming",
      "Structured programming"
    ],
    answer: "Code readability with significant indentation"
  },
  {
    id: 2,
    question: "What is Python's memory management approach?",
    options: [
      "Dynamic typing and garbage collection",
      "Static typing and manual memory management",
      "Reference counting and cycle-detecting garbage collector",
      "Hybrid approach"
    ],
    answer: "Reference counting and cycle-detecting garbage collector"
  },
  {
    id: 3,
    question: "Who is the creator of Python?",
    options: [
      "Guido van Rossum",
      "Monty Python",
      "Alex Martelli",
      "None of the above"
    ],
    answer: "Guido van Rossum"
  },
  {
    id: 4,
    question: "What is the name of the British comedy series that inspired the name \"Python\"?",
    options: [
      "Monty Python's Flying Circus",
      "The Office",
      "Python's Flying Circus",
      "None of the above"
    ],
    answer: "Monty Python's Flying Circus"
  },
  {
    id: 5,
    question: "What is the latest stable release of Python as of October 2024?",
    options: [
      "Python 3.12",
      "Python 3.13",
      "Python 3.14",
      "Python 3.15"
    ],
    answer: "Python 3.13"
  },
  {
    id: 6,
    question: "What is the purpose of the Steering Council in Python?",
    options: [
      "To lead the project",
      "To make decisions on new features",
      "To maintain backward compatibility",
      "To promote Python"
    ],
    answer: "To lead the project"
  },
  {
    id: 7,
    question: "What is the significance of the \"Zen of Python\"?",
    options: [
      "It is a set of rules for Python development",
      "It is a guideline for Python design philosophy",
      "It is a criticism of Python's complexity",
      "It is a set of best practices for Python programming"
    ],
    answer: "It is a guideline for Python design philosophy"
  },
  {
    id: 8,
    question: "What is the main advantage of Python's modularity?",
    options: [
      "It makes Python more complex",
      "It makes Python more extensible",
      "It makes Python faster",
      "It makes Python more readable"
    ],
    answer: "It makes Python more extensible"
  },
  {
    id: 9,
    question: "What is the purpose of the match and case keywords in Python 3.10?",
    options: [
      "For structural pattern matching statements",
      "For exception handling",
      "For list comprehensions",
      "For functional programming"
    ],
    answer: "For structural pattern matching statements"
  },
  {
    id: 10,
    question: "What is the significance of Python 3.15?",
    options: [
      "It is the latest stable release",
      "It makes UTF-8 mode default",
      "It introduces a new garbage collector",
      "It drops support for Python 2.7"
    ],
    answer: "It makes UTF-8 mode default"
  }
];

const Quiz = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      toast({
        title: "Please answer all questions",
        description: "You must answer all questions before submitting.",
        variant: "destructive",
      });
      return;
    }

    setSubmitted(true);
    const score = calculateScore();
    toast({
      title: score >= 70 ? "Congratulations!" : "Keep practicing!",
      description: `Your score: ${score}%${score >= 70 ? " - You passed!" : " - Try again to improve your score."}`,
      variant: score >= 70 ? "default" : "destructive",
    });
  };

  const calculateScore = () => {
    const correctAnswers = questions.filter(
      (q) => answers[q.id] === q.answer
    ).length;
    return (correctAnswers / questions.length) * 100;
  };

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Python Quiz</h1>
          
          <div className="glass p-6 rounded-lg space-y-4">
            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <RadioGroup
                value={difficulty}
                onValueChange={setDifficulty}
                className="flex space-x-4"
              >
                {["easy", "medium", "hard"].map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <RadioGroupItem value={level} id={level} />
                    <Label htmlFor={level} className="capitalize">{level}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-8">
            {questions.map((q) => (
              <div
                key={q.id}
                className={`glass p-6 rounded-lg space-y-4 ${
                  submitted
                    ? answers[q.id] === q.answer
                      ? "border-2 border-green-500"
                      : "border-2 border-red-500"
                    : ""
                }`}
              >
                <h3 className="text-lg font-medium">
                  {q.id}. {q.question}
                </h3>
                <RadioGroup
                  value={answers[q.id] || ""}
                  onValueChange={(value) =>
                    setAnswers((prev) => ({ ...prev, [q.id]: value }))
                  }
                  className="space-y-2"
                  disabled={submitted}
                >
                  {q.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`q${q.id}-${index}`} />
                      <Label
                        htmlFor={`q${q.id}-${index}`}
                        className={
                          submitted
                            ? option === q.answer
                              ? "text-green-500"
                              : answers[q.id] === option
                              ? "text-red-500"
                              : ""
                            : ""
                        }
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {submitted && answers[q.id] !== q.answer && (
                  <p className="text-sm text-green-500">
                    Correct answer: {q.answer}
                  </p>
                )}
              </div>
            ))}
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={submitted}
          >
            Submit Quiz
          </Button>

          {submitted && (
            <div className="glass p-6 rounded-lg text-center">
              <h2 className="text-xl font-bold mb-2">
                Your Score: {calculateScore()}%
              </h2>
              {calculateScore() >= 70 ? (
                <p className="text-green-500">
                  Congratulations! You have passed the test!
                </p>
              ) : (
                <p className="text-yellow-500">
                  Keep practicing! You can do better next time.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;