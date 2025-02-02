import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/auth/AuthForm";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (signInError) throw signInError;

        // After sign in, verify the profile exists
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("No user found after login");
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          throw new Error("Failed to verify user profile");
        }

        if (!profile) {
          throw new Error("Profile not found. Please contact support.");
        }

        // Check onboarding status
        const { data: onboardingStatus, error: onboardingError } = await supabase
          .from('onboarding_status')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (onboardingError) {
          console.error("Error fetching onboarding status:", onboardingError);
          throw new Error("Failed to verify onboarding status");
        }

        // Redirect based on onboarding status
        if (!onboardingStatus?.is_completed) {
          navigate("/onboarding");
        } else {
          navigate("/dashboard");
        }

        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      } else {
        // Sign up flow
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              username: formData.username,
              full_name: formData.fullName,
            },
          },
        });

        if (signUpError) {
          const errorMessage = signUpError.message?.toLowerCase() || '';
          if (errorMessage.includes('already registered') || errorMessage.includes('already exists')) {
            toast({
              title: "Account Already Exists",
              description: "This email is already registered. Please sign in instead.",
              variant: "destructive",
            });
            return;
          }
          throw signUpError;
        }

        if (authData.user) {
          // Wait for the profile trigger to complete
          await new Promise(resolve => setTimeout(resolve, 2000));

          toast({
            title: "Success",
            description: "Account created successfully! Please check your email to verify your account.",
          });
          
          navigate("/onboarding");
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 animate-fade-up glass rounded-lg">
        <AuthForm onSubmit={handleAuth} loading={loading} />
      </div>
    </div>
  );
};

export default Auth;