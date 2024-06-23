// CalendarComponent.js
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import PropTypes from 'prop-types';
import 'react-calendar/dist/Calendar.css'; // Import CSS for the calendar

const CalendarComponent = ({ events, onDateChange }) => {
  const [date, setDate] = useState(null); // Initial date state set to null

  useEffect(() => {
    // Ensure the calendar starts with today's date selected by default
    const today = new Date();
    setDate(today);
    onDateChange(today);
  }, [onDateChange]);

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const eventDate = events.find(
        (event) => new Date(event.date).toDateString() === date.toDateString()
      );
      return eventDate ? <div className="event-dot"></div> : null;
    }
  };

  const tileDisabled = ({ date, view }) => {
    // Disable dates before today (not including today)
    return date < new Date().setHours(0, 0, 0, 0);
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
          tileDisabled={tileDisabled}
        />
      </div>
      <button style={{ marginTop: '5px' , marginBottom: '5px'}} onClick={handleClearDate}>Clear Date</button>
    </div>
  );
};

CalendarComponent.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      // Define the structure of each event object if needed
      date: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      // Add more properties as needed
    })
  ).isRequired,
  onDateChange: PropTypes.func.isRequired,
};

export default CalendarComponent;
