import React, { useState } from "react";

function Calendar({ onSelect }) {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const prevMonth = new Date(prev);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      return prevMonth;
    });
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const nextMonth = new Date(prev);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return nextMonth;
    });
    setSelectedDay(null);
  };

  const handleDayClick = (day, isCurrentMonth) => {
    if (isCurrentMonth) {
      setSelectedDay(day);
      if (onSelect) {
        // Format the date in ISO format which is more standardized for database storage
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // Adding 1 because getMonth() is zero-based
        const formattedMonth = month < 10 ? `0${month}` : month;
        const formattedDay = day < 10 ? `0${day}` : day;
        
        // Use ISO format for consistency - This is clearer for debugging
        const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;
        
        console.log("Calendar component selected date (ISO format):", formattedDate); 
        onSelect(formattedDate);
      }
    }
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Previous month's days
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
    
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <div 
          key={`prev-${daysInPrevMonth - i}`} 
          className="text-gray-300 text-center py-1 cursor-pointer"
          onClick={() => handleDayClick(daysInPrevMonth - i, false)}
        >
          {daysInPrevMonth - i}
        </div>
      );
    }
    
    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = new Date().getDate() === i && 
                      new Date().getMonth() === month && 
                      new Date().getFullYear() === year;
      const isSelected = selectedDay === i;
      
      days.push(
        <div 
          key={`current-${i}`} 
          className={`text-center py-1 cursor-pointer 
                     ${isToday ? 'bg-cyan-100 text-cyan-700' : ''} 
                     ${isSelected ? 'bg-cyan-500 text-white rounded-full' : ''}`}
          onClick={() => handleDayClick(i, true)}
        >
          {i}
        </div>
      );
    }
    
    // Next month's days
    const totalCells = 42; // 6 rows of 7 days
    const nextDays = totalCells - days.length;
    
    for (let i = 1; i <= nextDays; i++) {
      days.push(
        <div 
          key={`next-${i}`} 
          className="text-gray-300 text-center py-1 cursor-pointer"
          onClick={() => handleDayClick(i, false)}
        >
          {i}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="bg-white rounded-lg w-[300px]">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={handlePrevMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          &lt;
        </button>
        <div className="font-semibold">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        <button 
          onClick={handleNextMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          &gt;
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {weekdays.map(day => (
          <div key={day} className="text-center font-semibold text-xs py-1">
            {day}
          </div>
        ))}
        
        {renderCalendarDays()}
      </div>
    </div>
  );
}

export default Calendar;