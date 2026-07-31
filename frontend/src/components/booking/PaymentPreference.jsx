import { Wallet, CreditCard, Banknote, CircleCheck, Circle } from "lucide-react";

const plans = [
  {
    value: "full",
    label: "Pay Full Amount",
    desc: "Pay everything now and unlock priority confirmation",
    icon: Wallet
  },
  {
    value: "advance",
    label: "Pay 30% Now",
    desc: "Pay 30% today and the balance before departure",
    icon: CreditCard
  },
  {
    value: "arrival",
    label: "Pay at Arrival",
    desc: "No advance needed. Pay when you check in",
    icon: Banknote
  }
];

const PaymentPreference = ({ value, onChange }) => {
  const setPlan = (paymentType) => onChange({ ...value, paymentType });

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
          <CreditCard size={20} />
        </div>
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-500">
            Step 3
          </p>
          <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-slate-900">
            Payment Preference
          </h2>
        </div>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {plans.map(({ value: planValue, label, desc, icon: Icon }) => {
          const isActive = value.paymentType === planValue;
          return (
            <label
              key={planValue}
              className={`relative cursor-pointer rounded-2xl border p-5 transition-all duration-200 ${
                isActive
                  ? "border-orange-500 bg-orange-50/70 shadow-[0_8px_20px_rgba(249,115,22,0.1)]"
                  : "border-slate-200 bg-white hover:border-orange-300 hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)]"
              }`}
            >
              <input
                type="radio"
                name="paymentType"
                value={planValue}
                checked={isActive}
                onChange={() => setPlan(planValue)}
                className="hidden"
              />
              {isActive ? (
                <CircleCheck size={18} className="absolute right-4 top-4 text-orange-500" />
              ) : (
                <Circle size={18} className="absolute right-4 top-4 text-slate-300" />
              )}

              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${isActive ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-500"}`}>
                  <Icon size={17} />
                </div>
                <span className={`text-sm font-black uppercase tracking-wide ${isActive ? "text-orange-600" : "text-slate-800"}`}>
                  {label}
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">{desc}</p>
            </label>
          );
        })}
      </div>
    </section>
  );
};

export default PaymentPreference;
