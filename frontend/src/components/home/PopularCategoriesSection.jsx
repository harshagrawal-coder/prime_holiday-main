import CategoryCard from "./CategoryCard";
import SectionHeading from "../ui/SectionHeading";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchMoods } from "../../redux/slices/moodSlice";

const getCardsPerView = (width) => {
  if (width >= 1024) return 5;
  if (width >= 768) return 3;
  if (width >= 640) return 2;
  return 1;
};

const PopularCategoriesSection = () => {
  const dispatch = useDispatch();
  const { items: homeCategories } = useSelector((state) => state.mood);
  const [index, setIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(5);
  const [slideWidth, setSlideWidth] = useState(0);
  const touchStartX = useRef(null);
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    dispatch(fetchMoods({ isActive: true }));
  }, [dispatch]);

  const total = homeCategories.length;
  const isSlider = total > 5;
  const maxIndex = Math.max(total - cardsPerView, 0);

  useEffect(() => {
    const handleResize = () => setCardsPerView(getCardsPerView(window.innerWidth));
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const SLIDE_GAP = 24;

  const measureSlides = useCallback(() => {
    if (!containerRef.current) return;
    const width =
      (containerRef.current.offsetWidth - SLIDE_GAP * (cardsPerView - 1)) /
      cardsPerView;
    setSlideWidth(width);
  }, [cardsPerView]);

  useEffect(() => {
    if (!isSlider) return undefined;
    measureSlides();
    window.addEventListener("resize", measureSlides);
    return () => window.removeEventListener("resize", measureSlides);
  }, [isSlider, cardsPerView, measureSlides]);

  const handlePrev = () => setIndex((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setIndex((prev) => Math.min(prev + 1, maxIndex));

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current == null) return;
    const deltaX = touchStartX.current - event.changedTouches[0].clientX;
    if (deltaX > 50) handleNext();
    if (deltaX < -50) handlePrev();
    touchStartX.current = null;
  };

  const translateX = -(index * (slideWidth + SLIDE_GAP));

  if (total === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading title="Popular Categories" subtitle="Find trips based on your mood" />

      {isSlider && (
        <div className="mt-10 flex items-center justify-end gap-3">
          <button
            onClick={handlePrev}
            disabled={index === 0}
            aria-label="Previous categories"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-orange-400 hover:text-white hover:shadow-lg hover:shadow-orange-400/15 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:bg-white disabled:hover:text-slate-700"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={handleNext}
            disabled={index === maxIndex}
            aria-label="Next categories"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-orange-400 hover:text-white hover:shadow-lg hover:shadow-orange-400/15 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:bg-white disabled:hover:text-slate-700"
          >
            <FaArrowRight />
          </button>
        </div>
      )}

      {isSlider ? (
        <div className="mt-10">
          <div
            ref={containerRef}
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <motion.div
              ref={trackRef}
              className="flex w-max gap-6"
              animate={{ x: translateX }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            >
              {homeCategories.map((item) => (
                <div key={item._id} className="flex-shrink-0" style={{ width: slideWidth }}>
                  <CategoryCard
                    title={item.name}
                    image={item?.moodImage?.url}
                    queryCategory={item.name}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      ) : (
        <div
          className="mt-10 grid gap-6 sm:gap-8"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))" }}
        >
          {homeCategories.map((item) => (
            <CategoryCard
              key={item._id}
              title={item.name}
              image={item?.moodImage?.url}
              queryCategory={item.name}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default PopularCategoriesSection;
