import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check authentication and onboarding status
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  // First check/create profile
  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      // Try to get existing profile
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw profileError;
      }

      // If no profile exists, create one
      if (!existingProfile) {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: session.user.id,
              username: session.user.email?.split('@')[0], // Default username from email
              full_name: session.user.user_metadata.full_name || null
            }
          ])
          .select()
          .maybeSingle();

        if (insertError) {
          console.error('Error creating profile:', insertError);
          throw insertError;
        }

        return newProfile;
      }

      return existingProfile;
    },
    enabled: !!session?.user?.id,
  });

  // Then check/create onboarding status
  const { data: onboardingStatus } = useQuery({
    queryKey: ['onboardingStatus', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null;
      
      // Try to get existing onboarding status
      const { data: existingStatus, error: statusError } = await supabase
        .from('onboarding_status')
        .select('*')
        .eq('user_id', profile.id)
        .maybeSingle();
      
      if (statusError) {
        console.error('Error fetching onboarding status:', statusError);
        throw statusError;
      }

      // If no status exists, create one
      if (!existingStatus) {
        const { data: newStatus, error: insertError } = await supabase
          .from('onboarding_status')
          .insert([
            { 
              user_id: profile.id,
              is_completed: false,
              created_at: new Date().toISOString()
            }
          ])
          .select()
          .maybeSingle();

        if (insertError) {
          console.error('Error creating onboarding status:', insertError);
          throw insertError;
        }

        return newStatus;
      }

      return existingStatus;
    },
    enabled: !!profile?.id,
  });

  // If user is not authenticated, redirect to auth page
  useEffect(() => {
    if (!session && window.location.pathname !== '/auth') {
      navigate('/auth');
    }
  }, [session, navigate]);

  // If user is authenticated but hasn't completed onboarding, redirect to onboarding
  useEffect(() => {
    if (session && onboardingStatus && !onboardingStatus.is_completed && window.location.pathname !== '/onboarding') {
      navigate('/onboarding');
    }
  }, [session, onboardingStatus, navigate]);

  // Don't show navigation if user is not authenticated or hasn't completed onboarding
  if (!session || (onboardingStatus && !onboardingStatus.is_completed)) {
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