"use client"

import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DatePickerProps {
      isOpen: boolean
      onClose: () => void
      currentDate: Date
      onDateSelect: (day: number, isEducation: boolean, isStartDate: boolean) => void
      isEducation: boolean
      isStartDate: boolean
      onPrevMonth: (isEducation: boolean) => void
      onNextMonth: (isEducation: boolean) => void
}

const DatePicker: React.FC<DatePickerProps> = ({
      isOpen,
      onClose,
      currentDate,
      onDateSelect,
      isEducation,
      isStartDate,
      onPrevMonth,
      onNextMonth
}) => {
      if (!isOpen) return null

      const getDaysInMonth = (date: Date) => {
            const year = date.getFullYear()
            const month = date.getMonth()
            const firstDay = new Date(year, month, 1)
            const lastDay = new Date(year, month + 1, 0)
            const daysInMonth = lastDay.getDate()
            const startingDay = firstDay.getDay()

            return { daysInMonth, startingDay }
      }

      const { daysInMonth, startingDay } = getDaysInMonth(currentDate)
      const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
      ]

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const days = []
      for (let i = 0; i < startingDay; i++) {
            days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>)
      }

      for (let day = 1; day <= daysInMonth; day++) {
            days.push(
                  <button
                        key={day}
                        onClick={() => onDateSelect(day, isEducation, isStartDate)}
                        className="w-8 h-8 flex items-center justify-center text-sm rounded transition-colors hover:bg-[#3A96AF] hover:text-white cursor-pointer"
                  >
                        {day}
                  </button>
            )
      }

      return (
            <>
                  <div
                        className="fixed inset-0 z-[60] bg-transparent"
                        onClick={onClose}
                  />
                  <div className="fixed z-[70] bg-white border border-[#E8ECF4] rounded-xl shadow-lg p-4 min-w-[280px] transform -translate-x-1/2 left-1/2 top-1/2">
                        <div className="flex items-center justify-between mb-4">
                              <button
                                    onClick={() => onPrevMonth(isEducation)}
                                    className="p-1 hover:bg-gray-100 rounded"
                              >
                                    <ChevronLeft size={16} />
                              </button>
                              <h3 className="font-medium">
                                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                              </h3>
                              <button
                                    onClick={() => onNextMonth(isEducation)}
                                    className="p-1 hover:bg-gray-100 rounded"
                              >
                                    <ChevronRight size={16} />
                              </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 mb-2">
                              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className="w-8 h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                                          {day}
                                    </div>
                              ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                              {days}
                        </div>
                  </div>
            </>
      )
}

export default DatePicker