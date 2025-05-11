'use client';

import { useEffect, useState } from 'react';
import { prisma } from '@/lib/prisma';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function TailwindCalendar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Calendar state
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Fetch announcements from API
  async function fetchAnnouncements() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/announcements');
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch announcements: ${res.status} ${errorText}`);
      }
      const data: { announcements: Announcement[] } = await res.json();
      setAnnouncements(data.announcements);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Days in month and first day of week
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  // Generate calendar days with padding for first day
  const calendarDays = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Navigation handlers
  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }
  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }
  function selectDate(day: number) {
    setSelectedDate(new Date(year, month, day));
  }

  // Check if day is today
  function isToday(day: number) {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  }

  // Check if day is selected
  function isSelected(day: number) {
    return (
      selectedDate !== null &&
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    );
  }

  return ( 
    <div className='flex w-full flex-col md:w-md items-start justify-items-start' >
  <h1 className="text-2xl font-extrabold mb-6 text-emerald-600 drop-shadow-lg">
  Calendar
</h1>
<div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 w-full max-w-sm mx-auto p-4 rounded-lg shadow-lg text-white">
  {/* Header: Month, Year and Navigation */}
 
  <div className="flex items-center justify-between mb-4">
    <button
      onClick={prevMonth}
      className="p-2 rounded-full bg-blue-700 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      aria-label="Previous Month"
      type="button"
    >
      <FaChevronLeft size={16} />
    </button>
    <h2 className="text-xl font-semibold text-blue-300 select-none">
      {currentDate.toLocaleString('default', { month: 'short' })} {year}
    </h2>
    <button
      onClick={nextMonth}
      className="p-2 rounded-full bg-blue-700 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      aria-label="Next Month"
      type="button"
    >
      <FaChevronRight size={16} />
    </button>
  </div>

  {/* Weekday headers */}
  <div className="grid grid-cols-7 text-center text-[10px] font-semibold uppercase tracking-wider mb-2 select-none text-blue-400">
    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
      <div key={day} className="py-1">
        {day}
      </div>
    ))}
  </div>

  {/* Calendar grid */}
  <div className="grid grid-cols-7 gap-[1px] rounded-md overflow-hidden border border-blue-600 shadow-inner">
    {calendarDays.map((day, idx) =>
      day === null ? (
        <div key={idx} className="bg-blue-800 h-16" />
      ) : (
        <button
          key={idx}
          onClick={() => selectDate(day)}
          className={`
            relative h-16 p-1 cursor-pointer focus:outline-none
            bg-blue-800   
            ${isToday(day) ? 'bg-gray-500 text-white ring-1 ring-blue-400 round' : ''}
            ${isSelected(day) ? 'bg-indigo-600 text-white' : ''}
            hover:bg-blue-600 transition flex items-start justify-start
          `}
          aria-label={`Day ${day}`}
          type="button"
        >
          <time
            dateTime={`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`}
            className="flex items-center justify-center w-6 h-6 rounded-full font-semibold mb-1 ml-1"
          >
            {day}
          </time>
        </button>
      )
    )}
  </div>
</div>

</div>

  );
}
