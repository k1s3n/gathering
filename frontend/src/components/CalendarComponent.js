import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import Calendar from 'react-calendar';
import PropTypes from 'prop-types';
import 'react-calendar/dist/Calendar.css'; // Import CSS for the calendar

const CalendarComponent = forwardRef(({ events, onDateChange }, ref) => {
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

  const clearSelectedDate = () => {
    setDate(null);
    onDateChange(null); // Notify parent component about cleared date if needed
  };

  // Expose clearSelectedDate function to parent component via ref
  useImperativeHandle(ref, () => ({
    clearSelectedDate
  }));

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
      <button style={{ marginTop: '5px' }} onClick={clearSelectedDate}>Clear Date</button>
    </div>
  );
});

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
