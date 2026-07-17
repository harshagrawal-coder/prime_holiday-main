import { useState } from "react";
import { FaSearch, FaEye, FaCheck, FaTimes } from "react-icons/fa";

const Bookings = () => {
  const [bookings] = useState([]);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Bookings</h1>
          <p className="text-sm text-slate-500">Manage customer bookings</p>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search bookings..."
              className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="p-8 text-center">
          <p className="text-sm text-slate-500">No bookings yet.</p>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
