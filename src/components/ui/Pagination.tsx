import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

function getPaginationRange(current: number, total: number) {
    const maxElements = 5;
    const range = [];
    const rangeWithDots = [];
    let l: number | undefined = undefined;

    if (total <= 3) {
        for (let i = 1; i <= total; i++) {
            range.push(i);
        }
    } else {
        const maxPageNumbers = 3;
        
        if (current <= 2) {
            range.push(1, 2, 3);
        } else if (current >= total - 1) {
            range.push(total - 2, total - 1, total);
        } else {
            range.push(current - 1, current, current + 1);
        }
    }

    for (let i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        l = i;
    }

    return rangeWithDots;
}

function getMobilePaginationRange(current: number, total: number) {
    if (total <= 3) return Array.from({ length: total }, (_, i) => i + 1);
    if (current === 1) return [1, 2, total];
    if (current === total) return [1, total - 1, total];
    return [1, current, total];
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
    const desktopPagination = (
        <div className="hidden md:flex items-center gap-3">
            <button
                className={`w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors duration-200 ${
                    page === 1 
                        ? 'opacity-50 cursor-not-allowed text-gray-400' 
                        : 'cursor-pointer text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                }`}
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            {getPaginationRange(page, totalPages).map((p, idx) =>
                p === '...'
                    ? (
                        <span key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center text-lg text-gray-500 font-medium">
                            ...
                        </span>
                    )
                    : (
                        <button
                            key={`page-${p}`}
                            className={`w-10 h-10 flex items-center justify-center cursor-pointer rounded-lg border text-base font-medium transition-all duration-200
                                ${page === p
                                    ? 'border-gray-800 text-gray-900 bg-white shadow-sm'
                                    : 'border-gray-200 text-gray-500 bg-white hover:bg-gray-50 hover:border-gray-300'
                                }
                            `}
                            onClick={() => onPageChange(Number(p))}
                        >
                            {p}
                        </button>
                    )
            )}
            <button
                className={`w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors duration-200 ${
                    page === totalPages 
                        ? 'opacity-50 cursor-not-allowed text-gray-400' 
                        : 'cursor-pointer text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                }`}
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );

    const mobilePagination = (
        <div className="flex md:hidden items-center gap-3">
            <button
                className={`w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors duration-200 ${
                    page === 1 
                        ? 'opacity-50 cursor-not-allowed text-gray-400' 
                        : 'cursor-pointer text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                }`}
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
            >
                <ChevronLeft className="w-4 h-4" />
            </button>
            {getMobilePaginationRange(page, totalPages).map((p, idx, arr) => {
                if (idx === 1 && arr[1] !== 2) {
                    return [
                        <span key='ellipsis-left' className="w-8 h-8 flex items-center justify-center text-lg text-gray-500 font-medium">...</span>,
                        <button
                            key={`page-${p}`}
                            className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded-lg border text-sm font-medium transition-all duration-200
                                ${page === p
                                    ? 'border-gray-800 text-gray-900 bg-white shadow-sm'
                                    : 'border-gray-200 text-gray-500 bg-white hover:bg-gray-50 hover:border-gray-300'
                                }
                            `}
                            onClick={() => onPageChange(Number(p))}
                        >
                            {p}
                        </button>
                    ]
                }
                if (idx === arr.length - 2 && arr[arr.length - 2] !== totalPages - 1) {
                    return [
                        <button
                            key={`page-${p}`}
                            className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded-lg border text-sm font-medium transition-all duration-200
                                ${page === p
                                    ? 'border-gray-800 text-gray-900 bg-white shadow-sm'
                                    : 'border-gray-200 text-gray-500 bg-white hover:bg-gray-50 hover:border-gray-300'
                                }
                            `}
                            onClick={() => onPageChange(Number(p))}
                        >
                            {p}
                        </button>,
                        <span key='ellipsis-right' className="w-8 h-8 flex items-center justify-center text-lg text-gray-500 font-medium">...</span>
                    ]
                }
                return (
                    <button
                        key={`page-${p}`}
                        className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded-lg border text-sm font-medium transition-all duration-200
                            ${page === p
                                ? 'border-gray-800 text-gray-900 bg-white shadow-sm'
                                : 'border-gray-200 text-gray-500 bg-white hover:bg-gray-50 hover:border-gray-300'
                            }
                        `}
                        onClick={() => onPageChange(Number(p))}
                    >
                        {p}
                    </button>
                )
            })}
            <button
                className={`w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors duration-200 ${
                    page === totalPages 
                        ? 'opacity-50 cursor-not-allowed text-gray-400' 
                        : 'cursor-pointer text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                }`}
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );

    return (
        <>
            {mobilePagination}
            {desktopPagination}
        </>
    )
}

export default Pagination