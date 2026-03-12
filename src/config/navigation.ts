export type NavItem = {
  label: string;
  href: string;
};

export const APP_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/assistant" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Calendar", href: "/calendar" },
  { label: "Tasks", href: "/tasks" },
  { label: "Profile", href: "/profile" },
];
