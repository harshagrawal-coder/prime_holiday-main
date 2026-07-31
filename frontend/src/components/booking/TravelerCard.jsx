import { Trash2 } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10";

const TravelerCard = ({ index, value, onChange, onRemove }) => (
  <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
    <div className="flex items-center justify-between gap-3">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
        Traveler {index}
      </p>
      <button
        type="button"
        onClick={onRemove}
        className="inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-red-500 transition-all hover:border-red-300 hover:bg-red-100"
      >
        <Trash2 size={11} /> Remove
      </button>
    </div>

    <div className="mt-4">
      <label className="mb-2 block text-sm font-semibold text-slate-700">Full Name</label>
      <input
        type="text"
        value={value.fullName}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Traveler's full name"
        className={inputClass}
      />
    </div>
  </div>
);

export default TravelerCard;
