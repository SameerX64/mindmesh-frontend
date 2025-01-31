import { useState } from "react";
import CourseChat from "@/components/course/CourseChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Youtube, Book } from "lucide-react";

const Course = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Course Recommendations</h1>
          <p className="text-muted-foreground">
            Get personalized course recommendations based on your interests and skill level
          </p>
        </div>
        <CourseChat />
      </div>
    </div>
  );
};

export default Course;