"use client"
import React, { useState, useEffect } from 'react'
import RippleButton from '../../ui/button'
import Checkbox from '../../ui/Checkbox'
import { Eye, MoreVertical, RefreshCw, Download } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'
import SortableHeader from '../../ui/SortableHeader'
import ConfirmationModal from '../../ui/ConfirmationModal'
import TableControls from '../../ui/TableControls'
import Pagination from '../../ui/Pagination'

interface FlaggedHiddenService {
    id: number
    title: string
    provider: string
    status: 'Flagged' | 'Hidden'
    flagReason: string
    category: string
    dateFlagged: string
}

const FlagHide = () => {
    const [services, setServices] = useState<FlaggedHiddenService[]>([])
    const [filteredServices, setFilteredServices] = useState<FlaggedHiddenService[]>([])
    const [currentServices, setCurrentServices] = useState<FlaggedHiddenService[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [dateFilter, setDateFilter] = useState('all')
    const [selectedServices, setSelectedServices] = useState<number[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [openPopoverId, setOpenPopoverId] = useState<number | null>(null)
    const [showRestoreModal, setShowRestoreModal] = useState(false)
    const [showUnflagModal, setShowUnflagModal] = useState(false)
    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null)
    const [currentSortKey, setCurrentSortKey] = useState<string>('')
    const [currentDirection, setCurrentDirection] = useState<'asc' | 'desc'>('asc')

    const [columns, setColumns] = useState([
        { key: 'checkbox', label: 'Select', visible: true },
        { key: 'title', label: 'Title', visible: true },
        { key: 'provider', label: 'Provider', visible: true },
        { key: 'status', label: 'Status', visible: true },
        { key: 'flagReason', label: 'Flag Reason', visible: true },
        { key: 'action', label: 'Action', visible: true }
    ])

    useEffect(() => {
        loadData()
    }, [])

    useEffect(() => {
        filterServices()
    }, [searchTerm, categoryFilter, statusFilter, dateFilter, services, currentSortKey, currentDirection])

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
            const flaggedHiddenData = data.flaggedHiddenServices || []

            setServices(flaggedHiddenData)
            setFilteredServices(flaggedHiddenData)
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
            const matchesDate = dateFilter === 'all' || checkDateRange(service.dateFlagged, dateFilter)

            return matchesSearch && matchesCategory && matchesStatus && matchesDate
        })

        // Apply sorting
        if (currentSortKey) {
            filtered.sort((a, b) => {
                const aValue = a[currentSortKey as keyof FlaggedHiddenService]
                const bValue = b[currentSortKey as keyof FlaggedHiddenService]

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return currentDirection === 'asc'
                        ? aValue.toLowerCase().localeCompare(bValue.toLowerCase())
                        : bValue.toLowerCase().localeCompare(aValue.toLowerCase())
                }

                return 0
            })
        }

        setFilteredServices(filtered)
        if (searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || dateFilter !== 'all') {
            setCurrentPage(1)
        }
    }

    const checkDateRange = (date: string, range: string): boolean => {
        const serviceDate = new Date(date)
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - serviceDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        switch (range) {
            case 'today': return diffDays === 0
            case 'week': return diffDays <= 7
            case 'month': return diffDays <= 30
            case 'quarter': return diffDays <= 90
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

    const handleRestoreService = (serviceId: number) => {
        setSelectedServiceId(serviceId)
        setShowRestoreModal(true)
        setOpenPopoverId(null)
    }

    const handleUnflagService = (serviceId: number) => {
        setSelectedServiceId(serviceId)
        setShowUnflagModal(true)
        setOpenPopoverId(null)
    }

    const confirmRestoreService = () => {
        if (selectedServiceId) {
            setServices(prev => prev.filter(service => service.id !== selectedServiceId))
            setFilteredServices(prev => prev.filter(service => service.id !== selectedServiceId))
        }
        setShowRestoreModal(false)
        setSelectedServiceId(null)
    }

    const confirmUnflagService = () => {
        if (selectedServiceId) {
            setServices(prev => prev.filter(service => service.id !== selectedServiceId))
            setFilteredServices(prev => prev.filter(service => service.id !== selectedServiceId))
        }
        setShowUnflagModal(false)
        setSelectedServiceId(null)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Flagged':
                return 'bg-[#FF3B301A] text-[#FF3B30]'
            case 'Hidden':
                return 'bg-[#2525251A] text-[#252525]'
            default:
                return 'bg-gray-100 text-gray-600'
        }
    }

    const getStatusDot = (status: string) => {
        switch (status) {
            case 'Flagged':
                return 'bg-[#FF3B30]'
            case 'Hidden':
                return 'bg-[#252525]'
            default:
                return 'bg-gray-400'
        }
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
        // Bulk delete logic can be implemented here
    }

    const handleClearSelection = () => {
        setSelectedServices([])
    }

    const handleExportCSV = () => {
        // CSV export functionality
        const csvContent = "data:text/csv;charset=utf-8," +
            "Title,Provider,Status,Flag Reason,Category,Date Flagged\n" +
            filteredServices.map(service =>
                `${service.title},${service.provider},${service.status},${service.flagReason},${service.category},${service.dateFlagged}`
            ).join("\n")

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", "flagged-hidden-services.csv")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className='max-w-[1138px] w-full mx-auto'>
            <div className="">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[24px] leading-[38px] font-semibold text-[#252525] tracking-[-1px]">Flagged/Hidden Services</h2>
                </div>

                <div className="border border-[#E8ECF4] bg-white rounded-[24px] py-6">
                    <TableControls
                        search={searchTerm}
                        onSearchChange={(e) => setSearchTerm(e.target.value)}
                        searchPlaceholder="Search by Service or Provider Name"
                        filters={[
                            {
                                options: ['All', 'Coaching', 'Digital Services', 'Technology', 'Creative', 'Business'],
                                selected: categoryFilter === 'all' ? 'All' : categoryFilter,
                                onChange: (value) => setCategoryFilter(value === 'All' ? 'all' : value),
                                label: 'Category'
                            },
                            {
                                options: ['All', 'Flagged', 'Hidden'],
                                selected: statusFilter === 'all' ? 'All' : statusFilter,
                                onChange: (value) => setStatusFilter(value === 'All' ? 'all' : value),
                                label: 'Status'
                            },
                            {
                                options: ['All', 'Today', 'This Week', 'This Month', 'This Quarter'],
                                selected: dateFilter === 'all' ? 'All' : dateFilter,
                                onChange: (value) => setDateFilter(value === 'All' ? 'all' : value),
                                label: 'Date Range'
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
                        exportFilename="flagged-hidden-services"
                        showBulkActions={true}
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
                                    {columns.find(col => col.key === 'flagReason')?.visible && (
                                        <th className="py-[17px] px-6">
                                            <SortableHeader
                                                sortKey="flagReason"
                                                currentSortKey={currentSortKey}
                                                currentDirection={currentDirection}
                                                onSort={handleSort}
                                                notTH={true}
                                                className="py-0 px-0"
                                            >
                                                Flag Reason
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
                                                    Please wait while we fetch the flagged and hidden services.
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
                                            {columns.find(col => col.key === 'status')?.visible && (
                                                <td className="px-6 py-4">
                                                    <div className={`px-3.5 h-[32px] rounded-full w-fit ${getStatusColor(service.status)} flex items-center gap-2`}>
                                                        <div className={`w-2 h-2 rounded-full ${getStatusDot(service.status)}`}></div>
                                                        <span className='text-[14px] leading-[20px] font-medium'>{service.status}</span>
                                                    </div>
                                                </td>
                                            )}
                                            {columns.find(col => col.key === 'flagReason')?.visible && (
                                                <td className="px-6 py-4 text-[14px] leading-[20px] text-[#252525]">{service.flagReason}</td>
                                            )}
                                            {columns.find(col => col.key === 'action')?.visible && (
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <RippleButton
                                                            onClick={() => { }}
                                                            className="h-[38px] w-[38px] border border-[#25252526] rounded-[11px] flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
                                                        >
                                                            <Eye className="w-5 h-5 text-[#252525]" />
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
                                                                    {service.status === 'Flagged' && (
                                                                        <RippleButton
                                                                            className="w-full flex items-center justify-start gap-2.5 hover:bg-[#4862841A] text-[14px] leading-[20px] font-medium text-[#252525] px-2.5 py-2 rounded-lg transition-colors duration-200"
                                                                            onClick={() => handleUnflagService(service.id)}
                                                                        >
                                                                            <RefreshCw className="w-5 h-5" />
                                                                            Unflag Service
                                                                        </RippleButton>
                                                                    )}
                                                                    {service.status === 'Hidden' && (
                                                                        <RippleButton
                                                                            className="w-full flex items-center justify-start gap-2.5 hover:bg-[#4862841A] text-[14px] leading-[20px] font-medium text-[#252525] px-2.5 py-2 rounded-lg transition-colors duration-200"
                                                                            onClick={() => handleRestoreService(service.id)}
                                                                        >
                                                                            <Eye className="w-5 h-5" />
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
                                            <h3 className="text-[18px] leading-[24px] font-semibold text-gray-900 mb-2">No flagged or hidden services found</h3>
                                            <p className='text-[16px] leading-[20px] text-[#252525] font-normal'>
                                                No services match your current search criteria or filters.
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

            {/* Restore Service Confirmation Modal */}
            <ConfirmationModal
                isOpen={showRestoreModal}
                onClose={() => setShowRestoreModal(false)}
                onConfirm={confirmRestoreService}
                title="Restore Service"
                description="Are you sure you want to restore this hidden service? This will make the service visible to users again."
                confirmText="Restore Service"
                cancelText="Cancel"
                icon={<Eye className="w-[30px] h-[30px] text-[#3A96AF]" />}
            />

            {/* Unflag Service Confirmation Modal */}
            <ConfirmationModal
                isOpen={showUnflagModal}
                onClose={() => setShowUnflagModal(false)}
                onConfirm={confirmUnflagService}
                title="Unflag Service"
                description="Are you sure you want to unflag this service? This will restore the service to normal status."
                confirmText="Unflag Service"
                cancelText="Cancel"
                icon={<RefreshCw className="w-[30px] h-[30px] text-[#3A96AF]" />}
            />
        </div>
    )
}

export default FlagHide