"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(
  ({ className, value, onChange, placeholder = "Select time", disabled, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [displayValue, setDisplayValue] = React.useState(value || "");
    const [selectedHour, setSelectedHour] = React.useState<number>(12);
    const [selectedMinute, setSelectedMinute] = React.useState<number>(0);
    const [selectedPeriod, setSelectedPeriod] = React.useState<'AM' | 'PM'>('AM');
    
    const inputRef = React.useRef<HTMLInputElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const popupRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    const formatTime = (hour: number, minute: number, period: 'AM' | 'PM') => {
      const hourStr = hour.toString();
      const minuteStr = minute.toString().padStart(2, '0');
      return `${hourStr}:${minuteStr} ${period}`;
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

    const autoFormatTimeInput = (input: string): string => {
      let cleaned = input.replace(/[^0-9APMapm\s:]/g, '');
      cleaned = cleaned.replace(/[aA][mM]/g, ' AM').replace(/[pP][mM]/g, ' PM');
    
      if (/^\d{1,2}$/.test(cleaned)) {
        if (parseInt(cleaned) > 12) {
          const hour24 = parseInt(cleaned);
          if (hour24 <= 23) {
            const hour12 = hour24 > 12 ? hour24 - 12 : hour24;
            const period = hour24 >= 12 ? 'PM' : 'AM';
            cleaned = `${hour12}:00 ${period}`;
          }
        } else if (cleaned.length === 2) {
          cleaned = cleaned + ':';
        }
      }
      
      if (/^\d{3,4}$/.test(cleaned)) {
        if (cleaned.length === 3) {
          cleaned = cleaned.slice(0, 1) + ':' + cleaned.slice(1);
        } else if (cleaned.length === 4) {
          cleaned = cleaned.slice(0, 2) + ':' + cleaned.slice(2);
        }
      }
      
      if (/^\d{1,2}:$/.test(cleaned)) {
        cleaned = cleaned + '00';
      }
      
      if (/^\d{1,2}:\d{2}$/.test(cleaned)) {
        cleaned = cleaned + ' AM';
      }
      
      cleaned = cleaned.replace(/\s+/g, ' ').trim();
      
      return cleaned;
    };

    const validateInputSequence = (currentValue: string, newChar: string, cursorPosition: number): boolean => {
      const beforeCursor = currentValue.slice(0, cursorPosition);
      const afterCursor = currentValue.slice(cursorPosition);
      const newValue = beforeCursor + newChar + afterCursor;
      
      if (/[a-zA-Z]/.test(newChar)) {
        if (!/[AMapm]/.test(newChar)) {
          return false;
        }
        
        const hasTimeDigits = /\d/.test(currentValue);
        if (!hasTimeDigits) {
          return false;
        }
        
        const timeWithoutPeriod = currentValue.replace(/\s*(AM|PM|am|pm)\s*$/, '').trim();
        if (timeWithoutPeriod.length === 0) {
          return false;
        }
      }
      
      if (/\d/.test(newChar)) {
        const hasAMPM = /\s*(AM|PM|am|pm)/.test(currentValue);
        if (hasAMPM && cursorPosition >= currentValue.search(/\s*(AM|PM|am|pm)/)) {
          return false;
        }
      }
      
      if (newChar === ':') {
        if (!/\d/.test(beforeCursor)) {
          return false;
        }
      }
      
      if (newChar === ' ') {
        const hasDigits = /\d/.test(currentValue);
        if (!hasDigits) {
          return false;
        }
      }
      
      return true;
    };

    const updateTime = (hour: number, minute: number, period: 'AM' | 'PM') => {
      const formattedTime = formatTime(hour, minute, period);
      setDisplayValue(formattedTime);
      onChange?.(formattedTime);
    };

    const handleInputClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsOpen(prev => !prev);
      }
    };

    const handleIconClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsOpen(prev => !prev);
      }
    };

    const handleHourSelect = (hour: number) => {
      setSelectedHour(hour);
      updateTime(hour, selectedMinute, selectedPeriod);
    };

    const handleMinuteSelect = (minute: number) => {
      setSelectedMinute(minute);
      updateTime(selectedHour, minute, selectedPeriod);
    };

    const handlePeriodSelect = (period: 'AM' | 'PM') => {
      setSelectedPeriod(period);
      updateTime(selectedHour, selectedMinute, period);
    };

    const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      
      const timeChars = /^[0-9: APMapm\s]*$/;
      if (!timeChars.test(newValue)) {
        return;
      }
      
      const formattedValue = autoFormatTimeInput(newValue);
      
      setDisplayValue(formattedValue);
      onChange?.(formattedValue);
      
      if (formattedValue) {
        const parsed = parseTimeString(formattedValue);
        setSelectedHour(parsed.hour);
        setSelectedMinute(parsed.minute);
        setSelectedPeriod(parsed.period);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      const allowedKeys = [
        'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Home', 'End', 'Tab', 'Enter', 'Escape'
      ];
      
      if (allowedKeys.includes(e.key)) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleInputClick(e as any);
        }
        if (e.key === 'Escape') {
          setIsOpen(false);
          inputRef.current?.focus();
        }
        return;
      }
      
      const input = e.target as HTMLInputElement;
      const cursorPosition = input.selectionStart || 0;
      
      if (!validateInputSequence(displayValue, e.key, cursorPosition)) {
        e.preventDefault();
        return;
      }
      
      const timeChars = /^[0-9: APMapm\s]$/;
      if (!timeChars.test(e.key)) {
        e.preventDefault();
      }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pastedText = e.clipboardData.getData('text');
      
      const timeChars = /^[0-9: APMapm\s]*$/;
      if (!timeChars.test(pastedText)) {
        return;
      }
      
      const formattedValue = autoFormatTimeInput(pastedText);
      
      setDisplayValue(formattedValue);
      onChange?.(formattedValue);
      
      if (formattedValue) {
        const parsed = parseTimeString(formattedValue);
        setSelectedHour(parsed.hour);
        setSelectedMinute(parsed.minute);
        setSelectedPeriod(parsed.period);
      }
    };

    const handleBlur = () => {
      if (displayValue && displayValue.trim()) {
        const formatted = autoFormatTimeInput(displayValue);
        if (formatted !== displayValue) {
          setDisplayValue(formatted);
          onChange?.(formatted);
          
          const parsed = parseTimeString(formatted);
          setSelectedHour(parsed.hour);
          setSelectedMinute(parsed.minute);
          setSelectedPeriod(parsed.period);
        }
      }
    };

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);

    React.useEffect(() => {
      if (value !== undefined) {
        setDisplayValue(value);
        if (value) {
          const parsed = parseTimeString(value);
          setSelectedHour(parsed.hour);
          setSelectedMinute(parsed.minute);
          setSelectedPeriod(parsed.period);
        }
      }
    }, [value]);

    return (
      <div ref={containerRef} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={displayValue}
            onChange={handleTextInputChange}
            onClick={handleInputClick}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              "cursor-pointer focus:outline-none focus:border-[#3A96AF] focus:ring-0 focus:ring-transparent hover:border-[#3A96AF] transition-colors duration-200",
              className
            )}
            {...props}
          />
          <Clock 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" 
            onClick={handleIconClick}
          />
        </div>

        {isOpen && (
          <div
            ref={popupRef}
            className="absolute top-full mt-1 w-full sm:min-w-[280px] sm:max-w-[320px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 left-0"
          >
            <div className="space-y-3">
              <div className="text-center">
                <h3 className="text-base font-medium text-gray-900">Select Time</h3>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block text-center cursor-pointer">Hour</label>
                  <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                    {hours.map((hour) => (
                      <button
                        key={hour}
                        type="button"
                        onClick={() => handleHourSelect(hour)}
                        className={cn(
                          "w-full px-3 py-2 text-sm text-center hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer",
                          selectedHour === hour ? "bg-[#3A96AF] text-white hover:bg-[#2d7a8f]" : "text-gray-900"
                        )}
                      >
                        {hour}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block text-center cursor-pointer">Min</label>
                  <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                    {minutes.map((minute) => (
                      <button
                        key={minute}
                        type="button"
                        onClick={() => handleMinuteSelect(minute)}
                        className={cn(
                          "w-full px-3 py-2 text-sm text-center hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer",
                          selectedMinute === minute ? "bg-[#3A96AF] text-white hover:bg-[#2d7a8f]" : "text-gray-900"
                        )}
                      >
                        {minute.toString().padStart(2, '0')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block text-center cursor-pointer">Period</label>
                  <div className="space-y-1">
                    {(['AM', 'PM'] as const).map((period) => (
                      <button
                        key={period}
                        type="button"
                        onClick={() => handlePeriodSelect(period)}
                        className={cn(
                          "w-full px-3 py-3 text-sm text-center rounded-md hover:bg-gray-100 transition-colors border border-gray-200 cursor-pointer",
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
    );
  }
);

TimeInput.displayName = "TimeInput";

export { TimeInput };