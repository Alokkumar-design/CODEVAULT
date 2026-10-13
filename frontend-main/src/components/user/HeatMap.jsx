import React, { useEffect, useState } from "react";
import HeatMap from "@uiw/react-heat-map";

const generateRecentActivityData = () => {
  const data = [];
  const today = new Date();
  const past = new Date();
  past.setMonth(today.getMonth() - 5);

  let cur = new Date(past);
  while (cur <= today) {
    // Generate realistic contribution distribution
    const rand = Math.random();
    const count = rand > 0.5 ? Math.floor(Math.random() * 8) + 1 : 0;
    data.push({
      date: cur.toISOString().split("T")[0],
      count,
    });
    cur.setDate(cur.getDate() + 1);
  }
  return { data, startDate: past };
};

const HeatMapProfile = () => {
  const [activityData, setActivityData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());

  const panelColors = {
    0: "#161b22",
    1: "#0e4429",
    2: "#006d32",
    4: "#26a641",
    8: "#39d353",
  };

  useEffect(() => {
    const { data, startDate } = generateRecentActivityData();
    setActivityData(data);
    setStartDate(startDate);
  }, []);

  const totalContributions = activityData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: "10px", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#f0f6fc" }}>
          {totalContributions} contributions in the last 6 months
        </h4>
        <span style={{ fontSize: "11px", color: "#8b949e" }}>Contribution settings ▾</span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <HeatMap
          style={{ color: "#8b949e" }}
          value={activityData}
          weekLabels={["", "Mon", "", "Wed", "", "Fri", ""]}
          startDate={startDate}
          rectSize={12}
          space={3}
          rectProps={{ rx: 2 }}
          panelColors={panelColors}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "6px", fontSize: "11px", color: "#8b949e", marginTop: "12px" }}>
        <span>Less</span>
        <span style={{ width: "10px", height: "10px", background: "#161b22", borderRadius: "2px", display: "inline-block", border: "1px solid #30363d" }}></span>
        <span style={{ width: "10px", height: "10px", background: "#0e4429", borderRadius: "2px", display: "inline-block" }}></span>
        <span style={{ width: "10px", height: "10px", background: "#006d32", borderRadius: "2px", display: "inline-block" }}></span>
        <span style={{ width: "10px", height: "10px", background: "#26a641", borderRadius: "2px", display: "inline-block" }}></span>
        <span style={{ width: "10px", height: "10px", background: "#39d353", borderRadius: "2px", display: "inline-block" }}></span>
        <span>More</span>
      </div>
    </div>
  );
};

export default HeatMapProfile;
