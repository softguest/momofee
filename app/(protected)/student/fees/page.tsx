import { FiDollarSign } from "react-icons/fi";
import StudentFees from "./StudentFees";

export default function StudentFeesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center space-x-2 text-2xl font-semibold mb-6"><div>My School Fees</div> <div><FiDollarSign  /></div></div>
      <StudentFees />
    </div>
  );
}
