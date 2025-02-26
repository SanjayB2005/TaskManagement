import React, { useState, useRef, useEffect } from 'react';
import Calendar from './Calendar';

function DateInput({ id, value, onChange, placeholder = "Select date..." }) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value || '');
  const dateInputRef = useRef(null);

  const handleInputClick = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
    if (onChange) {
      onChange(date);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateInputRef.current && !dateInputRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dateInputRef}>
      <div className="relative">
        <input
          id={id}
          type="text"
          value={selectedDate}
          readOnly
          placeholder={placeholder}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
          onClick={handleInputClick}
        />
        <button
          type="button"
          onClick={handleInputClick}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>
      
      {isCalendarOpen && (
        <div className="absolute mt-1 z-50">
          <Calendar onSelect={handleDateSelect} />
        </div>
      )}
    </div>
  );
}

export default DateInput;