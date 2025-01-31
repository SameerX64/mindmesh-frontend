import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  // Check authentication and onboarding status
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: onboardingStatus } = useQuery({
    queryKey: ['onboardingStatus', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from('onboarding_status')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // If user is not authenticated, redirect to auth page
  useEffect(() => {
    if (!session && window.location.pathname !== '/auth') {
      navigate('/auth');
    }
  }, [session, navigate]);

  // If user is authenticated but hasn't completed onboarding, redirect to onboarding
  useEffect(() => {
    if (session && !onboardingStatus?.is_completed && window.location.pathname !== '/onboarding') {
      navigate('/onboarding');
    }
  }, [session, onboardingStatus, navigate]);

  // Don't show navigation if user is not authenticated or hasn't completed onboarding
  if (!session || !onboardingStatus?.is_completed) {
    return null;
  }

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Course", path: "/course" },
    { name: "Quiz", path: "/quiz" },
    { name: "Notes", path: "/notes" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-semibold">
              CogniLearn
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/10 hover:text-white"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-white/10 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/80 backdrop-blur-sm">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;