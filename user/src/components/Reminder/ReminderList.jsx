export default function ReminderList({ reminders, onDelete }) {
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
        <div
  key={reminder.id}
  className={`p-3 rounded shadow flex justify-between items-start ${getPriorityColor(reminder.rm_priority)}`}
>
      <div>
        <div className="text-sm font-bold">{reminder.rm_time?.slice(0,5)}</div>
        <div className="text-lg">{reminder.rm_title}</div>
        <div className="text-sm text-gray-600">{reminder.rm_content}</div>
     </div>

     <button
        onClick={() => onDelete(reminder.id)}
        className="text-red-600 text-xl font-bold ml-4 hover:text-red-800"
        title="Xóa nhắc nhở"
        >
        ✕
      </button>
    </div>

      ))}
    </div>
  );
}
