import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import {
  CheckCircle2, ArrowLeft, ArrowUp, Loader2
} from "lucide-react";
import toursData from "../data/toursData.json";
import BookingHeader from "../components/booking/BookingHeader";
import TravelerDetails from "../components/booking/TravelerDetails";
import TravelDetails from "../components/booking/TravelDetails";
import PaymentPreference from "../components/booking/PaymentPreference";
import SecurityCard from "../components/booking/SecurityCard";
import FAQSection from "../components/booking/FAQSection";
import BookingSummary from "../components/booking/BookingSummary";
import SeatsLeftCard from "../components/booking/SeatsLeftCard";
import CancellationPolicyCard from "../components/booking/CancellationPolicyCard";
import NeedHelpCard from "../components/booking/NeedHelpCard";

const getBasePrice = (tour) => {
  if (!tour) return 3000;
  if (tour.discountPrice) return tour.discountPrice;
  if (tour.basePrice) return tour.basePrice;
  if (tour.price) return tour.price;
  const match = String(tour.priceRange || "").match(/[\d,]+/);
  if (match) return parseInt(match[0].replace(/,/g, ""), 10);
  return 3000;
};

const enrichTour = (tour) => ({
  id: tour.id,
  name: tour.name || "Signature Escape",
  city: tour.cityName || tour.city || "Destination",
  state: tour.stateName || tour.state || "India",
  days: tour.durationName || tour.days || "2-3 days",
  rating: tour.rating || 4.8,
  mood: tour.moodName || tour.mood || "Adventure",
  region: tour.region || "Popular",
  image: tour.thumbnail?.url || tour.image || "https://images.unsplash.com/photo-1562016600-ece13e8ba570?auto=format&fit=crop&w=800&q=80",
  banner: tour.banner,
  thumbnail: tour.thumbnail,
  pricePerPerson: getBasePrice(tour),
  seatsLeft: tour.seatsLeft || 12,
  bestTimeToVisit: tour.bestTimeToVisit || "Year-round",
  trending: tour.trending,
  topAttractions: tour.topAttractions || []
});

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const tourId = searchParams.get("tourId");

  const [rawTour, setRawTour] = useState(null);
  const [isResolving, setIsResolving] = useState(true);

  useEffect(() => {
    const stateTour = location.state?.tour;
    if (stateTour && (stateTour.name || stateTour.city)) {
      setRawTour(stateTour);
      setIsResolving(false);
      return;
    }

    if (!tourId) {
      setRawTour(toursData[0] || null);
      setIsResolving(false);
      return;
    }

    const normalizedId = String(tourId).trim();
    const found = toursData.find((t) => {
      if (!t) return false;
      const idStr = String(t.id).trim();
      return idStr === normalizedId || t.id === Number(normalizedId);
    });

    setRawTour(found || null);
    setIsResolving(false);
  }, [tourId, location.state]);

  const [primary, setPrimary] = useState({
    fullName: "", email: "", phone: "", country: "", emergencyName: "", emergencyPhone: ""
  });
  const [travelers, setTravelers] = useState([]);
  const [travel, setTravel] = useState({
    departureDate: "", adults: 1, children: 0, specialRequest: ""
  });
  const [payment, setPayment] = useState({ paymentType: "full" });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const formRef = useRef(null);
  const topRef = useRef(null);

  const tour = useMemo(() => (rawTour ? enrichTour(rawTour) : null), [rawTour]);

  const pricing = useMemo(() => {
    if (!tour) return null;
    const basePrice = tour.pricePerPerson;
    const adultPrice = travel.adults * basePrice;
    const childPrice = travel.children * basePrice * 0.5;
    const subtotal = adultPrice + childPrice;
    const taxes = Math.round(subtotal * 0.05);
    const grandTotal = subtotal + taxes;
    const payNow =
      payment.paymentType === "advance"
        ? Math.round(grandTotal * 0.3)
        : payment.paymentType === "arrival"
          ? 0
          : grandTotal;

    return { basePrice, adultPrice, childPrice, taxes, grandTotal, payNow, paymentType: payment.paymentType };
  }, [tour, travel.adults, travel.children, payment.paymentType]);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const validate = () => {
    const next = {};
    if (!primary.fullName.trim()) next.fullName = "Full name is required";
    if (!primary.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(primary.email)) next.email = "Invalid email format";
    if (!primary.phone.trim()) next.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(primary.phone.replace(/\D/g, ""))) next.phone = "Phone must be 10 digits";
    if (!travel.departureDate) next.departureDate = "Departure date is required";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      scrollToForm();
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <section className="min-h-[70vh] bg-white px-4 py-24">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 size={40} className="text-emerald-500" />
          </div>
          <h1 className="mt-6 text-4xl font-black uppercase italic text-slate-900">
            Booking Submitted!
          </h1>
          <p className="mt-4 text-slate-500">
            Thank you, {primary.fullName.split(" ")[0] || "traveller"}. Your reservation for{" "}
            <span className="font-semibold text-slate-900">{tour?.name}</span> has been received.
            Our team will reach out within 24 hours to confirm the itinerary.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/tour"
              className="rounded-full bg-orange-500 px-8 py-3 text-sm font-black uppercase tracking-wider text-white shadow-[0_12px_28px_rgba(249,115,22,0.35)] transition-all hover:bg-orange-600"
            >
              Browse More Tours
            </Link>
            <Link
              to="/"
              className="rounded-full border border-slate-200 px-8 py-3 text-sm font-black uppercase tracking-wider text-slate-700 transition-all hover:border-orange-300 hover:text-orange-600"
            >
              Go Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (isResolving) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-white">
        <Loader2 size={36} className="animate-spin text-orange-500" />
      </div>
    );
  }

  if (!tour) {
    return (
      <section className="min-h-[70vh] bg-white px-4 py-24">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-500">Booking</p>
          <h1 className="mt-4 text-4xl font-black uppercase italic text-slate-900">Tour Not Found</h1>
          <p className="mt-4 text-slate-500">
            The trip you are trying to book is no longer available. Explore more curated escapes below.
          </p>
          <Link
            to="/tour"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3 text-sm font-black uppercase tracking-wider text-white shadow-[0_12px_28px_rgba(249,115,22,0.35)] transition-all hover:bg-orange-600"
          >
            <ArrowLeft size={16} /> Browse Tours
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div ref={topRef} className="bg-white pb-28 lg:pb-16">
      <main className="mx-auto max-w-[1400px] px-6 pb-16 pt-24 md:pt-28">
        <BookingHeader tour={tour} />

        <div className="mt-12 grid items-start gap-10 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_350px]">
          {/* Left column: booking form */}
          <form
            ref={formRef}
            id="booking-form"
            onSubmit={handleSubmit}
            noValidate
            className="w-full min-w-0 scroll-mt-24 space-y-8"
          >
            <TravelerDetails
              primary={primary}
              onPrimaryChange={setPrimary}
              travelers={travelers}
              onTravelersChange={setTravelers}
              errors={errors}
            />

            <TravelDetails value={travel} onChange={setTravel} errors={errors} />

            <PaymentPreference value={payment} onChange={setPayment} />

            <SecurityCard />

            <FAQSection />

            <p className="text-center text-sm text-slate-500">
              By booking, you agree to our{" "}
              <Link to="/" className="font-semibold text-orange-600 underline-offset-2 hover:underline">
                Terms &amp; Conditions
              </Link>{" "}
              and{" "}
              <Link to="/" className="font-semibold text-orange-600 underline-offset-2 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </form>

          {/* Right sticky sidebar ~30% */}
          <aside className="w-full space-y-6 lg:sticky lg:top-8 lg:-mt-24">
            {pricing && (
              <BookingSummary
                tour={tour}
                pricing={pricing}
                adults={travel.adults}
                children={travel.children}
                isSubmitting={isSubmitting}
                formId="booking-form"
              />
            )}
            <SeatsLeftCard seatsLeft={tour.seatsLeft} />
            <CancellationPolicyCard />
            <NeedHelpCard />
          </aside>
        </div>
      </main>

      {/* Sticky mobile bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-slate-100 bg-white px-5 py-3 shadow-[0_-8px_30px_rgba(15,23,42,0.1)] lg:hidden">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Amount</p>
          <p className="text-xl font-black text-orange-600">
            ₹{(pricing?.grandTotal || 0).toLocaleString("en-IN")}
          </p>
        </div>
        <button
          type="submit"
          form="booking-form"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-orange-500 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-[0_12px_28px_rgba(249,115,22,0.35)] transition-all hover:bg-orange-600"
        >
          {isSubmitting ? "Processing..." : "Reserve Now"}
        </button>
      </div>

      <button
        type="button"
        onClick={() => topRef.current?.scrollIntoView({ behavior: "smooth" })}
        className="fixed bottom-20 right-5 z-40 hidden h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-lg transition-all hover:border-orange-300 hover:text-orange-600 lg:flex"
        aria-label="Back to top"
      >
        <ArrowUp size={18} />
      </button>
    </div>
  );
};

export default BookingPage;
