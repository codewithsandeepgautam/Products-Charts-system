import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import DateRangePicker from "./DateRangePicker";
import { track } from "../api";

const Filters = ({ onFilterChange }) => {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [ageGroup, setAgeGroup] = useState("");
  const [gender, setGender] = useState("");

  useEffect(() => {
    const saved = Cookies.get("filters");

    if (saved) {
      const parsed = JSON.parse(saved);
      setDateRange(parsed.dateRange || { start: "", end: "" });
      setAgeGroup(parsed.ageGroup || "");
      setGender(parsed.gender || "");
    }
  }, []);

  useEffect(() => {
    const filters = { dateRange, ageGroup, gender };
    Cookies.set("filters", JSON.stringify(filters), { expires: 7 });
    onFilterChange(filters);
  }, [dateRange, ageGroup, gender, onFilterChange]);

  const handleDateApply = (range) => {
    setDateRange({
      start: range.start.toISOString(),
      end: range.end.toISOString(),
    });

    track("date_picker");
  };

  return (
    <div className="filters-wrapper">
      <div className="filters-row">
        <div className="date-picker-box">
          <DateRangePicker onChange={handleDateApply} />
        </div>

      </div>

      <div className="age-gender-filters">
        <select
          value={ageGroup}
          onChange={(e) => {
            setAgeGroup(e.target.value);
            track("filter_age");
          }}
        >
          <option value="">All</option>
          <option value="<18">&lt;18</option>
          <option value="18-40">18-40</option>
          <option value=">40">&gt;40</option>
        </select>

        <select
          value={gender}
          onChange={(e) => {
            setGender(e.target.value);
            track("filter_gender");
          }}
        >
          <option value="">All</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;