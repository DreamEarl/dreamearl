import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getFullName } from "@/lib/account/getFullName";
import { getInitials } from "@/lib/account/getInitials";
import AccountShell from "@/components/account/AccountShell";
import CustomRequestDetailsPanel from "@/components/account/CustomRequestDetailsPanel";
import type { CustomRequest } from "@/lib/customRequests/types";

interface CustomRequestDetailsPageProps {
  params: Promise<{ requestId: string }>;
}

export default async function CustomRequestDetailsPage({
  params,
}: Readonly<CustomRequestDetailsPageProps>) {
  const { requestId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
    return null;
  }

  // Fetched fresh from Supabase (never trust the URL alone) — RLS also enforces ownership.
  const { data, error } = await supabase
    .from("custom_requests")
    .select("*")
    .eq("id", requestId)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    notFound();
    return null;
  }

  const name = getFullName(user);

  return (
    <AccountShell
      name={name}
      email={user.email ?? ""}
      initials={getInitials(name)}
      activeTab="custom-requests"
    >
      <CustomRequestDetailsPanel request={data as CustomRequest} />
    </AccountShell>
  );
}
