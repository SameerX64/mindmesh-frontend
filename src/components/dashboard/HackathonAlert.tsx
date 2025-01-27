import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

const HackathonAlert = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroll = () => {
      if (scrollRef.current) {
        if (
          scrollRef.current.scrollLeft >=
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth
        ) {
          scrollRef.current.scrollLeft = 0;
        } else {
          scrollRef.current.scrollLeft += 1;
        }
      }
    };

    const intervalId = setInterval(scroll, 30);
    return () => clearInterval(intervalId);
  }, []);

  const hackathons = [
    { name: "CogniHack 2024", date: "March 15, 2024" },
    { name: "AI Learning Challenge", date: "April 1, 2024" },
    { name: "EdTech Innovation", date: "April 20, 2024" },
  ];

  return (
    <Card className="w-full bg-black/50 border-none overflow-hidden">
      <div
        ref={scrollRef}
        className="flex whitespace-nowrap overflow-hidden py-2 px-4 gap-8"
      >
        {[...hackathons, ...hackathons].map((hackathon, index) => (
          <span key={index} className="text-white/90">
            🏆 {hackathon.name} - Starting {hackathon.date}
          </span>
        ))}
      </div>
    </Card>
  );
};

export default HackathonAlert;