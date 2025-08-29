"use client"
import React, { useState } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import FilterByDropdown from '@/components/ui/FilterByDropdown'

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

interface ChartData {
    month: string
    signups: number
}

const UserSignupsOverTime = () => {
    const [userFilter, setUserFilter] = useState('All Users')
    const [timeFilter, setTimeFilter] = useState('Daily')

    // Sample data matching the image
    const chartData: ChartData[] = [
        { month: 'APR', signups: 850 },
        { month: 'MAY', signups: 1200 },
        { month: 'JUN', signups: 300 },
        { month: 'JUL', signups: 800 },
        { month: 'AUG', signups: 550 },
        { month: 'SEP', signups: 1150 }
    ]

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
                cornerRadius: 2,
                displayColors: false,
                callbacks: {
                    title: (tooltipItems: any) => {
                        return `${tooltipItems[0].label}`
                    },
                    label: (tooltipItem: any) => {
                        return `${tooltipItem.parsed.y.toLocaleString()} signups`
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
                    color: '#6B7280',
                    font: {
                        size: 10
                    },
                    // padding: 8
                },
                border: {
                    display: false
                }
            },
            y: {
                grid: {
                    display: true,
                    color: '#F3F4F6',
                    drawBorder: false,
                    borderDash: [2, 2]
                },
                ticks: {
                    color: '#6B7280',
                    font: {
                        size: 10
                    },
                    padding: 8,
                    callback: (value: any) => {
                        if ([0, 400, 800, 1200, 1600].includes(value)) {
                            return value.toLocaleString()
                        }
                        return ''
                    }
                },
                border: {
                    display: false
                },
                beginAtZero: true,
                max: 1600,
                stepSize: 400
            }
        },
        elements: {
            point: {
                radius: 6,
                hoverRadius: 8,
                backgroundColor: 'white',
                borderColor: '#3A96AF',
                borderWidth: 3,
                hoverBorderWidth: 3
            },
            line: {
                tension: 0.4, // Smooth curve
                borderWidth: 3,
                borderColor: '#3A96AF',
                fill: true,
                backgroundColor: 'rgba(58, 150, 175, 0.1)'
            }
        },
        interaction: {
            intersect: false,
            mode: 'index' as const
        }
    }

    const data = {
        labels: chartData.map(d => d.month),
        datasets: [
            {
                label: 'User Signups',
                data: chartData.map(d => d.signups),
                fill: true,
                backgroundColor: 'rgba(58, 150, 175, 0.1)',
                borderColor: '#3A96AF',
                borderWidth: 2,
                pointBackgroundColor: '#3A96AF',
                pointBorderColor: '#3A96AF',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.2
            }
        ]
    }

    return (
        <div className="bg-white rounded-[22px] p-6 border border-[#E8ECF4]">
            {/* Header with title and filters */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] leading-[32px] font-semibold text-[#252525]">
                    User Signups Over Time
                </h3>

                <div className="flex gap-3">
                    {/* All Users Dropdown */}
                    <FilterByDropdown
                        options={['All Users', 'Service Providers', 'Customers', 'New Users']}
                        selected={userFilter}
                        onChange={setUserFilter}
                        label="All Users"
                    />

                    {/* Daily Dropdown */}
                    <FilterByDropdown
                        options={['Daily', 'Weekly', 'Monthly', 'Yearly']}
                        selected={timeFilter}
                        onChange={setTimeFilter}
                        label="Daily"
                    />
                </div>
            </div>

            {/* Chart Container */}
            <div className="h-[250px] w-full">
                <Line options={options} data={data} />
            </div>

        </div>
    )
}

export default UserSignupsOverTime