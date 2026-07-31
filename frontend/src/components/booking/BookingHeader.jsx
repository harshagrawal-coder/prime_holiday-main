import { Link } from "react-router-dom";
import {
  ShieldCheck, BadgeCheck, Headphones, MapPin, Star, Clock, ChevronRight
} from "lucide-react";

const trustBadges = [
  { icon: ShieldCheck, label: "Secure Booking" },
  { icon: BadgeCheck, label: "Best Price Guarantee" },
  { icon: Headphones, label: "24×7 Support" }
];

const ShowcaseCard = ({ tour }) => {
  const image = tour.thumbnail?.url || tour.image;

  return (
    <div className="relative">
      <img
        src={image}
        alt={tour.name}
        className="aspect-[16/8] w-full rounded-[24px] object-cover shadow-[0_30px_60px_rgba(15,23,42,0.18)]"
      />

      <div className="absolute top-46 left-3 max-w-[280px] rounded-2xl border border-white/50 bg-white/75 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.16)] backdrop-blur-xl">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">
          {tour.mood}
        </p>
        <h2 className="mt-1 text-lg font-black uppercase leading-tight tracking-tight text-slate-900">
          {tour.name}
        </h2>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
          <MapPin size={14} className="shrink-0 text-orange-500" />
          {tour.city}, {tour.state}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-semibold text-slate-700">
          <span className="inline-flex items-center gap-1.5">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            {tour.rating}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} className="text-slate-400" />
            {tour.days}
          </span>
        </div>
      </div>
    </div>
  );
};

const BookingHeader = ({ tour }) => (
  <section className="grid items-center gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16">
    <div className="relative">
      <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />

      <nav className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
        <Link to="/" className="transition-colors hover:text-orange-600">Home</Link>
        <ChevronRight size={12} className="text-slate-300" />
        <Link to="/tour" className="transition-colors hover:text-orange-600">Tour</Link>
        <ChevronRight size={12} className="text-slate-300" />
        <span className="max-w-[180px] truncate text-slate-600">{tour.name}</span>
        <ChevronRight size={12} className="text-slate-300" />
        <span className="text-orange-600">Booking</span>
      </nav>

      <p className="mt-8 text-[11px] font-black uppercase tracking-[0.3em] text-orange-500">
        Reserve in Minutes
      </p>
      <h1 className="mt-3 text-4xl font-black uppercase italic leading-tight text-slate-900 md:text-5xl">
        Book Your Trip
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
        Complete the details below and our travel experts will confirm your reservation within
        24 hours.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {trustBadges.map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-slate-700 shadow-sm transition-colors hover:border-orange-300 hover:text-orange-600"
          >
            <Icon size={13} className="text-orange-500" />
            {label}
          </span>
        ))}
      </div>
    </div>

    {tour && <ShowcaseCard tour={tour} />}
  </section>
);

export default BookingHeader;
