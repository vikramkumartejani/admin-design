"use client"
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Menu } from "lucide-react";
import Image from "next/image";
import Dashboard from "@/svgIcons/Dashboard";
import DashboardFilled from "@/svgIcons/DashboardFilled";
import TransactionsFilled from "@/svgIcons/TransactionsFilled";
import ServicesFilled from "@/svgIcons/ServicesFilled";
import ManageCustomersFilled from "@/svgIcons/ManageCustomersFilled";
import InvoicesFilled from "@/svgIcons/InvoicesFilled";
import ManageProfileFilled from "@/svgIcons/ManageProfileFilled";
import { usePathname, useSearchParams } from "next/navigation";
import { generateBreadcrumbs } from "@/lib/utils";
import { useState, Suspense, useEffect } from "react";
import { NotificationModal } from "./ui/NotificationModal";
import { ProfileModal } from "./ui/ProfileModal";

function TopHeaderContent({
  onSidebarOpen,
}: {
  onSidebarOpen?: () => void;
  onSidebarClose?: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const breadcrumbs = generateBreadcrumbs(pathname, searchParams.toString());
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Handle clicking outside modals
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Check if click is outside notification modal (including AllNotificationsModal)
      if (isNotificationModalOpen && !target.closest('[data-notification-modal]') && !target.closest('[data-all-notifications-modal]')) {
        setIsNotificationModalOpen(false);
      }
      
      // Check if click is outside profile modal
      if (isProfileModalOpen && !target.closest('[data-profile-modal]')) {
        setIsProfileModalOpen(false);
      }
    };

    if (isNotificationModalOpen || isProfileModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isNotificationModalOpen, isProfileModalOpen]);

  const handleNotificationClick = () => {
    setIsNotificationModalOpen(true);
  };

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
  };

  const closeNotificationModal = () => {
    setIsNotificationModalOpen(false);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const getIconForLabel = (label: string, isActive: boolean = false) => {
    switch (label) {
      case "Dashboard":
        return isActive ? <DashboardFilled className="text-[#3A96AF] w-5 h-5" /> : <Dashboard className="text-[#486284] w-5 h-5" />;
      case "Services":
        return <ServicesFilled className="text-[#3A96AF] w-5 h-5" />;
      case "Users":
        return <ManageCustomersFilled className="text-[#3A96AF] w-5 h-5" />;
      case "Reports":
        return <TransactionsFilled className="text-[#3A96AF] w-5 h-5" />;
      case "Payments":
        return <InvoicesFilled className="text-[#3A96AF] w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <>
      <header className="w-full flex items-center justify-between px-4 lg:px-6 py-3 h-[77px] bg-white border-b border-l border-[#E8ECF4] sticky top-0 z-30">
        {/* Desktop Breadcrumbs */}
        <div className="hidden xl:flex items-center gap-2 text-nowrap">
          <Link href='/' className={`flex items-center gap-2 text-[18px] leading-[22px] font-normal ${pathname === "/" ? "text-[#3A96AF]" : "text-[#486284]"
            }`}>
            {getIconForLabel("Dashboard", pathname === "/")} Dashboard
          </Link>

          {pathname !== "/" && breadcrumbs.slice(1).map((breadcrumb, index) => (
            <div key={index} className="flex items-center gap-2">
              <Image src='/assets/icons/chevron-right.svg' alt="chevron-right" width={20} height={20} />
              <Link
                href={breadcrumb.href}
                className={`flex items-center gap-2 text-[18px] leading-[22px] font-normal ${breadcrumb.isActive
                  ? "text-[#3A96AF]"
                  : "text-[#3A96AF]"
                  }`}
              >
                {getIconForLabel(breadcrumb.label, breadcrumb.isActive)}
                {breadcrumb.label}
              </Link>
            </div>
          ))}
        </div>

        {/* Desktop Action Buttons */}
        <div className="w-fit hidden lg:flex items-center justify-end gap-3 relative">
          <div className="relative">
            <button
              onClick={handleNotificationClick}
              className="border border-[#E8ECF4] rounded-full min-w-[46px] h-[46px] flex items-center justify-center relative cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="w-[22px] h-[22px] relative">
                <Image src='/assets/icons/notification.svg' alt="notification" width={22} height={22} />
                <div className="bg-[#FF5F5F] rounded-full min-w-[6px] min-h-[6px] max-w-[6px] max-h-[6px] absolute top-[3px] left-[13px]" />
              </div>
            </button>
            <NotificationModal
              isOpen={isNotificationModalOpen}
              onClose={closeNotificationModal}
            />
          </div>

          <div className="relative">
            <button onClick={handleProfileClick} className="rounded-full">
              <Avatar className="bg-[#FF783A]/20 min-w-[46px] min-h-[46px] cursor-pointer hover:ring-2 hover:ring-[#3A96AF] hover:ring-offset-2 transition-all">
                <AvatarImage src="/assets/avatar.png" alt="User" />
                <AvatarFallback className="text-[#FF783A] text-[16px] leading-[27px] font-bold">AW</AvatarFallback>
              </Avatar>
            </button>
            <ProfileModal
              isOpen={isProfileModalOpen}
              onClose={closeProfileModal}
            />
          </div>
        </div>

        {/* Mobile Header */}
        <div className="w-full flex items-center justify-between gap-2 lg:hidden relative">
          <Link href="/" >
            <Image src="/assets/logo-name.svg" alt="elevana logo" width={125} height={32} />
          </Link>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={handleNotificationClick}
                className="border border-[#E8ECF4] rounded-full min-w-[40px] sm:min-w-[46px] h-[40px] sm:h-[46px] flex items-center justify-center relative cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="w-[22px] h-[22px] relative">
                  <Image src='/assets/icons/notification.svg' alt="notification" width={22} height={22} />
                  <div className="bg-[#FF5F5F] rounded-full min-w-[6px] min-h-[6px] max-w-[6px] max-h-[6px] absolute top-[3px] left-[13px]" />
                </div>
              </button>
              <NotificationModal
                isOpen={isNotificationModalOpen}
                onClose={closeNotificationModal}
              />
            </div>

            <div className="relative">
              <button onClick={handleProfileClick} className="rounded-full">
                <Avatar className="bg-[#FF783A]/20 min-w-[40px] sm:min-w-[46px] min-h-[40px] sm:min-h-[46px] cursor-pointer hover:ring-2 hover:ring-[#3A96AF] hover:ring-offset-2 transition-all">
                  <AvatarImage src="/assets/avatar.png" alt="User" />
                  <AvatarFallback className="text-[#FF783A] text-[16px] leading-[27px] font-bold">AW</AvatarFallback>
                </Avatar>
              </button>
              <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={closeProfileModal}
              />
            </div>

            <button
              onClick={onSidebarOpen}
              className="rounded-md cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>


    </>
  );
}

export function TopHeader({
  onSidebarOpen,
}: {
  onSidebarOpen?: () => void;
  onSidebarClose?: () => void;
}) {
  return (
    <Suspense fallback={
      <header className="w-full flex items-center justify-between px-4 lg:px-6 py-4 lg:py-5 bg-white border-b border-l border-[#E8ECF4] sticky top-0 z-30">
        <div className="hidden xl:flex items-center gap-2">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="w-full xl:w-fit hidden lg:flex items-center justify-end gap-3">
          <div className="border border-[#E8ECF4] rounded-full min-w-[46px] h-[46px] bg-gray-100 animate-pulse"></div>
          <div className="rounded-full min-w-[46px] min-h-[46px] bg-gray-200 animate-pulse"></div>
        </div>
        <div className="w-full flex items-center justify-between gap-2 lg:hidden">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </header>
    }>
      <TopHeaderContent
        onSidebarOpen={onSidebarOpen}
      />
    </Suspense>
  );
}