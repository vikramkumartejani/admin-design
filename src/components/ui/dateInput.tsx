"use client";

import * as React from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, value, onChange, placeholder = "mm/dd/yyyy", disabled, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [displayValue, setDisplayValue] = React.useState(value || "");
    const inputRef = React.useRef<HTMLInputElement>(null);
    const dateInputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    const formatDate = (dateString: string) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${month}/${day}/${year}`;
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedDate = e.target.value;
      if (selectedDate) {
        const formattedDate = formatDate(selectedDate);
        setDisplayValue(formattedDate);
        onChange?.(formattedDate);
      }
      setIsOpen(false);
    };

    const handleTextInputClick = () => {
      if (!disabled) {
        setIsOpen(true);
        setTimeout(() => {
          dateInputRef.current?.focus();
          dateInputRef.current?.showPicker?.();
        }, 10);
      }
    };

    const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setDisplayValue(newValue);
      onChange?.(newValue);
    };

    React.useEffect(() => {
      setDisplayValue(value || "");
    }, [value]);

    return (
      <div className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={displayValue}
            onChange={handleTextInputChange}
            onClick={handleTextInputClick}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              "cursor-pointer focus:outline-none focus:border-[#3A96AF] focus:ring-0 focus:ring-transparent",
              className
            )}
            readOnly={false}
            {...props}
          />
          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        {isOpen && (
          <input
            ref={dateInputRef}
            type="date"
            onChange={handleDateChange}
            onBlur={() => setIsOpen(false)}
            className="absolute top-0 left-0 w-full h-full opacity-0 pointer-events-auto z-10 focus:outline-none focus:border-[#3A96AF] focus:ring-0 focus:ring-transparent"
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              pointerEvents: 'auto'
            }}
          />
        )}
      </div>
    );
  }
);

DateInput.displayName = "DateInput";

export { DateInput };