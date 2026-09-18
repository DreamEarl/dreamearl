export const ACCOUNT_TABS = [
  "overview",
  "orders",
  "addresses",
  "custom-requests",
] as const;

export type AccountTab = (typeof ACCOUNT_TABS)[number];

export function toAccountTab(value: string | undefined): AccountTab {
  return (ACCOUNT_TABS as readonly string[]).includes(value ?? "")
    ? (value as AccountTab)
    : "overview";
}
