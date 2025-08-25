import { useState } from "react";
import Header from '../components/User/SearchBar';
import UserList from '../components/User/UserList';

export default function UserPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="w-full h-full p-6">
      <Header setSearchTerm={setSearchTerm} />
      <UserList searchTerm={searchTerm} />
    </div>
  );
}