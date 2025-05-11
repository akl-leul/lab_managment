'use client';

import { useEffect, useState } from 'react';
import { prisma } from '@/lib/prisma';


const PHYSICS_COLORS = {
  background: 'bg-gray-900',
  card: 'bg-gray-800',
  textPrimary: 'text-cyan-400',
  textSecondary: 'text-cyan-300',
  hoverBg: 'hover:bg-cyan-700',
  todayBg: 'bg-cyan-600',
  todayText: 'text-white',
  todayRing: 'ring-2 ring-cyan-400',
  selectedBg: 'bg-green-600',
  selectedText: 'text-white',
  border: 'border-cyan-500',
  announcementBg: 'bg-gray-800',
  announcementBorder: 'border-green-600',
  announcementText: 'text-green-400',
};

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
    <div className={`${PHYSICS_COLORS.background} min-w-xl mx-auto p-6 rounded-lg shadow-lg text-white`}>
      {/* Header: Month, Year and Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className={`px-3 py-1 rounded ${PHYSICS_COLORS.hoverBg} transition`}
          aria-label="Previous Month"
        >
          &lt;
        </button>
        <h2 className={`text-3xl font-semibold ${PHYSICS_COLORS.textPrimary}`}>
          {currentDate.toLocaleString('default', { month: 'long' })} {year}
        </h2>
        <button
          onClick={nextMonth}
          className={`px-3 py-1 rounded ${PHYSICS_COLORS.hoverBg} transition`}
          aria-label="Next Month"
        >
          &gt;
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 text-center text-xs font-semibold uppercase tracking-wide mb-2 select-none">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className={`${PHYSICS_COLORS.textSecondary} py-2`}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px rounded-lg overflow-hidden border border-cyan-700">
        {calendarDays.map((day, idx) =>
          day === null ? (
            <div key={idx} className={`${PHYSICS_COLORS.card} h-24`} />
          ) : (
            <button
              key={idx}
              onClick={() => selectDate(day)}
              className={`
                relative h-24 p-2 cursor-pointer focus:outline-none
                ${PHYSICS_COLORS.card}
                ${isToday(day) ? `${PHYSICS_COLORS.todayBg} ${PHYSICS_COLORS.todayText} ${PHYSICS_COLORS.todayRing}` : ''}
                ${isSelected(day) ? `${PHYSICS_COLORS.selectedBg} ${PHYSICS_COLORS.selectedText}` : ''}
                hover:bg-cyan-700
              `}
              aria-label={`Day ${day}`}
              type="button"
            >
              <time
                dateTime={`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`}
                className="flex items-center justify-center w-7 h-7 rounded-full font-semibold"
              >
                {day}
              </time>
            </button>
          )
        )}
      </div>

 
    </div>
  );
}
