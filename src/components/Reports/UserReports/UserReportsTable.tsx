"use client"
import React, { useState, useEffect } from 'react'
import RippleButton from "@/components/ui/button"
import Pagination from "@/components/ui/Pagination"
import Checkbox from "@/components/ui/Checkbox"
import SortableHeader from "@/components/ui/SortableHeader"
import TableControls from "@/components/ui/TableControls"

interface User {
    id: number
    name: string
    email: string
    role: string
    registeredOn: string
    status: string
    phone: string
    location: string
    lastActive: string
    services: number
    rating: number
}

type SortDirection = 'asc' | 'desc'

const UserReportsTable = () => {
    const [users, setUsers] = useState<User[]>([])
    const [filteredUsers, setFilteredUsers] = useState<User[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [dateRangeFilter, setDateRangeFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedUsers, setSelectedUsers] = useState<number[]>([])
    const [currentSortKey, setCurrentSortKey] = useState<string>("")
    const [currentDirection, setCurrentDirection] = useState<SortDirection>('asc')
    const [isLoading, setIsLoading] = useState(true)
    const [pageSize, setPageSize] = useState(3)
    const [columns, setColumns] = useState([
        { key: 'checkbox', label: 'Select', visible: true },
        { key: 'name', label: 'Name', visible: true },
        { key: 'email', label: 'Email', visible: true },
        { key: 'role', label: 'Role', visible: true },
        { key: 'registeredOn', label: 'Registered On', visible: true },
        { key: 'status', label: 'Status', visible: true },
        { key: 'action', label: 'Action', visible: true }
    ])

    // Load data from JSON file
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true)
            try {
                const response = await fetch('/api/users')
                const data = await response.json()
                setUsers(data.users)
                setFilteredUsers(data.users)
            } catch (error) {
                // Fallback to static data if API fails
                const staticData = require('@/data/userReportsData.json')
                setUsers(staticData.users)
                setFilteredUsers(staticData.users)
            } finally {
                setIsLoading(false)
            }
        }
        loadData()
    }, [])

    // Filter and search logic
    useEffect(() => {
        let filtered = users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phone.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesRole = roleFilter === 'all' || user.role === roleFilter
            const matchesStatus = statusFilter === 'all' || user.status.toLowerCase() === statusFilter.toLowerCase()

            // Date range filtering
            let matchesDate = true
            if (dateRangeFilter !== 'all') {
                // Parse transaction date (format: 20-Apr-2025)
                const [day, month, year] = user.registeredOn.split('-')
                const monthMap: { [key: string]: number } = {
                    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
                    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
                }
                const userDate = new Date(parseInt(year), monthMap[month], parseInt(day))

                // Get current date
                const now = new Date()
                const currentYear = now.getFullYear()
                const currentMonth = now.getMonth()
                const currentDay = now.getDate()

                // Create date objects for comparison
                const today = new Date(currentYear, currentMonth, currentDay)
                const yesterday = new Date(currentYear, currentMonth, currentDay - 1)
                const lastWeek = new Date(currentYear, currentMonth, currentDay - 7)
                const lastMonth = new Date(currentYear, currentMonth - 1, currentDay)

                switch (dateRangeFilter) {
                    case 'today':
                        matchesDate = userDate.getTime() === today.getTime()
                        break
                    case 'yesterday':
                        matchesDate = userDate.getTime() === yesterday.getTime()
                        break
                    case 'lastWeek':
                        matchesDate = userDate >= lastWeek
                        break
                    case 'lastMonth':
                        matchesDate = userDate >= lastMonth
                        break
                }
            }

            return matchesSearch && matchesRole && matchesStatus && matchesDate
        })

        // Apply sorting
        if (currentSortKey) {
            filtered.sort((a, b) => {
                let aValue: string | number = a[currentSortKey as keyof User]
                let bValue: string | number = b[currentSortKey as keyof User]

                // Handle date sorting
                if (currentSortKey === 'registeredOn') {
                    const [dayA, monthA, yearA] = (aValue as string).split('-')
                    const [dayB, monthB, yearB] = (bValue as string).split('-')
                    const monthMap: { [key: string]: number } = {
                        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
                        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
                    }
                    aValue = new Date(parseInt(yearA), monthMap[monthA], parseInt(dayA)).getTime()
                    bValue = new Date(parseInt(yearB), monthMap[monthB], parseInt(dayB)).getTime()
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

        setFilteredUsers(filtered)
        setCurrentPage(1)
    }, [users, searchTerm, roleFilter, statusFilter, dateRangeFilter, currentSortKey, currentDirection])

    // Pagination logic
    const totalPages = Math.ceil(filteredUsers.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    const currentUsers = filteredUsers.slice(startIndex, endIndex)

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
            setSelectedUsers(currentUsers.map(user => user.id))
        } else {
            setSelectedUsers([])
        }
    }

    const handleSelectUser = (userId: number, checked: boolean) => {
        if (checked) {
            setSelectedUsers([...selectedUsers, userId])
        } else {
            setSelectedUsers(selectedUsers.filter(id => id !== userId))
        }
    }

    // Action handlers
    const handleViewUser = (userId: number) => {
        console.log('View user:', userId)
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
                const response = await fetch('/api/users')
                const data = await response.json()
                setUsers(data.users)
                setFilteredUsers(data.users)
            } catch (error) {
                const staticData = require('@/data/userReportsData.json')
                setUsers(staticData.users)
                setFilteredUsers(staticData.users)
            }
        }
        await loadData()
    }

    const handleBulkDelete = () => {
        if (selectedUsers.length > 0) {
            // Remove selected users
            setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)))
            setFilteredUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)))
            setSelectedUsers([])
            console.log('Bulk deleted users:', selectedUsers)
        }
    }

    const handleClearSelection = () => {
        setSelectedUsers([])
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-[#00AA061A] text-[#00AA06]' // Light green background, dark green text
            case 'blocked':
                return 'bg-[#FF5F5F1A] text-[#FF5F5F]' // Light red background, dark red text
            case 'pending':
                return 'bg-[#FFF3CD] text-[#856404]' // Light yellow background, dark yellow text
            case 'inactive':
                return 'bg-[#F8F9FA] text-[#6C757D]' // Light gray background, dark gray text
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getRoleColor = (role: string) => {
        return role === 'Service Provider'
            ? 'bg-[#2525250A] text-[#252525]'
            : 'bg-[#2525250A] text-[#252525]'
    }

    const getStatusDot = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-[#00AA06]' // Dark green dot
            case 'blocked':
                return 'bg-[#FF5F5F]' // Dark red dot
            case 'pending':
                return 'bg-[#856404]' // Dark yellow dot
            case 'inactive':
                return 'bg-[#6C757D]' // Dark gray dot
            default:
                return 'bg-gray-600'
        }
    }

    return (
        <div className="border border-[#E8ECF4] bg-white rounded-[24px] py-6">
            {/* Table Controls */}
            <TableControls
                search={searchTerm}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
                searchPlaceholder="Search by Booking ID / Provider Name / Email"
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
                pageSizeOptions={[5, 10, 15, 20, 25, 50]}
                filters={[
                    {
                        options: ['All', 'Service Provider', 'Customer'],
                        selected: roleFilter === 'all' ? 'All' : roleFilter,
                        onChange: (value) => {
                            setRoleFilter(value === 'All' ? 'all' : value)
                        },
                        label: 'Role'
                    },
                    {
                        options: ['All', 'Active', 'Blocked', 'Pending'],
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
                selectedCount={selectedUsers.length}
                totalCount={filteredUsers.length}
                onBulkDelete={handleBulkDelete}
                onRefresh={handleRefresh}
                showBulkActions={true}
                onClearSelection={handleClearSelection}
                columns={columns}
                onColumnToggle={handleColumnToggle}
                data={filteredUsers}
                selectedData={currentUsers.filter(user => selectedUsers.includes(user.id))}
                exportFilename="user_reports"
            />

            {/* Table */}
            <div className="overflow-x-auto mt-3.5">
                <table className="min-w-[700px] sm:min-w-[800px] w-full text-nowrap">
                    <thead className='bg-[#F3F6F9]'>
                        <tr>
                            {columns.find(col => col.key === 'checkbox')?.visible && (
                                <th className="text-left py-[17px] pl-6 pr-4 w-16">
                                    <Checkbox
                                        checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                            )}
                            {columns.find(col => col.key === 'name')?.visible && (
                                <SortableHeader
                                    sortKey="name"
                                    currentSortKey={currentSortKey}
                                    currentDirection={currentDirection}
                                    onSort={handleSort}
                                    className="py-[17px] px-6"
                                >
                                    Name
                                </SortableHeader>
                            )}
                            {columns.find(col => col.key === 'email')?.visible && (
                                <SortableHeader
                                    sortKey="email"
                                    currentSortKey={currentSortKey}
                                    currentDirection={currentDirection}
                                    onSort={handleSort}
                                    className="py-[17px] px-6"
                                >
                                    Email
                                </SortableHeader>
                            )}
                            {columns.find(col => col.key === 'role')?.visible && (
                                <SortableHeader
                                    sortKey="role"
                                    currentSortKey={currentSortKey}
                                    currentDirection={currentDirection}
                                    onSort={handleSort}
                                    className="py-[17px] px-6"
                                >
                                    Role
                                </SortableHeader>
                            )}
                            {columns.find(col => col.key === 'registeredOn')?.visible && (
                                <SortableHeader
                                    sortKey="registeredOn"
                                    currentSortKey={currentSortKey}
                                    currentDirection={currentDirection}
                                    onSort={handleSort}
                                    className="py-[17px] px-6"
                                >
                                    Registered On
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
                                        <h3 className="text-[18px] leading-[24px] text-gray-900 mb-2 font-semibold">Loading users...</h3>
                                        <p className="text-[16px] leading-[20px] text-[#252525] font-normal">
                                            Please wait while we fetch the user data.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : currentUsers.length > 0 ? (
                            currentUsers.map((user) => (
                                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                                    {columns.find(col => col.key === 'checkbox')?.visible && (
                                        <td className="pl-6 pr-4 py-4 w-16">
                                            <Checkbox
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={(checked) => handleSelectUser(user.id, checked)}
                                            />
                                        </td>
                                    )}
                                    {columns.find(col => col.key === 'name')?.visible && (
                                        <td className="px-6 py-4 text-[14px] leading-[20px] font-medium text-[#252525]">{user.name}</td>
                                    )}
                                    {columns.find(col => col.key === 'email')?.visible && (
                                        <td className="px-6 py-4 text-[14px] leading-[20px] font-medium text-[#252525]">{user.email}</td>
                                    )}
                                    {columns.find(col => col.key === 'role')?.visible && (
                                        <td className="px-6 py-4">
                                            <span className={`px-3.5 py-1.5 rounded-full text-sm font-medium text-[14px] leading-[20px] text-[#252525] ${getRoleColor(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                    )}
                                    {columns.find(col => col.key === 'registeredOn')?.visible && (
                                        <td className="px-6 py-4 text-[14px] leading-[20px] font-medium text-[#252525]">{user.registeredOn}</td>
                                    )}
                                    {columns.find(col => col.key === 'status')?.visible && (
                                        <td className="px-6 py-4">
                                            <div className={`px-3.5 h-[32px] rounded-full w-fit ${getStatusColor(user.status)} flex items-center gap-2`}>
                                                <div className={`w-2 h-2 rounded-full ${getStatusDot(user.status)}`}></div>
                                                <span className='text-[14px] leading-[20px] font-medium'>{user.status}</span>
                                            </div>
                                        </td>
                                    )}
                                    {columns.find(col => col.key === 'action')?.visible && (
                                        <td className="px-6 py-4">
                                            <RippleButton
                                                onClick={() => handleViewUser(user.id)}
                                                className="h-[38px] w-[38px] border border-[#25252526] rounded-[11px] flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
                                            >
                                                <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5.28809 13.5527L12.1824 6.65844M6.34875 6.12811H11.9627C12.3769 6.12811 12.7127 6.4639 12.7127 6.87811V12.4921" stroke="#252525" strokeWidth="2" strokeLinecap="round" />
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
                                        No users match your current search criteria or filters. Try adjusting your search terms or filters.
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
    )
}

export default UserReportsTable