"use client"
import React, { useState, useEffect } from 'react'
import RippleButton from "@/components/ui/button"
import Pagination from "@/components/ui/Pagination"
import Checkbox from "@/components/ui/Checkbox"
import SortableHeader from "@/components/ui/SortableHeader"
import TableControls from "@/components/ui/TableControls"

interface ServiceListing {
    id: number
    serviceTitle: string
    provider: string
    category: string
    bookings: number
    revenue: number
    status: 'Published' | 'Unpublished' | 'Pending'
}

type SortDirection = 'asc' | 'desc'

const ServiceListings = () => {
    const [services, setServices] = useState<ServiceListing[]>([])
    const [filteredServices, setFilteredServices] = useState<ServiceListing[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [dateRangeFilter, setDateRangeFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedServices, setSelectedServices] = useState<number[]>([])
    const [currentSortKey, setCurrentSortKey] = useState<string>("")
    const [currentDirection, setCurrentDirection] = useState<SortDirection>('asc')
    const [isLoading, setIsLoading] = useState(true)
    const [pageSize, setPageSize] = useState(4)
    const [columns, setColumns] = useState([
        { key: 'checkbox', label: 'Select', visible: true },
        { key: 'serviceTitle', label: 'Service Title', visible: true },
        { key: 'provider', label: 'Provider', visible: true },
        { key: 'category', label: 'Category', visible: true },
        { key: 'bookings', label: 'Bookings', visible: true },
        { key: 'revenue', label: 'Revenue (KES)', visible: true },
        { key: 'status', label: 'Status', visible: true }
    ])

    // Sample data based on image design
    const sampleData: ServiceListing[] = [
        { id: 1, serviceTitle: "Life Coaching", provider: "Kevin M.", category: "Coaching", bookings: 142, revenue: 245000, status: "Published" },
        { id: 2, serviceTitle: "Life Coaching", provider: "Kevin M.", category: "Digital", bookings: 57, revenue: 175000, status: "Unpublished" },
        { id: 3, serviceTitle: "Content Writing", provider: "Kevin M.", category: "Digital", bookings: 87, revenue: 335000, status: "Published" },
        { id: 4, serviceTitle: "Web Development", provider: "James K.", category: "Technology", bookings: 98, revenue: 289000, status: "Published" },
        { id: 5, serviceTitle: "Graphic Design", provider: "Sarah L.", category: "Creative", bookings: 76, revenue: 198000, status: "Unpublished" },
        { id: 6, serviceTitle: "Digital Marketing", provider: "Michael R.", category: "Digital", bookings: 123, revenue: 412000, status: "Published" },
        { id: 7, serviceTitle: "Business Consulting", provider: "Emma W.", category: "Business", bookings: 89, revenue: 267000, status: "Pending" },
        { id: 8, serviceTitle: "Photography", provider: "David T.", category: "Creative", bookings: 45, revenue: 156000, status: "Published" },
        { id: 9, serviceTitle: "Data Analysis", provider: "Lisa P.", category: "Technology", bookings: 112, revenue: 378000, status: "Published" },
        { id: 10, serviceTitle: "Social Media Management", provider: "John S.", category: "Digital", bookings: 67, revenue: 223000, status: "Unpublished" }
    ]

    // Load data
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true)
            try {
                // Try to fetch from API first
                const response = await fetch('/api/service-listings')
                if (response.ok) {
                    const data = await response.json()
                    setServices(data.services)
                    setFilteredServices(data.services)
                } else {
                    throw new Error('API not available')
                }
            } catch (error) {
                // Fallback to sample data
                setServices(sampleData)
                setFilteredServices(sampleData)
            } finally {
                setIsLoading(false)
            }
        }
        loadData()
    }, [])

    // Filter and search logic
    useEffect(() => {
        let filtered = services.filter(service => {
            const matchesSearch = service.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.provider.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter
            const matchesStatus = statusFilter === 'all' || service.status === statusFilter
            const matchesDate = dateRangeFilter === 'all' || true // Add date logic if needed

            return matchesSearch && matchesCategory && matchesStatus && matchesDate
        })

        // Apply sorting
        if (currentSortKey) {
            filtered.sort((a, b) => {
                let aValue: string | number = a[currentSortKey as keyof ServiceListing]
                let bValue: string | number = b[currentSortKey as keyof ServiceListing]

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

        setFilteredServices(filtered)
        setCurrentPage(1)
    }, [services, searchTerm, categoryFilter, statusFilter, dateRangeFilter, currentSortKey, currentDirection])

    // Pagination logic
    const totalPages = Math.ceil(filteredServices.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    const currentServices = filteredServices.slice(startIndex, endIndex)

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
            setSelectedServices(currentServices.map(service => service.id))
        } else {
            setSelectedServices([])
        }
    }

    const handleSelectService = (serviceId: number, checked: boolean) => {
        if (checked) {
            setSelectedServices([...selectedServices, serviceId])
        } else {
            setSelectedServices(selectedServices.filter(id => id !== serviceId))
        }
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
            const response = await fetch('/api/service-listings')
            if (response.ok) {
                const data = await response.json()
                setServices(data.services)
                setFilteredServices(data.services)
            } else {
                setServices(sampleData)
                setFilteredServices(sampleData)
            }
        } catch (error) {
            setServices(sampleData)
            setFilteredServices(sampleData)
        } finally {
            setIsLoading(false)
        }
    }

    const handleBulkDelete = () => {
        if (selectedServices.length > 0) {
            // Remove selected services
            setServices(prev => prev.filter(service => !selectedServices.includes(service.id)))
            setFilteredServices(prev => prev.filter(service => !selectedServices.includes(service.id)))
            setSelectedServices([])
            console.log('Bulk deleted services:', selectedServices)
        }
    }

    const handleClearSelection = () => {
        setSelectedServices([])
    }

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Published':
                return 'bg-[#00AA061A] text-[#00AA06]'
            case 'Unpublished':
                return 'bg-[#FF3B301A] text-[#FF3B30]'
            case 'Pending':
                return 'bg-[#FF95001A] text-[#FF9500]'
            default:
                return 'bg-gray-100 text-gray-600'
        }
    }

    const getStatusDot = (status: string) => {
        switch (status) {
            case 'Published':
                return 'bg-[#00AA06]'
            case 'Unpublished':
                return 'bg-[#FF3B30]'
            case 'Pending':
                return 'bg-[#FF9500]'
            default:
                return 'bg-gray-400'
        }
    }

    const getCategoryColor = () => {
        return 'bg-[#2525250A] text-[#252525]'
    }

    return (
        <div className="max-w-[1138px] w-full mx-auto">
            <div className="mb-2.5">
                <h2 className='text-[#252525] text-[24px] font-semibold leading-[38px] tracking-[-1px]'>Service Listings</h2>
            </div>
            <div className="border border-[#E8ECF4] bg-white rounded-[24px] py-6">
                {/* Table Controls */}
                <TableControls
                    search={searchTerm}
                    onSearchChange={(e) => setSearchTerm(e.target.value)}
                    searchPlaceholder="Search by Service"
                    pageSize={pageSize}
                    onPageSizeChange={handlePageSizeChange}
                    pageSizeOptions={[4, 8, 12, 16, 20]}
                    filters={[
                        {
                            options: ['All', 'Coaching', 'Digital', 'Technology', 'Creative', 'Business'],
                            selected: categoryFilter === 'all' ? 'All' : categoryFilter,
                            onChange: (value) => {
                                setCategoryFilter(value === 'All' ? 'all' : value)
                            },
                            label: 'Category'
                        },
                        {
                            options: ['All', 'Published', 'Unpublished', 'Pending'],
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
                    selectedCount={selectedServices.length}
                    totalCount={filteredServices.length}
                    onBulkDelete={handleBulkDelete}
                    onRefresh={handleRefresh}
                    showBulkActions={true}
                    onClearSelection={handleClearSelection}
                    columns={columns}
                    onColumnToggle={handleColumnToggle}
                    data={filteredServices}
                    selectedData={currentServices.filter(service => selectedServices.includes(service.id))}
                    exportFilename="service_listings"
                />

                {/* Table */}
                <div className="overflow-x-auto mt-3.5">
                    <table className="min-w-[700px] sm:min-w-[800px] w-full text-nowrap">
                        <thead className='bg-[#F3F6F9]'>
                            <tr>
                                {columns.find(col => col.key === 'checkbox')?.visible && (
                                    <th className="text-left py-[17px] pl-6 pr-4 w-16">
                                        <Checkbox
                                            checked={selectedServices.length === currentServices.length && currentServices.length > 0}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                )}
                                {columns.find(col => col.key === 'serviceTitle')?.visible && (
                                    <SortableHeader
                                        sortKey="serviceTitle"
                                        currentSortKey={currentSortKey}
                                        currentDirection={currentDirection}
                                        onSort={handleSort}
                                        className="py-[17px] px-6"
                                    >
                                        Service Title
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
                                {columns.find(col => col.key === 'category')?.visible && (
                                    <SortableHeader
                                        sortKey="category"
                                        currentSortKey={currentSortKey}
                                        currentDirection={currentDirection}
                                        onSort={handleSort}
                                        className="py-[17px] px-6"
                                    >
                                        Category
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
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={columns.filter(col => col.visible).length} className="py-10">
                                        <div className="flex flex-col items-center justify-center">
                                            <h3 className="text-[18px] leading-[24px] text-gray-900 mb-2 font-semibold">Loading services...</h3>
                                            <p className="text-[16px] leading-[20px] text-[#252525] font-normal">
                                                Please wait while we fetch the service data.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : currentServices.length > 0 ? (
                                currentServices.map((service) => (
                                    <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                                        {columns.find(col => col.key === 'checkbox')?.visible && (
                                            <td className="pl-6 pr-4 py-4 w-16">
                                                <Checkbox
                                                    checked={selectedServices.includes(service.id)}
                                                    onChange={(checked) => handleSelectService(service.id, checked)}
                                                />
                                            </td>
                                        )}
                                        {columns.find(col => col.key === 'serviceTitle')?.visible && (
                                            <td className="px-6 py-4 text-[14px] leading-[20px] font-medium text-[#252525]">{service.serviceTitle}</td>
                                        )}
                                        {columns.find(col => col.key === 'provider')?.visible && (
                                            <td className="px-6 py-4 text-[14px] leading-[20px] font-medium text-[#252525]">{service.provider}</td>
                                        )}
                                        {columns.find(col => col.key === 'category')?.visible && (
                                            <td className="px-6 py-4">
                                                <span className={`px-3.5 py-1.5 rounded-full text-sm font-medium text-[14px] leading-[20px] text-[#252525] ${getCategoryColor()}`}>
                                                    {service.category}
                                                </span>
                                            </td>
                                        )}
                                        {columns.find(col => col.key === 'bookings')?.visible && (
                                            <td className="px-6 py-4 text-[14px] leading-[20px] font-medium text-[#252525]">{service.bookings}</td>
                                        )}
                                        {columns.find(col => col.key === 'revenue')?.visible && (
                                            <td className="px-6 py-4 text-[14px] leading-[20px] font-medium text-[#252525]">{formatCurrency(service.revenue)}</td>
                                        )}
                                        {columns.find(col => col.key === 'status')?.visible && (
                                            <td className="px-6 py-4">
                                                <div className={`px-3.5 h-[32px] rounded-full w-fit ${getStatusColor(service.status)} flex items-center gap-2`}>
                                                    <div className={`w-2 h-2 rounded-full ${getStatusDot(service.status)}`}></div>
                                                    <span className='text-[14px] leading-[20px] font-medium'>{service.status}</span>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.filter(col => col.visible).length} className="w-full py-10 text-center">
                                        <h3 className="text-[18px] leading-[24px] font-semibold text-gray-900 mb-2">No data found</h3>
                                        <p className='text-[16px] leading-[20px] text-[#252525] font-normal'>
                                            No services match your current search criteria or filters. Try adjusting your search terms or filters.
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

export default ServiceListings