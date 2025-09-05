"use client"
import React, { useState } from 'react'

interface ServiceData {
    id: number
    title: string
    bookings: number
}

const UserSignupsOverTime = () => {
    const [currentIndex, setCurrentIndex] = useState(0)

    // Sample data - in real app this would come from API
    const serviceData: ServiceData[] = [
        { id: 1, title: "Life Coaching (1hr)", bookings: 135 },
        { id: 2, title: "Digital Marketing Basics", bookings: 102 },
        { id: 3, title: "Personal Finance Guide", bookings: 85 },
        { id: 4, title: "Web Development Course", bookings: 78 },
        { id: 5, title: "Graphic Design Masterclass", bookings: 65 },
        { id: 6, title: "Business Strategy Workshop", bookings: 58 }
    ]

    const itemsPerPage = 3
    const totalPages = Math.ceil(serviceData.length / itemsPerPage)
    const currentData = serviceData.slice(currentIndex, currentIndex + itemsPerPage)
    const maxBookings = Math.max(...serviceData.map(service => service.bookings))

    const handlePrevious = () => {
        setCurrentIndex(prev => Math.max(0, prev - 1))
    }

    const handleNext = () => {
        setCurrentIndex(prev => Math.min(serviceData.length - itemsPerPage, prev + 1))
    }

    const getProgressPercentage = (bookings: number) => {
        return (bookings / maxBookings) * 100
    }

    return (
        <div className='border border-[#E8ECF4] bg-white rounded-[22px] pt-4 px-4 sm:px-6 pb-5 sm:pb-[30px]'>
            <div className='flex items-center justify-between gap-4 mb-5'>
                <h2 className='text-[#252525] text-[16px] leading-[32px] font-semibold'>User Signups Over Time</h2>
                <div className='flex items-center gap-2'>
                    <button
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                        className={`w-10 h-10 rounded-xl border border-[#25252526] flex items-center justify-center cursor-pointer transition-colors duration-200 ${currentIndex === 0
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-gray-50'
                            }`}
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g opacity={currentIndex === 0 ? "0.3" : "1"}>
                                <path d="M12.5415 16.6L7.1082 11.1667C6.46654 10.525 6.46654 9.47499 7.1082 8.83333L12.5415 3.39999" stroke="#252525" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                        </svg>
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={currentIndex >= serviceData.length - itemsPerPage}
                        className={`w-10 h-10 rounded-xl border border-[#25252526] flex items-center justify-center cursor-pointer transition-colors duration-200 ${currentIndex >= serviceData.length - itemsPerPage
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-gray-50'
                            }`}
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g opacity={currentIndex >= serviceData.length - itemsPerPage ? "0.3" : "1"}>
                                <path d="M7.45846 16.6L12.8918 11.1667C13.5335 10.525 13.5335 9.47499 12.8918 8.83333L7.45846 3.39999" stroke="#252525" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Column Headers */}
            <div className='flex items-center justify-between mb-4.5 sm:mb-[22px]'>
                <div className='text-[#676D75] text-[14px] leading-[20px] font-medium'>Service Title</div>
                <div className='text-[#676D75] text-[14px] leading-[20px] font-medium'>Bookings</div>
            </div>

            {/* Service List */}
            <div className='space-y-4 sm:space-y-6'>
                {currentData.map((service) => (
                    <div key={service.id} className='flex items-center flex-col justify-between'>
                        <div className='flex items-center justify-between w-full gap-4 mb-1.5'>
                            <div className='text-[#252525] text-[14px] leading-[20px] font-medium'>
                                {service.title}
                            </div>
                            <div className='text-[#252525] text-[14px] leading-[20px] font-medium'>
                                {service.bookings}
                            </div>
                        </div>
                        <div className='w-full bg-[#F5F5F5] rounded-full h-4 sm:h-5'>
                            <div
                                className='bg-[#3A96AF] h-4 sm:h-5 rounded-full transition-all duration-500 ease-out'
                                style={{ width: `${getProgressPercentage(service.bookings)}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UserSignupsOverTime