export type NavItem = {
  label: string;
  href: string;
};

export const APP_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Calendar", href: "/calendar" },
  { label: "Tasks", href: "/tasks" },
  { label: "Assistant", href: "/assistant" },
  { label: "Profile", href: "/profile" },
];
