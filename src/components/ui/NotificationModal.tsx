"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Service Booking',
    message: 'John Doe has booked your consultation service for tomorrow at 2:00 PM.',
    time: '5 minutes ago',
    isRead: false,
    type: 'success'
  },
  {
    id: '2',
    title: 'Payment Received',
    message: 'You received a payment of $150 for your coaching session.',
    time: '1 hour ago',
    isRead: false,
    type: 'success'
  },
  {
    id: '3',
    title: 'Profile Update Required',
    message: 'Please update your profile information to improve your visibility.',
    time: '2 hours ago',
    isRead: true,
    type: 'warning'
  },
  {
    id: '4',
    title: 'New Review Received',
    message: 'Sarah Johnson left a 5-star review for your workshop.',
    time: '1 day ago',
    isRead: true,
    type: 'info'
  },
  {
    id: '5',
    title: 'Upcoming Event Reminder',
    message: 'Your conference "Digital Marketing Trends" starts in 3 days.',
    time: '2 days ago',
    isRead: true,
    type: 'info'
  },
  {
    id: '6',
    title: 'Service Cancelled',
    message: 'Unfortunately, your appointment with Mike Smith has been cancelled.',
    time: '3 days ago',
    isRead: false,
    type: 'error'
  },
  {
    id: '7',
    title: 'New Message',
    message: 'You have a new message from a potential client regarding your web development course.',
    time: '4 days ago',
    isRead: true,
    type: 'info'
  },
  {
    id: '8',
    title: 'Weekly Report Available',
    message: 'Your weekly performance report is now available for download.',
    time: '1 week ago',
    isRead: true,
    type: 'info'
  }
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'success':
      return (
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );
    case 'warning':
      return (
        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );
    case 'error':
      return (
        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );
    default:
      return (
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );
  }
};

const AllNotificationsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
}> = ({ isOpen, onClose, notifications, onMarkAllAsRead, onMarkAsRead }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4" data-all-notifications-modal>
      <div
        // ref={modalRef}
        className="bg-white rounded-lg sm:rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between flex-wrap px-4 py-3 sm:p-6 border-b border-[#E8ECF4]">
         <div className='w-full flex items-center justify-between gap-5'>
           <div className="flex items-center gap-2.5 sm:gap-3">
            <h2 className="text-[18px] sm:text-[24px] font-semibold text-[#252525]">All Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-[#FF5F5F] text-white text-xs sm:text-sm px-3 py-1 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAllAsRead();
                }}
                className="px-4 py-2 text-sm sm:block hidden cursor-pointer text-[#3A96AF] hover:text-[#2d7a8f] hover:bg-[#3A96AF1F] rounded-lg font-medium transition-colors"
              >
                Mark all as read
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="#676D75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
         </div>
          {unreadCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkAllAsRead();
              }}
              className="text-sm block sm:hidden cursor-pointer text-[#3A96AF] hover:text-[#2d7a8f] hover:underline underline-offset-2 rounded-lg font-medium transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>


        <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Image src='/assets/icons/notification.svg' alt="notification" width={32} height={32} />
              </div>
              <h3 className="text-lg font-medium text-[#252525] mb-2">No notifications yet</h3>
              <p className="text-[#676D75]">When you receive notifications, they'll appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#E8ECF4]">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 sm:p-6 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-blue-50' : ''
                    }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id);
                  }}
                >
                  <div className="flex items-start gap-2.5 sm:gap-4">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className={`text-base sm:text-lg font-medium text-[#252525] mb-1 sm:mb-2 ${!notification.isRead ? 'font-semibold' : ''
                            }`}>
                            {notification.title}
                          </h3>
                          <p className="text-[#676D75] text-sm sm:text-base mb-1.5 sm:mb-3">
                            {notification.message}
                          </p>
                          <p className="text-sm text-[#676D75]">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="w-3 h-3 bg-[#3A96AF] rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowAllNotifications(false);
    }
  }, [isOpen]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const handleViewAllNotifications = () => {
    setShowAllNotifications(true);
  };

  const handleCloseAllNotifications = () => {
    setShowAllNotifications(false);
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const displayedNotifications = notifications.slice(0, 5);

  return (
    <>
      {!showAllNotifications && (
        <div className="absolute top-full -right-10 sm:right-0 mt-2 z-[9999]" data-notification-modal>
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl w-[300px] sm:w-80 max-h-[80vh] relative z-[9999] overflow-hidden border border-gray-200"
          >
            <div className="flex items-center justify-between p-4 border-b border-[#E8ECF4]">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-[#252525]">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-[#FF5F5F] text-white text-xs min-w-6 h-6 flex items-center justify-center rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 cursor-pointer rounded-full transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="#676D75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {displayedNotifications.length === 0 ? (
                <div className="p-6 sm:p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Image src='/assets/icons/notification.svg' alt="notification" width={24} height={24} />
                  </div>
                  <p className="text-[#676D75] text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-[#E8ECF4]">
                  {displayedNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-blue-50' : ''
                        }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={`text-sm font-medium text-[#252525] ${!notification.isRead ? 'font-semibold' : ''
                              }`}>
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-[#3A96AF] rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-sm text-[#676D75] mt-0.5 sm:mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-[#676D75] mt-1 sm:mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {displayedNotifications.length > 0 && (
              <div className="p-4 border-t border-[#E8ECF4]">
                <div className="flex items-center justify-between">
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-[#3A96AF] hover:text-[#2d7a8f] hover:underline font-medium transition-colors cursor-pointer"
                  >
                    Mark all as read
                  </button>
                  <button
                    onClick={handleViewAllNotifications}
                    className="text-sm text-[#3A96AF] hover:text-[#2d7a8f] hover:underline font-medium transition-colors cursor-pointer"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <AllNotificationsModal
        isOpen={showAllNotifications}
        onClose={handleCloseAllNotifications}
        notifications={notifications}
        onMarkAllAsRead={markAllAsRead}
        onMarkAsRead={markAsRead}
      />
    </>
  );
};