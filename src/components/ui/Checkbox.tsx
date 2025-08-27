import React, { forwardRef, useEffect, useRef } from "react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
  className?: string;
  indeterminate?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked, onChange, id, label, className = "", indeterminate = false }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const combinedRef = ref || inputRef;

    useEffect(() => {
      if (combinedRef && typeof combinedRef === 'object' && combinedRef.current) {
        combinedRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate, combinedRef]);

    return (
      <label htmlFor={id} className={`relative flex items-center gap-2 cursor-pointer select-none ${className}`}>
        <span className="relative flex items-center justify-center">
          <input
            id={id}
            ref={combinedRef}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="peer appearance-none w-[20px] h-[20px] cursor-pointer border border-[#D0D5DD] rounded-[6px] bg-white checked:bg-[#3A96AF] transition-colors duration-200"
          />
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-white">
            {indeterminate ? (
              <svg
                className="w-[12px] h-[12px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            ) : checked ? (
              <svg
                className="w-[14px] h-[14px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : null}
          </span>
        </span>
        {label && <span className="text-[14px] text-[#252525] font-medium leading-[20px]">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;