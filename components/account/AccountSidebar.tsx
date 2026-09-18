import Link from "next/link";
import Text from "@/components/ui/Text";
import SignOutButton from "@/components/account/SignOutButton";
import { translations } from "@/lib/constants/translations";
import { ACCOUNT_TABS, type AccountTab } from "@/lib/account/tabs";

interface AccountSidebarProps {
  name: string;
  email: string;
  initials: string;
  activeTab: AccountTab;
}

const NAV_LABEL_KEYS: Record<
  AccountTab,
  keyof typeof translations.account.nav
> = {
  overview: "overview",
  orders: "myOrders",
  addresses: "manageAddresses",
  "custom-requests": "customRequests",
};

export default function AccountSidebar({
  name,
  email,
  initials,
  activeTab,
}: Readonly<AccountSidebarProps>) {
  const { nav } = translations.account;

  return (
    <aside
      id="account-sidebar"
      className="w-full md:w-72 shrink-0 bg-[#5f1631] text-white p-8 flex flex-col"
    >
      <div
        id="account-sidebar-avatar"
        className="w-16 h-16 flex items-center justify-center bg-[#faf3ea] text-[#5f1631] text-xl font-light mb-4"
      >
        {initials}
      </div>
      <Text
        id="account-sidebar-name"
        variant="body"
        className="text-white text-lg mb-1"
      >
        {name}
      </Text>
      <Text
        id="account-sidebar-email"
        variant="caption"
        className="text-white/70 mb-8 break-all"
      >
        {email}
      </Text>

      <nav id="account-sidebar-nav" className="flex flex-col gap-3 mb-10">
        {ACCOUNT_TABS.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <Link
              key={tab}
              id={`account-sidebar-nav-${tab}`}
              href={tab === "overview" ? "/account" : `/account?tab=${tab}`}
              className={`py-3 px-4 text-sm tracking-widest uppercase text-center transition-colors ${
                isActive
                  ? "bg-white text-[#5f1631]"
                  : "border border-white/40 text-white hover:bg-white/10"
              }`}
            >
              {nav[NAV_LABEL_KEYS[tab]]}
            </Link>
          );
        })}
      </nav>

      <div id="account-sidebar-signout" className="mt-auto">
        <SignOutButton variant="secondary" className="!text-[#5f1631]" />
      </div>
    </aside>
  );
}
