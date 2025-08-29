import React from 'react'
import Cards from './Cards'
import UserSignupsOverTime from './UserSignupsOverTime'
import UserReportsTable from './UserReportsTable'

const UserReports = () => {
    return (
        <div className='max-w-[1138px] w-full mx-auto'>
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-[24px] leading-[38px] font-semibold text-[#252525] tracking-[-1px]">User Reports</h2>
            </div>
            <div className='grid grid-cols-2 gap-3.5 mb-3.5'>
                <Cards />
                <UserSignupsOverTime />
            </div>
            <UserReportsTable />
        </div>
    )
}

export default UserReports