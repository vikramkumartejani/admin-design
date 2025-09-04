'use client'
import React, { useState } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import FilterByDropdown from '../ui/FilterByDropdown'

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

const BookingRevenueTrend = () => {
    const [timeFilter, setTimeFilter] = useState('Monthly')

    // Sample data matching the image exactly
    const chartData = {
        labels: ['APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP'],
        datasets: [
            {
                label: 'Bookings',
                data: [340, 250, 340, 230, 250, 250],
                backgroundColor: '#3A96AF',
                borderColor: '#3A96AF',
                borderWidth: 0,
                borderRadius: {
                    topLeft: 6,
                    topRight: 6,
                    bottomLeft: 0,
                    bottomRight: 0
                },
                borderSkipped: false,
                yAxisID: 'y',
            },
            {
                label: 'Revenue',
                data: [2900, 1800, 4200, 2800, 1800, 1800],
                backgroundColor: '#3A96AF4D',
                borderColor: '#7BC5D3',
                borderWidth: 0,
                borderRadius: {
                    topLeft: 6,
                    topRight: 6,
                    bottomLeft: 0,
                    bottomRight: 0
                },
                borderSkipped: false,
                yAxisID: 'y1',
            }
        ]
    }

    // Chart.js configuration
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, // Hide legend since we have it below
            },
            tooltip: {
                backgroundColor: 'rgba(58, 150, 175, 0.9)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: '#3A96AF',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                    title: (tooltipItems: any) => {
                        return `${tooltipItems[0].label}`
                    },
                    label: (tooltipItem: any) => {
                        if (tooltipItem.datasetIndex === 0) {
                            return `Bookings: ${tooltipItem.parsed.y}`
                        } else {
                            return `Revenue: $${(tooltipItem.parsed.y / 1000).toFixed(1)}K`
                        }
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: true,
                    color: '#F3F4F6',
                    drawBorder: false,
                    borderDash: [2, 2]
                },
                ticks: {
                    color: '#676D75',
                    font: {
                        size: 10
                    },
                    padding: 0
                },
                border: {
                    display: false
                }
            },
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                title: {
                    display: false,
                },
                grid: {
                    display: true,
                    color: '#F3F4F6',
                    drawBorder: false,
                    borderDash: [2, 2]
                },
                ticks: {
                    color: '#676D75',
                    font: {
                        size: 10
                    },
                    padding: 0,
                    callback: (value: any) => {
                        // Only show specific values: 0, 100, 200, 300, 400
                        if ([0, 100, 200, 300, 400].includes(value)) {
                            return value
                        }
                        return ''
                    }
                },
                border: {
                    display: false
                },
                beginAtZero: true,
                max: 400,
                stepSize: 100
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                title: {
                    display: false,
                },
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    color: '#676D75',
                    font: {
                        size: 10
                    },
                    padding: 0,
                    callback: (value: any) => {
                        if ([0, 2000, 4000, 6000, 8000].includes(value)) {
                            if (value >= 1000) {
                                return `${(value / 1000)}K`
                            }
                            return value
                        }
                        return ''
                    }
                },
                border: {
                    display: false
                },
                beginAtZero: true,
                max: 8000,
                stepSize: 2000
            }
        },
        interaction: {
            mode: 'index' as const,
            intersect: false,
        }
    }

    return (
        <div className="bg-white rounded-[22px] p-4.5 sm:p-6 border border-[#E8ECF4]">
            <div className="flex items-start sm:items-center justify-between sm:flex-row flex-col mb-4">
                <h3 className="text-[16px] leading-[32px] font-semibold text-[#252525]">
                    Booking & Revenue Trend
                </h3>

                <div className="flex gap-3">
                    <FilterByDropdown
                        options={['Daily', 'Weekly', 'Monthly', 'Yearly']}
                        selected={timeFilter}
                        onChange={setTimeFilter}
                        label="Monthly"
                    />
                </div>
            </div>

            {/* Chart Container */}
            <div className="relative">
                {/* Custom Left Y-axis Title */}
                <div className="absolute -left-2.5 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="flex items-center flex-col gap-1">
                        <div className="w-2 h-2 bg-[#3A96AF] rounded-full flex-shrink-0"></div>
                        <span className="text-[#676D75] text-[12px] font-medium" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                            Bookings
                        </span>
                    </div>
                </div>

                {/* Custom Right Y-axis Title */}
                <div className="absolute -right-2.5 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="flex items-center flex-col gap-1">
                        <div className="w-2 h-2 bg-[#3A96AF4D] rounded-full flex-shrink-0"></div>
                        <span className="text-[#676D75] text-[12px] font-medium" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                            Revenue
                        </span>
                    </div>
                </div>

                <div className="h-[250px] px-3 w-full">
                    <Bar options={options} data={chartData} />
                </div>
            </div>
        </div>
    )
}

export default BookingRevenueTrend