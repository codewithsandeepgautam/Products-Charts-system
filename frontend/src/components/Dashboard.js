import React, { useState, useEffect, useCallback } from "react";
import Filters from "./Filters";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import { getAnalytics, track } from "../api";

const Dashboard = () => {
  const [filters, setFilters] = useState({
    dateRange: { start: "", end: "" },
    ageGroup: "",
    gender: ""
  });

  const [barData, setBarData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const fetchBarData = useCallback(async () => {
    try {
      const params = {
        startDate: filters.dateRange.start,
        endDate: filters.dateRange.end,
        ageGroup: filters.ageGroup,
        gender: filters.gender
      };

      const res = await getAnalytics(params);

      setBarData(res.data.barData || []);
      setLineData(res.data.lineData || []); // important
    } catch (err) {
      console.error(err);
    }
  }, [filters]);

  const fetchLineData = useCallback(async (feature) => {
    try {
      const params = {
        startDate: filters.dateRange.start,
        endDate: filters.dateRange.end,
        ageGroup: filters.ageGroup,
        gender: filters.gender,
        feature
      };

      const res = await getAnalytics(params);
      setLineData(res.data.lineData || []);
    } catch (err) {
      console.error(err);
    }
  }, [filters]);

  useEffect(() => {
    fetchBarData();
  }, [fetchBarData]);

  const handleBarClick = (featureName) => {
    setSelectedFeature(featureName);
    fetchLineData(featureName);
    track("chart_bar");
  };

  return (
    <div className="dashboard">
      <Filters onFilterChange={setFilters} />
      <div className="charts-grid">
        <BarChart
          data={barData}
          onBarClick={handleBarClick}
        />
        <LineChart
          data={lineData}
        />
      </div>
    </div>
  );
};

export default Dashboard;