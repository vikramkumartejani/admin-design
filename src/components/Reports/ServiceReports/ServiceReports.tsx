import React from 'react'
import Cards from './Cards'
import UserSignupsOverTime from './UserSignupsOverTime'
import RevenueByProvider from './RevenueByProvider'
import ServiceListings from './ServiceListings'

const ServiceReports = () => {
    return (
        <div className='space-y-3.5 max-w-[1138px] w-full mx-auto'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-6'>
                <Cards />
                <UserSignupsOverTime />
            </div>
            <RevenueByProvider />
            <ServiceListings />
        </div>
    )
}

export default ServiceReports