import { FaClock, FaMapMarkerAlt, FaMountain, FaGlobeAsia } from "react-icons/fa";
import CheckboxGroup from "./TourDropdownField";

const TourFiltersContent = ({
  durations,
  city,
  regions,
  moods,
  states,
  selectedRegion,
  setSelectedRegion,
  selectedStates,
  setSelectedStates,
  selectedCities,
  setSelectedCities,
  selectedDays,
  setSelectedDays,
  selectedVibe,
  setSelectedVibe,
  priceRange,
  setPriceRange,
}) => (
  <div className="space-y-6">
    <CheckboxGroup
      label="Region"
      icon={FaGlobeAsia}
      options={regions}
      selected={selectedRegion}
      onChange={(val) => {
        setSelectedRegion(val === selectedRegion ? "" : val);
        setSelectedStates([]);
        setSelectedCities([]);
      }}
      single
    />

    <CheckboxGroup
      label="State"
      icon={FaMapMarkerAlt}
      options={states}
      selected={selectedStates}
      onChange={(val) =>
        setSelectedStates((prev) =>
          prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
        )
      }
    />

    <CheckboxGroup
      label="City"
      icon={FaMapMarkerAlt}
      options={city}
      selected={selectedCities}
      onChange={(val) =>
        setSelectedCities((prev) =>
          prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
        )
      }
    />

    <CheckboxGroup
      label="Duration"
      icon={FaClock}
      options={durations}
      selected={selectedDays}
      onChange={(val) =>
        setSelectedDays((prev) =>
          prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
        )
      }
    />

    <CheckboxGroup
      label="Experience"
      icon={FaMountain}
      options={moods}
      selected={selectedVibe}
      onChange={(val) => setSelectedVibe(selectedVibe === val ? "All Vibes" : val)}
      single
    />

    <div className="space-y-4 pt-2">
      <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-800">
        <span>Max Budget</span>
        <span className="font-bold text-orange-600">₹{priceRange.toLocaleString()}</span>
      </div>
      <input
        type="range"
        min="5000"
        max="200000"
        step="5000"
        value={priceRange}
        onChange={(event) => setPriceRange(parseInt(event.target.value, 10))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-100 accent-orange-600"
      />
    </div>
  </div>
);

export default TourFiltersContent;
