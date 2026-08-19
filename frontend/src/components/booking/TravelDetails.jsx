import { CalendarDays, Minus, Plus, ClipboardList, MapPin } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10";

const Counter = ({ label, hint, value, min, onChange }) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      {label}
    </label>
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:border-orange-500 hover:text-orange-500"
        aria-label={`Decrease ${label}`}
      >
        <Minus size={15} />
      </button>
      <span className="w-12 text-center text-xl font-black text-slate-900">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:border-orange-500 hover:text-orange-500"
        aria-label={`Increase ${label}`}
      >
        <Plus size={15} />
      </button>
    </div>
    <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
  </div>
);
const TravelDetails = ({ value, onChange, errors = {} }) => {
  const handleChange = (e) => {
    const { name, value: inputValue } = e.target;
    onChange({ ...value, [name]: inputValue });
  };
  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
          <CalendarDays size={20} />
        </div>
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-500">
            Step 2
          </p>
          <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-slate-900">
            Travel Details
          </h2>
        </div>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Departure Date *
          </label>
          <input
            type="date"
            name="departureDate"
            value={value.departureDate}
            onChange={handleChange}
            className={`${inputClass} ${errors.departureDate ? "border-red-300" : ""}`}
          />
          {errors.departureDate && (
            <p className="mt-1.5 text-xs font-medium text-red-500">
              {errors.departureDate}
            </p>
          )}
        </div>

        <Counter
          label="Adults *"
          hint="Age 12 and above"
          value={value.adults}
          min={1}
          onChange={(adults) => onChange({ ...value, adults })}
        />

        <Counter
          label="Children"
          hint="Age 2 to 11"
          value={value.children}
          min={0}
          onChange={(children) => onChange({ ...value, children })}
        />
      </div>

      <div className="mt-4 grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Pickup Location
          </label>
          <div className="relative">
            <MapPin
              size={15}
              className="pointer-events-none absolute left-4 top-3.5 text-slate-400"
            />
            <input
              type="text"
              name="pickupLocation"
              value={value.pickupLocation || ""}
              onChange={handleChange}
              placeholder="Airport, railway station, or hotel (optional)"
              className={`${inputClass} pl-11`}
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-400">
            pickup from the airport, railway station, or your hotel also
            available
          </p>
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Special Request
        </label>
        <div className="relative">
          <ClipboardList
            size={15}
            className="pointer-events-none absolute left-4 top-4 text-slate-400"
          />
          <textarea
            name="specialRequest"
            value={value.specialRequest}
            onChange={handleChange}
            rows={5}
            placeholder="Dietary needs, wheelchair access, hotel preference, celebrations, or anything we should know…"
            className={`${inputClass} resize-none pl-11`}
          />
        </div>
      </div>
    </section>
  );
};

export default TravelDetails;
