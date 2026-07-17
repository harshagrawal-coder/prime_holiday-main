import { useState } from "react";
import { FaStar, FaTrash } from "react-icons/fa";

const Reviews = () => {
  const [reviews] = useState([]);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reviews</h1>
          <p className="text-sm text-slate-500">Customer reviews & ratings</p>
        </div>
      </div>
      {reviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <FaStar className="mx-auto mb-3 text-slate-300" size={32} />
          <p className="text-sm text-slate-500">No reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-600">{r.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
