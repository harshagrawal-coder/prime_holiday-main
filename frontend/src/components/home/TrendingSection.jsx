import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaFire } from "react-icons/fa";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchTours } from "../../redux/slices/tourSlice";
import TourCard from "../tour/TourCard";

const getCardsPerView = (width) => {
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
};
const TrendingSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: trendingTours } = useSelector((state) => state.tour);
  const [index, setIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    dispatch(fetchTours({ trending: true }));
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setCardsPerView(getCardsPerView(window.innerWidth));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(trendingTours.length - cardsPerView, 0);

  useEffect(() => {
    setIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    const card = cardRefs.current[index];
    setTranslateX(card ? -card.offsetLeft : 0);
  }, [cardsPerView, index, trendingTours.length]);

  const handlePrev = () => setIndex((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setIndex((prev) => Math.min(prev + 1, maxIndex));

  return (
    <section className="mx-auto max-w-[1440px] overflow-x-clip bg-white px-4 py-16 sm:px-6 sm:py-4">
      <div className="mb-10 flex flex-col gap-6 sm:mb-16 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <FaFire className="animate-pulse text-orange-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">
              Top Rated
            </span>
          </div>
          <h2 className="text-3xl font-black uppercase italic leading-none tracking-tight text-slate-900 sm:text-5xl md:text-7xl">
            Trending <span className="text-slate-200">Destinations</span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            disabled={index === 0}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/75 text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-orange-400 hover:text-white hover:shadow-lg hover:shadow-orange-400/15 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous destinations"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={handleNext}
            disabled={index >= maxIndex}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/75 text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-orange-400 hover:text-white hover:shadow-lg hover:shadow-orange-400/15 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next destinations"
          >
            <FaArrowRight />
          </button>
          <button
            onClick={() => navigate("/tour")}
            className="group ml-2 inline-flex items-center gap-3 self-start text-[11px] font-black uppercase tracking-widest text-slate-900 transition-all hover:text-orange-600 md:self-auto"
          >
            View All <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-2 group-hover:rotate-6" />
          </button>
        </div>
      </div>

      <div ref={containerRef} className="overflow-visible">
        <motion.div
          ref={trackRef}
          className="flex w-max gap-4"
          animate={{ x: translateX }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          {trendingTours.map((tour, i) => (
            <div
              key={tour._id}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="relative flex-shrink-0 hover:z-50"
              style={{
                width: `calc((100vw - 48px) / ${cardsPerView} - ${(cardsPerView - 1) * 16}px / ${cardsPerView})`,
                maxWidth: `calc((1440px - 48px) / ${cardsPerView} - ${(cardsPerView - 1) * 16}px / ${cardsPerView})`,
              }}
            >
              <TourCard tour={tour} isHome={true} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrendingSection;
