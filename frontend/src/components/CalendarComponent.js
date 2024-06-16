// CalendarComponent.js
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import CSS for the calendar

const CalendarComponent = ({ events, onDateChange }) => {
  const [date, setDate] = useState(null); // Initial date state set to null

  useEffect(() => {
    // Ensure the calendar starts with no date selected
    setDate(null);
  }, []);

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const eventDate = events.find(
        (event) => new Date(event.date).toDateString() === date.toDateString()
      );
      return eventDate ? <div className="event-dot"></div> : null;
    }
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    onDateChange(newDate);
  };

  const handleClearDate = () => {
    setDate(null); // Set date state to null to clear the selected date
    onDateChange(null); // Optionally notify parent component about cleared date
  };

  return (
    <div>
      <h3>Event Calendar</h3>
      <div className="calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={date}
          tileContent={tileContent}
        />
      </div>
      <button onClick={handleClearDate}>Clear Date</button>
    </div>
  );
};

export default CalendarComponent;
