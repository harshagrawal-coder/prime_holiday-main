import { Lock } from "lucide-react";

const formatINR = (n) => `₹${n.toLocaleString("en-IN")}`;

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 text-sm">
    <span className="text-slate-500">{label}</span>
    <span className="shrink-0 font-semibold text-slate-700">{value}</span>
  </div>
);

const Divider = () => <div className="h-px bg-slate-100" />;

const BookingSummary = ({ tour, pricing, adults, children, isSubmitting, formId }) => {
  const { basePrice, adultPrice, childPrice, taxes, grandTotal, payNow, paymentType } = pricing;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
      <div className="flex items-center gap-4 border-b border-slate-100 bg-slate-50/70 p-5">
        <img
          src={tour.thumbnail?.url || tour.image}
          alt={tour.name}
          className="h-16 w-20 shrink-0 rounded-xl object-cover"
        />
        <div className="min-w-0">
          <p className="line-clamp-2 text-sm font-black uppercase tracking-tight text-slate-900">
            {tour.name}
          </p>
          <p className="mt-1 text-xs text-slate-500">{tour.city}, {tour.state}</p>
        </div>
      </div>

      <div className="space-y-3 px-6 py-6">
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-800">
          Booking Summary
        </p>

        <Row label="Tour Price (per person)" value={formatINR(basePrice)} />
        <Divider />
        <Row label={`Adults × ${adults}`} value={formatINR(adultPrice)} />
        {children > 0 && (
          <>
            <Row label={`Children × ${children} (50%)`} value={formatINR(childPrice)} />
            <Divider />
          </>
        )}
        <Divider />
        <Row label="Taxes & Fees (GST 5%)" value={formatINR(taxes)} />

        <Divider />
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-900">Total Amount</span>
          <span className="text-2xl font-black text-orange-600">{formatINR(grandTotal)}</span>
        </div>
        {paymentType === "advance" && payNow < grandTotal && (
          <p className="text-right text-xs font-medium text-slate-500">
            Pay now (30%): <span className="font-bold text-orange-600">{formatINR(payNow)}</span>
          </p>
        )}
        {paymentType === "arrival" && (
          <p className="text-right text-xs font-medium text-emerald-600">Pay on arrival</p>
        )}
        <p className="text-right text-xs text-slate-400">For {adults + children} traveller(s)</p>
      </div>

      <div className="px-6 pb-6">
        <button
          type="submit"
          form={formId}
          disabled={isSubmitting}
          className="w-full rounded-full bg-orange-500 py-4 text-sm font-black uppercase tracking-wider text-white shadow-[0_12px_28px_rgba(249,115,22,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Processing..." : "Reserve Now"}
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Lock size={13} className="text-emerald-500" />
          Secure payment via SSL encryption
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
