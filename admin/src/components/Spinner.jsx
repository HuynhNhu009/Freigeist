import { ClipLoader } from "react-spinners";

function Spinner(props) {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-white z-50 h-full">
      <ClipLoader color="#00d1caff" size={100} />
      <p className="mt-4 text-gray-700 text-lg">{props.sentence}</p>
    </div>
  );
}

export default Spinner;
