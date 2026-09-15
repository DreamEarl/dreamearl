import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDisplayName } from "@/lib/account/getDisplayName";
import ProfileHeader from "@/components/account/ProfileHeader";
import AccountQuickLinks from "@/components/account/AccountQuickLinks";
import SignOutButton from "@/components/account/SignOutButton";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-16 px-6">
      <div className="w-full max-w-md">
        <ProfileHeader name={getDisplayName(user)} email={user.email ?? ""} />
        <AccountQuickLinks />
        <SignOutButton />
      </div>
    </div>
  );
}
