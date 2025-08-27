"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DashboardIcon from "@/svgIcons/Dashboard";
import ServiceIcon from "@/svgIcons/Services";
import ManageCustomers from "@/svgIcons/ManageCustomers";
import Transactions from "@/svgIcons/Transactions";
import Invoices from "@/svgIcons/Invoices";
import ArrowDropdownMenu from "@/svgIcons/ArrowDropdownMenu";
import DashboardIconFilled from "@/svgIcons/DashboardFilled";
import ServiceIconFilled from "@/svgIcons/ServicesFilled";
import ManageCustomersFilled from "@/svgIcons/ManageCustomersFilled";
import TransactionsFilled from "@/svgIcons/TransactionsFilled";
import InvoicesFilled from "@/svgIcons/InvoicesFilled";

const menuItems = [
    {
        label: "Dashboard",
        icon: DashboardIcon,
        iconFilled: DashboardIconFilled,
        href: "/",
    },
    {
        label: "Users",
        icon: ManageCustomers,
        iconFilled: ManageCustomersFilled,
        dropdown: [
            { label: "View All User", href: "/users" },
        ],
    },
    {
        label: "Services",
        icon: ServiceIcon,
        iconFilled: ServiceIconFilled,
        dropdown: [
            { label: "View Listings", href: "/services" },
            { label: "Flag / Hide Service", href: "/services/flag-hide" },
        ],
    },
    {
        label: "Reports",
        icon: Transactions,
        iconFilled: TransactionsFilled,
        dropdown: [
            { label: "Transactions", href: "/reports" },
            { label: "User Reports", href: "/reports/user-reports" },
            { label: "Service Reports", href: "/reports/service-reports" },
        ],
    },
    {
        label: "Payments",
        icon: Invoices,
        iconFilled: InvoicesFilled,
        dropdown: [
            { label: "Payment Settings", href: "/payments" },
            { label: "Transaction Logs", href: "/payments/transaction-logs" },
        ],
    },
];

interface SidebarProps {
    onCollapseChange?: (collapsed: boolean) => void;
    onMobileClose?: () => void;
}

export function Sidebar({ onCollapseChange, onMobileClose }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        if (collapsed) {
            return;
        }

        const activeDropdown = menuItems.find(item => {
            if (!item.dropdown) return false;
            
            return item.dropdown.some((sub: any) => {
                if (pathname === sub.href) return true;
                if (sub.href === '/users' && pathname.startsWith('/users')) return true;
                if (sub.href === '/services' && (pathname.startsWith('/services') || pathname === '/services')) return true;
                if (sub.href === '/reports' && (pathname.startsWith('/reports') || pathname === '/reports')) return true;
                if (sub.href === '/payments' && (pathname.startsWith('/payments') || pathname === '/payments')) return true;
                
                return false;
            });
        });

        setOpenDropdown(activeDropdown ? activeDropdown.label : null);
    }, [pathname, collapsed]);

    const handleCollapse = (newCollapsed: boolean) => {
        setCollapsed(newCollapsed);
        onCollapseChange?.(newCollapsed);
    };

    const getMainPageForDropdown = (label: string) => {
        switch (label) {
            case "Services":
                return "/services";
            case "Users":
                return "/users";
            case "Reports":
                return "/reports";
            case "Payments":
                return "/payments";
            default:
                return "/";
        }
    };

    const isMenuItemActive = (item: any) => {
        if (item.href) {
            return pathname === item.href;
        }
        if (item.dropdown) {
            // Check if any sub-item is active
            const hasActiveSubItem = item.dropdown.some((sub: any) => 
                pathname === sub.href || 
                (sub.href === '/users' && pathname.startsWith('/users')) ||
                (sub.href === '/services' && (pathname.startsWith('/services') || pathname === '/services')) ||
                (sub.href === '/reports' && (pathname.startsWith('/reports') || pathname === '/reports')) ||
                (sub.href === '/payments' && (pathname.startsWith('/payments') || pathname === '/payments'))
            );
            
            // If no sub-item is active, check if we're on the main page for this dropdown
            if (!hasActiveSubItem) {
                const mainPage = getMainPageForDropdown(item.label);
                return pathname === mainPage;
            }
            
            return hasActiveSubItem;
        }
        return false;
    };

    const isSubItemActive = (sub: any) => {
        // Check if this sub-item is directly active - only exact match or specific nested paths
        if (pathname === sub.href) return true;
        
        // Special cases for nested paths
        if (sub.href === '/services/flag-hide' && pathname === '/services/flag-hide') return true;
        if (sub.href === '/services' && pathname === '/services') return true;
        if (sub.href === '/users' && pathname === '/users') return true;
        if (sub.href === '/reports' && pathname === '/reports') return true;
        if (sub.href === '/payments' && pathname === '/payments') return true;
        
        return false;
    };

    return (
        <aside
            className={`h-screen bg-white transition-all duration-300 flex flex-col ${collapsed ? "w-[127px]" : "w-[261px]"} fixed z-20`}>
            <div className={`flex items-center justify-between  ${collapsed ? "py-[4px] bg-white px-3 h-[76px]" : "py-3  bg-[#48628412] px-4 h-[77px]"} `}>
                <Link href="/" onClick={onMobileClose} >
                    <Image
                        src={collapsed ? "/assets/logo.svg" : "/assets/logo-name.svg"}
                        alt="elevana logo"
                        width={collapsed ? 39.83 : 125}
                        height={collapsed ? 43.83 : 32.83}
                        className="transition-all duration-300"
                    />
                </Link>
                <button
                    className="bg-white rounded-lg w-7 h-7 hidden lg:flex items-center justify-center border border-[#F6F6F6] cursor-pointer"
                    style={{ boxShadow: "0px 4px 24px 0px rgba(37, 37, 37, 0.12)" }}
                    onClick={() => handleCollapse(!collapsed)}
                >
                    <Image src='/assets/icons/arrow.svg' className={collapsed ? "rotate-180" : ""} alt="arrow" width={16} height={16} />
                </button>
                <button
                    className="bg-white rounded-lg w-7 h-7 lg:hidden flex items-center justify-center border border-[#F6F6F6] cursor-pointer"
                    style={{ boxShadow: "0px 4px 24px 0px rgba(37, 37, 37, 0.12)" }}
                    onClick={onMobileClose}
                >
                    <Image src='/assets/icons/arrow.svg' alt="arrow" width={16} height={16} />
                </button>
            </div>


            <div className={`${collapsed ? "w-full max-w-[103px] h-[1px] mx-auto bg-[#E8ECF4]" : ""}`} />

            <nav className="flex-1 mt-4 lg:mt-5 overflow-y-auto hide-scrollbar px-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const IconFilled = item.iconFilled;
                        const isActive = isMenuItemActive(item);
                        const isDropdownOpen = openDropdown === item.label;
                        
                        return (
                            <li key={item.label}>
                                {item.dropdown ? (
                                    <div>
                                        <Link
                                            href={getMainPageForDropdown(item.label)}
                                            className={`w-full flex items-center gap-3 justify-between px-2.5 lg:px-3 py-2.5 lg:py-3 cursor-pointer rounded-lg
                                                transition-all duration-300
                                                ${collapsed ? "justify-center" : ""}
                                                ${isDropdownOpen || isActive
                                                    ? "bg-[#8291960F]"
                                                    : "text-[#252525]  hover:bg-[#8291960F]"
                                                }`}
                                            onClick={() => {
                                                setOpenDropdown(openDropdown === item.label ? null : item.label);
                                                onMobileClose?.();
                                            }}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                {(isDropdownOpen || isActive) ? (
                                                    <IconFilled className="text-[#3A96AF] w-5 h-5" />
                                                ) : (
                                                    <Icon className="text-[#252525] w-5 h-5" />
                                                )}
                                                {!collapsed && <span className={`text-[16px] leading-[24px] font-medium ${(isDropdownOpen || isActive) ? "text-[#252525]" : "text-[#252525]"}`}>{item.label}</span>}
                                            </div>
                                            {!collapsed && (
                                                <ArrowDropdownMenu className={`transition-transform duration-300 ${(isDropdownOpen || isActive) ? "text-[#9A9EA6] -rotate-90" : "text-[#9A9EA6]"}`} />
                                            )}
                                        </Link>
                                        {/* Dropdown */}
                                        {openDropdown === item.label && !collapsed && (
                                            <div
                                                className={`
                                                   mt-0.5 rounded-lg overflow-hidden
                                                    transition-all duration-300 ease-in-out
                                                    ${openDropdown === item.label ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                                                `}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                            >
                                                <ul className="">
                                                    {item.dropdown.map((sub) => {
                                                        const isSubActive = isSubItemActive(sub);
                                                        return (
                                                            <li key={sub.label} className="rounded-lg">
                                                                <Link
                                                                    href={sub.href}
                                                                    className={`flex items-center p-2.5 lg:p-3 rounded-lg font-medium hover:bg-[#8291960F] ${isSubActive ? 'bg-[#3A96AF0F] text-[#252525]' : ' text-[#252525]'}`}
                                                                >
                                                                    {isSubActive ? (
                                                                        <span className="inline-block w-2.5 h-2.5 rounded-full ml-[5px] mr-3 bg-[#3A96AF]" />
                                                                    ) : (
                                                                        <span className="inline-block w-2.5 h-2.5 ml-[5px] mr-3" />
                                                                    )}
                                                                    {sub.label}
                                                                </Link>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    ) : (
                                    <Link href={item.href || "/"}>
                                        <button
                                            className={`cursor-pointer w-full flex items-center gap-3 px-2.5 lg:px-3 py-2.5 lg:py-3 rounded-lg ${collapsed ? "justify-center" : "justify-start"
                                                } ${isActive ? "bg-[#8291960F]" : "text-[#252525] hover:bg-[#8291960F]"}`}
                                                onClick={() => {
                                                    setOpenDropdown(null);
                                                    onMobileClose?.();
                                                }}
                                        >
                                            {isActive ? (
                                                <IconFilled className="text-[#3A96AF] w-5 h-5" />
                                            ) : (
                                                <Icon className="text-[#252525] w-5 h-5" />
                                            )}
                                            {!collapsed && <span className={`text-[16px] leading-[20px] font-medium ${isActive ? "text-[#252525]" : "text-[#252525]"}`}>{item.label}</span>}
                                        </button>
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}