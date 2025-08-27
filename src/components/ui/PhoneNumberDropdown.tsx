"use client"
import React, { useState, useRef, useEffect } from 'react';

const countries = [
    {
        code: '+44',
        name: 'UK',
        flag: (
            <img src="https://flagcdn.com/24x18/gb.png" alt="UK" width={20} height={18} style={{ borderRadius: '4px' }} />
        ),
    },
    {
        code: '+1',
        name: 'USA',
        flag: (
            <img src="https://flagcdn.com/24x18/us.png" alt="US" width={20} height={18} style={{ borderRadius: '4px' }} />
        ),
    },
    {
        code: '+92',
        name: 'Pak',
        flag: (
            <img src="https://flagcdn.com/24x18/pk.png" alt="Pakistan" width={20} height={18} style={{ borderRadius: '4px' }} />
        ),
    },
];

interface PhoneNumberDropdownProps {
    value?: string;
    onChange?: (value: string) => void;
    onCountryChange?: (country: { code: string; name: string }) => void;
    maxLength?: number;
    initialCountryCode?: string;
    initialPhoneValue?: string;
    placeholder?: string;
    className?: string;
}

const PhoneNumberDropdown: React.FC<PhoneNumberDropdownProps> = ({ 
    value, 
    onChange, 
    onCountryChange, 
    maxLength,
    initialCountryCode = '+44',
    initialPhoneValue = '',
    placeholder = 'Phone Number',
    className = ''
}) => {
    const getInitialCountryIndex = () => {
        const index = countries.findIndex(country => country.code === initialCountryCode);
        return index >= 0 ? index : 0;
    };

    const [countryIndex, setCountryIndex] = useState(getInitialCountryIndex());
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [phone, setPhone] = useState(value || initialPhoneValue);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        setPhone(val);
        if (onChange) onChange(val);
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        if (dropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownOpen]);

    const handleCountrySelect = (idx: number) => {
        setCountryIndex(idx);
        setDropdownOpen(false);
        if (onCountryChange) onCountryChange({ code: countries[idx].code, name: countries[idx].name });
    };

    return (
        <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    className="flex items-center cursor-pointer justify-between gap-1.5 px-3 py-3 border border-[#E8ECF4] rounded-xl sm:rounded-[12px] min-w-[70px] sm:min-w-[114px] focus:outline-none"
                    onClick={() => setDropdownOpen((open) => !open)}
                    tabIndex={0}
                >
                    {countries[countryIndex].flag}
                    <span className="text-[#252525] text-[16px] leading-[18px] tracking-[0.5px] font-medium">{countries[countryIndex].code}</span>
                    <svg width="21" height="20" className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.0999 7.4585L11.6666 12.8918C11.0249 13.5335 9.9749 13.5335 9.33324 12.8918L3.8999 7.4585" stroke="#9CB0C9" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                {dropdownOpen && (
                <div className="absolute left-0 mt-1 min-w-max bg-white py-1 border border-[#E8ECF4] rounded-lg shadow-lg z-10">
                    {countries.map((country, idx) => (
                    <button
                        key={country.code}
                        type="button"
                        className={`flex items-center gap-2 w-full py-1.5 px-3 text-left hover:bg-[#F7F8F9] ${
                        idx === countryIndex ? 'bg-[#F8FAFC]' : ''
                        }`}
                        onClick={() => handleCountrySelect(idx)}
                    >
                        {country.flag}
                        <span className="text-[#252525] text-[14px] leading-[18px] font-medium">{country.name}</span>
                        <span className="text-[#676D75] text-[14px] leading-[18px] font-medium">{country.code}</span>
                    </button>
                    ))}
                </div>
                )}
            </div>
            <input
                type="tel"
                placeholder={placeholder}
                className="px-4 py-3 border w-full border-[#E8ECF4] rounded-xl hover:border-[#3A96AF] outline-none text-[#252525] text-[16px] leading-[20px] font-medium tracking-[0.5px]"
                style={{ minWidth: 0 }}
                value={phone}
                onChange={handlePhoneChange}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={maxLength}
            />
        </div>
    );
};

export default PhoneNumberDropdown; 