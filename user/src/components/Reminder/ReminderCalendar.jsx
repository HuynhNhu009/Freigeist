import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar-custom.css';
import { addHours, format } from 'date-fns';

export default function ReminderCalendar({ reminders, selectedDate, setSelectedDate }) {
  // Chuẩn hóa reminders
  const normalizedReminders = reminders.map((reminder) => ({
    ...reminder,
    rm_date: reminder.rm_date, // Giữ nguyên chuỗi YYYY-MM-DD từ API
  }));

  const getTileClass = ({ date, view }) => {
    if (view !== 'month') return '';

    // Chuẩn hóa date thành chuỗi YYYY-MM-DD theo local timezone
    const dateStr = format(date, 'yyyy-MM-dd');
    // Chuẩn hóa selectedDate thành chuỗi YYYY-MM-DD
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');

    // So sánh với rm_date từ API
    const hasReminder = normalizedReminders.some((r) => r.rm_date === dateStr);
    const isSelected = selectedDateStr === dateStr;

    console.log("Date:", dateStr); // Debug
    console.log("Selected Date:", selectedDateStr);
    console.log("Has Reminder:", hasReminder);
    console.log("Reminder rm_date:", normalizedReminders.map(r => r.rm_date)); // Debug thêm để kiểm tra tất cả rm_date

    if (isSelected) return 'selected-date';
    if (hasReminder) return 'has-reminder';
    return '';
  };

  return (
    <Calendar
      value={selectedDate}
      onChange={setSelectedDate}
      tileClassName={getTileClass}
      className="p-4 rounded-lg shadow-md bg-white"
    />
  );
}