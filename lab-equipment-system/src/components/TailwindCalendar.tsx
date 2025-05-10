import { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns';

export default function TailwindCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <button
        className="px-2 py-1 rounded hover:bg-blue-100"
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
      >
        &lt;
      </button>
      <div className="text-lg font-bold">
        {format(currentMonth, 'MMMM yyyy')}
      </div>
      <button
        className="px-2 py-1 rounded hover:bg-blue-100"
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
      >
        &gt;
      </button>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const date = startOfWeek(currentMonth, { weekStartsOn: 0 });
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-medium text-blue-600">
          {format(addDays(date, i), 'EEE')}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        const isToday = isSameDay(day, new Date());
        const isSelected = isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <button
            key={day.toString()}
            onClick={() => setSelectedDate(cloneDay)}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition
              ${isToday ? 'bg-blue-200 text-blue-800 font-bold' : ''}
              ${isSelected ? 'bg-blue-500 text-white font-bold' : ''}
              ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}
              hover:bg-blue-100`}
            disabled={!isCurrentMonth}
          >
            {formattedDate}
          </button>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 w-full max-w-md mx-auto">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      <div className="mt-4 text-center text-blue-700 font-semibold">
        {format(selectedDate, 'PPPP')}
      </div>
    </div>
  );
}
