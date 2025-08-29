import React, { useState, useEffect } from 'react'
import { X, Check } from 'lucide-react'
import RippleButton from '@/components/ui/button'

interface Transaction {
    id: number
    txnId: string
    bookingId: string
    user: string
    provider: string
    amount: number
    status: string
    pspRefId: string
    date: string
}

interface TransactionDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    transaction: Transaction | null
}

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({ isOpen, onClose, transaction }) => {
    const [isVerified, setIsVerified] = useState(false)

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen || !transaction) return null

    const handleMarkAsVerified = () => {
        setIsVerified(true)
        // Here you can add API call to update transaction status
        console.log('Transaction marked as verified:', transaction.id)
    }

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'bg-[#00AA061A] text-[#00AA06]' // Light green background, dark green text
            case 'failed':
                return 'bg-[#FF5F5F1A] text-[#FF5F5F]' // Light red background, dark red text
            case 'pending':
                return 'bg-[#FFF3CD] text-[#856404]' // Light yellow background, dark yellow text
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusDot = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'bg-[#00AA06]' // Dark green dot
            case 'failed':
                return 'bg-[#FF5F5F]' // Dark red dot
            case 'pending':
                return 'bg-[#856404]' // Dark yellow dot
            default:
                return 'bg-gray-600'
        }
    }

    return (
        <div 
            className="fixed inset-0 bg-[#0613234b] flex items-center justify-center z-50 overflow-x-auto hide-scrollbar"
            onClick={handleBackdropClick}
        >
            <div className="bg-[#FFFFFF] border border-[#E8ECF4] rounded-[20px] sm:rounded-[34px] max-w-[587px] max-h-[90vh] hide-scrollbar w-full mx-4 py-[30px] relative overflow-y-auto" style={{ boxShadow: "0px 4px 8px 0px #2D2E330A" }}>
                <button
                    onClick={onClose}
                    className="absolute right-5 cursor-pointer sm:right-[30px] top-5 sm:top-[30px] text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Header */}
                <div className="flex items-center flex-col gap-5 justify-center ">
                    <svg width="49" height="48" viewBox="0 0 49 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" width="48" height="48" rx="24" fill="#3A96AF" fillOpacity="0.15" />
                        <g clipPath="url(#clip0_859_20074)">
                            <path fillRule="evenodd" clipRule="evenodd" d="M14.2553 13.7553C15.059 12.9515 16.1491 12.5 17.2857 12.5H33.5714C34.4807 12.5 35.3527 12.8612 35.9958 13.5042C36.6388 14.1472 37 15.0193 37 15.9286V21.9286C37 22.402 36.6162 22.7857 36.1429 22.7857H34.0084V16.7857C34.0084 16.194 33.5287 15.7143 32.937 15.7143C32.3452 15.7143 31.8655 16.194 31.8655 16.7857V22.7857H31.8571V35.6429C31.8571 35.9516 31.691 36.2365 31.4222 36.3887C31.1536 36.541 30.8238 36.5367 30.5591 36.3778L26.7143 34.071L22.8696 36.3778C22.5981 36.5408 22.259 36.5408 21.9876 36.3778L18.1429 34.071L14.2981 36.3778C14.0333 36.5367 13.7036 36.541 13.4348 36.3887C13.1661 36.2365 13 35.9516 13 35.6429V16.7857C13 15.6491 13.4515 14.559 14.2553 13.7553ZM22.4285 15.9286C23.1386 15.9286 23.7142 16.5042 23.7142 17.2143V18.1189C24.4981 18.2507 25.1921 18.6486 25.6981 19.214C25.9925 19.5429 26.225 19.93 26.376 20.3572C26.6126 21.0267 26.2617 21.7613 25.5922 21.9979C24.9227 22.2346 24.1882 21.8837 23.9515 21.2142C23.9144 21.1091 23.8566 21.0122 23.782 20.9289C23.6232 20.7515 23.3966 20.6429 23.1428 20.6429H21.4842C21.1379 20.6429 20.8572 20.9236 20.8572 21.2699C20.8572 21.5646 21.0624 21.8195 21.3502 21.8825L23.8755 22.4349C25.45 22.7793 26.5714 24.1741 26.5714 25.7849C26.5714 27.4833 25.3362 28.8946 23.7142 29.1668V30.0714C23.7142 30.7815 23.1386 31.3571 22.4285 31.3571C21.7184 31.3571 21.1428 30.7815 21.1428 30.0714V29.1668C19.9025 28.9588 18.89 28.0851 18.4812 26.9284C18.2445 26.2589 18.5954 25.5244 19.2649 25.2877C19.9344 25.0511 20.669 25.402 20.9056 26.0715C21.0239 26.4061 21.3431 26.6428 21.7143 26.6428H23.1428C23.6156 26.6428 24 26.2589 24 25.7849C24 25.3816 23.7191 25.0329 23.326 24.9469L20.8007 24.3945C19.3323 24.0733 18.2857 22.773 18.2857 21.2699C18.2857 19.6188 19.5369 18.2598 21.1428 18.0894V17.2143C21.1428 16.5042 21.7184 15.9286 22.4285 15.9286Z" fill="#3A96AF" />
                        </g>
                        <defs>
                            <clipPath id="clip0_859_20074">
                                <rect width="24" height="24" fill="white" transform="translate(13 12.5)" />
                            </clipPath>
                        </defs>
                    </svg>

                    <h2 className="text-[24px] leading-[41px] tracking-[-0.02px] font-medium text-[#252525]">Transaction Details</h2>

                </div>

                {/* Divider */}
                <div className="border-t border-[#00000024] my-6 mx-5 sm:mx-10"></div>

                {/* Content */}
                <div className="px-5 sm:px-10">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[#676D75] text-[16px] font-medium leading-[22px]">Transaction ID:</span>
                            <span className="text-[#252525] text-[16px] leading-[22px] font-medium">{transaction.txnId}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-[#676D75] text-[16px] font-medium leading-[22px]">Booking ID:</span>
                            <span className="text-[#252525] text-[16px] font-medium leading-[22px]">{transaction.bookingId}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-[#676D75] text-[16px] font-medium leading-[22px]">User:</span>
                            <span className="text-[#252525] text-[16px] font-medium leading-[22px]">{transaction.user}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-[#676D75] text-[16px] font-medium leading-[22px]">Provider:</span>
                            <span className="text-[#252525] text-[16px] font-medium leading-[22px]">{transaction.provider}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-[#676D75] text-[16px] font-medium leading-[22px]">Service:</span>
                            <span className="text-[#252525] text-[16px] font-medium leading-[22px]">Life Coaching</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-[#676D75] text-[16px] font-medium leading-[22px]">Amount:</span>
                            <span className="text-[#252525] text-[16px] font-medium leading-[22px]">KES {transaction.amount.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-[#676D75] text-[16px] font-medium leading-[22px]">Date:</span>
                            <span className="text-[#252525] text-[16px] font-medium leading-[22px]">{formatDate(transaction.date)}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-[#676D75] text-[16px] font-medium leading-[22px]">Status:</span>
                            <div className={`px-3.5 py-1.5 rounded-full text-[14p] leading-[20p] font-medium flex items-center gap-2 ${getStatusColor(transaction.status)}`}>
                                <div className={`w-2 h-2 rounded-full ${getStatusDot(transaction.status)}`}></div>
                                {transaction.status}
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-[#676D75] text-[16px] font-medium leading-[22px]">PSP Ref:</span>
                            <span className="text-[#252525] text-[16px] font-medium leading-[22px]">{transaction.pspRefId}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-[#676D75] text-[16px] font-medium leading-[22px]">PSP Provider:</span>
                            <span className="text-[#252525] text-[16px] font-medium leading-[22px]">{transaction.provider}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 sm:px-10 pt-[35px]">
                    <RippleButton
                        onClick={handleMarkAsVerified}
                        disabled={isVerified}
                        className={`w-full max-w-[237px] mx-auto py-3 px-4 rounded-xl group font-medium text-[16px] leading-[20px] transition-all duration-200 flex items-center justify-center gap-1 ${isVerified
                            ? 'bg-[#3A96AF] text-white cursor-not-allowed'
                            : 'bg-white border-2 border-[#3A96AF] text-[#3A96AF] hover:bg-[#3A96AF] hover:text-white'
                            }`}
                    >
                        {isVerified ?
                            <svg width="25" height="24" className='text-white' viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M9.73693 3.20027C9.49341 3.4078 9.37164 3.51158 9.24159 3.59874C8.94349 3.79854 8.6087 3.93721 8.25663 4.00672C8.10304 4.03705 7.94356 4.04977 7.62461 4.07522C6.82323 4.13918 6.42253 4.17115 6.08824 4.28923C5.31504 4.56233 4.70686 5.17051 4.43376 5.94371C4.31568 6.278 4.28371 6.6787 4.21975 7.48008C4.1943 7.79903 4.18158 7.95851 4.15125 8.1121C4.08174 8.46417 3.94307 8.79896 3.74327 9.09706C3.65611 9.22711 3.55234 9.34887 3.3448 9.5924C2.82336 10.2043 2.56263 10.5102 2.40975 10.8301C2.05612 11.57 2.05612 12.43 2.40975 13.1699C2.56264 13.4898 2.82336 13.7957 3.3448 14.4076C3.55231 14.6511 3.65611 14.7729 3.74327 14.9029C3.94307 15.201 4.08174 15.5358 4.15125 15.8879C4.18158 16.0415 4.1943 16.201 4.21975 16.5199C4.28371 17.3213 4.31568 17.722 4.43376 18.0563C4.70686 18.8295 5.31504 19.4377 6.08824 19.7108C6.42253 19.8288 6.82323 19.8608 7.62461 19.9248C7.94356 19.9502 8.10304 19.963 8.25663 19.9933C8.6087 20.0628 8.94349 20.2015 9.24159 20.4013C9.37164 20.4884 9.4934 20.5922 9.73693 20.7997C10.3488 21.3212 10.6547 21.5819 10.9746 21.7348C11.7145 22.0884 12.5745 22.0884 13.3144 21.7348C13.6343 21.5819 13.9402 21.3212 14.5521 20.7997C14.7956 20.5922 14.9174 20.4884 15.0474 20.4013C15.3455 20.2015 15.6803 20.0628 16.0324 19.9933C16.186 19.963 16.3455 19.9502 16.6644 19.9248C17.4658 19.8608 17.8665 19.8288 18.2008 19.7108C18.974 19.4377 19.5822 18.8295 19.8553 18.0563C19.9733 17.722 20.0053 17.3213 20.0693 16.5199C20.0947 16.201 20.1075 16.0415 20.1378 15.8879C20.2073 15.5358 20.346 15.201 20.5458 14.9029C20.6329 14.7729 20.7367 14.6511 20.9442 14.4076C21.4657 13.7957 21.7264 13.4898 21.8793 13.1699C22.2329 12.43 22.2329 11.57 21.8793 10.8301C21.7264 10.5102 21.4657 10.2043 20.9442 9.5924C20.7367 9.34887 20.6329 9.22711 20.5458 9.09706C20.346 8.79896 20.2073 8.46417 20.1378 8.1121C20.1075 7.95851 20.0947 7.79903 20.0693 7.48008C20.0053 6.6787 19.9733 6.278 19.8553 5.94371C19.5822 5.17051 18.974 4.56233 18.2008 4.28923C17.8665 4.17115 17.4658 4.13918 16.6644 4.07522C16.3455 4.04977 16.186 4.03705 16.0324 4.00672C15.6803 3.93721 15.3455 3.79854 15.0474 3.59874C14.9174 3.51158 14.7956 3.40781 14.5521 3.20027C13.9402 2.67883 13.6343 2.41811 13.3144 2.26522C12.5745 1.91159 11.7145 1.91159 10.9746 2.26522C10.6547 2.4181 10.3488 2.67883 9.73693 3.20027ZM16.518 9.86314C16.8358 9.5453 16.8358 9.03 16.518 8.71216C16.2002 8.39433 15.6848 8.39433 15.367 8.71216L10.5168 13.5624L8.92199 11.9676C8.60416 11.6498 8.08885 11.6498 7.77102 11.9676C7.45319 12.2854 7.45319 12.8007 7.77102 13.1186L9.94131 15.2889C10.2591 15.6067 10.7744 15.6067 11.0923 15.2889L16.518 9.86314Z" fill="currentColor" />
                            </svg>
                            :
                            <svg width="25" height="24" viewBox="0 0 25 24" className='text-[#3A96AF] group-hover:text-white' fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.1445 6L9.14453 17L4.14453 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        }
                        {isVerified ? 'Transaction Verified' : 'Mark as Verified'}
                    </RippleButton>
                </div>
            </div>
        </div>
    )
}

export default TransactionDetailsModal