import { Headphones, Phone, Mail } from "lucide-react";

const NeedHelpCard = () => (
  <div className="rounded-3xl border border-orange-100 bg-orange-50/40 p-6">
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white">
        <Headphones size={20} />
      </div>
      <div>
        <p className="text-sm font-black uppercase tracking-wide text-slate-900">Need Help?</p>
        <p className="mt-0.5 text-xs text-slate-500">24×7 travel support</p>
      </div>
    </div>

    <div className="mt-4 space-y-2.5">
      <p className="flex items-center gap-2.5 text-sm font-bold text-slate-800">
        <Phone size={14} className="shrink-0 text-orange-500" />
        +91 98765 43210
      </p>
      <p className="flex items-center gap-2.5 text-sm text-slate-600">
        <Mail size={14} className="shrink-0 text-orange-500" />
        support@primeholiday.in
      </p>
    </div>
  </div>
);

export default NeedHelpCard;
