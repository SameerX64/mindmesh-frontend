import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Course = () => {
  const [topic, setTopic] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement course generation logic
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Course Learning</h1>
      <Card className="max-w-2xl mx-auto glass">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                What would you like to learn?
              </label>
              <Input
                type="text"
                placeholder="Enter a topic (e.g., Data Structures and Algorithms)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full">
              Start Learning
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Course;