import { useEffect, useMemo, useState } from "react";
import { FaFilter, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTourFilters } from "../../hooks/useTourFilters";
import TourFiltersContent from "./TourFiltersContent";
import TourGrid from "./TourGrid";
import TourHeroBanner from "./TourHeroBanner";
import TourResultsHeader from "./TourResultsHeader";
import { fetchTours } from "../../redux/slices/tourSlice";
import { fetchDurations } from "../../redux/slices/durationSlice";
import { fetchRegions } from "../../redux/slices/regionSlice";
import { fetchStates } from "../../redux/slices/stateSlice";
import { fetchCities } from "../../redux/slices/citySlice";
import { fetchMoods } from "../../redux/slices/moodSlice";

const TourExplorerSection = () => {
  const dispatch = useDispatch();
  const { items: tours } = useSelector((state) => state.tour);
  const { items: durations } = useSelector((state) => state.duration);
  const { items: regions } = useSelector((state) => state.region);
  const { items: moods } = useSelector((state) => state.mood);
  const { items: city } = useSelector((state) => state.city);
  const { items: states } = useSelector((state) => state.state);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategoryFromUrl = useMemo(
    () => searchParams.get("category")?.toLowerCase() || "",
    [searchParams]
  );
  const selectedVibe = useMemo(() => {
    if (!activeCategoryFromUrl) return "All Vibes";

    const mood = moods.find(
      (item) => item.slug.toLowerCase() === activeCategoryFromUrl
    );

    return mood ? mood.name : "All Vibes";
  }, [activeCategoryFromUrl, moods]);
  const {
    selectedRegion,
    setSelectedRegion,
    selectedStates,
    setSelectedStates,
    selectedCities,
    setSelectedCities,
    selectedDays,
    setSelectedDays,
    priceRange,
    setPriceRange,
    filteredTours,
    displayStates,
    displayCities,
    resetFilters,
  } = useTourFilters({ selectedVibeExternal: selectedVibe, tours, city, moods, states, durations, regions });

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // useEffect(() => {
  //   tours.forEach((tour) => {
  //     if (tour.image) {
  //       const image = new Image();
  //       image.src = tour.image;
  //     }
  //   });
  // }, [tours]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        dispatch(fetchTours()),
        dispatch(fetchDurations()),
        dispatch(fetchRegions()),
        dispatch(fetchStates()),
        dispatch(fetchCities()),
        dispatch(fetchMoods()),
      ]);
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);
  const updateCategoryInUrl = (value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value === "All Vibes") {
      nextParams.delete("category");
    } else {
      const mood = moods.find(
        (item) => item.name.toLowerCase() === value.toLowerCase()
      );

      if (mood) {
        nextParams.set("category", mood.slug);
      }
    }

    setSearchParams(nextParams, { replace: true });
  };
  const handleVibeChange = (value) => {
    updateCategoryInUrl(value);
  };
  const filterContentProps = {
    durations,
    city: displayCities,
    regions,
    moods,
    states: displayStates,
    selectedRegion,
    setSelectedRegion,
    selectedStates,
    setSelectedStates,
    selectedCities,
    setSelectedCities,
    selectedDays,
    setSelectedDays,
    selectedVibe,
    setSelectedVibe: handleVibeChange,
    priceRange,
    setPriceRange,
  };

  const handleResetFilters = () => {
    resetFilters();
    setSearchParams({}, { replace: true });
  };

  const filterAnimationKey = [
    selectedVibe,
    selectedRegion,
    selectedStates.join(","),
    selectedCities.join(","),
    selectedDays,
    priceRange,
    filteredTours.length,
  ].join("|");
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7FB]">
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .stroke-text { -webkit-text-stroke: 1px #e2e8f0; color: transparent; }`}</style>

      <TourHeroBanner count={filteredTours.length} />

      <div className="fixed bottom-5 right-4 z-[100] lg:hidden sm:bottom-8 sm:right-8">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-orange-600 text-xl text-white shadow-2xl sm:h-16 sm:w-16 sm:text-2xl"
        >
          <FaFilter />
        </button>
      </div>

      {isMobileFilterOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm lg:hidden"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-[201] max-h-[90vh] overflow-y-auto rounded-t-[2.25rem] bg-white p-5 sm:rounded-t-[3rem] sm:p-8 lg:hidden"
          >
            <div className="mx-auto mb-8 h-1.5 w-12 rounded-full bg-slate-200" />
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-black uppercase italic text-slate-900">Filters</h2>
                <button
                  onClick={handleResetFilters}
                  className="border-b-2 border-orange-100 text-[10px] font-black uppercase text-orange-600"
                >
                  Reset
                </button>
              </div>
              <button onClick={() => setIsMobileFilterOpen(false)} className="rounded-full bg-slate-50 p-3">
                <FaTimes />
              </button>
            </div>
            <div className="space-y-8 pb-20">
              <TourFiltersContent {...filterContentProps} />
              <div className="border-t border-slate-50 pt-4">
                <p className="mb-4 text-center text-[11px] font-black uppercase tracking-widest text-slate-400">
                  {filteredTours.length} Adventures Found
                </p>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full rounded-2xl bg-orange-600 py-5 text-sm font-black uppercase tracking-widest text-white shadow-xl"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}

      <div className="relative z-20 mx-auto -mt-8 flex max-w-[1440px] flex-col gap-6 px-3 pb-14 sm:-mt-16 sm:gap-8 sm:px-4 md:px-10 lg:flex-row">
        <aside className="hidden w-[320px] shrink-0 lg:block lg:sticky lg:top-6 lg:h-[calc(100vh-80px)]">
          <div className="h-full flex flex-col rounded-[2.5rem] border border-white/70 bg-white/80 p-7 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur-md">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-800">
                Discovery Center
              </h2>
              <button
                onClick={handleResetFilters}
                className="text-[10px] font-black uppercase italic text-orange-600 hover:underline"
              >
                Reset
              </button>
            </div>
            <div className="hide-scrollbar flex-1 space-y-7 overflow-y-auto pb-4">
              <TourFiltersContent {...filterContentProps} />
            </div>
            <button className="mt-4 w-full rounded-[1.6rem] bg-slate-950 py-5 text-[11px] font-black uppercase tracking-widest text-white transition-colors hover:bg-orange-600">
              Filters Ready
            </button>
          </div>
        </aside>

        <main className="flex-1 lg:pl-2">
          <TourResultsHeader
            filteredCount={filteredTours.length}
            priceRange={priceRange}
            selectedVibe={selectedVibe}
          />

          <TourGrid tours={filteredTours} animationKey={filterAnimationKey} />
        </main>
      </div>
    </div>
  );
};

export default TourExplorerSection;
