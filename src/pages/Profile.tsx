import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Camera, Mail, User, MapPin, GraduationCap, CheckCircle, XCircle } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    dateOfBirth: "",
    city: "",
    subjectsOfInterest: [] as string[],
  });

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      setProfile(profile);
      setFormData({
        username: profile.username || "",
        fullName: profile.full_name || "",
        dateOfBirth: profile.date_of_birth || "",
        city: profile.city || "",
        subjectsOfInterest: profile.subjects_of_interest || [],
      });

      if (profile.avatar_url) {
        const { data: { publicUrl } } = supabase
          .storage
          .from('avatars')
          .getPublicUrl(profile.avatar_url);
        setAvatarUrl(publicUrl);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: filePath })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });

      getProfile();
    } catch (error: any) {
      toast({
        title: "Error uploading avatar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Check username change cooldown
      if (profile.username !== formData.username) {
        const lastChange = new Date(profile.last_username_change || 0);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        if (lastChange > sixMonthsAgo) {
          throw new Error("Username can only be changed once every 6 months");
        }
      }

      const updates = {
        username: formData.username,
        full_name: formData.fullName,
        date_of_birth: formData.dateOfBirth,
        city: formData.city,
        subjects_of_interest: formData.subjectsOfInterest,
        ...(profile.username !== formData.username && {
          last_username_change: new Date().toISOString(),
        }),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      getProfile();
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fade-up">
        <div className="flex items-start gap-8">
          <div className="relative">
            <Avatar className="w-32 h-32">
              <AvatarImage src={avatarUrl || ""} />
              <AvatarFallback>
                {formData.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <label
              className="absolute bottom-0 right-0 p-2 bg-accent rounded-full cursor-pointer hover:bg-accent/80 transition-colors"
              htmlFor="avatar-upload"
            >
              <Camera className="h-5 w-5" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={uploadAvatar}
              disabled={loading}
            />
          </div>

          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Username
              </label>
              <Input
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <div className="flex items-center gap-2">
                <Input value={profile?.email} disabled />
                {profile?.email_verified ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                City
              </label>
              <Input
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date of Birth</label>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Subjects of Interest
              </label>
              <Input
                value={formData.subjectsOfInterest.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subjectsOfInterest: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
                placeholder="Enter subjects separated by commas"
                disabled={loading}
              />
            </div>

            <Button
              onClick={updateProfile}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;