import Image from 'next/image'
import React, { useState, useRef, useEffect } from 'react'

interface FilterByDropdownProps {
    options: string[];
    selected: string;
    onChange: (value: string) => void;
    label?: string;
}

const FilterByDropdown: React.FC<FilterByDropdownProps> = ({ options, selected, onChange, label = 'Filter By' }) => {
    const [open, setOpen] = useState(false);
    const btnRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node) &&
                btnRef.current &&
                !btnRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener('mousedown', handleClick);
        } else {
            document.removeEventListener('mousedown', handleClick);
        }
        return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(true);
        }
    };

    const displayLabel = (!selected || !options.includes(selected)) ? label : selected;

    return (
        <div className="relative inline-block">
            <button
                ref={btnRef}
                type='button'
                className='flex items-center justify-between py-1 sm:py-1.5 px-1.5 sm:px-2 border border-[#3A96AF] rounded-[8px] text-[#3A96AF] text-[11px] sm:text-[12px] leading-[16px] font-medium tracking-[0.3px] cursor-pointer bg-white focus:outline-none focus:ring-1 focus:ring-[#3A96AF] transition whitespace-nowrap'
                aria-haspopup='listbox'
                aria-expanded={open}
                onClick={() => setOpen(o => !o)}
                onKeyDown={handleKeyDown}
            >
                <span className='sm:pt-[1px]'>{displayLabel}</span>
                <span className={`ml-1 transition-transform ${open ? 'rotate-180' : ''}`}>
                    <Image src='/assets/icons/arrow-up-dropdown.svg' alt='arrow' width={20} height={20} />
                </span>
            </button>
            {open && (
                <div
                    ref={menuRef}
                    className='absolute left-0 z-10 mt-2 w-fit bg-white border border-[#3A96AF] rounded-xl shadow-lg py-1'
                    role='listbox'
                >
                    {options.map(option => (
                        <button
                            key={option}
                            type='button'
                            className={`w-full text-left px-3 py-2 text-nowrap text-[14px] leading-[20px] font-medium tracking-[0.5px] first:rounded-t-xl last:rounded-b-xl transition hover:bg-[#F7F8F9] focus:bg-[#F7F8F9] ${option === selected ? 'text-[#3A96AF] bg-[#F7F8F9]' : 'text-[#252525]'}`}
                            role='option'
                            aria-selected={option === selected}
                            onClick={() => {
                                onChange(option);
                                setOpen(false);
                            }}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default FilterByDropdown