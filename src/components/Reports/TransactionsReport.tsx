"use client"
import React, { useState, useEffect } from 'react'
import RippleButton from "@/components/ui/button"
import Pagination from "@/components/ui/Pagination"
import Checkbox from "@/components/ui/Checkbox"
import { Eye } from "lucide-react"
import SortableHeader from "@/components/ui/SortableHeader"
import TableControls from "@/components/ui/TableControls"

interface Transaction {
    id: number
    bookingId: string
    user: string
    provider: string
    price: number
    service: string
    status: string
    date: string
}

type SortDirection = 'asc' | 'desc'

const TransactionsReport = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [dateRangeFilter, setDateRangeFilter] = useState('all')
    const [amountRangeFilter, setAmountRangeFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedTransactions, setSelectedTransactions] = useState<number[]>([])
    const [currentSortKey, setCurrentSortKey] = useState<string>("")
    const [currentDirection, setCurrentDirection] = useState<SortDirection>('asc')
    const [isLoading, setIsLoading] = useState(true)
    const [pageSize, setPageSize] = useState(10)
    const [columns, setColumns] = useState([
        { key: 'checkbox', label: 'Select', visible: true },
        { key: 'bookingId', label: 'Booking ID', visible: true },
        { key: 'user', label: 'User', visible: true },
        { key: 'provider', label: 'Provider', visible: true },
        { key: 'price', label: 'Price (KES)', visible: true },
        { key: 'service', label: 'Service', visible: true },
        { key: 'status', label: 'Status', visible: true },
        { key: 'date', label: 'Date', visible: true },
        { key: 'action', label: 'Action', visible: true }
    ])

    // Load data from JSON file
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true)
            try {
                const response = await fetch('/api/transactions')
                const data = await response.json()
                setTransactions(data.transactions)
                setFilteredTransactions(data.transactions)
            } catch (error) {
                // Fallback to static data if API fails
                const staticData = require('@/data/transactionsReportData.json')
                setTransactions(staticData.transactions)
                setFilteredTransactions(staticData.transactions)
            } finally {
                setIsLoading(false)
            }
        }
        loadData()
    }, [])

    // Filter and search logic
    useEffect(() => {
        let filtered = transactions.filter(transaction => {
            const matchesSearch = transaction.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.service.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesStatus = statusFilter === 'all' || transaction.status.toLowerCase() === statusFilter.toLowerCase()
            
            // Date range filtering
            let matchesDate = true
            if (dateRangeFilter !== 'all') {
                console.log('📅 Date filtering active for:', dateRangeFilter)
                
                // Parse transaction date (format: 2025-08-29)
                const [year, month, day] = transaction.date.split('-').map(Number)
                const transactionDate = new Date(year, month - 1, day) // month is 0-indexed
                
                // Get current date
                const now = new Date()
                const currentYear = now.getFullYear()
                const currentMonth = now.getMonth() // 0-indexed
                const currentDay = now.getDate()
                
                // Create date objects for comparison
                const today = new Date(currentYear, currentMonth, currentDay)
                const yesterday = new Date(currentYear, currentMonth, currentDay - 1)
                const lastWeek = new Date(currentYear, currentMonth, currentDay - 7)
                const lastMonth = new Date(currentYear, currentMonth - 1, currentDay)

                // Debug logging for first transaction only
                if (transaction.id === 1) {
                    console.log('=== DATE FILTERING DEBUG ===')
                    console.log('Current date:', now.toString())
                    console.log('Today (normalized):', today.toString())
                    console.log('Transaction date string:', transaction.date)
                    console.log('Transaction date parsed:', transactionDate.toString())
                    console.log('Date range filter:', dateRangeFilter)
                    console.log('Today timestamp:', today.getTime())
                    console.log('Transaction timestamp:', transactionDate.getTime())
                }

                switch (dateRangeFilter) {
                    case 'today':
                        matchesDate = transactionDate.getTime() === today.getTime()
                        break
                    case 'yesterday':
                        matchesDate = transactionDate.getTime() === yesterday.getTime()
                        break
                    case 'lastWeek':
                        matchesDate = transactionDate >= lastWeek
                        break
                    case 'lastMonth':
                        matchesDate = transactionDate >= lastMonth
                        break
                }

                if (transaction.id === 1) {
                    console.log('Final matchesDate result:', matchesDate)
                    console.log('=== END DEBUG ===')
                }
            }

            // Amount range filtering
            let matchesAmount = true
            if (amountRangeFilter !== 'all') {
                switch (amountRangeFilter) {
                    case '0-10000':
                        matchesAmount = transaction.price >= 0 && transaction.price <= 10000
                        break
                    case '10001-20000':
                        matchesAmount = transaction.price >= 10001 && transaction.price <= 20000
                        break
                    case '20001-30000':
                        matchesAmount = transaction.price >= 20001 && transaction.price <= 30000
                        break
                    case '30001+':
                        matchesAmount = transaction.price >= 30001
                        break
                }
            }

            return matchesSearch && matchesStatus && matchesDate && matchesAmount
        })

        // Apply sorting
        if (currentSortKey) {
            filtered.sort((a, b) => {
                let aValue: string | number = a[currentSortKey as keyof Transaction]
                let bValue: string | number = b[currentSortKey as keyof Transaction]

                // Handle date sorting
                if (currentSortKey === 'date') {
                    aValue = new Date(aValue as string).getTime()
                    bValue = new Date(bValue as string).getTime()
                }

                // Handle price sorting
                if (currentSortKey === 'price') {
                    aValue = Number(aValue)
                    bValue = Number(bValue)
                }

                // Handle string sorting
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    aValue = aValue.toLowerCase()
                    bValue = bValue.toLowerCase()
                }

                if (aValue < bValue) {
                    return currentDirection === 'asc' ? -1 : 1
                }
                if (aValue > bValue) {
                    return currentDirection === 'asc' ? 1 : -1
                }
                return 0
            })
        }

        setFilteredTransactions(filtered)
        setCurrentPage(1)
    }, [transactions, searchTerm, statusFilter, dateRangeFilter, amountRangeFilter, currentSortKey, currentDirection])

    // Pagination logic
    const totalPages = Math.ceil(filteredTransactions.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    const currentTransactions = filteredTransactions.slice(startIndex, endIndex)

    // Handle sorting
    const handleSort = (key: string) => {
        if (currentSortKey === key) {
            setCurrentDirection(currentDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setCurrentSortKey(key)
            setCurrentDirection('asc')
        }
    }

    // Handle bulk selection
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedTransactions(currentTransactions.map(transaction => transaction.id))
        } else {
            setSelectedTransactions([])
        }
    }

    const handleSelectTransaction = (transactionId: number, checked: boolean) => {
        if (checked) {
            setSelectedTransactions([...selectedTransactions, transactionId])
        } else {
            setSelectedTransactions(selectedTransactions.filter(id => id !== transactionId))
        }
    }

    // Action handlers
    const handleViewTransaction = (transactionId: number) => {
        console.log('View transaction:', transactionId)
        // Add your view logic here
    }

    // TableControls functions
    const handlePageSizeChange = (size: number) => {
        setPageSize(size)
        setCurrentPage(1)
    }

    const handleColumnToggle = (columnKey: string) => {
        setColumns(prev => 
            prev.map(col => 
                col.key === columnKey 
                    ? { ...col, visible: !col.visible }
                    : col
            )
        )
    }

    const handleRefresh = async () => {
        const loadData = async () => {
            try {
                const response = await fetch('/api/transactions')
                const data = await response.json()
                setTransactions(data.transactions)
                setFilteredTransactions(data.transactions)
            } catch (error) {
                const staticData = require('@/data/transactionsReportData.json')
                setTransactions(staticData.transactions)
                setFilteredTransactions(staticData.transactions)
            }
        }
        await loadData()
    }

    const handleBulkDelete = () => {
        if (selectedTransactions.length > 0) {
            // Remove selected transactions
            setTransactions(prev => prev.filter(transaction => !selectedTransactions.includes(transaction.id)))
            setFilteredTransactions(prev => prev.filter(transaction => !selectedTransactions.includes(transaction.id)))
            setSelectedTransactions([])
            console.log('Bulk deleted transactions:', selectedTransactions)
        }
    }

    const handleClearSelection = () => {
        setSelectedTransactions([])
    }

    const handleExportCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8," +
            "Booking ID,User,Provider,Price (KES),Service,Status,Date\n" +
            filteredTransactions.map(transaction =>
                `${transaction.bookingId},${transaction.user},${transaction.provider},${transaction.price},${transaction.service},${transaction.status},${transaction.date}`
            ).join("\n")

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", "transactions_report.csv")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'bg-[#00AA061A] text-[#00AA06]' // Light green background, dark green text
            case 'failed':
                return 'bg-[#FF5F5F1A] text-[#FF5F5F]' // Light red background, dark red text
            case 'pending':
                return 'bg-[#FFF3CD] text-[#856404]' // Light yellow background, dark yellow text
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusDot = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'bg-[#00AA06]' // Dark green dot
            case 'failed':
                return 'bg-[#FF5F5F]' // Dark red dot
            case 'pending':
                return 'bg-[#856404]' // Dark yellow dot
            default:
                return 'bg-gray-600'
        }
    }

    const formatDisplayDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }

    // Get unique services for filter
    const uniqueServices = [...new Set(transactions.map(t => t.service))]

    return (
        <div className='max-w-[1240px] w-full mx-auto'>
            <div className="">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[24px] leading-[38px] font-semibold text-[#252525] tracking-[-1px]">Transactions Report</h2>
                </div>

                <div className="border border-[#E8ECF4] bg-white rounded-[24px] py-6">
                    {/* Table Controls */}
                    <TableControls
                        search={searchTerm}
                        onSearchChange={(e) => setSearchTerm(e.target.value)}
                        searchPlaceholder="Search by Booking ID, User, Provider, Service"
                        pageSize={pageSize}
                        onPageSizeChange={handlePageSizeChange}
                        pageSizeOptions={[5, 10, 15, 20, 25, 50]}
                        filters={[
                            {
                                options: ['All', 'Paid', 'Failed', 'Pending'],
                                selected: statusFilter === 'all' ? 'All' : statusFilter,
                                onChange: (value) => {
                                    setStatusFilter(value === 'All' ? 'all' : value)
                                },
                                label: 'Status'
                            },
                            {
                                options: ['All', 'Today', 'Yesterday', 'Last Week', 'Last Month'],
                                selected: dateRangeFilter === 'all' ? 'All' : dateRangeFilter,
                                onChange: (value) => {
                                    setDateRangeFilter(value === 'All' ? 'all' : value)
                                },
                                label: 'Date Range'
                            },
                            {
                                options: ['All', '0-10000', '10001-20000', '20001-30000', '30001+'],
                                selected: amountRangeFilter === 'all' ? 'All' : amountRangeFilter,
                                onChange: (value) => {
                                    setAmountRangeFilter(value === 'All' ? 'all' : value)
                                },
                                label: 'Amount Range'
                            }
                        ]}
                        selectedCount={selectedTransactions.length}
                        totalCount={filteredTransactions.length}
                        onBulkDelete={handleBulkDelete}
                        onRefresh={handleRefresh}
                        showBulkActions={true}
                        onClearSelection={handleClearSelection}
                        columns={columns}
                        onColumnToggle={handleColumnToggle}
                        data={filteredTransactions}
                        selectedData={currentTransactions.filter(transaction => selectedTransactions.includes(transaction.id))}
                        exportFilename="transactions_report"
                    />

                    {/* Table */}
                    <div className="overflow-x-auto mt-3.5">
                        <table className="min-w-[800px] sm:min-w-[900px] w-full text-nowrap">
                            <thead className='bg-[#F3F6F9]'>
                                <tr>
                                    {columns.find(col => col.key === 'checkbox')?.visible && (
                                        <th className="text-left py-[17px] pl-6 pr-4 w-16">
                                            <Checkbox
                                                checked={selectedTransactions.length === currentTransactions.length && currentTransactions.length > 0}
                                                onChange={handleSelectAll}
                                            />
                                        </th>
                                    )}
                                    {columns.find(col => col.key === 'bookingId')?.visible && (
                                        <SortableHeader
                                            sortKey="bookingId"
                                            currentSortKey={currentSortKey}
                                            currentDirection={currentDirection}
                                            onSort={handleSort}
                                            className="py-[17px] px-6"
                                        >
                                            Booking ID
                                        </SortableHeader>
                                    )}
                                    {columns.find(col => col.key === 'user')?.visible && (
                                        <SortableHeader
                                            sortKey="user"
                                            currentSortKey={currentSortKey}
                                            currentDirection={currentDirection}
                                            onSort={handleSort}
                                            className="py-[17px] px-6"
                                        >
                                            User
                                        </SortableHeader>
                                    )}
                                    {columns.find(col => col.key === 'provider')?.visible && (
                                        <SortableHeader
                                            sortKey="provider"
                                            currentSortKey={currentSortKey}
                                            currentDirection={currentDirection}
                                            onSort={handleSort}
                                            className="py-[17px] px-6"
                                        >
                                            Provider
                                        </SortableHeader>
                                    )}
                                    {columns.find(col => col.key === 'price')?.visible && (
                                        <SortableHeader
                                            sortKey="price"
                                            currentSortKey={currentSortKey}
                                            currentDirection={currentDirection}
                                            onSort={handleSort}
                                            className="py-[17px] px-6"
                                        >
                                            Price (KES)
                                        </SortableHeader>
                                    )}
                                    {columns.find(col => col.key === 'service')?.visible && (
                                        <SortableHeader
                                            sortKey="service"
                                            currentSortKey={currentSortKey}
                                            currentDirection={currentDirection}
                                            onSort={handleSort}
                                            className="py-[17px] px-6"
                                        >
                                            Service
                                        </SortableHeader>
                                    )}
                                    {columns.find(col => col.key === 'status')?.visible && (
                                        <SortableHeader
                                            sortKey="status"
                                            currentSortKey={currentSortKey}
                                            currentDirection={currentDirection}
                                            onSort={handleSort}
                                            className="py-[17px] px-6"
                                        >
                                            Status
                                        </SortableHeader>
                                    )}
                                    {columns.find(col => col.key === 'date')?.visible && (
                                        <SortableHeader
                                            sortKey="date"
                                            currentSortKey={currentSortKey}
                                            currentDirection={currentDirection}
                                            onSort={handleSort}
                                            className="py-[17px] px-6"
                                        >
                                            Date
                                        </SortableHeader>
                                    )}
                                    {columns.find(col => col.key === 'action')?.visible && (
                                        <th className="text-left px-6 py-[11px] text-[16px] leading-[32px] font-semibold text-[#252525]">Action</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={columns.filter(col => col.visible).length} className="py-10">
                                            <div className="flex flex-col items-center justify-center">
                                                <h3 className="text-[18px] leading-[24px] text-gray-900 mb-2 font-semibold">Loading transactions...</h3>
                                                <p className="text-[16px] leading-[20px] text-[#252525] font-normal">
                                                    Please wait while we fetch the transaction data.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : currentTransactions.length > 0 ? (
                                    currentTransactions.map((transaction) => (
                                        <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                                            {columns.find(col => col.key === 'checkbox')?.visible && (
                                                <td className="pl-6 pr-4 py-4 w-16">
                                                    <Checkbox
                                                        checked={selectedTransactions.includes(transaction.id)}
                                                        onChange={(checked) => handleSelectTransaction(transaction.id, checked)}
                                                    />
                                                </td>
                                            )}
                                            {columns.find(col => col.key === 'bookingId')?.visible && (
                                                <td className="px-6 py-4 text-[14px] leading-[20px] font-medium text-[#252525]">{transaction.bookingId}</td>
                                            )}
                                            {columns.find(col => col.key === 'user')?.visible && (
                                                <td className="px-6 py-4 text-[14px] leading-[20px] font-medium text-[#252525]">{transaction.user}</td>
                                            )}
                                            {columns.find(col => col.key === 'provider')?.visible && (
                                                <td className="px-6 py-4 text-[14px] leading-[20px] font-medium text-[#252525]">{transaction.provider}</td>
                                            )}
                                            {columns.find(col => col.key === 'price')?.visible && (
                                                <td className="px-6 py-4 text-[14px] leading-[20px] font-medium text-[#252525]">{transaction.price.toLocaleString()}</td>
                                            )}
                                            {columns.find(col => col.key === 'service')?.visible && (
                                                <td className="px-6 py-4 text-[14px] leading-[20px] font-medium text-[#252525]">{transaction.service}</td>
                                            )}
                                            {columns.find(col => col.key === 'status')?.visible && (
                                                <td className="px-6 py-4">
                                                    <div className={`px-3.5 h-[32px] rounded-full w-fit ${getStatusColor(transaction.status)} flex items-center gap-2`}>
                                                        <div className={`w-2 h-2 rounded-full ${getStatusDot(transaction.status)}`}></div>
                                                        <span className='text-[14px] leading-[20px] font-medium'>{transaction.status}</span>
                                                    </div>
                                                </td>
                                            )}
                                            {columns.find(col => col.key === 'date')?.visible && (
                                                <td className="px-6 py-4 text-[14px] leading-[20px] font-medium text-[#252525]">{formatDisplayDate(transaction.date)}</td>
                                            )}
                                            {columns.find(col => col.key === 'action')?.visible && (
                                                <td className="px-6 py-4">
                                                    <RippleButton
                                                        onClick={() => handleViewTransaction(transaction.id)}
                                                        className="h-[38px] w-[38px] border border-[#25252526] rounded-[11px] flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
                                                    >
                                                        <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M11.6849 9.8404C11.6849 11.3254 10.4849 12.5254 8.99994 12.5254C7.51494 12.5254 6.31494 11.3254 6.31494 9.8404C6.31494 8.3554 7.51494 7.1554 8.99994 7.1554C10.4849 7.1554 11.6849 8.3554 11.6849 9.8404Z" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M8.99988 16.0429C11.6474 16.0429 14.1149 14.4829 15.8324 11.7829C16.5074 10.7254 16.5074 8.9479 15.8324 7.8904C14.1149 5.1904 11.6474 3.6304 8.99988 3.6304C6.35238 3.6304 3.88488 5.1904 2.16738 7.8904C1.49238 8.9479 1.49238 10.7254 2.16738 11.7829C3.88488 14.4829 6.35238 16.0429 8.99988 16.0429Z" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </RippleButton>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={columns.filter(col => col.visible).length} className="w-full py-10 text-center">
                                            <h3 className="text-[18px] leading-[24px] font-semibold text-gray-900 mb-2">No data found</h3>
                                            <p className='text-[16px] leading-[20px] text-[#252525] font-normal'>
                                                No transactions match your current search criteria or filters. Try adjusting your search terms or filters.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-6">
                            <div className="flex justify-center">
                                <Pagination
                                    page={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TransactionsReport