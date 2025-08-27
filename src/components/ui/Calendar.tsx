"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CalendarProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    dateFormat?: "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";
    minDate?: Date;
    restrictPastDates?: boolean;
}

const Calendar = React.forwardRef<HTMLInputElement, CalendarProps>(
    ({
        className,
        value,
        onChange,
        placeholder = "Select date",
        disabled,
        dateFormat = "MM/DD/YYYY",
        minDate,
        restrictPastDates = true,
        ...props
    }, ref) => {
        const [isOpen, setIsOpen] = React.useState(false);
        const [displayValue, setDisplayValue] = React.useState(value || "");
        const [selectedDate, setSelectedDate] = React.useState("");
        const [currentMonth, setCurrentMonth] = React.useState(new Date());

        const inputRef = React.useRef<HTMLInputElement>(null);
        const popupRef = React.useRef<HTMLDivElement>(null);

        React.useImperativeHandle(ref, () => inputRef.current!);

        const getMinDate = () => {
            if (minDate) return minDate;
            if (restrictPastDates) return new Date(); // Today
            return null;
        };

        const isDateDisabled = (date: Date) => {
            const minAllowedDate = getMinDate();
            if (!minAllowedDate) return false;
            
            const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            const minDateOnly = new Date(minAllowedDate.getFullYear(), minAllowedDate.getMonth(), minAllowedDate.getDate());
            
            return dateOnly < minDateOnly;
        };

        const getDaysInMonth = (date: Date) => {
            return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        };

        const getFirstDayOfMonth = (date: Date) => {
            return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        };

        const getCalendarDays = () => {
            const daysInMonth = getDaysInMonth(currentMonth);
            const firstDay = getFirstDayOfMonth(currentMonth);
            const days = [];

            const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 0);
            const prevMonthDays = getDaysInMonth(prevMonth);
            for (let i = firstDay - 1; i >= 0; i--) {
                days.push({
                    day: prevMonthDays - i,
                    isCurrentMonth: false,
                    date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, prevMonthDays - i)
                });
            }

            for (let i = 1; i <= daysInMonth; i++) {
                days.push({
                    day: i,
                    isCurrentMonth: true,
                    date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i)
                });
            }

            const remainingDays = 42 - days.length;
            for (let i = 1; i <= remainingDays; i++) {
                days.push({
                    day: i,
                    isCurrentMonth: false,
                    date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i)
                });
            }

            return days;
        };

        const formatDate = (dateString: string) => {
            if (!dateString) return "";

            const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));

            if (!year || !month || !day) return dateString;

            const monthStr = month.toString().padStart(2, '0');
            const dayStr = day.toString().padStart(2, '0');
            const yearStr = year.toString();

            switch (dateFormat) {
                case "DD/MM/YYYY":
                    return `${dayStr}/${monthStr}/${yearStr}`;
                case "YYYY-MM-DD":
                    return `${yearStr}-${monthStr}-${dayStr}`;
                case "MM/DD/YYYY":
                default:
                    return `${monthStr}/${dayStr}/${yearStr}`;
            }
        };

        const updateDisplayValue = () => {
            if (selectedDate) {
                const formattedDate = formatDate(selectedDate);
                setDisplayValue(formattedDate);
                onChange?.(formattedDate);
            } else {
                setDisplayValue("");
                onChange?.("");
            }
        };

        const handleDateSelect = (date: Date) => {
            if (isDateDisabled(date)) {
                return;
            }

            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const dateString = `${year}-${month}-${day}`;
            setSelectedDate(dateString);
        };

        const handleInputClick = () => {
            if (!disabled) {
                setIsOpen(true);
            }
        };

        const handleApply = () => {
            updateDisplayValue();
            setIsOpen(false);
        };

        const handleClear = () => {
            setSelectedDate("");
            setDisplayValue("");
            onChange?.("");
            setIsOpen(false);
        };

        const handleCancel = () => {
            setIsOpen(false);
        };

        const nextMonth = () => {
            setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
        };

        const prevMonth = () => {
            setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
        };

        React.useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (popupRef.current && !popupRef.current.contains(event.target as Node) &&
                    inputRef.current && !inputRef.current.contains(event.target as Node)) {
                    setIsOpen(false);
                }
            };

            if (isOpen) {
                document.addEventListener('mousedown', handleClickOutside);
                return () => document.removeEventListener('mousedown', handleClickOutside);
            }
        }, [isOpen]);

        React.useEffect(() => {
            updateDisplayValue();
        }, [selectedDate]);

        React.useEffect(() => {
            if (value) {
                setDisplayValue(value);

                const dateRegex = /(\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{1,2}-\d{1,2}|\d{1,2}\/\d{1,2}\/\d{4})/;
                const match = value.match(dateRegex);
                if (match) {
                    const datePart = match[1];

                    if (datePart) {
                        let year, month, day;

                        if (datePart.includes('/')) {
                            const parts = datePart.split('/');
                            if (dateFormat === "DD/MM/YYYY") {
                                [day, month, year] = parts.map(p => parseInt(p, 10));
                            } else {
                                [month, day, year] = parts.map(p => parseInt(p, 10));
                            }
                        } else if (datePart.includes('-')) {
                            [year, month, day] = datePart.split('-').map(p => parseInt(p, 10));
                        }

                        if (year && month && day) {
                            const isoDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                            setSelectedDate(isoDate);
                            setCurrentMonth(new Date(year, month - 1, 1));
                        }
                    }
                }
            }
        }, [value, dateFormat]);

        const calendarDays = getCalendarDays();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        return (
            <div className="relative">
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={displayValue}
                        onClick={handleInputClick}
                        placeholder={placeholder}
                        disabled={disabled}
                        readOnly
                        className={cn(
                            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                            "cursor-pointer focus:outline-none focus:border-[#3A96AF] focus:ring-0 focus:ring-transparent",
                            className
                        )}
                        {...props}
                    />

                    <div onClick={handleInputClick} className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                        <Image src='/assets/icons/calendar-dark.svg' alt="calendar" width={20} height={20} className="cursor-pointer" />
                    </div>
                </div>

                {isOpen && (
                    <div
                        ref={popupRef}
                        className="absolute top-full mt-1 w-full min-w-[320px] max-w-[380px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 left-0"
                        style={{
                            maxHeight: '80vh',
                            overflowY: 'auto'
                        }}
                    >
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-medium text-gray-900">Select Date</h3>
                                {restrictPastDates && (
                                    <span className="text-xs text-gray-500">Future dates only</span>
                                )}
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-lg font-semibold text-gray-900">
                                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                    </h4>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={prevMonth}
                                            className="p-1 hover:bg-gray-100 rounded"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={nextMonth}
                                            className="p-1 hover:bg-gray-100 rounded"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-7 gap-1">
                                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                                        <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                            {day}
                                        </div>
                                    ))}

                                    {calendarDays.map((day, index) => {
                                        const dayYear = day.date.getFullYear();
                                        const dayMonth = (day.date.getMonth() + 1).toString().padStart(2, '0');
                                        const dayDate = day.date.getDate().toString().padStart(2, '0');
                                        const dayDateString = `${dayYear}-${dayMonth}-${dayDate}`;
                                        const isSelected = selectedDate === dayDateString;
                                        const isToday = day.date.toDateString() === new Date().toDateString();
                                        const isDisabled = !day.isCurrentMonth || isDateDisabled(day.date);

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => day.isCurrentMonth && !isDateDisabled(day.date) && handleDateSelect(day.date)}
                                                disabled={isDisabled}
                                                className={cn(
                                                    "text-center py-2 text-sm rounded-md transition-colors",
                                                    day.isCurrentMonth && !isSelected && !isDateDisabled(day.date) ? "hover:bg-gray-100 cursor-pointer" : "",
                                                    !day.isCurrentMonth || isDateDisabled(day.date) ? "text-gray-300 cursor-not-allowed" : "",
                                                    isSelected ? "bg-[#3A96AF] text-white cursor-pointer" : "",
                                                    isToday && !isSelected && !isDateDisabled(day.date) ? "bg-gray-100 font-semibold" : "",
                                                    isDateDisabled(day.date) ? "text-gray-300 bg-gray-50" : "",
                                                    !day.isCurrentMonth || isDateDisabled(day.date) ? "text-gray-300" : isSelected ? "text-white" : "text-gray-900"
                                                )}
                                            >
                                                {day.day}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                <button
                                    onClick={handleClear}
                                    className="cursor-pointer text-base text-gray-500 hover:text-gray-700 font-medium"
                                >
                                    Clear
                                </button>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleCancel}
                                        className="cursor-pointer px-3 py-1.5 text-base text-gray-600 hover:text-gray-800 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleApply}
                                        className="cursor-pointer px-3 py-1.5 bg-[#3A96AF] text-white text-base font-medium rounded-md hover:bg-[#2d7a8f] transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
);

Calendar.displayName = "Calendar";

export { Calendar };