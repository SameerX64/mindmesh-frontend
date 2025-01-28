import { Card } from "@/components/ui/card";
import HackathonAlert from "@/components/dashboard/HackathonAlert";
import BuddySystem from "@/components/dashboard/BuddySystem";
import CourseProgress from "@/components/dashboard/CourseProgress";
import QuizModel from "@/components/dashboard/QuizModel";
import Navigation from "@/components/Navigation";
import { Trophy } from "lucide-react";

const Performance = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-20 pb-8 space-y-6">
        <HackathonAlert />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BuddySystem />
          <CourseProgress />
          <QuizModel />
          
          <Card className="w-full bg-black/50 border-border/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-6 w-6" />
              <h3 className="text-xl font-semibold">Achievements and Badges</h3>
            </div>
            <div className="space-y-4">
              {/* Achievement items will be dynamically loaded here */}
              <p className="text-muted-foreground">Complete courses and quizzes to earn achievements!</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Performance;