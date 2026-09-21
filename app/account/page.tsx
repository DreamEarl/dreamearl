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
import AddressesPanel from "@/components/account/AddressesPanel";
import PlaceholderPanel from "@/components/account/PlaceholderPanel";
import type { Order } from "@/lib/orders/types";
import type { Address } from "@/lib/addresses/types";

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

  const { data: addresses } =
    activeTab === "addresses"
      ? await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("is_default", { ascending: false })
          .order("created_at", { ascending: true })
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
        <AddressesPanel addresses={(addresses ?? []) as Address[]} />
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
