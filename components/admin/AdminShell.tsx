import Link from "next/link";
import Text from "@/components/ui/Text";
import SignOutButton from "@/components/account/SignOutButton";

interface AdminShellProps {
  email: string;
  children: React.ReactNode;
}

export default function AdminShell({
  email,
  children,
}: Readonly<AdminShellProps>) {
  return (
    <div id="admin-page" className="min-h-screen bg-white flex justify-center">
      <div
        id="admin-page-content"
        className="w-full flex flex-col md:flex-row gap-8"
      >
        <aside
          id="admin-sidebar"
          className="w-full md:w-64 shrink-0 bg-[#5f1631] text-white p-8 flex flex-col"
        >
          <Text
            id="admin-sidebar-title"
            variant="body"
            className="text-white text-lg mb-1 uppercase tracking-wide"
          >
            Admin
          </Text>
          <Text
            id="admin-sidebar-email"
            variant="caption"
            className="text-white/70 mb-8 break-all"
          >
            {email}
          </Text>

          <nav id="admin-sidebar-nav" className="flex flex-col gap-3 mb-10">
            <Link
              id="admin-sidebar-nav-orders"
              href="/admin/orders"
              className="text-sm tracking-wide text-white/90 hover:text-white"
            >
              Orders
            </Link>
            <Link
              id="admin-sidebar-nav-custom-requests"
              href="/admin/custom-requests"
              className="text-sm tracking-wide text-white/90 hover:text-white"
            >
              Custom Requests
            </Link>
          </nav>

          <div id="admin-sidebar-sign-out" className="mt-auto">
            <SignOutButton variant="secondary" />
          </div>
        </aside>

        <div id="admin-page-panel" className="flex-1 min-w-0 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
