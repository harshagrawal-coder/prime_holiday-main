import { Users, UserPlus } from "lucide-react";
import TravelerCard from "./TravelerCard";

const inputClass = (error) =>
  `w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:ring-4 ${
    error ? "border-red-300 focus:ring-red-500/10" : "border-slate-200 focus:ring-orange-500/10"
  }`;

const Field = ({ label, error, children }) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
    {children}
    {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
  </div>
);

const TravelerDetails = ({ primary, onPrimaryChange, travelers, onTravelersChange, errors = {} }) => {
  const handlePrimary = (e) => {
    const { name, value } = e.target;
    onPrimaryChange({ ...primary, [name]: value });
  };

  const updateTraveler = (index, fullName) =>
    onTravelersChange(travelers.map((t, i) => (i === index ? { ...t, fullName } : t)));

  const addTraveler = () => {
    if (travelers.length >= 8) return;
    onTravelersChange([...travelers, { fullName: "" }]);
  };

  const removeTraveler = (index) =>
    onTravelersChange(travelers.filter((_, i) => i !== index));

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
          <Users size={20} />
        </div>
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-500">
            Step 1
          </p>
          <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-slate-900">
            Travelers Details
          </h2>
        </div>
      </div>

      {/* Primary Contact */}
      <h3 className="mt-7 text-sm font-black uppercase tracking-[0.2em] text-slate-800">
        Primary Contact
      </h3>
      <div className="mt-4 grid gap-5 md:grid-cols-2">
        <Field label="Full Name *" error={errors.fullName}>
          <input
            type="text"
            name="fullName"
            value={primary.fullName}
            onChange={handlePrimary}
            placeholder="Enter your full name"
            className={inputClass(errors.fullName)}
          />
        </Field>

        <Field label="Email Address *" error={errors.email}>
          <input
            type="email"
            name="email"
            value={primary.email}
            onChange={handlePrimary}
            placeholder="you@example.com"
            className={inputClass(errors.email)}
          />
        </Field>

        <Field label="Phone Number *" error={errors.phone}>
          <input
            type="tel"
            name="phone"
            value={primary.phone}
            onChange={handlePrimary}
            placeholder="10-digit mobile number"
            className={inputClass(errors.phone)}
          />
        </Field>

        <Field label="Emergency Contact Name">
          <input
            type="text"
            name="emergencyName"
            value={primary.emergencyName}
            onChange={handlePrimary}
            placeholder="Name of emergency contact"
            className={inputClass()}
          />
        </Field>

        <Field label="Emergency Contact Number">
          <input
            type="tel"
            name="emergencyPhone"
            value={primary.emergencyPhone}
            onChange={handlePrimary}
            placeholder="Emergency contact number"
            className={inputClass()}
          />
        </Field>
      </div>

      {/* All Travelers */}
      <h3 className="mt-8 text-sm font-black uppercase tracking-[0.2em] text-slate-800">
        All Travelers
      </h3>
      <div className="mt-4 grid gap-4">
        {travelers.map((traveler, index) => (
          <TravelerCard
            key={index}
            index={index + 1}
            value={traveler}
            onChange={(fullName) => updateTraveler(index, fullName)}
            onRemove={() => removeTraveler(index)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={addTraveler}
        className="mt-5 inline-flex items-center gap-2 rounded-full border border-dashed border-orange-300 bg-orange-50/60 px-6 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-orange-600 transition-all duration-300 hover:border-orange-500 hover:bg-orange-100"
      >
        <UserPlus size={14} /> Add Another Traveler
      </button>
    </section>
  );
};

export default TravelerDetails;
