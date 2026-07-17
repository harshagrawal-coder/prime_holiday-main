import { useState } from "react";
import { FaSearch, FaEdit, FaTrash, FaPlus, FaTimes, FaTag } from "react-icons/fa";

const Coupons = () => {
  const [coupons] = useState([]);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Coupons</h1>
          <p className="text-sm text-slate-500">Manage discount coupons</p>
        </div>
      </div>
      {coupons.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <FaTag className="mx-auto mb-3 text-slate-300" size={32} />
          <p className="text-sm text-slate-500">No coupons yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {coupons.map((c) => (
            <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="font-bold text-slate-800">{c.code}</p>
              <p className="text-xs text-slate-500">{c.discount}% off</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Coupons;
