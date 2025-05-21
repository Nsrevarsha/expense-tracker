"use client";
import React from 'react';

function DatePicker({ value, onChange }) {
  const dateValue = value instanceof Date && !isNaN(value) 
    ? value.toISOString().split('T')[0] 
    : '';

  return (
    <input
      type="date"
      value={dateValue}
      onChange={(e) => {
        const date = new Date(e.target.value);
        if (!isNaN(date.getTime())) {
          onChange(date);
        }
      }}
      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  );
}

export default DatePicker;