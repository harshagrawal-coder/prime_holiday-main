import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Can I cancel my booking?",
    a: "Yes. You can cancel for a full refund up to 7 days before departure, get a 50% refund up to 3 days before, and cancellations within 48 hours of departure are non-refundable."
  },
  {
    q: "What documents are required?",
    a: "A valid government-issued photo ID (Aadhaar, Passport, or Voter ID) for every traveller is needed at check-in. For international trips, a passport with at least 6 months of validity is required."
  },
  {
    q: "Can I pay later?",
    a: "Absolutely. Choose Pay 30% Now or Pay at Arrival while booking and clear the balance any time before departure."
  },
  {
    q: "Is pickup available?",
    a: "Yes, free pickup and drop is included from the airport, railway station, or your hotel in the city."
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
          <HelpCircle size={20} />
        </div>
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-500">
            Need Help?
          </p>
          <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>
      </div>

      <div className="mt-7 space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.q}
              className={`overflow-hidden rounded-2xl border transition-colors ${
                isOpen ? "border-orange-200 bg-orange-50/50" : "border-slate-200 bg-white"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-sm font-bold text-slate-900">{faq.q}</span>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                    isOpen ? "rotate-180 bg-orange-500 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <ChevronDown size={15} />
                </span>
              </button>
              {isOpen && (
                <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600">{faq.a}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQSection;
