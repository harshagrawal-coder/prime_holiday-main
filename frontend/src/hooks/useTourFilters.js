import { useMemo, useState } from "react";
export const useTourFilters = ({
  selectedVibeExternal,
  tours = [],
  regions = [],
  states = [],
  city = [],
  durations = [],
  moods = [],
} = {}) => {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [priceRange, setPriceRange] = useState(150000);
  const selectedVibe = selectedVibeExternal || "All Vibes";
  const resetFilters = () => {
    setSelectedRegion("");
    setSelectedStates([]);
    setSelectedCities([]);
    setSelectedDays([]);
    setPriceRange(150000);
  };
  const displayStates = useMemo(() => {
    if (!selectedRegion) return states;
    // console.log(states[0])
    return states.filter(
      (state) => state.regionId?.name === selectedRegion
    );
  }, [selectedRegion, states]);
  const displayCities = useMemo(() => {
    if (selectedStates.length === 0) return city;
    // console.log(city[0]);
    return city.filter((item) =>
      selectedStates.includes(item.stateId?.name)
    );
  }, [selectedStates, city]);
  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const matchVibe =
        selectedVibe === "All Vibes" ||
        tour.moodName?.toLowerCase() === selectedVibe.toLowerCase();
      const matchRegion =
        !selectedRegion ||
        tour.regionName?.toLowerCase() === selectedRegion.toLowerCase();
      const matchState =
        selectedStates.length === 0 ||
        selectedStates.some(
          state => state.toLowerCase() === tour.stateName?.toLowerCase()
        );
      const matchCity =
        selectedCities.length === 0 ||
        selectedCities.some(
          city => city.toLowerCase() === tour.cityName?.toLowerCase()
        );
      const matchDays =
        selectedDays.length === 0 ||
        selectedDays.some(
          day => day.toLowerCase() === tour.durationName?.toLowerCase()
        );
      const matchPrice = tour.price <= priceRange;
      return (
        matchRegion &&
        matchState &&
        matchCity &&
        matchDays &&
        matchVibe &&
        matchPrice
      );
    });
  }, [
    priceRange,
    selectedCities,
    selectedDays,
    selectedRegion,
    selectedStates,
    selectedVibe,
    tours,
  ]);

  return {
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
    resetFilters,
    displayStates,
    displayCities,
  };
};