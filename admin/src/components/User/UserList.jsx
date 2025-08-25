import { useEffect, useState } from "react";
import axios from "axios";
import UserDetailModal from "./UserDetailModal";

export default function UserList({ searchTerm }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8888/api/admin/users/")
      .then((res) => {
        setUsers(res.data);
        setFilteredUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch users");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      setFilteredUsers(
        users.filter((u) => {
          const idMatch = u.id.toString().includes(lowercasedTerm);
          const nameMatch = (u.user_fullname || u.name)?.toLowerCase().includes(lowercasedTerm);
          const emailMatch = (u.user_email || u.email)?.toLowerCase() === lowercasedTerm;
          return idMatch || nameMatch || emailMatch;
        })
      );
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

return (
    <div className="p-4 w-full mx-auto">
      <table className="w-full table-auto border-collapse">
        <thead className="bg-gray-300">
          <tr>
            <th className="border p-2">id</th>
            <th className="border p-2">name</th>
            <th className="border p-2">Gender</th>
            <th className="border p-2">Email</th>
            <th className="border p-2"></th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id}>
              <td className="border p-2">{u.id}</td>
              <td className="border p-2">{u.user_fullname || u.name}</td>
              <td className="border p-2">{u.user_gender || u.gender}</td>
              <td className="border p-2">{u.user_email || u.email}</td>
              <td className="border p-2">
                <button
                  onClick={() => setSelectedUser(u)}
                  className="bg-blue-400 text-white px-3 py-1 rounded hover:bg-blue-500"
                >
                  Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
}