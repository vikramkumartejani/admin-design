import Link from 'next/link'
import React from 'react'

const RecentTransactionsReport = () => {
    // Static transaction data matching the image
    const transactions = [
        {
            id: 1,
            bookingId: 'BK2032',
            user: 'Kevin M.',
            provider: 'Jane M.',
            price: 20000,
            service: 'Life Coaching',
            status: 'Paid',
            date: '20-Apr-2025'
        },
        {
            id: 2,
            bookingId: 'BK2032',
            user: 'Jane M.',
            provider: 'Jane M.',
            price: 20000,
            service: 'Life Coaching',
            status: 'Failed',
            date: '20-Apr-2025'
        },
        {
            id: 3,
            bookingId: 'BK2032',
            user: 'Jane M.',
            provider: 'Jane M.',
            price: 20000,
            service: 'Life Coaching',
            status: 'Pending',
            date: '20-Apr-2025'
        }
    ]

    // Status styling functions
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Paid':
                return 'bg-[#00AA061A] text-[#00AA06]'
            case 'Failed':
                return 'bg-[#FF5F5F1A] text-[#FF5F5F]'
            case 'Pending':
                return 'bg-[#FFB7001A] text-[#FFB700]'
            default:
                return 'bg-gray-100 text-gray-700'
        }
    }

    const getStatusDot = (status: string) => {
        switch (status) {
            case 'Paid':
                return 'bg-[#00AA06]'
            case 'Failed':
                return 'bg-[#FF5F5F]'
            case 'Pending':
                return 'bg-[#FFB700]'
            default:
                return 'bg-gray-500'
        }
    }

    return (
        <div className="bg-white rounded-[24px] border border-[#E8ECF4]">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3.5 px-4 sm:px-6 pt-4">
                <h3 className="text-[20px] leading-[38px] tracking-[-1px] font-semibold text-[#252525]">
                    Recent Transactions Report
                </h3>
                <Link href='/reports' className="bg-[#3A96AF] text-white px-4 py-2 rounded-lg text-[14px] font-medium hover:bg-[#2d7a8f] transition-colors duration-200">
                    View All
                </Link>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-[750px] lg:min-w-[900px] w-full text-nowrap">
                    <thead className='bg-[#F3F6F9]'>
                        <tr>
                            <th className="text-left py-[11px] px-6 text-[16px] leading-[32px] font-semibold text-[#252525]">
                                Booking ID
                            </th>
                            <th className="text-left py-[11px] px-6 text-[16px] leading-[32px] font-semibold text-[#252525]">
                                User
                            </th>
                            <th className="text-left py-[11px] px-6 text-[16px] leading-[32px] font-semibold text-[#252525]">
                                Provider
                            </th>
                            <th className="text-left py-[11px] px-6 text-[16px] leading-[32px] font-semibold text-[#252525]">
                                Price (KES)
                            </th>
                            <th className="text-left py-[11px] px-6 text-[16px] leading-[32px] font-semibold text-[#252525]">
                                Service
                            </th>
                            <th className="text-left py-[11px] px-6 text-[16px] leading-[32px] font-semibold text-[#252525]">
                                Status
                            </th>
                            <th className="text-left py-[11px] px-6 text-[16px] leading-[32px] font-semibold text-[#252525]">
                                Date
                            </th>
                            <th className="text-left py-[11px] px-6 text-[16px] leading-[32px] font-semibold text-[#252525]">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction.id} className="border-b border-[#F3F6F9] hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-6 py-5 text-[14px] leading-[20px] font-medium text-[#252525]">
                                    {transaction.bookingId}
                                </td>
                                <td className="px-6 py-5 text-[14px] leading-[20px] font-medium text-[#252525]">
                                    {transaction.user}
                                </td>
                                <td className="px-6 py-5 text-[14px] leading-[20px] font-medium text-[#252525]">
                                    {transaction.provider}
                                </td>
                                <td className="px-6 py-5 text-[14px] leading-[20px] font-medium text-[#252525]">
                                    {transaction.price.toLocaleString()}
                                </td>
                                <td className="px-6 py-5 text-[14px] leading-[20px] font-medium text-[#252525]">
                                    {transaction.service}
                                </td>
                                <td className="px-6 py-5">
                                    <div className={`px-3.5 h-[32px] rounded-full w-fit ${getStatusColor(transaction.status)} flex items-center gap-2`}>
                                        <div className={`w-2 h-2 rounded-full ${getStatusDot(transaction.status)}`}></div>
                                        <span className='text-[14px] leading-[20px] font-medium'>{transaction.status}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-[14px] leading-[20px] font-medium text-[#252525]">
                                    {transaction.date}
                                </td>
                                <td className="px-6 py-4">
                                    <button className="h-[38px] w-[38px] border border-[#25252526] rounded-[11px] flex items-center justify-center hover:bg-gray-100 transition-colors duration-200">
                                        <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.28809 13.5527L12.1824 6.65844M6.34875 6.12811H11.9627C12.3769 6.12811 12.7127 6.4639 12.7127 6.87811V12.4921" stroke="#252525" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default RecentTransactionsReport