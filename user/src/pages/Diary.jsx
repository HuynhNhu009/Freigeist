import { useState } from "react";
import DiaryGrid from "../components/Diary/DiaryGrid";
import Sidebar from "../components/Diary/SideBar";

export default function Diary() {
  const [filters, setFilters] = useState({});

  return (
    <div className="flex flex-row h-screen min-h-[500px] bg-gray-800">
      <Sidebar onFilterChange={setFilters} />
      <DiaryGrid filters={filters} />
    </div>
  );
}
