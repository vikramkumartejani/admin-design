"use client";

import * as React from "react";
import { Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateTimePickerMergedProps {
      value?: string;
      onChange?: (value: string) => void;
      placeholder?: string;
      className?: string;
      disabled?: boolean;
      dateFormat?: "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";
      timeFormat?: "12" | "24";
      "data-error"?: boolean;
}

const DateTimePickerMerged = React.forwardRef<HTMLInputElement, DateTimePickerMergedProps>(
      ({
            className,
            value,
            onChange,
            placeholder = "Select date and time",
            disabled,
            dateFormat = "MM/DD/YYYY",
            timeFormat = "12",
            ...props
      }, ref) => {
            const [isOpen, setIsOpen] = React.useState(false);
            const [displayValue, setDisplayValue] = React.useState(value || "");
            const [selectedDate, setSelectedDate] = React.useState("");
            const [selectedTime, setSelectedTime] = React.useState("");
            const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);
            const [isTimePickerOpen, setIsTimePickerOpen] = React.useState(false);
            const [currentMonth, setCurrentMonth] = React.useState(new Date());
            const [selectedHour, setSelectedHour] = React.useState<number>(12);
            const [selectedMinute, setSelectedMinute] = React.useState<number>(0);
            const [selectedPeriod, setSelectedPeriod] = React.useState<'AM' | 'PM'>('AM');

            const inputRef = React.useRef<HTMLInputElement>(null);
            const popupRef = React.useRef<HTMLDivElement>(null);
            const datePickerRef = React.useRef<HTMLDivElement>(null);
            const timePickerRef = React.useRef<HTMLDivElement>(null);

            React.useImperativeHandle(ref, () => inputRef.current!);

            const hours = Array.from({ length: 12 }, (_, i) => i + 1);
            const minutes = Array.from({ length: 60 }, (_, i) => i);

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

            const formatTimeDisplay = (hour: number, minute: number, period: 'AM' | 'PM') => {
                  if (timeFormat === "24") {
                        let hour24 = hour;
                        if (period === 'PM' && hour !== 12) {
                              hour24 = hour + 12;
                        } else if (period === 'AM' && hour === 12) {
                              hour24 = 0;
                        }
                        return `${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                  } else {
                        return `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
                  }
            };

            const parseTimeString = (timeString: string): { hour: number; minute: number; period: 'AM' | 'PM' } => {
                  if (!timeString) return { hour: 12, minute: 0, period: 'AM' };
                  
                  try {
                        if (timeString.includes('AM') || timeString.includes('PM') || timeString.includes('am') || timeString.includes('pm')) {
                              const upperTimeString = timeString.toUpperCase();
                              const [time, periodStr] = upperTimeString.split(' ');
                              const [hourStr, minuteStr] = time.split(':');
                              const hour = parseInt(hourStr, 10);
                              const minute = parseInt(minuteStr || '0', 10);
                              const period = (periodStr === 'AM' || periodStr === 'PM') ? periodStr as 'AM' | 'PM' : 'AM';
                              
                              if (hour >= 1 && hour <= 12 && minute >= 0 && minute <= 59) {
                                    return { hour, minute, period };
                              }
                        }
                        
                        if (timeString.includes(':') && !timeString.includes('AM') && !timeString.includes('PM') && !timeString.includes('am') && !timeString.includes('pm')) {
                              const [hourStr, minuteStr] = timeString.split(':');
                              const hour24 = parseInt(hourStr, 10);
                              const minute = parseInt(minuteStr || '0', 10);
                              
                              if (hour24 >= 0 && hour24 <= 23 && minute >= 0 && minute <= 59) {
                                    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
                                    const period: 'AM' | 'PM' = hour24 >= 12 ? 'PM' : 'AM';
                                    
                                    return { hour: hour12, minute, period };
                              }
                        }
                  } catch (error) {
                  }
                  
                  return { hour: 12, minute: 0, period: 'AM' };
            };

            const updateDisplayValue = (date: string, timeStr: string) => {
                  if (date && timeStr) {
                        const formattedDate = formatDate(date);
                        const combined = `${formattedDate} ${timeStr}`;
                        setDisplayValue(combined);
                        onChange?.(combined);
                  } else if (date) {
                        const formattedDate = formatDate(date);
                        setDisplayValue(formattedDate);
                        onChange?.(formattedDate);
                  } else {
                        setDisplayValue("");
                        onChange?.("");
                  }
            };

            const handleDateSelect = (date: Date) => {
                  const year = date.getFullYear();
                  const month = (date.getMonth() + 1).toString().padStart(2, '0');
                  const day = date.getDate().toString().padStart(2, '0');
                  const dateString = `${year}-${month}-${day}`;
                  setSelectedDate(dateString);
                  updateDisplayValue(dateString, selectedTime);
            };

            const handleTimeSelect = (hour: number, minute: number, period: 'AM' | 'PM') => {
                  const timeStr = formatTimeDisplay(hour, minute, period);
                  setSelectedTime(timeStr);
                  updateDisplayValue(selectedDate, timeStr);
            };

            const handleInputClick = () => {
                  if (!disabled) {
                        setIsOpen(true);
                  }
            };

            const handleDateInputClick = () => {
                  setIsDatePickerOpen(true);
                  setIsTimePickerOpen(false);
            };

            const handleTimeInputClick = () => {
                  setIsTimePickerOpen(true);
                  setIsDatePickerOpen(false);
            };

            const handleHourSelect = (hour: number) => {
                  setSelectedHour(hour);
                  handleTimeSelect(hour, selectedMinute, selectedPeriod);
            };

            const handleMinuteSelect = (minute: number) => {
                  setSelectedMinute(minute);
                  handleTimeSelect(selectedHour, minute, selectedPeriod);
            };

            const handlePeriodSelect = (period: 'AM' | 'PM') => {
                  setSelectedPeriod(period);
                  handleTimeSelect(selectedHour, selectedMinute, period);
            };

            const nextMonth = () => {
                  setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
            };

            const prevMonth = () => {
                  setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
            };

            const handleApply = () => {
                  updateDisplayValue(selectedDate, selectedTime);
                  setIsOpen(false);
            };

            const handleClear = () => {
                  setSelectedDate("");
                  setSelectedTime("");
                  setSelectedHour(12);
                  setSelectedMinute(0);
                  setSelectedPeriod('AM');
                  setDisplayValue("");
                  onChange?.("");
                  setIsOpen(false);
            };

            const handleCancel = () => {
                  setIsOpen(false);
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
                  const handleClickOutside = (event: MouseEvent) => {
                        if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                              setIsDatePickerOpen(false);
                        }
                  };

                  if (isDatePickerOpen) {
                        document.addEventListener('mousedown', handleClickOutside);
                        return () => document.removeEventListener('mousedown', handleClickOutside);
                  }
            }, [isDatePickerOpen]);

            React.useEffect(() => {
                  const handleClickOutside = (event: MouseEvent) => {
                        if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
                              setIsTimePickerOpen(false);
                        }
                  };

                  if (isTimePickerOpen) {
                        document.addEventListener('mousedown', handleClickOutside);
                        return () => document.removeEventListener('mousedown', handleClickOutside);
                  }
            }, [isTimePickerOpen]);

            React.useEffect(() => {
                  if (value) {
                        setDisplayValue(value);
                        const dateTimeRegex = /(\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{1,2}-\d{1,2}|\d{1,2}\/\d{1,2}\/\d{4})\s*(.+)?/;
                        const match = value.match(dateTimeRegex);
                        if (match) {
                              const [, datePart, timePart] = match;
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
                              if (timePart) {
                                    setSelectedTime(timePart.trim());
                                    const parsed = parseTimeString(timePart.trim());
                                    setSelectedHour(parsed.hour);
                                    setSelectedMinute(parsed.minute);
                                    setSelectedPeriod(parsed.period);
                              }
                        }
                  }
            }, [value, dateFormat]);

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
                                          "cursor-pointer focus:outline-none focus:border-[#3A96AF] focus:ring-0 focus:ring-transparent hover:border-[#3A96AF] transition-colors duration-200",
                                          className
                                    )}
                                    {...props}
                              />

                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                                    <Calendar 
                                          className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" 
                                          onClick={handleInputClick}
                                    />
                                    <Clock 
                                          className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" 
                                          onClick={handleInputClick}
                                    />
                              </div>
                        </div>

                        {isOpen && (
                              <div
                                    ref={popupRef}
                                    className="absolute top-full left-0 mt-1 w-full min-w-[280px] max-w-[320px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3"
                              >
                                    <div className="space-y-3">
                                          <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-medium text-gray-900">Select Date & Time</h3>
                                          </div>

                                          <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-2 relative">
                                                      <label className="text-sm font-medium text-gray-700 flex items-center gap-1 cursor-pointer">
                                                            <Calendar className="h-3 w-3" />
                                                            Date
                                                      </label>
                                                      <div className="relative">
                                                            <input
                                                                  type="text"
                                                                  value={selectedDate ? formatDate(selectedDate) : ""}
                                                                  onClick={handleDateInputClick}
                                                                  placeholder="Select date"
                                                                  readOnly
                                                                  className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm cursor-pointer focus:outline-none focus:border-[#3A96AF] focus:ring-1 focus:ring-[#3A96AF] hover:border-[#3A96AF] transition-colors duration-200"
                                                            />
                                                            <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                                                      </div>

                                                      {isDatePickerOpen && (
                                                            <div ref={datePickerRef} className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3">
                                                                  <div className="space-y-2">
                                                                        <div className="flex items-center justify-between">
                                                                              <h4 className="text-xs font-semibold text-gray-900">
                                                                                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                                                              </h4>
                                                                              <div className="flex gap-1">
                                                                                    <button
                                                                                          type="button"
                                                                                          onClick={prevMonth}
                                                                                          className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                                                                                    >
                                                                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                                          </svg>
                                                                                    </button>
                                                                                    <button
                                                                                          type="button"
                                                                                          onClick={nextMonth}
                                                                                          className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                                                                                    >
                                                                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                                          </svg>
                                                                                    </button>
                                                                              </div>
                                                                        </div>

                                                                        <div className="grid grid-cols-7 gap-0.5">
                                                                              {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                                                                                    <div key={`day-header-${index}`} className="text-center text-xs font-medium text-gray-500 py-1">
                                                                                          {day}
                                                                                    </div>
                                                                              ))}

                                                                              {getCalendarDays().map((day, index) => {
                                                                                    const dayYear = day.date.getFullYear();
                                                                                    const dayMonth = (day.date.getMonth() + 1).toString().padStart(2, '0');
                                                                                    const dayDate = day.date.getDate().toString().padStart(2, '0');
                                                                                    const dayDateString = `${dayYear}-${dayMonth}-${dayDate}`;

                                                                                    const isSelected = selectedDate === dayDateString;
                                                                                    const isToday = day.date.toDateString() === new Date().toDateString();
                                                                                    
                                                                                    const today = new Date();
                                                                                    today.setHours(0, 0, 0, 0);
                                                                                    const dayDateOnly = new Date(day.date);
                                                                                    dayDateOnly.setHours(0, 0, 0, 0);
                                                                                    const isPastDate = dayDateOnly < today;
                                                                                    
                                                                                    const isDisabled = !day.isCurrentMonth || isPastDate;

                                                                                    return (
                                                                                          <button
                                                                                                key={index}
                                                                                                type="button"
                                                                                                onClick={() => {
                                                                                                      if (day.isCurrentMonth && !isPastDate) {
                                                                                                            handleDateSelect(day.date);
                                                                                                            setIsDatePickerOpen(false);
                                                                                                      }
                                                                                                }}
                                                                                                disabled={isDisabled}
                                                                                                className={cn(
                                                                                                      "text-center py-1 text-xs rounded transition-colors",
                                                                                                      day.isCurrentMonth && !isSelected && !isPastDate ? "hover:bg-gray-100 cursor-pointer" : "",
                                                                                                      isDisabled ? "text-gray-300 cursor-not-allowed opacity-50" : "",
                                                                                                      isSelected && !isPastDate ? "bg-[#3A96AF] text-white cursor-pointer" : "",
                                                                                                      isToday && !isSelected ? "bg-gray-100 font-semibold" : "",
                                                                                                      isDisabled ? "text-gray-300" : isSelected ? "text-white" : "text-gray-900"
                                                                                                )}
                                                                                          >
                                                                                                {day.day}
                                                                                          </button>
                                                                                    );
                                                                              })}
                                                                        </div>
                                                                  </div>
                                                            </div>
                                                      )}
                                                </div>

                                                <div className="space-y-2 relative">
                                                      <label className="text-sm font-medium text-gray-700 flex items-center gap-1 cursor-pointer">
                                                            <Clock className="h-3 w-3" />
                                                            Time
                                                      </label>
                                                      <div className="relative">
                                                            <input
                                                                  type="text"
                                                                  value={selectedTime || ""}
                                                                  onClick={handleTimeInputClick}
                                                                  placeholder="Select time"
                                                                  readOnly
                                                                  className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm cursor-pointer focus:outline-none focus:border-[#3A96AF] focus:ring-1 focus:ring-[#3A96AF] hover:border-[#3A96AF] transition-colors duration-200"
                                                            />
                                                            <Clock className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                                                      </div>

                                                      {isTimePickerOpen && (
                                                            <div
                                                                  ref={timePickerRef}
                                                                  className="absolute top-full right-0 md:left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3"
                                                            >
                                                                  <div className="space-y-3">
                                                                        <div className="text-center">
                                                                              <h4 className="text-xs font-medium text-gray-900">Select Time</h4>
                                                                        </div>

                                                                        <div className="grid grid-cols-3 gap-2">
                                                                              <div className="space-y-1">
                                                                                    <label className="text-xs font-medium text-gray-700 block text-center cursor-pointer">Hour</label>
                                                                                    <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-md">
                                                                                          {hours.map((hour) => (
                                                                                                <button
                                                                                                      key={hour}
                                                                                                      type="button"
                                                                                                      onClick={() => handleHourSelect(hour)}
                                                                                                      className={cn(
                                                                                                            "w-full px-2 py-1 text-xs text-center hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer",
                                                                                                            selectedHour === hour ? "bg-[#3A96AF] text-white hover:bg-[#2d7a8f]" : "text-gray-900"
                                                                                                      )}
                                                                                                >
                                                                                                      {hour}
                                                                                                </button>
                                                                                          ))}
                                                                                    </div>
                                                                              </div>

                                                                              <div className="space-y-1">
                                                                                    <label className="text-xs font-medium text-gray-700 block text-center cursor-pointer">Min</label>
                                                                                    <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-md">
                                                                                          {minutes.map((minute) => (
                                                                                                <button
                                                                                                      key={minute}
                                                                                                      type="button"
                                                                                                      onClick={() => handleMinuteSelect(minute)}
                                                                                                      className={cn(
                                                                                                            "w-full px-2 py-1 text-xs text-center hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer",
                                                                                                            selectedMinute === minute ? "bg-[#3A96AF] text-white hover:bg-[#2d7a8f]" : "text-gray-900"
                                                                                                      )}
                                                                                                >
                                                                                                      {minute.toString().padStart(2, '0')}
                                                                                                </button>
                                                                                          ))}
                                                                                    </div>
                                                                              </div>

                                                                              <div className="space-y-1">
                                                                                    <label className="text-xs font-medium text-gray-700 block text-center cursor-pointer">Period</label>
                                                                                    <div className="space-y-1">
                                                                                          {(['AM', 'PM'] as const).map((period) => (
                                                                                                <button
                                                                                                      key={period}
                                                                                                      type="button"
                                                                                                      onClick={() => handlePeriodSelect(period)}
                                                                                                      className={cn(
                                                                                                            "w-full px-2 py-2 text-xs text-center rounded-md hover:bg-gray-100 transition-colors border border-gray-200 cursor-pointer",
                                                                                                            selectedPeriod === period ? "bg-[#3A96AF] text-white border-[#3A96AF] hover:bg-[#2d7a8f]" : "text-gray-900"
                                                                                                      )}
                                                                                                >
                                                                                                      {period}
                                                                                                </button>
                                                                                          ))}
                                                                                    </div>
                                                                              </div>
                                                                        </div>
                                                                  </div>
                                                            </div>
                                                      )}
                                                </div>
                                          </div>

                                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                                <button
                                                      type="button"
                                                      onClick={handleClear}
                                                      className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 font-medium"
                                                >
                                                      Clear
                                                </button>
                                                <div className="flex items-center gap-2">
                                                      <button
                                                            type="button"
                                                            onClick={handleCancel}
                                                            className="cursor-pointer px-2 py-1 text-sm text-gray-600 hover:text-gray-800 font-medium"
                                                      >
                                                            Cancel
                                                      </button>
                                                      <button
                                                            type="button"
                                                            onClick={handleApply}
                                                            className="cursor-pointer px-2 py-1 bg-[#3A96AF] text-white text-sm font-medium rounded-md hover:bg-[#2d7a8f] transition-colors"
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

DateTimePickerMerged.displayName = "DateTimePickerMerged";

export { DateTimePickerMerged };