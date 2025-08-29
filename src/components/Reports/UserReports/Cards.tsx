"use client"
import React, { useState, useEffect } from 'react'

interface UserStats {
    totalUsers: number
    serviceProviders: number
    customers: number
    blockedUsers: number
}

interface MetricCardProps {
    icon: React.ReactNode
    title: string
    value: number
}

// Reusable MetricCard component
const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value }) => {
    const formatNumber = (num: number) => {
        return num.toLocaleString()
    }

    return (
        <div className="bg-white rounded-[24px] p-6 hover:shadow-sm border border-[#E8ECF4] transition duration-150">
            <div className="flex flex-col gap-2">
                {icon}
                <p className="text-[16px] leading-[27px] font-medium text-[#252525]">
                    {title}
                </p>
                <p className="text-[40px] leading-[40px] font-semibold text-[#3A96AF]">
                    {formatNumber(value)}
                </p>
            </div>
        </div>
    )
}

const Cards = () => {
    const [stats, setStats] = useState<UserStats>({
        totalUsers: 0,
        serviceProviders: 0,
        customers: 0,
        blockedUsers: 0
    })

    useEffect(() => {
        const calculateStats = async () => {
            try {
                const response = await fetch('/api/users')
                const data = await response.json()
                updateStats(data.users)
            } catch (error) {
                const staticData = require('@/data/userReportsData.json')
                updateStats(staticData.users)
            }
        }

        const updateStats = (users: any[]) => {
            const serviceProviders = users.filter(user => user.role === 'Service Provider').length
            const customers = users.filter(user => user.role === 'Customer').length
            const blockedUsers = users.filter(user => user.status === 'Blocked').length
            const totalUsers = users.length

            setStats({
                totalUsers,
                serviceProviders,
                customers,
                blockedUsers
            })
        }

        calculateStats()
    }, [])

    // Icon components
    const TotalUsersIcon = (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="18" fill="#3A96AF" fillOpacity="0.2" />
            <g clipPath="url(#clip0_859_19357)">
                <path d="M27.6473 26.5931C27.9962 27.0567 27.7123 27.7241 27.1364 27.7944C27.1058 27.7982 27.0751 27.8 27.0443 27.8H8.95505C8.37483 27.8 8.0122 27.1719 8.30229 26.6694C8.31736 26.6433 8.33398 26.6182 8.35207 26.594C9.01947 25.6992 9.90947 24.9947 10.9336 24.5505C8.79078 22.5948 9.56863 19.0529 12.3337 18.175C15.0988 17.2972 17.7772 19.7418 17.155 22.5753C16.988 23.3357 16.5896 24.0257 16.0146 24.5505C16.7534 24.8699 17.4249 25.3268 17.9931 25.8969C18.5613 25.3268 19.2328 24.8699 19.9716 24.5505C17.8288 22.5948 18.6067 19.0529 21.3717 18.175C24.1368 17.2972 26.8153 19.7418 26.193 22.5753C26.026 23.3357 25.6276 24.0257 25.0526 24.5505C26.0815 24.9924 26.9762 25.6967 27.6473 26.5931ZM8.50281 17.8509C8.83583 18.1006 9.30826 18.0332 9.55802 17.7001C11.5177 15.0872 15.437 15.0872 17.3967 17.7001C17.6982 18.1021 18.3012 18.1021 18.6027 17.7001C20.5623 15.0872 24.4817 15.0872 26.4414 17.7001C26.7899 18.1643 27.5101 18.0772 27.7379 17.5433C27.8436 17.2955 27.809 17.0102 27.6473 16.7947C26.9799 15.9002 26.0899 15.196 25.0658 14.7522C27.2086 12.7965 26.4307 9.25454 23.6657 8.37668C20.9006 7.49882 18.2221 9.94342 18.8444 12.777C19.0114 13.5374 19.4098 14.2274 19.9848 14.7522C19.246 15.0715 18.5745 15.5284 18.0063 16.0985C17.438 15.5284 16.7666 15.0715 16.0278 14.7522C18.1706 12.7965 17.3927 9.25454 14.6276 8.37668C11.8626 7.49882 9.18409 9.94342 9.80637 12.777C9.97337 13.5374 10.3717 14.2274 10.9467 14.7522C9.91785 15.1944 9.02312 15.8991 8.35207 16.7957C8.10231 17.1287 8.1698 17.6011 8.50281 17.8509Z" fill="#3A96AF" />
            </g>
            <defs>
                <clipPath id="clip0_859_19357">
                    <rect width="20" height="20" fill="white" transform="translate(8 8)" />
                </clipPath>
            </defs>
        </svg>
    )

    const ServiceProvidersIcon = (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="18" fill="#3A96AF" fillOpacity="0.2" />
            <path fillRule="evenodd" clipRule="evenodd" d="M15.6435 12.4643C15.6435 11.4781 16.443 10.6786 17.4292 10.6786H18.5721C19.5583 10.6786 20.3578 11.4781 20.3578 12.4643V12.6808C19.5789 12.6643 18.7981 12.6643 18.0407 12.6643H17.9603C17.2029 12.6643 16.4223 12.6643 15.6435 12.6808V12.4643ZM13.5006 12.7825V12.4643C13.5006 10.2946 15.2595 8.53572 17.4292 8.53572H18.5721C20.7418 8.53572 22.5006 10.2946 22.5006 12.4643V12.7825C23.1161 12.8326 23.7147 12.9039 24.2829 13.0055C25.4547 13.2149 26.3769 14.1102 26.6277 15.2706C26.7544 15.8561 26.8301 16.4255 26.8756 17.0215L18.6275 19.7749C18.2238 19.9097 17.7873 19.9097 17.3836 19.7749L9.12563 17.0182C9.17106 16.4234 9.24683 15.855 9.3732 15.2706C9.62411 14.1102 10.5463 13.2149 11.7181 13.0055C12.2863 12.9039 12.885 12.8326 13.5006 12.7825ZM9.05762 20.0108C9.05761 19.6112 9.05761 19.236 9.06044 18.879L16.8181 21.4687C17.5888 21.726 18.4223 21.726 19.193 21.4687L26.9406 18.8824C26.9433 19.2383 26.9433 19.6125 26.9433 20.0109V20.1176C26.9434 22.0386 26.9434 23.3983 26.6277 24.858C26.3769 26.0184 25.4547 26.9137 24.2829 27.1231C22.3737 27.4643 20.1193 27.4643 18.0407 27.4643H17.9603C15.8817 27.4643 13.6272 27.4643 11.7181 27.1231C10.5463 26.9137 9.62411 26.0184 9.3732 24.858C9.05757 23.3984 9.05759 22.0386 9.05762 20.1176V20.0108Z" fill="#3A96AF" />
        </svg>
    )

    const CustomersIcon = (
        <svg width="36" height="37" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="0.5" width="36" height="36" rx="18" fill="#3A96AF" fillOpacity="0.2" />
            <path d="M11 15.5C11 16.5609 11.4214 17.5783 12.1716 18.3284C12.9217 19.0786 13.9391 19.5 15 19.5C16.0609 19.5 17.0783 19.0786 17.8284 18.3284C18.5786 17.5783 19 16.5609 19 15.5C19 14.4391 18.5786 13.4217 17.8284 12.6716C17.0783 11.9214 16.0609 11.5 15 11.5C13.9391 11.5 12.9217 11.9214 12.1716 12.6716C11.4214 13.4217 11 14.4391 11 15.5Z" fill="#3A96AF" stroke="#3A96AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 19.5C11.134 19.5 8 22.186 8 25.5H22C22 22.186 18.866 19.5 15 19.5Z" fill="#3A96AF" stroke="#3A96AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 19.5C21.6684 19.5 22.3261 19.3324 22.9131 19.0127C23.5 18.693 23.9975 18.2313 24.3601 17.6698C24.7227 17.1083 24.9388 16.4649 24.9886 15.7984C25.0385 15.1319 24.9205 14.4635 24.6456 13.8543C24.3706 13.2451 23.9473 12.7145 23.4144 12.311C22.8816 11.9076 22.2561 11.644 21.5952 11.5446C20.9342 11.4451 20.2589 11.5128 19.6309 11.7415C19.0028 11.9703 18.4421 12.3527 18 12.854M21 19.5C20.193 19.5 18.897 19.207 18 18.265M21 19.5C24.866 19.5 28 22.186 28 25.5H22" stroke="#3A96AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )

    const BlockedUsersIcon = (
        <svg width="36" height="37" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="0.5" width="36" height="36" rx="18" fill="#3A96AF" fillOpacity="0.2" />
            <path d="M20.7 17.95L15.825 13.075C16.1083 12.8916 16.4375 12.7333 16.8125 12.6C17.1875 12.4667 17.5834 12.4 18 12.4C18.9667 12.4 19.7792 12.7291 20.4375 13.3875C21.0958 14.0458 21.425 14.8583 21.425 15.825C21.425 16.2416 21.3625 16.6542 21.2375 17.0625C21.1125 17.4708 20.9333 17.7667 20.7 17.95ZM11.6 24.175C12.65 23.525 13.6709 23.0166 14.6625 22.65C15.6542 22.2833 16.7667 22.1 18 22.1C18.6166 22.1 19.2042 22.1459 19.7625 22.2375C20.3208 22.3292 20.7916 22.4417 21.175 22.575L17.825 19.225C16.8917 19.1917 16.1417 18.8917 15.575 18.325C15.0083 17.7583 14.7 17.0416 14.65 16.175L11.45 12.975C10.8333 13.725 10.3542 14.5541 10.0125 15.4625C9.67083 16.3708 9.5 17.3834 9.5 18.5C9.5 19.5167 9.66666 20.4917 10 21.425C10.3333 22.3583 10.8667 23.275 11.6 24.175ZM24.6 24C25.1833 23.3 25.6458 22.4833 25.9875 21.55C26.3291 20.6167 26.5 19.6 26.5 18.5C26.5 15.9667 25.7167 13.9166 24.15 12.35C22.5833 10.7833 20.5333 10 18 10C16.8334 10 15.8 10.175 14.9 10.525C14 10.875 13.2 11.3333 12.5 11.9L24.6 24ZM18 28.5C16.6 28.5 15.2916 28.2416 14.075 27.725C12.8583 27.2084 11.8 26.5 10.9 25.6C10 24.7 9.29167 23.6417 8.775 22.425C8.25834 21.2084 8 19.9 8 18.5C8 17.1 8.25834 15.7916 8.775 14.575C9.29167 13.3583 10 12.3 10.9 11.4C11.8 10.5 12.8583 9.79167 14.075 9.275C15.2916 8.75834 16.6 8.5 18 8.5C19.4 8.5 20.7084 8.75834 21.925 9.275C23.1417 9.79167 24.2 10.5 25.1 11.4C26 12.3 26.7084 13.3583 27.225 14.575C27.7416 15.7916 28 17.1 28 18.5C28 19.9 27.7416 21.2084 27.225 22.425C26.7084 23.6417 26 24.7 25.1 25.6C24.2 26.5 23.1417 27.2084 21.925 27.725C20.7084 28.2416 19.4 28.5 18 28.5Z" fill="#3A96AF" />
        </svg>
    )

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2.5">
            <MetricCard
                icon={TotalUsersIcon}
                title="Total Users"
                value={stats.totalUsers}
            />
            <MetricCard
                icon={ServiceProvidersIcon}
                title="Service Providers"
                value={stats.serviceProviders}
            />
            <MetricCard
                icon={CustomersIcon}
                title="Customers"
                value={stats.customers}
            />
            <MetricCard
                icon={BlockedUsersIcon}
                title="Blocked Users"
                value={stats.blockedUsers}
            />
        </div>
    )
}

export default Cards