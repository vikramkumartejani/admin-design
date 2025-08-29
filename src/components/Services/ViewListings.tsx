"use client"
import React, { useState, useEffect } from 'react'
import RippleButton from '../ui/button'
import Checkbox from '../ui/Checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import SortableHeader from '../ui/SortableHeader'
import ConfirmationModal from '../ui/ConfirmationModal'
import TableControls from '../ui/TableControls'
import Pagination from '../ui/Pagination'
import { Eye, MoreVertical, Flag, EyeOff, Download } from 'lucide-react'

interface Service {
    id: number
    title: string
    provider: string
    category: string
    price: number
    status: 'Published' | 'Flagged' | 'Unpublished'
    rating: number
    reviews: number
    dateCreated: string
    description: string
}

const ViewListings = () => {
    const [services, setServices] = useState<Service[]>([])
    const [filteredServices, setFilteredServices] = useState<Service[]>([])
    const [currentServices, setCurrentServices] = useState<Service[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [priceFilter, setPriceFilter] = useState('all')
    const [selectedServices, setSelectedServices] = useState<number[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [openPopoverId, setOpenPopoverId] = useState<number | null>(null)
    const [showFlagModal, setShowFlagModal] = useState(false)
    const [showHideModal, setShowHideModal] = useState(false)
    const [showRestoreModal, setShowRestoreModal] = useState(false)
    const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false)
    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null)
    const [currentSortKey, setCurrentSortKey] = useState<string>('')
    const [currentDirection, setCurrentDirection] = useState<'asc' | 'desc'>('asc')

    const [columns, setColumns] = useState([
        { key: 'checkbox', label: 'Select', visible: true },
        { key: 'title', label: 'Title', visible: true },
        { key: 'provider', label: 'Provider', visible: true },
        { key: 'category', label: 'Category', visible: true },
        { key: 'price', label: 'Price (KES)', visible: true },
        { key: 'status', label: 'Status', visible: true },
        { key: 'action', label: 'Action', visible: true }
    ])

    useEffect(() => {
        loadData()
    }, [])

    useEffect(() => {
        filterServices()
    }, [searchTerm, categoryFilter, statusFilter, priceFilter, services, currentSortKey, currentDirection])

    useEffect(() => {
        const startIndex = (currentPage - 1) * pageSize
        const endIndex = startIndex + pageSize
        setCurrentServices(filteredServices.slice(startIndex, endIndex))
    }, [filteredServices, currentPage, pageSize])

    const loadData = async () => {
        setIsLoading(true)
        try {
            // Load data from servicesTableData.json
            const response = await fetch('/data/servicesTableData.json')
            if (!response.ok) {
                throw new Error('Failed to fetch services data')
            }

            const data = await response.json()
            const servicesData = data.services || []

            setServices(servicesData)
            setFilteredServices(servicesData)
        } catch (error) {
            console.error('Error loading services:', error)
            // Fallback to empty array if fetch fails
            setServices([])
            setFilteredServices([])
        } finally {
            setIsLoading(false)
        }
    }

    const filterServices = () => {
        let filtered = services.filter(service => {
            const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.provider.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter
            const matchesStatus = statusFilter === 'all' || service.status === statusFilter
            const matchesPrice = priceFilter === 'all' || checkPriceRange(service.price, priceFilter)

            return matchesSearch && matchesCategory && matchesStatus && matchesPrice
        })

        // Apply sorting
        if (currentSortKey) {
            filtered.sort((a, b) => {
                const aValue = a[currentSortKey as keyof Service]
                const bValue = b[currentSortKey as keyof Service]

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return currentDirection === 'asc'
                        ? aValue.toLowerCase().localeCompare(bValue.toLowerCase())
                        : bValue.toLowerCase().localeCompare(aValue.toLowerCase())
                }

                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return currentDirection === 'asc' ? aValue - bValue : bValue - aValue
                }

                return 0
            })
        }

        setFilteredServices(filtered)
        if (searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || priceFilter !== 'all') {
            setCurrentPage(1)
        }
    }

    const checkPriceRange = (price: number, range: string): boolean => {
        switch (range) {
            case '0-1000': return price >= 0 && price <= 1000
            case '1001-5000': return price >= 1001 && price <= 5000
            case '5001-10000': return price >= 5001 && price <= 10000
            case '10001+': return price > 10000
            default: return true
        }
    }

    const handleSort = (key: string) => {
        if (currentSortKey === key) {
            setCurrentDirection(currentDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setCurrentSortKey(key)
            setCurrentDirection('asc')
        }
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedServices(currentServices.map(service => service.id))
        } else {
            setSelectedServices([])
        }
    }

    const handleSelectService = (serviceId: number, checked: boolean) => {
        if (checked) {
            setSelectedServices(prev => [...prev, serviceId])
        } else {
            setSelectedServices(prev => prev.filter(id => id !== serviceId))
        }
    }

    const handleFlagService = (serviceId: number) => {
        setSelectedServiceId(serviceId)
        setShowFlagModal(true)
        setOpenPopoverId(null)
    }

    const handleHideService = (serviceId: number) => {
        setSelectedServiceId(serviceId)
        setShowHideModal(true)
        setOpenPopoverId(null)
    }

    const handleRestoreService = (serviceId: number) => {
        setSelectedServiceId(serviceId)
        setShowRestoreModal(true)
        setOpenPopoverId(null)
    }

    const confirmFlagService = () => {
        if (selectedServiceId) {
            setServices(prev => prev.map(service =>
                service.id === selectedServiceId
                    ? { ...service, status: 'Flagged' as const }
                    : service
            ))
            setFilteredServices(prev => prev.map(service =>
                service.id === selectedServiceId
                    ? { ...service, status: 'Flagged' as const }
                    : service
            ))
        }
        setShowFlagModal(false)
        setSelectedServiceId(null)
    }

    const confirmHideService = () => {
        if (selectedServiceId) {
            setServices(prev => prev.map(service =>
                service.id === selectedServiceId
                    ? { ...service, status: 'Unpublished' as const }
                    : service
            ))
            setFilteredServices(prev => prev.map(service =>
                service.id === selectedServiceId
                    ? { ...service, status: 'Unpublished' as const }
                    : service
            ))
        }
        setShowHideModal(false)
        setSelectedServiceId(null)
    }

    const confirmRestoreService = () => {
        if (selectedServiceId) {
            setServices(prev => prev.map(service =>
                service.id === selectedServiceId
                    ? { ...service, status: 'Published' as const }
                    : service
            ))
            setFilteredServices(prev => prev.map(service =>
                service.id === selectedServiceId
                    ? { ...service, status: 'Published' as const }
                    : service
            ))
        }
        setShowRestoreModal(false)
        setSelectedServiceId(null)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Published':
                return 'bg-[#00AA061A] text-[#00AA06]'
            case 'Flagged':
                return 'bg-[#FF3B301A] text-[#FF3B30]'
            case 'Unpublished':
                return 'bg-[#FF95001A] text-[#FF9500]'
            default:
                return 'bg-gray-100 text-gray-600'
        }
    }

    const getStatusDot = (status: string) => {
        switch (status) {
            case 'Published':
                return 'bg-[#00AA06]'
            case 'Flagged':
                return 'bg-[#FF3B30]'
            case 'Unpublished':
                return 'bg-[#FF9500]'
            default:
                return 'bg-gray-400'
        }
    }

    const getCategoryColor = () => {
        return 'bg-[#2525250A] text-[#252525]'
    }

    const totalPages = Math.ceil(filteredServices.length / pageSize)

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize)
        setCurrentPage(1)
    }

    const handleColumnToggle = (columnKey: string) => {
        setColumns(prev => prev.map(col =>
            col.key === columnKey ? { ...col, visible: !col.visible } : col
        ))
    }

    const handleRefresh = () => {
        loadData()
    }

    const handleBulkDelete = () => {
        if (selectedServices.length === 0) return
        setShowBulkDeleteModal(true)
    }

    const confirmBulkDelete = () => {
        // Remove selected services from both arrays
        setServices(prev => prev.filter(service => !selectedServices.includes(service.id)))
        setFilteredServices(prev => prev.filter(service => !selectedServices.includes(service.id)))

        // Clear selection
        setSelectedServices([])

        // Reset to first page if current page becomes empty
        if (currentServices.length <= selectedServices.length) {
            setCurrentPage(1)
        }

        setShowBulkDeleteModal(false)
    }

    const handleClearSelection = () => {
        setSelectedServices([])
    }

    const handleExportCSV = () => {
        // CSV export functionality
        const csvContent = "data:text/csv;charset=utf-8," +
            "Title,Provider,Category,Price,Status\n" +
            filteredServices.map(service =>
                `${service.title},${service.provider},${service.category},${service.price},${service.status}`
            ).join("\n")

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", "services.csv")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className='max-w-[1138px] w-full mx-auto'>
            <div className="">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[24px] leading-[38px] font-semibold text-[#252525] tracking-[-1px]">View Listings</h2>
                </div>

                <div className="border border-[#E8ECF4] bg-white rounded-[24px] py-6">
                    <TableControls
                        search={searchTerm}
                        onSearchChange={(e) => setSearchTerm(e.target.value)}
                        searchPlaceholder="Search by service title or provider name"
                        filters={[
                            {
                                options: ['All', 'Coaching', 'Digital Services', 'Technology', 'Creative', 'Business'],
                                selected: categoryFilter === 'all' ? 'All' : categoryFilter,
                                onChange: (value) => {
                                    console.log('Category filter changed from', categoryFilter, 'to', value)
                                    setCategoryFilter(value === 'All' ? 'all' : value)
                                },
                                label: 'Category'
                            },
                            {
                                options: ['All', 'Published', 'Flagged', 'Unpublished'],
                                selected: statusFilter === 'all' ? 'All' : statusFilter,
                                onChange: (value) => {
                                    console.log('Status filter changed from', statusFilter, 'to', value)
                                    setStatusFilter(value === 'All' ? 'all' : value)
                                },
                                label: 'Status'
                            },
                            {
                                options: ['All', '0-1000', '1001-5000', '5001-10000', '10001+'],
                                selected: priceFilter === 'all' ? 'All' : priceFilter,
                                onChange: (value) => {
                                    console.log('Price filter changed from', priceFilter, 'to', value)
                                    setPriceFilter(value === 'All' ? 'all' : value)
                                },
                                label: 'Price Range'
                            }
                        ]}
                        pageSize={pageSize}
                        onPageSizeChange={handlePageSizeChange}
                        columns={columns}
                        onColumnToggle={handleColumnToggle}
                        onRefresh={handleRefresh}
                        onBulkDelete={handleBulkDelete}
                        onClearSelection={handleClearSelection}
                        selectedCount={selectedServices.length}
                        totalCount={filteredServices.length}
                        data={services}
                        selectedData={selectedServices}
                        exportFilename="services"
                        showBulkActions={true}
                    />

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
                                    {columns.find(col => col.key === 'title')?.visible && (
                                        <th className="py-[17px] px-6">
                                            <SortableHeader
                                                sortKey="title"
                                                currentSortKey={currentSortKey}
                                                currentDirection={currentDirection}
                                                onSort={handleSort}
                                                notTH={true}
                                                className="py-0 px-0"
                                            >
                                                Title
                                            </SortableHeader>
                                        </th>
                                    )}
                                    {columns.find(col => col.key === 'provider')?.visible && (
                                        <th className="py-[17px] px-6">
                                            <SortableHeader
                                                sortKey="provider"
                                                currentSortKey={currentSortKey}
                                                currentDirection={currentDirection}
                                                onSort={handleSort}
                                                notTH={true}
                                                className="py-0 px-0"
                                            >
                                                Provider
                                            </SortableHeader>
                                        </th>
                                    )}
                                    {columns.find(col => col.key === 'category')?.visible && (
                                        <th className="py-[17px] px-6">
                                            <SortableHeader
                                                sortKey="category"
                                                currentSortKey={currentSortKey}
                                                currentDirection={currentDirection}
                                                onSort={handleSort}
                                                notTH={true}
                                                className="py-0 px-0"
                                            >
                                                Category
                                            </SortableHeader>
                                        </th>
                                    )}
                                    {columns.find(col => col.key === 'price')?.visible && (
                                        <th className="py-[17px] px-6]">
                                            <SortableHeader
                                                sortKey="price"
                                                currentSortKey={currentSortKey}
                                                currentDirection={currentDirection}
                                                onSort={handleSort}
                                                notTH={true}
                                                className="py-0 px-0"
                                            >
                                                Price (KES)
                                            </SortableHeader>
                                        </th>
                                    )}
                                    {columns.find(col => col.key === 'status')?.visible && (
                                        <th className="py-[17px] px-6">
                                            <SortableHeader
                                                sortKey="status"
                                                currentSortKey={currentSortKey}
                                                currentDirection={currentDirection}
                                                onSort={handleSort}
                                                notTH={true}
                                                className="py-0 px-0"
                                            >
                                                Status
                                            </SortableHeader>
                                        </th>
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
                                            {columns.find(col => col.key === 'title')?.visible && (
                                                <td className="px-6 py-4 text-[14px] leading-[20px] font-medium text-[#252525]">{service.title}</td>
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
                                            {columns.find(col => col.key === 'price')?.visible && (
                                                <td className="px-6 py-4 text-[14px] leading-[20px] font-medium text-[#252525]">{service.price.toLocaleString()}</td>
                                            )}
                                            {columns.find(col => col.key === 'status')?.visible && (
                                                <td className="px-6 py-4">
                                                    <div className={`px-3.5 h-[32px] rounded-full w-fit ${getStatusColor(service.status)} flex items-center gap-2`}>
                                                        <div className={`w-2 h-2 rounded-full ${getStatusDot(service.status)}`}></div>
                                                        <span className='text-[14px] leading-[20px] font-medium'>{service.status}</span>
                                                    </div>
                                                </td>
                                            )}
                                            {columns.find(col => col.key === 'action')?.visible && (
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <RippleButton
                                                            onClick={() => { }}
                                                            className="h-[38px] w-[38px] border border-[#25252526] rounded-[11px] flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
                                                        >
                                                            <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M11.6849 9.8404C11.6849 11.3254 10.4849 12.5254 8.99994 12.5254C7.51494 12.5254 6.31494 11.3254 6.31494 9.8404C6.31494 8.3554 7.51494 7.1554 8.99994 7.1554C10.4849 7.1554 11.6849 8.3554 11.6849 9.8404Z" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                <path d="M8.99988 16.0429C11.6474 16.0429 14.1149 14.4829 15.8324 11.7829C16.5074 10.7254 16.5074 8.9479 15.8324 7.8904C14.1149 5.1904 11.6474 3.6304 8.99988 3.6304C6.35238 3.6304 3.88488 5.1904 2.16738 7.8904C1.49238 8.9479 1.49238 10.7254 2.16738 11.7829C3.88488 14.4829 6.35238 16.0429 8.99988 16.0429Z" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </RippleButton>
                                                        <Popover
                                                            open={openPopoverId === service.id}
                                                            onOpenChange={(open) => setOpenPopoverId(open ? service.id : null)}
                                                        >
                                                            <PopoverTrigger asChild>
                                                                <RippleButton
                                                                    className={`h-[38px] w-[38px] border border-[#25252526] rounded-[11px] flex items-center justify-center hover:bg-gray-100 transition-colors duration-200 ${openPopoverId === service.id ? 'border-black' : ''}`}
                                                                >
                                                                    <MoreVertical className="w-5 h-5" />
                                                                </RippleButton>
                                                            </PopoverTrigger>
                                                            <PopoverContent
                                                                className="w-[187px] px-2 py-2.5 border bg-white border-gray-200"
                                                                style={{ boxShadow: "0px 4px 4px 0px #0000000D" }}
                                                                side="bottom"
                                                                align="end"
                                                                sideOffset={5}
                                                            >
                                                                <div className="">
                                                                    <RippleButton
                                                                        className="w-full flex items-center justify-start gap-2.5 hover:bg-[#4862841A] text-[14px] leading-[20px] font-medium text-[#252525] px-2.5 py-2 rounded-lg transition-colors duration-200"
                                                                        onClick={() => handleFlagService(service.id)}
                                                                    >
                                                                        <Flag className="w-5 h-5" />
                                                                        Flag Service
                                                                    </RippleButton>
                                                                    <RippleButton
                                                                        className="w-full flex items-center justify-start gap-2.5 hover:bg-[#4862841A] text-[14px] leading-[20px] font-medium text-[#252525] px-2.5 py-2 rounded-lg transition-colors duration-200"
                                                                        onClick={() => handleHideService(service.id)}
                                                                    >
                                                                        <EyeOff className="w-5 h-5" />
                                                                        Hide Service
                                                                    </RippleButton>
                                                                    {(service.status === 'Flagged' || service.status === 'Unpublished') && (
                                                                        <RippleButton
                                                                            className="w-full flex items-center justify-start gap-2.5 hover:bg-[#4862841A] text-[14px] leading-[20px] font-medium text-[#252525] px-2.5 py-2 rounded-lg transition-colors duration-200"
                                                                            onClick={() => handleRestoreService(service.id)}
                                                                        >
                                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                                            </svg>
                                                                            Restore Service
                                                                        </RippleButton>
                                                                    )}
                                                                </div>
                                                            </PopoverContent>
                                                        </Popover>
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

            <ConfirmationModal
                isOpen={showFlagModal}
                onClose={() => setShowFlagModal(false)}
                onConfirm={confirmFlagService}
                title="Flag Service"
                description="Are you sure you want to flag this service? This action will mark the service for review."
                confirmText="Flag Service"
                cancelText="Cancel"
                icon={<Flag className="w-[26px] h-[26px] text-[#3A96AF]" />}
            />

            <ConfirmationModal
                isOpen={showHideModal}
                onClose={() => setShowHideModal(false)}
                onConfirm={confirmHideService}
                title="Hide Service"
                description="Are you sure you want to hide this service? This action will make the service unavailable to users."
                confirmText="Hide Service"
                cancelText="Cancel"
                icon={<EyeOff className="w-[24px] h-[24px] text-[#3A96AF]" />}
            />

            <ConfirmationModal
                isOpen={showBulkDeleteModal}
                onClose={() => setShowBulkDeleteModal(false)}
                onConfirm={confirmBulkDelete}
                title="Delete Services"
                description={`Are you sure you want to delete ${selectedServices.length} selected service(s)? This action cannot be undone.`}
                confirmText="Delete Services"
                cancelText="Cancel"
                icon={<svg className="w-[30px] h-[30px] text-[#3A96AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>}
            />

            <ConfirmationModal
                isOpen={showRestoreModal}
                onClose={() => setShowRestoreModal(false)}
                onConfirm={confirmRestoreService}
                title="Restore Service"
                description="Are you sure you want to restore this service to published status? This will make the service visible to users again."
                confirmText="Restore Service"
                cancelText="Cancel"
                icon={<svg className="w-[30px] h-[30px] text-[#3A96AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>}
            />
        </div>
    )
}



export default ViewListings