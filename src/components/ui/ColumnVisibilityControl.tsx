"use client"
import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'
import Checkbox from './Checkbox'

interface Column {
    key: string
    label: string
    visible: boolean
}

interface ColumnVisibilityControlProps {
    columns: Column[]
    onColumnToggle: (columnKey: string) => void
    className?: string
}

const ColumnVisibilityControl: React.FC<ColumnVisibilityControlProps> = ({
    columns,
    onColumnToggle,
    className = ""
}) => {
    const [open, setOpen] = useState(false)

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <button className={`cursor-pointer text-[#3A96AF] border border-[#3A96AF] p-1.5 sm:p-2 text-nowrap rounded-[8px] flex items-center gap-1 text-[11px] sm:text-[12px] leading-[16px] font-medium tracking-[0.3px] hover:bg-[#2d7a8f]/10 transition-colors ${className}`}>
                            <span className='w-[18px] h-[18px]'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6.17071 18C6.58254 16.8348 7.69378 16 9 16C10.3062 16 11.4175 16.8348 11.8293 18H22V20H11.8293C11.4175 21.1652 10.3062 22 9 22C7.69378 22 6.58254 21.1652 6.17071 20H2V18H6.17071ZM12.1707 11C12.5825 9.83481 13.6938 9 15 9C16.3062 9 17.4175 9.83481 17.8293 11H22V13H17.8293C17.4175 14.1652 16.3062 15 15 15C13.6938 15 12.5825 14.1652 12.1707 13H2V11H12.1707ZM6.17071 4C6.58254 2.83481 7.69378 2 9 2C10.3062 2 11.4175 2.83481 11.8293 4H22V6H11.8293C11.4175 7.16519 10.3062 8 9 8C7.69378 8 6.58254 7.16519 6.17071 6H2V4H6.17071ZM9 6C9.55228 6 10 5.55228 10 5C10 4.44772 9.55228 4 9 4C8.44772 4 8 4.44772 8 5C8 5.55228 8.44772 6 9 6ZM15 13C15.5523 13 16 12.5523 16 12C16 11.4477 15.5523 11 15 11C14.4477 11 14 11.4477 14 12C14 12.5523 14.4477 13 15 13ZM9 20C9.55228 20 10 19.5523 10 19C10 18.4477 9.55228 18 9 18C8.44772 18 8 18.4477 8 19C8 19.5523 8.44772 20 9 20Z"></path></svg></span>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-4 bg-white border border-[#E8ECF4] rounded-lg shadow-lg max-h-[400px] overflow-y-auto">
                        <div className="space-y-3">
                            <h3 className="text-[16px] font-medium text-[#252525] mb-3">Show/Hide Columns</h3>
                            {columns.map((column) => (
                                <div key={column.key} className="flex items-center gap-3">
                                    <Checkbox
                                        id={`column-${column.key}`}
                                        checked={column.visible}
                                        onChange={(checked) => onColumnToggle(column.key)}
                                        className="min-w-[16px] min-h-[16px]"
                                    />
                                    <label 
                  htmlFor={`column-${column.key}`}
                                        className="text-[14px] text-[#252525] cursor-pointer flex-1"
                                    >
                                        {column.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
                </div>
            </TooltipTrigger>
            <TooltipContent side="top">
                View Columns
            </TooltipContent>
        </Tooltip>
    )
}

export default ColumnVisibilityControl