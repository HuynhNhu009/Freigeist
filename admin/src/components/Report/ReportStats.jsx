
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ReportStats() {
  const [users, setUsers] = useState([]);
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      setError('No access token found. Please log in.');
      setLoading(false);
      return;
    }

    Promise.all([
      axios.get('http://127.0.0.1:8888/api/admin/users/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      axios.get('http://127.0.0.1:8888/api/admin/diaries/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    ])
      .then(([usersResponse, diariesResponse]) => {
        setUsers(usersResponse.data);
        setDiaries(diariesResponse.data);
      })
      .catch((err) => setError('Failed to fetch data: ' + err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // Tính toán nhóm tuổi và điểm cảm xúc trung bình
  const currentDate = new Date('2025-08-16');
  const ageGroups = {
    '<20': [], '21-30': [], '31-40': [], '41-50': [], '51-60': [], '>60': []
  };

  users.forEach(user => {
    const dob = new Date(user.user_dob);
    let age = currentDate.getFullYear() - dob.getFullYear();
    const monthDiff = currentDate.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < dob.getDate())) age--;
    const userDiaries = diaries.filter(d => d.user_email === user.user_email);
    const avgEmoScore = userDiaries.length > 0
      ? Math.round(userDiaries.reduce((sum, d) => sum + d.de_emoScore, 0) / userDiaries.length)
      : 0;

    if (age < 20) ageGroups['<20'].push(avgEmoScore);
    else if (age <= 30) ageGroups['21-30'].push(avgEmoScore);
    else if (age <= 40) ageGroups['31-40'].push(avgEmoScore);
    else if (age <= 50) ageGroups['41-50'].push(avgEmoScore);
    else if (age <= 60) ageGroups['51-60'].push(avgEmoScore);
    else ageGroups['>60'].push(avgEmoScore);
  });

  // Tính trung bình điểm cảm xúc cho từng nhóm tuổi
  const avgEmoScoreByAge = {
    '<20': ageGroups['<20'].length > 0 ? Math.round(ageGroups['<20'].reduce((sum, v) => sum + v, 0) / ageGroups['<20'].length) : 0,
    '21-30': ageGroups['21-30'].length > 0 ? Math.round(ageGroups['21-30'].reduce((sum, v) => sum + v, 0) / ageGroups['21-30'].length) : 0,
    '31-40': ageGroups['31-40'].length > 0 ? Math.round(ageGroups['31-40'].reduce((sum, v) => sum + v, 0) / ageGroups['31-40'].length) : 0,
    '41-50': ageGroups['41-50'].length > 0 ? Math.round(ageGroups['41-50'].reduce((sum, v) => sum + v, 0) / ageGroups['41-50'].length) : 0,
    '51-60': ageGroups['51-60'].length > 0 ? Math.round(ageGroups['51-60'].reduce((sum, v) => sum + v, 0) / ageGroups['51-60'].length) : 0,
    '>60': ageGroups['>60'].length > 0 ? Math.round(ageGroups['>60'].reduce((sum, v) => sum + v, 0) / ageGroups['>60'].length) : 0,
  };

  // Tính số người dùng mới trong tháng (tháng 8/2025)
  const newUsersThisMonth = users.filter(user => {
    const createDate = new Date(user.user_createAt);
    return createDate.getMonth() === 7 && createDate.getFullYear() === 2025;
  }).length;

  // Dữ liệu cho Pie Chart (số lượng người dùng theo nhóm tuổi)
  const pieChartData = {
    labels: Object.keys(ageGroups).filter(key => ageGroups[key].length > 0),
    datasets: [{
      data: Object.values(ageGroups).filter(arr => arr.length > 0).map(arr => arr.length),
      backgroundColor: ['#1E90FF', '#FF4500', '#FFA500', '#32CD32', '#8A2BE2', '#00CED1'],
      borderWidth: 1,
    }],
  };

  // Dữ liệu cho Bar Chart (điểm cảm xúc trung bình theo nhóm tuổi)
  const barChartData = {
    labels: Object.keys(avgEmoScoreByAge),
    datasets: [{
      label: 'Avg EmoScore',
      data: Object.values(avgEmoScoreByAge),
      backgroundColor: ['#1E90FF', '#FF4500', '#FFA500', '#32CD32', '#8A2BE2', '#00CED1'],
    }],
  };

 return (
  <div className="p-4 bg-white shadow rounded-lg w-[90%] mx-auto">
    {/* Hàng trên */}
    <div className="flex justify-between items-start justify-between">
      {/* Bên trái - số liệu */}
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-3xl font-semibold mb-3">Number of users</p>
          <p className="text-5xl font-bold">{users.length.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-3xl font-semibold">New regis in this month</p>
          <p className="text-5xl font-bold">{newUsersThisMonth.toLocaleString()}</p>
        </div>
      </div>

      {/* Bên phải - pie chart */}
      <div className="flex flex-row items-center">
        <div className="w-80 h-80 mb-4 mr-10 ">
          <Pie
            data={pieChartData}
            options={{
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              layout: { padding: 0 } // để biểu đồ chiếm tối đa
            }}
          />
        </div>

        <p className="mt-2 font-semibold mr-10">age-group-based</p>
        <div className="flex flex-wrap gap-2 mt-2 justify-center">
          {pieChartData.labels.map((label, index) => (
            <div key={label} className="flex items-center">
              <span
                className="w-4 h-4 mr-2"
                style={{
                  backgroundColor: pieChartData.datasets[0].backgroundColor[index],
                }}
              ></span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Bar chart bên dưới */}
    <div className="mt-6"><p className="text-3xl font-semibold">Average Emotional Score by Age Group</p>
      <div className="h-64">
        <Bar
          data={barChartData}
          options={{
            scales: {
              y: { beginAtZero: true, max: 100, ticks: { stepSize: 10 } }
            },
            plugins: { legend: { display: false } },
            maintainAspectRatio: false
          }}
        />
      </div>
    </div>
  </div>
);

}
