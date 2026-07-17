import { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaStar } from "react-icons/fa";

const Testimonials = () => {
  const [testimonials] = useState([]);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Testimonials</h1>
          <p className="text-sm text-slate-500">Manage customer testimonials</p>
        </div>
      </div>
      {testimonials.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <FaStar className="mx-auto mb-3 text-slate-300" size={32} />
          <p className="text-sm text-slate-500">No testimonials yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-600">{t.text}</p>
              <p className="mt-2 text-xs font-semibold text-slate-800">— {t.author}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Testimonials;
