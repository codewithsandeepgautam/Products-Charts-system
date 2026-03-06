import React, { useState, useEffect } from 'react';
import {
  format,
  startOfDay,
  endOfDay,
  subDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  isWithinInterval,
  isSameMonth
} from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

const presets = [
  { label: 'Today', getRange: () => ({ start: startOfDay(new Date()), end: endOfDay(new Date()) }) },
  { label: 'Yesterday', getRange: () => {
      const yesterday = subDays(new Date(), 1);
      return { start: startOfDay(yesterday), end: endOfDay(yesterday) };
    }
  },
  { label: 'Last 7 Days', getRange: () => ({ start: startOfDay(subDays(new Date(), 6)), end: endOfDay(new Date()) }) },
  { label: 'This Month', getRange: () => ({ start: startOfMonth(new Date()), end: endOfDay(new Date()) }) },
  { label: 'Custom Range', getRange: () => null }
];

const TimePicker = ({ value, onChange }) => {
  const [hour, setHour] = useState(value ? format(value, 'hh') : '12');
  const [minute, setMinute] = useState(value ? format(value, 'mm') : '00');
  const [ampm, setAmpm] = useState(value ? format(value, 'a') : 'AM');

  useEffect(() => {
    if (value) {
      setHour(format(value, 'hh'));
      setMinute(format(value, 'mm'));
      setAmpm(format(value, 'a'));
    }
  }, [value]);

  const updateTime = () => {
    const date = new Date(value || new Date());
    let hours = parseInt(hour, 10);
    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    date.setHours(hours, parseInt(minute, 10), 0, 0);
    onChange(date);
  };

  return (
    <div className="time-picker">
      <input
        type="number"
        min="1"
        max="12"
        value={hour}
        onChange={e => setHour(e.target.value.padStart(2, '0'))}
        onBlur={updateTime}
      />
      <span>:</span>
      <input
        type="number"
        min="0"
        max="59"
        step="15"
        value={minute}
        onChange={e => setMinute(e.target.value.padStart(2, '0'))}
        onBlur={updateTime}
      />
      <select value={ampm} onChange={e => setAmpm(e.target.value)} onBlur={updateTime}>
        <option>AM</option>
        <option>PM</option>
      </select>
    </div>
  );
};

const Calendar = ({ month, selectedStart, selectedEnd, onDateClick }) => {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startWeek = monthStart.getDay(); // 0 = Sunday
  const blanks = Array(startWeek).fill(null);

  return (
    <div className="calendar">
      <div className="calendar-header">
        <span>{format(month, 'MMMM yyyy')}</span>
      </div>
      <div className="weekdays">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="days-grid">
        {blanks.map((_, i) => <div key={`blank-${i}`} className="blank" />)}
        {days.map(day => {
          const isSelected = (selectedStart && isSameDay(day, selectedStart)) ||
                             (selectedEnd && isSameDay(day, selectedEnd));
          const isInRange = selectedStart && selectedEnd && 
                            isWithinInterval(day, { start: selectedStart, end: selectedEnd }) &&
                            !isSameDay(day, selectedStart) && !isSameDay(day, selectedEnd);
          return (
            <div
              key={day.toISOString()}
              className={`day ${isSelected ? 'selected' : ''} ${isInRange ? 'in-range' : ''}`}
              onClick={() => onDateClick(day)}
            >
              {format(day, 'd')}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DateRangePicker = ({ onChange }) => {
  const [startDate, setStartDate] = useState(startOfDay(new Date()));
  const [endDate, setEndDate] = useState(endOfDay(new Date()));
  const [startTime, setStartTime] = useState(startOfDay(new Date()));
  const [endTime, setEndTime] = useState(endOfDay(new Date()));
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activePreset, setActivePreset] = useState('Today');

  // Apply preset
  const applyPreset = (preset) => {
    const range = preset.getRange();
    if (range) {
      setStartDate(range.start);
      setEndDate(range.end);
      setStartTime(range.start);
      setEndTime(range.end);
      setActivePreset(preset.label);
    }
  };

  const handleDateClick = (day) => {
    if (!startDate || (startDate && endDate)) {
      // start new range
      setStartDate(day);
      setEndDate(null);
      setStartTime(day);
      setEndTime(day);
    } else {
      // set end date
      if (day < startDate) {
        setStartDate(day);
        setEndDate(startDate);
      } else {
        setEndDate(day);
      }
    }
    setActivePreset('Custom Range');
  };

  const handlePrevMonths = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonths = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleApply = () => {
    // Combine date and time
    const finalStart = new Date(startDate);
    finalStart.setHours(startTime.getHours(), startTime.getMinutes());
    const finalEnd = new Date(endDate || startDate);
    finalEnd.setHours(endTime.getHours(), endTime.getMinutes());
    onChange({ start: finalStart, end: finalEnd });
  };

  const handleCancel = () => {
    // Reset to today
    setStartDate(startOfDay(new Date()));
    setEndDate(endOfDay(new Date()));
    setStartTime(startOfDay(new Date()));
    setEndTime(endOfDay(new Date()));
    setActivePreset('Today');
  };

  const month1 = currentMonth;
  const month2 = addMonths(currentMonth, 1);

  return (
    <div className="date-range-picker">
      <div className="presets">
        {presets.map(p => (
          <button
            key={p.label}
            className={activePreset === p.label ? 'active' : ''}
            onClick={() => applyPreset(p)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="calendars-container">
        <div className="calendar-section">
          <div className="calendar-label">Calendar</div>
          <div className="dual-calendar">
            <Calendar
              month={month1}
              selectedStart={startDate}
              selectedEnd={endDate}
              onDateClick={handleDateClick}
            />
            <Calendar
              month={month2}
              selectedStart={startDate}
              selectedEnd={endDate}
              onDateClick={handleDateClick}
            />
          </div>
          <div className="calendar-nav">
            <button onClick={handlePrevMonths}><ChevronLeftIcon width={20} /> Prev</button>
            <button onClick={handleNextMonths}>Next <ChevronRightIcon width={20} /></button>
          </div>
        </div>

        <div className="time-section">
          <div className="time-label">Date Picker</div>
          <div className="time-inputs">
            <div>
              <span>Start:</span>
              <TimePicker value={startTime} onChange={setStartTime} />
            </div>
            <div>
              <span>End:</span>
              <TimePicker value={endTime} onChange={setEndTime} />
            </div>
          </div>
        </div>
      </div>

      <div className="actions">
        <button onClick={handleCancel}>Cancel</button>
        <button onClick={handleApply}>Apply</button>
      </div>
    </div>
  );
};

export default DateRangePicker;