import DiaryGrid from "../components/Diary/DiaryGrid";
import NewEntry from "../components/Diary/NewEntry";
import Sidebar from "../components/Diary/SideBar";

export default function Diary() {
  return (
    <div className="flex flex-row h-screen min-h-[500px] ">
      <Sidebar />
      <DiaryGrid />
      {/* <NewEntry /> */}
    </div>
  );
}