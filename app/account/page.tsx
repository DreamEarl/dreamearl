import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDisplayName } from "@/lib/account/getDisplayName";
import { getFullName } from "@/lib/account/getFullName";
import { getInitials } from "@/lib/account/getInitials";
import { getPhoneNumber } from "@/lib/account/getPhoneNumber";
import { toAccountTab } from "@/lib/account/tabs";
import { translations } from "@/lib/constants/translations";
import AccountShell from "@/components/account/AccountShell";
import OverviewPanel from "@/components/account/OverviewPanel";
import OrdersPanel from "@/components/account/OrdersPanel";
import PlaceholderPanel from "@/components/account/PlaceholderPanel";
import type { Order } from "@/lib/orders/types";

interface AccountPageProps {
  searchParams?: Promise<{ tab?: string }>;
}

export default async function AccountPage({
  searchParams,
}: Readonly<AccountPageProps> = {}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
    return null;
  }

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const activeTab = toAccountTab(resolvedSearchParams?.tab);

  const { data: orders } =
    activeTab === "orders"
      ? await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
      : { data: null };

  const { nav, placeholders } = translations.account;
  const name = getFullName(user);

  return (
    <AccountShell
      name={name}
      email={user.email ?? ""}
      initials={getInitials(name)}
      activeTab={activeTab}
    >
      {activeTab === "overview" && (
        <OverviewPanel
          firstName={getDisplayName(user)}
          fullName={name}
          email={user.email ?? ""}
          phone={getPhoneNumber(user)}
        />
      )}
      {activeTab === "orders" && (
        <OrdersPanel orders={(orders ?? []) as Order[]} />
      )}
      {activeTab === "addresses" && (
        <PlaceholderPanel
          id="addresses-panel"
          title={nav.manageAddresses}
          message={placeholders.addresses}
        />
      )}
      {activeTab === "custom-requests" && (
        <PlaceholderPanel
          id="custom-requests-panel"
          title={nav.customRequests}
          message={placeholders.customRequests}
        />
      )}
    </AccountShell>
  );
}
