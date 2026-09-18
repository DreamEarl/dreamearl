import AccountSidebar from "@/components/account/AccountSidebar";
import type { AccountTab } from "@/lib/account/tabs";

interface AccountShellProps {
  name: string;
  email: string;
  initials: string;
  activeTab: AccountTab;
  children: React.ReactNode;
}

export default function AccountShell({
  name,
  email,
  initials,
  activeTab,
  children,
}: Readonly<AccountShellProps>) {
  return (
    <div
      id="account-page"
      className="min-h-screen bg-white flex justify-center"
    >
      <div
        id="account-page-content"
        className="w-full flex flex-col md:flex-row gap-8"
      >
        <AccountSidebar
          name={name}
          email={email}
          initials={initials}
          activeTab={activeTab}
        />

        <div id="account-page-panel" className="flex-1 min-w-0 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
