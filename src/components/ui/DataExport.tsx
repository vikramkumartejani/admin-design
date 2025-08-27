"use client"
import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'

interface DataExportProps {
    data: any[]
    selectedData?: any[]
    filename: string
    columns: { key: string; label: string; visible: boolean }[]
    className?: string
}

const DataExport: React.FC<DataExportProps> = ({
    data,
    selectedData = [],
    filename,
    columns,
    className = ""
}) => {
    const [open, setOpen] = useState(false)

    const getVisibleColumns = () => columns.filter(col => 
        col.visible && 
        col.key !== 'actions' && 
        col.key !== 'checkbox' &&
        col.label !== 'Select' &&
        col.label !== 'Actions' &&
        col.label !== 'Action'
    )

    const getDataToExport = () => {
        return selectedData.length > 0 ? selectedData : data
    }

    const getNestedValue = (obj: any, path: string) => {
        if (!obj || !path) return ''
        try {
            return path.split('.').reduce((current, key) => current?.[key], obj) || ''
        } catch (error) {
            return ''
        }
    }

    const formatValue = (item: any, col: any) => {
        let value = getNestedValue(item, col.key)
        
        switch (col.key) {
            case 'client.name':
                value = item.client?.name || ''
                break
            case 'customer.name':
                value = item.customer?.name || ''
                break
            case 'pricing.basePrice':
                if (item.pricing) {
                    value = `${item.pricing.basePrice} ${item.pricing.currency}`
                }
                break
            case 'price':
                if (item.pricing?.basePrice && item.pricing?.currency) {
                    value = `${item.pricing.basePrice} ${item.pricing.currency.toUpperCase()}`
                } else {
                    value = item.price || ''
                }
                break
            case 'serviceTitle':
                value = item.serviceTitle || item.service || ''
                break
            case 'service':
                value = item.service || item.serviceTitle || ''
                break
            case 'offeringType':
                value = item.offeringType ? item.offeringType.charAt(0).toUpperCase() + item.offeringType.slice(1) : 'N/A'
                break
            case 'rating':
                value = item.rating ? `⭐ ${item.rating}` : 'N/A'
                break
            case 'totalReviews':
                value = item.totalReviews || 0
                break
            case 'completedOrders':
                value = item.completedOrders || 0
                break
            default:
                break
        }
        
        return value || ''
    }

    const exportToCSV = () => {
        const visibleColumns = getVisibleColumns()
        const dataToExport = getDataToExport()
        
        if (dataToExport.length === 0) {
            alert('No data to export')
            return
        }

        try {
            const headers = visibleColumns.map(col => col.label).join(',')
            const rows = dataToExport.map(item => {
                return visibleColumns.map(col => {
                    let value = formatValue(item, col)
                    
                    value = String(value)
                    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                        value = `"${value.replace(/"/g, '""')}"`
                    }
                    
                    return value
                }).join(',')
            })

            const csvContent = [headers, ...rows].join('\n')
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const link = document.createElement('a')
            const url = URL.createObjectURL(blob)
            link.setAttribute('href', url)
            link.setAttribute('download', `${filename}.csv`)
            link.style.visibility = 'hidden'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            
            setOpen(false)
        } catch (error) {
            console.error('Error generating CSV:', error)
            alert('Error generating CSV file. Please try again.')
        }
    }

    const exportToExcel = async () => {
        const visibleColumns = getVisibleColumns()
        const dataToExport = getDataToExport()
        
        if (dataToExport.length === 0) {
            alert('No data to export')
            return
        }

        try {
            const XLSX = await import('xlsx')
            const worksheetData = dataToExport.map(item => {
                const row: any = {}
                visibleColumns.forEach(col => {
                    const value = formatValue(item, col)
                    row[col.label] = value
                })
                return row
            })

            const workbook = XLSX.utils.book_new()
            const worksheet = XLSX.utils.json_to_sheet(worksheetData)
            const colWidths = visibleColumns.map(col => {
                const maxLength = Math.max(
                    col.label.length,
                    ...dataToExport.map(item => String(formatValue(item, col)).length)
                )
                return { wch: Math.min(Math.max(maxLength, 10), 50) } // Min 10, max 50 characters
            })
            worksheet['!cols'] = colWidths
            
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')
            
            XLSX.writeFile(workbook, `${filename}.xlsx`)
            setOpen(false)
        } catch (error) {
            console.error('Error generating Excel file:', error)
            alert('Error generating Excel file. Please install the xlsx package or try again.')
        }
    }

    const exportToPDF = async () => {
        const visibleColumns = getVisibleColumns()
        const dataToExport = getDataToExport()
        
        if (dataToExport.length === 0) {
            alert('No data to export')
            return
        }

        try {
            const jsPDF = (await import('jspdf')).default
            const autoTable = (await import('jspdf-autotable')).default
            const doc = new jsPDF()
            
            doc.setFontSize(16)
            doc.text(filename.charAt(0).toUpperCase() + filename.slice(1), 14, 22)
            
            const tableHeaders = visibleColumns.map(col => col.label)
            const tableRows = dataToExport.map(item => {
                return visibleColumns.map(col => {
                    const value = formatValue(item, col)
                    return String(value)
                })
            })

            autoTable(doc, {
                head: [tableHeaders],
                body: tableRows,
                startY: 30,
                styles: {
                    fontSize: 8,
                    cellPadding: 2,
                },
                headStyles: {
                    fillColor: [58, 150, 175],
                    textColor: 255,
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [247, 248, 249]
                },
                columnStyles: {},
                margin: { top: 30 }
            })
            
            doc.save(`${filename}.pdf`)
            setOpen(false)
        } catch (error) {
            console.error('Error generating PDF:', error)
            alert('Error generating PDF. Please install the required packages or try again.')
        }
    }

    const handlePrint = () => {
        const visibleColumns = getVisibleColumns()
        const dataToExport = getDataToExport()
        
        if (dataToExport.length === 0) {
            alert('No data to print')
            return
        }

        try {
            const printWindow = window.open('', '_blank')
            if (!printWindow) {
                alert('Please allow popups to enable printing')
                return
            }

            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${filename}</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 20px;
                            color: #333;
                        }
                        h1 {
                            color: #252525;
                            margin-bottom: 20px;
                            font-size: 24px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 20px;
                        }
                        th, td {
                            border: 1px solid #ddd;
                            padding: 8px;
                            text-align: left;
                            font-size: 12px;
                            word-wrap: break-word;
                        }
                        th {
                            background-color: #3A96AF;
                            color: white;
                            font-weight: bold;
                        }
                        tr:nth-child(even) {
                            background-color: #f7f8f9;
                        }
                        .print-info {
                            margin-bottom: 20px;
                            font-size: 14px;
                            color: #666;
                        }
                        @media print {
                            body {
                                margin: 0;
                            }
                            .print-info {
                                display: none;
                            }
                            table {
                                font-size: 10px;
                            }
                            th, td {
                                padding: 4px;
                            }
                        }
                    </style>
                </head>
                <body>
                    <h1>${filename.charAt(0).toUpperCase() + filename.slice(1)}</h1>
                    <div class="print-info">
                        Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
                        <br>
                        Total records: ${dataToExport.length}
                    </div>
                    <table>
                        <thead>
                            <tr>
                                ${visibleColumns.map(col => `<th>${col.label}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${dataToExport.map(item => `
                                <tr>
                                    ${visibleColumns.map(col => {
                                        const value = formatValue(item, col)
                                        return `<td>${String(value).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>`
                                    }).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
                </html>
            `

            printWindow.document.write(htmlContent)
            printWindow.document.close()

            printWindow.onload = () => {
                printWindow.print()
                printWindow.close()
            }

            setOpen(false)
        } catch (error) {
            console.error('Error generating print view:', error)
            alert('Error generating print view. Please try again.')
        }
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <button className={`cursor-pointer text-[#00AA06] border border-[#00AA06] p-1.5 sm:p-2 text-nowrap rounded-[8px] flex items-center gap-1 text-[11px] sm:text-[12px] leading-[16px] font-medium tracking-[0.3px] hover:bg-[#009905]/10 transition-colors ${className}`}>
                                <span className='w-[18px] h-[18px]'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download-icon lucide-download"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg></span>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-4 bg-white border border-[#E8ECF4] rounded-lg shadow-lg">
                            <div>
                                <h3 className="text-[16px] font-medium text-[#252525] mb-2">Export Options</h3>
                                <p className="text-[12px] text-[#676D75] mb-1">
                                    {selectedData.length > 0 
                                        ? `Exporting ${selectedData.length} selected items`
                                        : `Exporting all ${data.length} items`
                                    }
                                </p>
                                <button
                                    onClick={exportToCSV}
                                    className="cursor-pointer w-full flex items-center gap-2 px-3 py-2 text-[14px] text-[#252525] hover:bg-[#F7F8F9] rounded-lg transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    CSV
                                </button>
                                <button
                                    onClick={exportToPDF}
                                    className="cursor-pointer w-full flex items-center gap-2 px-3 py-2 text-[14px] text-[#252525] hover:bg-[#F7F8F9] rounded-lg transition-colors"
                                >
                                    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5 4H15V8H19V20H5V4ZM3.9985 2C3.44749 2 3 2.44405 3 2.9918V21.0082C3 21.5447 3.44476 22 3.9934 22H20.0066C20.5551 22 21 21.5489 21 20.9925L20.9997 7L16 2H3.9985ZM10.4999 7.5C10.4999 9.07749 10.0442 10.9373 9.27493 12.6534C8.50287 14.3757 7.46143 15.8502 6.37524 16.7191L7.55464 18.3321C10.4821 16.3804 13.7233 15.0421 16.8585 15.49L17.3162 13.5513C14.6435 12.6604 12.4999 9.98994 12.4999 7.5H10.4999ZM11.0999 13.4716C11.3673 12.8752 11.6042 12.2563 11.8037 11.6285C12.2753 12.3531 12.8553 13.0182 13.5101 13.5953C12.5283 13.7711 11.5665 14.0596 10.6352 14.4276C10.7999 14.1143 10.9551 13.7948 11.0999 13.4716Z"></path></svg>
                                    PDF
                                </button>
                                <button
                                    onClick={exportToExcel}
                                    className="cursor-pointer w-full flex items-center gap-2 px-3 py-2 text-[14px] text-[#252525] hover:bg-[#F7F8F9] rounded-lg transition-colors"
                                >
                                    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2.85858 2.87732L15.4293 1.0815C15.7027 1.04245 15.9559 1.2324 15.995 1.50577C15.9983 1.52919 16 1.55282 16 1.57648V22.4235C16 22.6996 15.7761 22.9235 15.5 22.9235C15.4763 22.9235 15.4527 22.9218 15.4293 22.9184L2.85858 21.1226C2.36593 21.0522 2 20.6303 2 20.1327V3.86727C2 3.36962 2.36593 2.9477 2.85858 2.87732ZM4 4.73457V19.2654L14 20.694V3.30599L4 4.73457ZM17 19H20V4.99997H17V2.99997H21C21.5523 2.99997 22 3.44769 22 3.99997V20C22 20.5523 21.5523 21 21 21H17V19ZM10.2 12L13 16H10.6L9 13.7143L7.39999 16H5L7.8 12L5 7.99997H7.39999L9 10.2857L10.6 7.99997H13L10.2 12Z"></path></svg>
                                    Excel
                                </button>
                                <button
                                    onClick={handlePrint}
                                    className="cursor-pointer w-full flex items-center gap-2 px-3 py-2 text-[14px] text-[#252525] hover:bg-[#F7F8F9] rounded-lg transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M6 9V2H18V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M6 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V11C2 10.4696 2.21071 9.96086 2.58579 9.58579C2.96086 9.21071 3.46957 9 4 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V16C22 16.5304 21.7893 17.0391 21.4142 17.4142C21.0391 17.7893 20.5304 18 20 18H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M18 14H6V22H18V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Print
                                </button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </TooltipTrigger>
            <TooltipContent side="top">
                Export
            </TooltipContent>
        </Tooltip>
    )
}

export default DataExport