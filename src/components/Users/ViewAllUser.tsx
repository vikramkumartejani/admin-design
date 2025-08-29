"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import RippleButton from "@/components/ui/button"
import SearchInput from "@/components/ui/SearchInput"
import FilterByDropdown from "@/components/ui/FilterByDropdown"
import Pagination from "@/components/ui/Pagination"
import Checkbox from "@/components/ui/Checkbox"
import { Eye, Download, UserX, Key } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import SortableHeader from "@/components/ui/SortableHeader"
import MoreVertical from '@/svgIcons/MoreVertical'
import ConfirmationModal from "@/components/ui/ConfirmationModal"
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

const ViewAllUser = () => {
    const [users, setUsers] = useState<User[]>([])
    const [filteredUsers, setFilteredUsers] = useState<User[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedUsers, setSelectedUsers] = useState<number[]>([])
    const [currentSortKey, setCurrentSortKey] = useState<string>("")
    const [currentDirection, setCurrentDirection] = useState<SortDirection>('asc')
    const [isLoading, setIsLoading] = useState(true)
    const [openPopoverId, setOpenPopoverId] = useState<number | null>(null)
    const [showBlockModal, setShowBlockModal] = useState(false)
    const [showResetModal, setShowResetModal] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
    const [pageSize, setPageSize] = useState(10)
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
                const staticData = require('@/data/viewAllUserData.json')
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
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesRole = roleFilter === 'all' || user.role === roleFilter
            const matchesStatus = statusFilter === 'all' ||
                user.status.toLowerCase() === statusFilter.toLowerCase()

            return matchesSearch && matchesRole && matchesStatus
        })

        // Apply sorting
        if (currentSortKey) {
            filtered.sort((a, b) => {
                let aValue: string | number = a[currentSortKey as keyof User]
                let bValue: string | number = b[currentSortKey as keyof User]

                // Handle date sorting
                if (currentSortKey === 'registeredOn') {
                    aValue = new Date(aValue as string).getTime()
                    bValue = new Date(bValue as string).getTime()
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
    }, [users, searchTerm, roleFilter, statusFilter, currentSortKey, currentDirection])

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

    const handleBlockUser = (userId: number) => {
        setSelectedUserId(userId)
        setShowBlockModal(true)
        setOpenPopoverId(null) // Close popover
    }

    const handleResetPassword = (userId: number) => {
        setSelectedUserId(userId)
        setShowResetModal(true)
        setOpenPopoverId(null) // Close popover
    }

    const confirmBlockUser = () => {
        if (selectedUserId) {
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === selectedUserId
                        ? { ...user, status: user.status === 'Blocked' ? 'Active' : 'Blocked' }
                        : user
                )
            )

            setFilteredUsers(prevFiltered =>
                prevFiltered.map(user =>
                    user.id === selectedUserId
                        ? { ...user, status: user.status === 'Blocked' ? 'Active' : 'Blocked' }
                        : user
                )
            )

            console.log('User status changed:', selectedUserId)
        }
        setShowBlockModal(false)
        setSelectedUserId(null)
    }

    const confirmResetPassword = () => {
        if (selectedUserId) {
            console.log('Reset password for user:', selectedUserId)
            // Add your reset password logic here
        }
        setShowResetModal(false)
        setSelectedUserId(null)
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
                const staticData = require('@/data/viewAllUserData.json')
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

    const handleExportCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8," +
            "Name,Email,Role,Status,Registered On,Phone,Location,Last Active,Services,Rating\n" +
            filteredUsers.map(user =>
                `${user.name},${user.email},${user.role},${user.status},${user.registeredOn},${user.phone},${user.location},${user.lastActive},${user.services},${user.rating}`
            ).join("\n")

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", "users.csv")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
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
        <div className='max-w-[1138px] w-full mx-auto'>
            <div className="">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[24px] leading-[38px] font-semibold text-[#252525] tracking-[-1px]">All Users</h2>
                </div>

                <div className="border border-[#E8ECF4] bg-white rounded-[24px] py-6">
                    {/* Table Controls */}
                    <TableControls
                        search={searchTerm}
                        onSearchChange={(e) => setSearchTerm(e.target.value)}
                        searchPlaceholder="Search by Name, Email"
                        pageSize={pageSize}
                        onPageSizeChange={handlePageSizeChange}
                        pageSizeOptions={[5, 10, 15, 20, 25, 50]}
                        filters={[
                            {
                                options: ['All', 'Service Provider', 'Customer'],
                                selected: roleFilter === 'all' ? 'All' : roleFilter,
                                onChange: (value) => {
                                    console.log('Role filter changed from', roleFilter, 'to', value);
                                    setRoleFilter(value === 'All' ? 'all' : value);
                                },
                                label: 'Role'
                            },
                            {
                                options: ['All', 'Active', 'Blocked', 'Pending'],
                                selected: statusFilter === 'all' ? 'All' : statusFilter,
                                onChange: (value) => {
                                    console.log('Status filter changed from', statusFilter, 'to', value);
                                    setStatusFilter(value === 'All' ? 'all' : value);
                                },
                                label: 'Status'
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
                        exportFilename="users"
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
                                        <td colSpan={7} className="py-10">
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
                                                    <div className="flex items-center gap-2">
                                                        <RippleButton
                                                            onClick={() => handleViewUser(user.id)}
                                                            className="h-[38px] w-[38px] border border-[#25252526] rounded-[11px] flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
                                                        >
                                                            <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M11.6849 9.8404C11.6849 11.3254 10.4849 12.5254 8.99994 12.5254C7.51494 12.5254 6.31494 11.3254 6.31494 9.8404C6.31494 8.3554 7.51494 7.1554 8.99994 7.1554C10.4849 7.1554 11.6849 8.3554 11.6849 9.8404Z" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                <path d="M8.99988 16.0429C11.6474 16.0429 14.1149 14.4829 15.8324 11.7829C16.5074 10.7254 16.5074 8.9479 15.8324 7.8904C14.1149 5.1904 11.6474 3.6304 8.99988 3.6304C6.35238 3.6304 3.88488 5.1904 2.16738 7.8904C1.49238 8.9479 1.49238 10.7254 2.16738 11.7829C3.88488 14.4829 6.35238 16.0429 8.99988 16.0429Z" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </RippleButton>
                                                        <Popover
                                                            open={openPopoverId === user.id}
                                                            onOpenChange={(open) => setOpenPopoverId(open ? user.id : null)}
                                                        >
                                                            <PopoverTrigger asChild>
                                                                <RippleButton
                                                                    className={`h-[38px] w-[38px] border border-[#25252526] rounded-[11px] flex items-center justify-center hover:bg-gray-100 transition-colors duration-200 ${openPopoverId === user.id ? 'border-black' : ''}`}
                                                                >
                                                                    <MoreVertical />
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
                                                                        onClick={() => handleBlockUser(user.id)}
                                                                    >
                                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M6.875 5.3125C6.875 6.1413 7.20424 6.93616 7.79029 7.52221C8.37634 8.10826 9.1712 8.4375 10 8.4375C10.8288 8.4375 11.6237 8.10826 12.2097 7.52221C12.7958 6.93616 13.125 6.1413 13.125 5.3125C13.125 4.4837 12.7958 3.68884 12.2097 3.10279C11.6237 2.51674 10.8288 2.1875 10 2.1875C9.1712 2.1875 8.37634 2.51674 7.79029 3.10279C7.20424 3.68884 6.875 4.4837 6.875 5.3125Z" stroke="#252525" strokeWidth="1.25" />
                                                                            <path d="M12.3438 11.0368C11.62 10.872 10.8288 10.7812 10 10.7812C6.54822 10.7812 3.75 12.3552 3.75 14.2969C3.75 16.2385 3.75 17.8125 10 17.8125C14.4433 17.8125 15.7277 17.017 16.0991 15.8594" stroke="#252525" strokeWidth="1.25" />
                                                                            <path d="M12.4777 15.3347C13.0433 15.9002 13.8245 16.25 14.6875 16.25C16.4134 16.25 17.8125 14.8509 17.8125 13.125C17.8125 12.262 17.4627 11.4808 16.8972 10.9152M12.4777 15.3347C11.9123 14.7691 11.5625 13.988 11.5625 13.125C11.5625 11.3991 12.9616 10 14.6875 10C15.5505 10 16.3316 10.3498 16.8972 10.9152M12.4777 15.3347L16.8972 10.9152" stroke="#252525" strokeWidth="1.25" strokeLinejoin="round" />
                                                                        </svg>
                                                                        {user.status === 'Blocked' ? 'Unblock user' : 'Block user'}
                                                                    </RippleButton>
                                                                    <RippleButton
                                                                        className="w-full flex items-center justify-start gap-2.5 hover:bg-[#4862841A] text-[14px] leading-[20px] font-medium text-[#252525] px-2.5 py-2 rounded-lg transition-colors duration-200"
                                                                        onClick={() => handleResetPassword(user.id)}
                                                                    >
                                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M6.875 8.4375V6.875C6.875 4.71797 7.84297 2.96875 10 2.96875C12.157 2.96875 13.125 4.71797 13.125 6.875V8.4375M10 12.9297V12.5391M13.125 12.9297V12.5391M6.875 12.9297V12.5391M3.35938 14.5312V10.9375C3.35938 10.0625 3.35937 9.625 3.52969 9.29141C3.67935 8.99713 3.91839 8.75782 4.2125 8.60781C4.54688 8.43828 4.98438 8.43828 5.85938 8.43828H14.1406C15.0156 8.43828 15.4531 8.43828 15.7875 8.60781C16.0815 8.75761 16.3205 8.99663 16.4703 9.29062C16.6406 9.625 16.6406 10.0625 16.6406 10.9375V14.5312C16.6406 15.4062 16.6406 15.8438 16.4703 16.1781C16.3205 16.4721 16.0815 16.7111 15.7875 16.8609C15.4531 17.0312 15.0156 17.0312 14.1406 17.0312H5.85938C4.98438 17.0312 4.54688 17.0312 4.2125 16.8609C3.91851 16.7111 3.67949 16.4721 3.52969 16.1781C3.35937 15.8445 3.35938 15.407 3.35938 14.5312Z" stroke="#252525" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                                                        </svg>
                                                                        Reset Password
                                                                    </RippleButton>
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
            </div>

            {/* Block User Confirmation Modal */}
            <ConfirmationModal
                isOpen={showBlockModal}
                onClose={() => setShowBlockModal(false)}
                onConfirm={confirmBlockUser}
                title={`${users.find(u => u.id === selectedUserId)?.status === 'Blocked' ? 'Unblock this user?' : 'Block this user?'}`}
                description={`${users.find(u => u.id === selectedUserId)?.status === 'Blocked'
                    ? 'Unblocking this user will allow them to access the platform again.'
                    : 'Blocking this user will prevent them from accessing the platform.'
                    }`}
                confirmText="Confirm"
                cancelText="Cancel"
                icon={
                    <svg width="49" height="48" viewBox="0 0 49 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" width="48" height="48" rx="24" fill="#3A96AF" fillOpacity="0.15" />
                        <path d="M20 16.5C20 17.8261 20.5268 19.0979 21.4645 20.0355C22.4021 20.9732 23.6739 21.5 25 21.5C26.3261 21.5 27.5979 20.9732 28.5355 20.0355C29.4732 19.0979 30 17.8261 30 16.5C30 15.1739 29.4732 13.9021 28.5355 12.9645C27.5979 12.0268 26.3261 11.5 25 11.5C23.6739 11.5 22.4021 12.0268 21.4645 12.9645C20.5268 13.9021 20 15.1739 20 16.5Z" fill="#3A96AF" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M32.5 28.6875C30.9468 28.6875 29.6875 29.9468 29.6875 31.5C29.6875 31.9341 29.7859 32.3454 29.9616 32.7125L33.7126 28.9616C33.3454 28.7859 32.9342 28.6875 32.5 28.6875ZM35.0384 30.2874L31.2874 34.0384C31.6545 34.2141 32.0658 34.3125 32.5 34.3125C34.0532 34.3125 35.3125 33.0532 35.3125 31.5C35.3125 31.0658 35.2141 30.6546 35.0384 30.2874ZM27.8125 31.5C27.8125 28.9111 29.9111 26.8125 32.5 26.8125C35.0889 26.8125 37.1875 28.9111 37.1875 31.5C37.1875 34.0889 35.0889 36.1875 32.5 36.1875C29.9111 36.1875 27.8125 34.0889 27.8125 31.5Z" fill="#3A96AF" />
                        <path d="M29.1584 25.8511C27.2301 26.9941 25.9375 29.0962 25.9375 31.5002C25.9375 32.8368 26.3371 34.0801 27.0234 35.1171C26.3739 35.205 25.6965 35.2515 25 35.2515C20.1675 35.2515 16.25 33.0128 16.25 30.2515C16.25 27.49 20.1675 25.2515 25 25.2515C26.5051 25.2515 27.9215 25.4686 29.1584 25.8511Z" fill="#3A96AF" />
                    </svg>
                }
            />

            {/* Reset Password Confirmation Modal */}
            <ConfirmationModal
                isOpen={showResetModal}
                onClose={() => setShowResetModal(false)}
                onConfirm={confirmResetPassword}
                title="Reset Password"
                description="A reset password link will be sent to the user's registered email."
                confirmText="Confirm"
                cancelText="Cancel"
                icon={
                    <svg width="49" height="48" viewBox="0 0 49 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" width="48" height="48" rx="24" fill="#3A96AF" fillOpacity="0.15" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M16.5625 21.5682V19C16.5625 14.3401 20.3401 10.5625 25 10.5625C29.6599 10.5625 33.4375 14.3401 33.4375 19V21.5682C34.831 21.6724 35.7384 21.935 36.4016 22.5984C37.5 23.6968 37.5 25.4645 37.5 29C37.5 32.5355 37.5 34.3032 36.4016 35.4016C35.3032 36.5 33.5355 36.5 30 36.5H20C16.4645 36.5 14.6967 36.5 13.5984 35.4016C12.5 34.3032 12.5 32.5355 12.5 29C12.5 25.4645 12.5 23.6968 13.5984 22.5984C14.2616 21.935 15.1691 21.6724 16.5625 21.5682ZM18.4375 19C18.4375 15.3756 21.3756 12.4375 25 12.4375C28.6244 12.4375 31.5625 15.3756 31.5625 19V21.5045C31.0837 21.5 30.5644 21.5 30 21.5H20C19.4356 21.5 18.9163 21.5 18.4375 21.5045V19ZM20 30.25C20.6903 30.25 21.25 29.6904 21.25 29C21.25 28.3096 20.6903 27.75 20 27.75C19.3096 27.75 18.75 28.3096 18.75 29C18.75 29.6904 19.3096 30.25 20 30.25ZM25 30.25C25.6904 30.25 26.25 29.6904 26.25 29C26.25 28.3096 25.6904 27.75 25 27.75C24.3096 27.75 23.75 28.3096 23.75 29C23.75 29.6904 24.3096 30.25 25 30.25ZM31.25 29C31.25 29.6904 30.6904 30.25 30 30.25C29.3096 30.25 28.75 29.6904 28.75 29C28.75 28.3096 29.3096 27.75 30 27.75C30.6904 27.75 31.25 28.3096 31.25 29Z" fill="#3A96AF" />
                    </svg>
                }
            />
        </div>
    )
}

export default ViewAllUser