"use client"
import React, { useState, useEffect } from 'react'
import RippleButton from "@/components/ui/button"
import Pagination from "@/components/ui/Pagination"
import Checkbox from "@/components/ui/Checkbox"
import SortableHeader from "@/components/ui/SortableHeader"
import TableControls from "@/components/ui/TableControls"

interface Provider {
    id: number
    providerName: string
    servicesListed: number
    bookings: number
    revenue: number
}

type SortDirection = 'asc' | 'desc'

const RevenueByProvider = () => {
    const [providers, setProviders] = useState<Provider[]>([])
    const [filteredProviders, setFilteredProviders] = useState<Provider[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [dateRangeFilter, setDateRangeFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedProviders, setSelectedProviders] = useState<number[]>([])
    const [currentSortKey, setCurrentSortKey] = useState<string>("")
    const [currentDirection, setCurrentDirection] = useState<SortDirection>('asc')
    const [isLoading, setIsLoading] = useState(true)
    const [pageSize, setPageSize] = useState(4)
    const [columns, setColumns] = useState([
        { key: 'checkbox', label: 'Select', visible: true },
        { key: 'providerName', label: 'Provider Name', visible: true },
        { key: 'servicesListed', label: 'Services Listed', visible: true },
        { key: 'bookings', label: 'Bookings', visible: true },
        { key: 'revenue', label: 'Revenue (KES)', visible: true }
    ])

    // Sample data based on image design
    const sampleData: Provider[] = [
        { id: 1, providerName: "Kevin M.", servicesListed: 12, bookings: 142, revenue: 245000 },
        { id: 2, providerName: "James K.", servicesListed: 56, bookings: 57, revenue: 175000 },
        { id: 3, providerName: "Sarah L.", servicesListed: 23, bookings: 87, revenue: 335000 },
        { id: 4, providerName: "Michael R.", servicesListed: 34, bookings: 98, revenue: 289000 },
        { id: 5, providerName: "Emma W.", servicesListed: 19, bookings: 76, revenue: 198000 },
        { id: 6, providerName: "David T.", servicesListed: 41, bookings: 123, revenue: 412000 },
        { id: 7, providerName: "Lisa P.", servicesListed: 28, bookings: 89, revenue: 267000 },
        { id: 8, providerName: "John S.", servicesListed: 15, bookings: 45, revenue: 156000 },
        { id: 9, providerName: "Anna M.", servicesListed: 37, bookings: 112, revenue: 378000 },
        { id: 10, providerName: "Robert K.", servicesListed: 22, bookings: 67, revenue: 223000 }
    ]

    // Load data
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true)
            try {
                // Try to fetch from API first
                const response = await fetch('/api/providers')
                if (response.ok) {
                    const data = await response.json()
                    setProviders(data.providers)
                    setFilteredProviders(data.providers)
                } else {
                    throw new Error('API not available')
                }
            } catch (error) {
                // Fallback to sample data
                setProviders(sampleData)
                setFilteredProviders(sampleData)
            } finally {
                setIsLoading(false)
            }
        }
        loadData()
    }, [])

    // Filter and search logic
    useEffect(() => {
        let filtered = providers.filter(provider => {
            const matchesSearch = provider.providerName.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCategory = categoryFilter === 'all' || true // Add category logic if needed
            const matchesStatus = statusFilter === 'all' || true // Add status logic if needed
            const matchesDate = dateRangeFilter === 'all' || true // Add date logic if needed

            return matchesSearch && matchesCategory && matchesStatus && matchesDate
        })

        // Apply sorting
        if (currentSortKey) {
            filtered.sort((a, b) => {
                let aValue: string | number = a[currentSortKey as keyof Provider]
                let bValue: string | number = b[currentSortKey as keyof Provider]

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

        setFilteredProviders(filtered)
        setCurrentPage(1)
    }, [providers, searchTerm, categoryFilter, statusFilter, dateRangeFilter, currentSortKey, currentDirection])

    // Pagination logic
    const totalPages = Math.ceil(filteredProviders.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    const currentProviders = filteredProviders.slice(startIndex, endIndex)

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
            setSelectedProviders(currentProviders.map(provider => provider.id))
        } else {
            setSelectedProviders([])
        }
    }

    const handleSelectProvider = (providerId: number, checked: boolean) => {
        if (checked) {
            setSelectedProviders([...selectedProviders, providerId])
        } else {
            setSelectedProviders(selectedProviders.filter(id => id !== providerId))
        }
    }

    // Action handlers
    const handleViewProvider = (providerId: number) => {
        console.log('View provider:', providerId)
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
        setIsLoading(true)
        try {
            const response = await fetch('/api/providers')
            if (response.ok) {
                const data = await response.json()
                setProviders(data.providers)
                setFilteredProviders(data.providers)
            } else {
                setProviders(sampleData)
                setFilteredProviders(sampleData)
            }
        } catch (error) {
            setProviders(sampleData)
            setFilteredProviders(sampleData)
        } finally {
            setIsLoading(false)
        }
    }

    const handleBulkDelete = () => {
        if (selectedProviders.length > 0) {
            // Remove selected providers
            setProviders(prev => prev.filter(provider => !selectedProviders.includes(provider.id)))
            setFilteredProviders(prev => prev.filter(provider => !selectedProviders.includes(provider.id)))
            setSelectedProviders([])
            console.log('Bulk deleted providers:', selectedProviders)
        }
    }

    const handleClearSelection = () => {
        setSelectedProviders([])
    }

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })
    }

    return (
        <div className="max-w-[1138px] w-full mx-auto">
            <div className="mb-2.5">
                <h2 className='text-[#252525] text-[24px] font-semibold leading-[38px] tracking-[-1px]'>Revenue by Provider</h2>
            </div>
            <div className="border border-[#E8ECF4] bg-white rounded-[24px] py-6">
                {/* Table Controls */}
                <TableControls
                    search={searchTerm}
                    onSearchChange={(e) => setSearchTerm(e.target.value)}
                    searchPlaceholder="Search by Provider"
                    pageSize={pageSize}
                    onPageSizeChange={handlePageSizeChange}
                    pageSizeOptions={[4, 8, 12, 16, 20]}
                    filters={[
                        {
                            options: ['All', 'Coaching', 'Digital Services', 'Technology', 'Creative', 'Business'],
                            selected: categoryFilter === 'all' ? 'All' : categoryFilter,
                            onChange: (value) => {
                                setCategoryFilter(value === 'All' ? 'all' : value)
                            },
                            label: 'Category'
                        },
                        {
                            options: ['All', 'Active', 'Inactive', 'Pending'],
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
                        }
                    ]}
                    selectedCount={selectedProviders.length}
                    totalCount={filteredProviders.length}
                    onBulkDelete={handleBulkDelete}
                    onRefresh={handleRefresh}
                    showBulkActions={true}
                    onClearSelection={handleClearSelection}
                    columns={columns}
                    onColumnToggle={handleColumnToggle}
                    data={filteredProviders}
                    selectedData={currentProviders.filter(provider => selectedProviders.includes(provider.id))}
                    exportFilename="revenue_by_provider"
                />

                {/* Table */}
                <div className="overflow-x-auto mt-3.5">
                    <table className="min-w-[700px] sm:min-w-[800px] w-full text-nowrap">
                        <thead className='bg-[#F3F6F9]'>
                            <tr>
                                {columns.find(col => col.key === 'checkbox')?.visible && (
                                    <th className="text-left py-[17px] pl-6 pr-4 w-16">
                                        <Checkbox
                                            checked={selectedProviders.length === currentProviders.length && currentProviders.length > 0}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                )}
                                {columns.find(col => col.key === 'providerName')?.visible && (
                                    <SortableHeader
                                        sortKey="providerName"
                                        currentSortKey={currentSortKey}
                                        currentDirection={currentDirection}
                                        onSort={handleSort}
                                        className="py-[17px] px-6"
                                    >
                                        Provider Name
                                    </SortableHeader>
                                )}
                                {columns.find(col => col.key === 'servicesListed')?.visible && (
                                    <SortableHeader
                                        sortKey="servicesListed"
                                        currentSortKey={currentSortKey}
                                        currentDirection={currentDirection}
                                        onSort={handleSort}
                                        className="py-[17px] px-6"
                                    >
                                        Services Listed
                                    </SortableHeader>
                                )}
                                {columns.find(col => col.key === 'bookings')?.visible && (
                                    <SortableHeader
                                        sortKey="bookings"
                                        currentSortKey={currentSortKey}
                                        currentDirection={currentDirection}
                                        onSort={handleSort}
                                        className="py-[17px] px-6"
                                    >
                                        Bookings
                                    </SortableHeader>
                                )}
                                {columns.find(col => col.key === 'revenue')?.visible && (
                                    <SortableHeader
                                        sortKey="revenue"
                                        currentSortKey={currentSortKey}
                                        currentDirection={currentDirection}
                                        onSort={handleSort}
                                        className="py-[17px] px-6"
                                    >
                                        Revenue (KES)
                                    </SortableHeader>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={columns.filter(col => col.visible).length} className="py-10">
                                        <div className="flex flex-col items-center justify-center">
                                            <h3 className="text-[18px] leading-[24px] text-gray-900 mb-2 font-semibold">Loading providers...</h3>
                                            <p className="text-[16px] leading-[20px] text-[#252525] font-normal">
                                                Please wait while we fetch the provider data.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : currentProviders.length > 0 ? (
                                currentProviders.map((provider) => (
                                    <tr key={provider.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                                        {columns.find(col => col.key === 'checkbox')?.visible && (
                                            <td className="pl-6 pr-4 py-4 w-16">
                                                <Checkbox
                                                    checked={selectedProviders.includes(provider.id)}
                                                    onChange={(checked) => handleSelectProvider(provider.id, checked)}
                                                />
                                            </td>
                                        )}
                                        {columns.find(col => col.key === 'providerName')?.visible && (
                                            <td className="px-6 py-4 text-[14px] leading-[20px] font-medium text-[#252525]">{provider.providerName}</td>
                                        )}
                                        {columns.find(col => col.key === 'servicesListed')?.visible && (
                                            <td className="px-6 py-4 text-[14px] leading-[20px] font-medium text-[#252525]">{provider.servicesListed}</td>
                                        )}
                                        {columns.find(col => col.key === 'bookings')?.visible && (
                                            <td className="px-6 py-4 text-[14px] leading-[20px] font-medium text-[#252525]">{provider.bookings}</td>
                                        )}
                                        {columns.find(col => col.key === 'revenue')?.visible && (
                                            <td className="px-6 py-4 text-[14px] leading-[20px] font-medium text-[#252525]">{formatCurrency(provider.revenue)}</td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.filter(col => col.visible).length} className="w-full py-10 text-center">
                                        <h3 className="text-[18px] leading-[24px] font-semibold text-gray-900 mb-2">No data found</h3>
                                        <p className='text-[16px] leading-[20px] text-[#252525] font-normal'>
                                            No providers match your current search criteria or filters. Try adjusting your search terms or filters.
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
    )
}

export default RevenueByProvider