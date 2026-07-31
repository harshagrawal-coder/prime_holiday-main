import { CalendarCheck, CalendarClock, CalendarX } from "lucide-react";

const steps = [
  {
    icon: CalendarCheck,
    title: "Free Cancellation",
    sub: "Up to 7 days before departure",
    iconClass: "text-emerald-600"
  },
  {
    icon: CalendarClock,
    title: "50% Refund",
    sub: "Up to 3 days before departure",
    iconClass: "text-orange-600"
  },
  {
    icon: CalendarX,
    title: "No Refund",
    sub: "Within 48 hours of departure",
    iconClass: "text-red-500"
  }
];

const CancellationPolicyCard = () => (
  <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-500">Policy</p>
    <h3 className="mt-2 text-lg font-black uppercase tracking-tight text-slate-900">
      Cancellation Policy
    </h3>

    <div className="mt-5 space-y-4">
      {steps.map(({ icon: Icon, title, sub, iconClass }) => (
        <div key={title} className="flex items-start gap-3">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200 ${iconClass}`}>
            <Icon size={16} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{title}</p>
            <p className="mt-0.5 text-xs text-slate-500">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default CancellationPolicyCard;
