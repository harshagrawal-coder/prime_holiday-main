import { Users } from "lucide-react";

const SeatsLeftCard = ({ seatsLeft = 12 }) => (
  <div className="flex items-center gap-4 rounded-3xl border border-orange-100 bg-orange-50/50 p-5">
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white">
      <Users size={20} />
    </div>
    <div>
      <p className="text-sm font-black uppercase tracking-wide text-slate-900">
        {seatsLeft} Seats Left
      </p>
      <p className="mt-1 text-xs text-slate-500">
        Only a few seats remaining at this price
      </p>
    </div>
  </div>
);

export default SeatsLeftCard;
