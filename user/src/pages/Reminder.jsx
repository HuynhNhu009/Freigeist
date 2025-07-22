import { useEffect, useState } from "react";
import axios from "axios";
import ReminderCalendar from "../components/Reminder/ReminderCalendar";
import ReminderForm from "../components/Reminder/ReminderForm";
import ReminderList from "../components/Reminder//ReminderList";
import Modal from "react-modal";

Modal.setAppElement('#root'); 

export default function Reminder() {
  const [reminders, setReminders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Load danh sách reminders từ API
  const fetchRemindersAgain = () => {
    axios.get("http://127.0.0.1:8888/api/reminders/")
      .then(res => setReminders(res.data))
      .catch(err => console.error("Error loading reminders:", err));
  };

  useEffect(() => {
    fetchRemindersAgain();
  }, []);

  // Lọc công việc theo ngày đã chọn
  const selectedReminders = reminders.filter(r =>
    r.rm_date === selectedDate.toISOString().split("T")[0]
  );

  // Hàm thêm reminder mới
  const handleAddReminder = async (newReminder) => {
    const reminderWithDate = {
      ...newReminder,
      rm_date: selectedDate.toISOString().split("T")[0]
    };

    try {
      const res = await axios.post("/api/reminders/", reminderWithDate);
      setReminders(prev => [...prev, res.data]);
    } catch (err) {
      console.error("Failed to add reminder:", err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 h-screen bg-[url('/public/notes.jpg')] bg-cover bg-center bg-no-repeat">
      
      {/* Khối danh sách công việc */}
      <div className="w-full md:w-full">
        <div className="bg-white shadow-md rounded p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Tasks for {selectedDate.toDateString()}
            </h2>
            <button
               onClick={() => setModalIsOpen(true)}
              className="bg-blue-800 text-white px-3 py-1 rounded hover:bg-blue-900"
            >
              + Add new
            </button>
          </div>

          <ReminderList reminders={selectedReminders} />
        </div>
      </div>

      {/* Khối lịch */}
      <div className="w-full md:w-1/2">
        <ReminderCalendar
          reminders={reminders}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>

      {/* Form thêm mới */}
      {modalIsOpen && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          contentLabel="Add Reminder"
        >
          <ReminderForm
            onClose={() => setModalIsOpen(false)}
            onAdd={handleAddReminder}
            selectedDate={selectedDate}
            //onSuccess={fetchRemindersAgain}
          />
        </Modal>
      )}
    </div>
  );
}
//         <ReminderForm
//           onClose={() => setShowForm(false)}
//           onAdd={handleAddReminder}
//           selectedDate={selectedDate}
//           //onSuccess={fetchRemindersAgain}
//         />
//       )}
//     </div>
//   );
// }
