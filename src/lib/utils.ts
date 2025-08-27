import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateBreadcrumbs(pathname: string, searchParams?: string) {
  const menuItems = [
    {
      label: "Dashboard",
      href: "/",
    },
    {
      label: "Users",
      dropdown: [{ label: "View All User", href: "/users" }],
    },
    {
      label: "Services",
      dropdown: [
        { label: "View Listings", href: "/services" },
        { label: "Flag / Hide Service", href: "/services/flag-hide" },
      ],
    },
    {
      label: "Reports",
      dropdown: [
        { label: "Transactions", href: "/reports" },
        { label: "User Reports", href: "/reports/user-reports" },
        { label: "Service Reports", href: "/reports/service-reports" },
      ],
    },
    {
      label: "Payments",
      dropdown: [
        { label: "Payment Settings", href: "/payments" },
        { label: "Transaction Logs", href: "/payments/transaction-logs" },
      ],
    },
  ];

  const breadcrumbs: Array<{ label: string; href: string; isActive: boolean }> =
    [];

  breadcrumbs.push({
    label: "Dashboard",
    href: "/",
    isActive: pathname === "/",
  });

  for (const item of menuItems) {
    if (item.href && pathname === item.href) {
      breadcrumbs.push({
        label: item.label,
        href: item.href,
        isActive: true,
      });
      break;
    }

    if (item.dropdown) {
      for (const subItem of item.dropdown) {
        if (pathname === subItem.href) {
          breadcrumbs.push({
            label: item.label,
            href: subItem.href,
            isActive: false,
          });
          breadcrumbs.push({
            label: subItem.label,
            href: subItem.href,
            isActive: true,
          });
          break;
        }
      }
      if (breadcrumbs.length > 1) break;
    }
  }

  return breadcrumbs;
}
