import Image from 'next/image'
import React from 'react'

interface SearchInputProps {
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearch?: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder = 'Search...', value, onChange, onSearch }) => {
    return (
        <div className="bg-white border border-[#25252526] h-[40px] px-4.5 rounded-[12px] flex items-center gap-1.5 w-full">
            <svg className='-mt-0.5' width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.58317 17.9202C13.9554 17.9202 17.4998 14.3758 17.4998 10.0036C17.4998 5.63133 13.9554 2.08691 9.58317 2.08691C5.21092 2.08691 1.6665 5.63133 1.6665 10.0036C1.6665 14.3758 5.21092 17.9202 9.58317 17.9202Z" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18.3332 18.7536L16.6665 17.0869" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onKeyDown={e => { if (e.key === 'Enter' && onSearch) onSearch(); }}
                className="outline-none placeholder:text-[#9A9EA6] text-[#252525] text-[14px] font-medium leading-[19.03px] w-full"
            />
        </div>
    )
}

export default SearchInput