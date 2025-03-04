
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/auth/AuthForm";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already authenticated
  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (session?.user) {
      // Check onboarding status
      const checkOnboardingStatus = async () => {
        try {
          const { data: onboardingStatus, error } = await supabase
            .from('onboarding_status')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (error) throw error;

          if (!onboardingStatus?.is_completed) {
            navigate("/onboarding");
          } else {
            navigate("/course");
          }
        } catch (error) {
          console.error("Error checking onboarding status:", error);
        }
      };

      checkOnboardingStatus();
    }
  }, [session, navigate]);

  const handleAuth = async (formData: {
    email: string;
    password: string;
    confirmPassword?: string;
    username?: string;
    fullName?: string;
  }, isLogin: boolean) => {
    setLoading(true);

    try {
      if (isLogin) {
        // Sign in flow
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (signInError) {
          if (signInError.message.includes('Email not confirmed')) {
            // Try to resend confirmation email
            await supabase.auth.resend({
              type: 'signup',
              email: formData.email,
            });
            
            throw new Error('Please check your email to verify your account. A new verification email has been sent.');
          }
          if (signInError.message.includes('Invalid login credentials')) {
            throw new Error('Invalid email or password. Please try again.');
          }
          throw signInError;
        }

        // If we get here, sign in was successful
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });

        // Redirect will happen via the useEffect hook that watches the session
      } else {
        // Sign up flow
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              username: formData.username,
              full_name: formData.fullName,
            },
            // For development, set emailRedirectTo to current origin
            emailRedirectTo: `${window.location.origin}/auth`,
          },
        });

        if (signUpError) {
          if (signUpError.message.toLowerCase().includes('already registered')) {
            throw new Error('This email is already registered. Please sign in instead.');
          }
          throw signUpError;
        }

        // For dev environments, let's check if email confirmation is required
        // If it's not required, the user might be auto-signed in
        if (data.user && !data.session) {
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account before signing in.",
          });
        } else if (data.session) {
          // User was auto-signed in (email confirmation is disabled)
          toast({
            title: "Account created!",
            description: "You have been automatically signed in.",
          });
          
          // Create profile if not exists (as a fallback)
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', data.user.id)
              .maybeSingle();
            
            if (!profile) {
              await supabase.from('profiles').insert({
                id: data.user.id,
                username: formData.username,
                full_name: formData.fullName,
              });
              
              // Also create onboarding status
              await supabase.from('onboarding_status').insert({
                user_id: data.user.id,
                is_completed: false,
              });
            }
          } catch (error) {
            console.error('Error creating profile:', error);
          }
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Authentication Error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking session
  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 animate-fade-up glass rounded-lg">
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold">Welcome to CogniLearn</h2>
          <p className="text-muted-foreground mt-2">
            {window.location.hostname.includes('localhost') && (
              <span className="text-yellow-500 block mb-2">
                Development mode: For testing, consider disabling email confirmation in Supabase.
              </span>
            )}
          </p>
        </div>
        <AuthForm onSubmit={handleAuth} loading={loading} />
      </div>
    </div>
  );
};

export default Auth;
