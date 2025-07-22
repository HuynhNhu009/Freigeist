import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './calendar-custom.css' // file này ta sẽ tuỳ biến màu

export default function ReminderCalendar({ reminders, selectedDate, setSelectedDate }) {
  const getTileClass = ({ date, view }) => {
    if (view !== 'month') return '';

    const dateStr = date.toISOString().split('T')[0];
    const hasReminder = reminders.some(r => r.rm_date === dateStr);
    const isSelected = selectedDate.toDateString() === date.toDateString();

    if (isSelected) return 'selected-date';
    if (hasReminder) return 'has-reminder';
    return '';
  };

  return (
    <Calendar
      value={selectedDate}
      onChange={setSelectedDate}
      tileClassName={getTileClass}
    />
  );
}
