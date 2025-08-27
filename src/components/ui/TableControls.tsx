"use client"
import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'
import ColumnVisibilityControl from './ColumnVisibilityControl'
import DataExport from './DataExport'
import FilterByDropdown from './FilterByDropdown'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface Column {
    key: string
    label: string
    visible: boolean
}

interface TableControlsProps {
    search?: string
    onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    searchPlaceholder?: string
    pageSize: number
    onPageSizeChange: (size: number) => void
    pageSizeOptions?: number[]
    filters?: Array<{
        options: string[]
        selected: string
        onChange: (value: string) => void
        label?: string
    }>
    selectedCount: number
    totalCount: number
    onBulkDelete?: () => void
    onRefresh?: () => void | Promise<void>
    showBulkActions?: boolean
    onClearSelection?: () => void
    columns?: Column[]
    onColumnToggle?: (columnKey: string) => void
    data?: any[]
    selectedData?: any[]
    exportFilename?: string
}

const TableControls: React.FC<TableControlsProps> = ({
    search = '',
    onSearchChange,
    searchPlaceholder = 'Search...',
    pageSize,
    onPageSizeChange,
    pageSizeOptions = [5, 10, 15, 20, 25, 50],
    filters = [],
    selectedCount,
    totalCount,
    onBulkDelete,
    onRefresh,
    showBulkActions = true,
    onClearSelection,
    columns = [],
    onColumnToggle,
    data = [],
    selectedData = [],
    exportFilename = 'data'
}) => {
    const [isRefreshing, setIsRefreshing] = useState(false)

    const handleRefresh = async () => {
        if (!onRefresh || isRefreshing) return
        
        setIsRefreshing(true)
        
        try {
            await onRefresh()
            toast.success('Data refreshed successfully!', {
                duration: 3000,
                position: 'top-right',
            })
        } catch (error) {
            toast.error('Failed to refresh data', {
                duration: 3000,
                position: 'top-right',
            })
        } finally {
            setTimeout(() => {
                setIsRefreshing(false)
            }, 500)
        }
    }

    return (
        <>
            <div className="w-full bg-white rounded-t-[12px] md:rounded-t-[24px] px-4 sm:px-6">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    {onSearchChange && (
                        <div className="search-wrapper w-full sm:w-[180px] sm:min-w-[180px] lg:min-w-[220px]">
                            <div className="bg-transparent border border-[#E8ECF4] h-[38px] px-2 sm:px-3 py-1 sm:py-1.5 rounded-[8px] flex items-center gap-1.5 sm:gap-2">
                                <Image
                                    src="/assets/icons/search.svg"
                                    alt="search"
                                    width={18}
                                    height={18}
                                    className="sm:w-[18px] sm:h-[18px] md:w-[18px] md:h-[18px]"
                                />
                                <input
                                    type="search"
                                    placeholder={searchPlaceholder}
                                    value={search}
                                    onChange={onSearchChange}
                                    className="outline-none placeholder:text-[#676D75] smaller sm:text-[13px] md:text-[14px] font-normal leading-[20px] w-full"
                                />
                            </div>
                        </div>
                    )}
                    
                    <div className="entries-container flex items-center gap-1 whitespace-nowrap">
                        <span className="text-[11px] sm:text-[12px] text-[#676D75] font-medium">Show</span>
                        <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(parseInt(value))}>
                            <SelectTrigger 
                                className="cursor-pointer py-1 md:py-2 px-2 md:px-3 w-fit border border-[#E8ECF4] rounded-[8px] text-[11px] sm:text-[12px] leading-[16px] font-medium h-[34px] outline-none focus:border-[#E8ECF4] focus:ring-0 focus:ring-offset-0 focus:outline-none focus-visible:border-[#E8ECF4] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
                                style={{
                                    outline: 'none',
                                    boxShadow: 'none',
                                    borderColor: '#E8ECF4'
                                }}
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-[#E8ECF4] rounded-[8px] shadow-lg">
                                {pageSizeOptions.map((size) => (
                                    <SelectItem 
                                        key={size} 
                                        value={size.toString()}
                                        className="py-1.5 px-2 text-[11px] sm:text-[12px] font-medium hover:bg-[#F7F8F9] focus:bg-[#F7F8F9] data-[highlighted]:bg-[#F7F8F9]"
                                    >
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span className="text-[11px] sm:text-[12px] text-[#676D75] font-medium">items</span>
                    </div>
                    
                    {filters.map((filter, index) => (
                        <div key={index} className={`filter-group order-${3 + index} flex-shrink-0`}>
                            <FilterByDropdown
                                options={filter.options}
                                selected={filter.selected}
                                onChange={filter.onChange}
                                label={filter.label}
                            />
                        </div>
                    ))}
                    
                    {selectedCount > 0 && (
                        <div className={`selected-status order-${10 + filters.length} flex-shrink-0`}>
                            <button
                                onClick={onClearSelection}
                                className="bg-transparent border border-[#E8ECF4] hover:bg-[#F7F8F9] text-[#252525] cursor-pointer flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1.5 sm:py-2 text-[11px] sm:text-[12px] rounded-lg transition-colors"
                            >
                                <svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[16px] sm:h-[16px]">
                                    <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="#00AA06" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                
                                <span className="font-medium">
                                    {selectedCount} selected
                                </span>
                                
                                <svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[16px] sm:h-[16px]">
                                    <path d="M15 5L5 15M5 5L15 15" stroke="#FF5F5F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    )}
                    
                    <div className="spacer flex-grow order-20 hidden sm:block"></div>
                    
                    <div className="sm:right left order-21 flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-start mt-2 sm:mt-0">
                        {onRefresh && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={handleRefresh}
                                        disabled={isRefreshing}
                                        className={`text-[#3A96AF] hover:text-[#2a7a8f] border border-[#3A96AF] hover:bg-blue-50 cursor-pointer flex items-center gap-1 p-1.5 sm:p-2 text-[11px] sm:text-[12px] rounded-[8px] transition-colors flex-shrink-0 ${
                                            isRefreshing ? 'opacity-75 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`w-[18px] h-[18px] transition-transform duration-1000 lucide lucide-refresh-cw-icon lucide-refresh-cw ${
                                                isRefreshing ? 'animate-spin' : ''
                                            }`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    {isRefreshing ? 'Refreshing...' : 'Refresh'}
                                </TooltipContent>
                            </Tooltip>
                        )}
                        
                        {selectedCount > 0 && showBulkActions && onBulkDelete && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={onBulkDelete}
                                        className="text-[#FF5F5F] hover:text-[#e54545] border border-[#FF5F5F] hover:bg-red-50 cursor-pointer flex items-center gap-1 p-1.5 sm:p-2 text-[11px] sm:text-[12px] rounded-[8px] transition-colors flex-shrink-0"
                                    >
                                        <svg className="w-[18px] h-[18px] lucide lucide-trash-icon lucide-trash" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    Delete
                                </TooltipContent>
                            </Tooltip>
                        )}
                        
                        {data.length > 0 && columns.length > 0 && (
                            <div className="flex-shrink-0">
                                <DataExport
                                    data={data}
                                    selectedData={selectedData}
                                    filename={exportFilename}
                                    columns={columns}
                                />
                            </div>
                        )}
                        
                        {columns.length > 0 && onColumnToggle && (
                            <div className="flex-shrink-0">
                                <ColumnVisibilityControl
                                    columns={columns}
                                    onColumnToggle={onColumnToggle}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default TableControls