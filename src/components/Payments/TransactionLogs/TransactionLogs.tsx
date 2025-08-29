"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import RippleButton from "@/components/ui/button"
import SearchInput from "@/components/ui/SearchInput"
import FilterByDropdown from "@/components/ui/FilterByDropdown"
import Pagination from "@/components/ui/Pagination"
import Checkbox from "@/components/ui/Checkbox"
import { Eye, Download, ArrowUpRight } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import SortableHeader from "@/components/ui/SortableHeader"
import MoreVertical from '@/svgIcons/MoreVertical'
import ConfirmationModal from "@/components/ui/ConfirmationModal"
import TableControls from "@/components/ui/TableControls"
import TransactionDetailsModal from "./TransactionDetailsModal"

interface Transaction {
    id: number
    txnId: string
    bookingId: string
    user: string
    provider: string
    amount: number
    status: string
    pspRefId: string
    date: string
}

type SortDirection = 'asc' | 'desc'

const TransactionLogs = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [dateRangeFilter, setDateRangeFilter] = useState('all')
    const [pspProviderFilter, setPspProviderFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedTransactions, setSelectedTransactions] = useState<number[]>([])
    const [currentSortKey, setCurrentSortKey] = useState<string>("")
    const [currentDirection, setCurrentDirection] = useState<SortDirection>('asc')
    const [isLoading, setIsLoading] = useState(true)
    const [openPopoverId, setOpenPopoverId] = useState<number | null>(null)
    const [pageSize, setPageSize] = useState(10)
    const [showTransactionModal, setShowTransactionModal] = useState(false)
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
    const [columns, setColumns] = useState([
        { key: 'checkbox', label: 'Select', visible: true },
        { key: 'txnId', label: 'Txn ID', visible: true },
        { key: 'bookingId', label: 'Booking ID', visible: true },
        { key: 'user', label: 'User', visible: true },
        { key: 'provider', label: 'Provider', visible: true },
        { key: 'amount', label: 'Amount (KES)', visible: true },
        { key: 'status', label: 'Status', visible: true },
        { key: 'pspRefId', label: 'PSP Ref ID', visible: true },
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
                const staticData = require('@/data/transactionLogsData.json')
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
            const matchesSearch =
                transaction.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.pspRefId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.user.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesStatus = statusFilter === 'all' ||
                transaction.status.toLowerCase() === statusFilter.toLowerCase()

            const matchesDateRange = dateRangeFilter === 'all' || checkDateRange(transaction.date, dateRangeFilter)
            const matchesPspProvider = pspProviderFilter === 'all' ||
                transaction.provider.toLowerCase() === pspProviderFilter.toLowerCase()

            return matchesSearch && matchesStatus && matchesDateRange && matchesPspProvider
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

                // Handle number sorting
                if (currentSortKey === 'amount') {
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
    }, [transactions, searchTerm, statusFilter, dateRangeFilter, pspProviderFilter, currentSortKey, currentDirection])

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
        const transaction = transactions.find(t => t.id === transactionId)
        if (transaction) {
            setSelectedTransaction(transaction)
            setShowTransactionModal(true)
        }
        console.log('View transaction:', transactionId)
    }

    const handleCloseTransactionModal = () => {
        setShowTransactionModal(false)
        setSelectedTransaction(null)
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
                const staticData = require('@/data/transactionLogsData.json')
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
            "Txn ID,Booking ID,User,Provider,Amount (KES),Status,PSP Ref ID,Date\n" +
            filteredTransactions.map(transaction =>
                `${transaction.txnId},${transaction.bookingId},${transaction.user},${transaction.provider},${transaction.amount},${transaction.status},${transaction.pspRefId},${transaction.date}`
            ).join("\n")

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", "transaction-logs.csv")
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

    const formatAmount = (amount: number) => {
        return amount.toLocaleString('en-KE')
    }

    const checkDateRange = (date: string, range: string): boolean => {
        const transactionDate = new Date(date)
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - transactionDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        switch (range) {
            case 'Today':
                return diffDays === 0
            case 'Last 7 days':
                return diffDays <= 7
            case 'Last 30 days':
                return diffDays <= 30
            case 'Last 90 days':
                return diffDays <= 90
            default:
                return true
        }
    }

    return (
        <div className='max-w-[1200px] w-full mx-auto'>
            <div className="">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[24px] leading-[38px] font-semibold text-[#252525] tracking-[-1px]">Transaction Logs</h2>
                </div>

                <div className="border border-[#E8ECF4] bg-white rounded-[24px] py-6">
                    {/* Table Controls */}
                    <TableControls
                        search={searchTerm}
                        onSearchChange={(e) => setSearchTerm(e.target.value)}
                        searchPlaceholder="Search by Booking ID / PSP Ref ID / User Email"
                        pageSize={pageSize}
                        onPageSizeChange={handlePageSizeChange}
                        pageSizeOptions={[5, 10, 15, 20, 25, 50]}
                        filters={[
                            {
                                options: ['All', 'Paid', 'Failed', 'Pending'],
                                selected: statusFilter === 'all' ? 'All' : statusFilter,
                                onChange: (value) => {
                                    console.log('Status filter changed from', statusFilter, 'to', value);
                                    setStatusFilter(value === 'All' ? 'all' : value);
                                },
                                label: 'Status'
                            },
                            {
                                options: ['All', 'Today', 'Last 7 days', 'Last 30 days', 'Last 90 days'],
                                selected: dateRangeFilter === 'all' ? 'All' : dateRangeFilter,
                                onChange: (value) => {
                                    console.log('Date range filter changed from', dateRangeFilter, 'to', value);
                                    setDateRangeFilter(value === 'All' ? 'all' : value);
                                },
                                label: 'Date Range'
                            },
                            {
                                options: ['All', 'M-Pesa', 'PayPal', 'Stripe', 'Square'],
                                selected: pspProviderFilter === 'all' ? 'All' : pspProviderFilter,
                                onChange: (value) => {
                                    console.log('PSP Provider filter changed from', pspProviderFilter, 'to', value);
                                    setPspProviderFilter(value === 'All' ? 'all' : value);
                                },
                                label: 'PSP Provider'
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
                        exportFilename="transaction-logs"
                    />

                    {/* Table */}
                    <div className="overflow-x-auto mt-3.5">
                        <table className="min-w-[700px] sm:min-w-[800px] w-full text-nowrap">
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
                                    {columns.find(col => col.key === 'txnId')?.visible && (
                                        <SortableHeader
                                            sortKey="txnId"
                                            currentSortKey={currentSortKey}
                                            currentDirection={currentDirection}
                                            onSort={handleSort}
                                            className="py-[17px] px-6"
                                        >
                                            Txn ID
                                        </SortableHeader>
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
                                    {columns.find(col => col.key === 'amount')?.visible && (
                                        <SortableHeader
                                            sortKey="amount"
                                            currentSortKey={currentSortKey}
                                            currentDirection={currentDirection}
                                            onSort={handleSort}
                                            className="py-[17px] px-6"
                                        >
                                            Amount (KES)
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
                                    {columns.find(col => col.key === 'pspRefId')?.visible && (
                                        <SortableHeader
                                            sortKey="pspRefId"
                                            currentSortKey={currentSortKey}
                                            currentDirection={currentDirection}
                                            onSort={handleSort}
                                            className="py-[17px] px-6"
                                        >
                                            PSP Ref ID
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
                                        <td colSpan={9} className="py-10">
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
                                            {columns.find(col => col.key === 'txnId')?.visible && (
                                                <td className="px-6 py-4 text-[14px] leading-[20px] font-medium text-[#252525]">{transaction.txnId}</td>
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
                                            {columns.find(col => col.key === 'amount')?.visible && (
                                                <td className="px-6 py-4 text-[14px] leading-[20px] font-medium text-[#252525]">{formatAmount(transaction.amount)}</td>
                                            )}
                                            {columns.find(col => col.key === 'status')?.visible && (
                                                <td className="px-6 py-4">
                                                    <div className={`px-3.5 h-[32px] rounded-full w-fit ${getStatusColor(transaction.status)} flex items-center gap-2`}>
                                                        <div className={`w-2 h-2 rounded-full ${getStatusDot(transaction.status)}`}></div>
                                                        <span className='text-[14px] leading-[20px] font-medium'>{transaction.status}</span>
                                                    </div>
                                                </td>
                                            )}
                                            {columns.find(col => col.key === 'pspRefId')?.visible && (
                                                <td className="px-6 py-4 text-[14px] leading-[20px] font-medium text-[#252525]">{transaction.pspRefId}</td>
                                            )}
                                            {columns.find(col => col.key === 'action')?.visible && (
                                                <td className="px-6 py-4">
                                                    <RippleButton
                                                        onClick={() => handleViewTransaction(transaction.id)}
                                                        className="h-[38px] w-[38px] border border-[#25252526] rounded-[11px] flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
                                                    >
                                                        <ArrowUpRight className="w-4 h-4 text-[#252525]" />
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

            {/* Transaction Details Modal */}
            <TransactionDetailsModal
                isOpen={showTransactionModal}
                onClose={handleCloseTransactionModal}
                transaction={selectedTransaction}
            />
        </div>
    )
}

export default TransactionLogs