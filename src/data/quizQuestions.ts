import { Question } from "@/types/quiz";

export const questions: Question[] = [
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
