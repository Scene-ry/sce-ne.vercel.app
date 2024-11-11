import React from 'react';

interface EventCardProps {
  event: {
    name: string;
    date: Date;
  };
  removeEvent: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, removeEvent }) => {
  const remainingDays = Math.ceil((event.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isWithin30Days = remainingDays <= 30;

  return (
    <div style={styles.card}>
      <button onClick={removeEvent} style={styles.removeButton}>X</button>
      <div style={styles.content}>
        <div>
          <h2>{event.name}</h2>
          <p>Date: {event.date.toLocaleDateString()}</p>
        </div>
        <p style={{ ...styles.remainingTime, color: isWithin30Days ? 'red' : 'black' }}>
          <span style={styles.largeText}>{remainingDays}</span>days
        </p>
      </div>
    </div>
  );
};

const styles = {
  card: {
    position: 'relative' as 'relative',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  removeButton: {
    position: 'absolute' as 'absolute',
    top: '8px',
    right: '8px',
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remainingTime: {
    fontWeight: 'bold' as 'bold',
  },
  largeText: {
    fontSize: '50px',
  },
};

export default EventCard;