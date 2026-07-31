import { ShieldCheck, Lock, CreditCard, Users } from "lucide-react";

const items = [
  {
    icon: Lock,
    label: "SSL Secure",
    desc: "256-bit encrypted connection"
  },
  {
    icon: CreditCard,
    label: "Encrypted Payments",
    desc: "Your payment data stays private"
  },
  {
    icon: Users,
    label: "Trusted Travelers",
    desc: "1000+ happy customers yearly"
  }
];

const SecurityCard = () => (
  <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-8">
    <div className="flex items-center gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
        <ShieldCheck size={20} />
      </div>
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-500">
          Security
        </p>
        <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-slate-900">
          Your Booking is Safe With Us
        </h2>
      </div>
    </div>

    <div className="mt-7 grid gap-4 sm:grid-cols-3">
      {items.map(({ icon: Icon, label, desc }) => (
        <div
          key={label}
          className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
            <Icon size={17} />
          </div>
          <p className="mt-3 text-sm font-bold text-slate-900">{label}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">{desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default SecurityCard;
