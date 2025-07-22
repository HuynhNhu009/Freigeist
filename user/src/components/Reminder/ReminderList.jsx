export default function ReminderList({ reminders }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-300';
      case 'medium': return 'bg-orange-200';
      case 'low': return 'bg-blue-100';
      default: return '';
    }
  };

  return (
    <div className="space-y-2 mt-4">
      {reminders.map(reminder => (
        <div key={reminder.id} className={`p-3 rounded shadow ${getPriorityColor(reminder.rm_priority)}`}>
          <div className="text-sm font-bold">{reminder.rm_time?.slice(0,5)}</div>
          <div className="text-lg">{reminder.rm_title}</div>
          <div className="text-sm text-gray-600">{reminder.rm_content}</div>
        </div>
      ))}
    </div>
  );
}
