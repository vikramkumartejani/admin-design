"use client";
import { SortDirection } from "@/hooks/useSorting";
import React from "react";

interface SortableHeaderProps {
  children: React.ReactNode;
  sortKey: string;
  currentSortKey: string;
  currentDirection: SortDirection;
  onSort: (key: string) => void;
  className?: string;
  align?: "left" | "center" | "right";
  notTH?: boolean;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({
  children,
  sortKey,
  currentSortKey,
  currentDirection,
  onSort,
  className = "",
  align = "left",
  notTH= false,
}) => {
  const isActive = currentSortKey === sortKey;
  const alignClass =
    align === "center"
      ? "text-center"
      : align === "right"
      ? "text-right"
      : "text-left";

      const Wrapper = notTH ? "div" : "th";

  return (
    <Wrapper
      className={` ${alignClass} cursor-pointer hover:bg-[#F0F4F8] transition-colors select-none ${className}`}
      onClick={() => onSort(sortKey)}
    >
      <div
        className={`flex items-center gap-2 ${
          align === "center"
            ? "justify-center"
            : align === "right"
            ? "justify-end"
            : "justify-start"
        }`}
      >
        <span className="text-[#252525] text-[16px] font-semibold leading-[32px]">
          {children}
        </span>
        <div className="space-y-[-10px]">
          <svg
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className={`transition-colors ${
              isActive && currentDirection === "asc"
                ? "fill-[#3A96AF]"
                : "fill-[#D0D5DD] hover:fill-[#98A2B3]"
            }`}
          >
            <path d="M12 8L18 14H6L12 8Z"></path>
          </svg>
          <svg
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className={`transition-colors ${
              isActive && currentDirection === "desc"
                ? "fill-[#3A96AF]"
                : "fill-[#D0D5DD] hover:fill-[#98A2B3]"
            }`}
          >
            <path d="M12 16L6 10H18L12 16Z"></path>
          </svg>
        </div>
      </div>
    </Wrapper>
  );
};

export default SortableHeader;
