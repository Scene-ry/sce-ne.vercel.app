'use client'

import { useState, useEffect } from 'react';
import EventCard from '@/components/EventCard';

export default function Home() {
  const [events, setEvents] = useState<{ name: string; date: Date }[]>([]);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents && JSON.parse(storedEvents).length > 0) {
      setEvents(JSON.parse(storedEvents).map((event: { name: string; date: string }) => ({
        name: event.name,
        date: new Date(event.date),
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const addEvent = () => {
    if (eventName && eventDate) {
      setEvents([...events, { name: eventName, date: new Date(eventDate) }]);
      setEventName('');
      setEventDate('');
    }
  };

  const removeEvent = (index: number) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  const styles = {
    form: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '16px',
      flexWrap: 'wrap' as 'wrap',
    },
    input: {
      padding: '8px',
      flex: '1 1 200px',
      marginBottom: '8px',
    },
    inputText: {
      fontSize: '16px',
    },
    button: {
      padding: '8px 16px',
      fontSize: '16px',
      cursor: 'pointer',
      flex: '1 1 100px',
      marginBottom: '8px',
    },
  };

  return (
    <div>
      <h1>Event Tracker</h1>
      <button onClick={() => setIsFormVisible(!isFormVisible)}>
        {isFormVisible ? 'Hide Form' : 'Show Form'}
      </button>
      {isFormVisible && (
        <div style={styles.form}>
          <input
            type="text"
            placeholder="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            style={{...styles.input, ...styles.inputText}}
          />
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            style={styles.input}
          />
          <button onClick={addEvent} style={styles.button}>Add Event</button>
        </div>
      )}
      <div>
        {events.sort((a, b) => a.date.getTime() - b.date.getTime()).map((event, index) => (
          <EventCard key={index} event={event} removeEvent={() => removeEvent(index)} />
        ))}
      </div>
    </div>
  );
}
