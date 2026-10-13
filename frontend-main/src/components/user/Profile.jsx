import React, { useEffect, useState } from "react";
import axios from "axios";
import "./profile.css";
import Navbar from "../Navbar";
import HeatMapProfile from "./HeatMap";

const Profile = () => {
  const [userDetails, setUserDetails] = useState({ username: "alokkumar", email: "alok@example.com" });
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const userId = localStorage.getItem("userId") || "mock-user";
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/userProfile/${userId}`
        );
        if (response.data) {
          setUserDetails(response.data);
        }
      } catch (err) {
        console.error("Cannot fetch user details: ", err);
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <>
      <Navbar />

      {/* Profile Subnav Tabs */}
      <div style={{ background: "#010409", borderBottom: "1px solid #21262d", padding: "0 28px" }}>
        <div style={{ display: "flex", gap: "20px", maxWidth: "1280px", margin: "0 auto", fontSize: "14px" }}>
          <button
            onClick={() => setActiveTab("overview")}
            style={{
              background: "transparent",
              border: "none",
              borderBottom: activeTab === "overview" ? "2px solid #f78166" : "2px solid transparent",
              color: activeTab === "overview" ? "#f0f6fc" : "#8b949e",
              fontWeight: activeTab === "overview" ? "600" : "400",
              padding: "12px 6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>📖 Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("repositories")}
            style={{
              background: "transparent",
              border: "none",
              borderBottom: activeTab === "repositories" ? "2px solid #f78166" : "2px solid transparent",
              color: activeTab === "repositories" ? "#f0f6fc" : "#8b949e",
              fontWeight: activeTab === "repositories" ? "600" : "400",
              padding: "12px 6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>📦 Repositories</span>
          </button>
        </div>
      </div>

      {/* Main Profile Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "32px", maxWidth: "1280px", margin: "32px auto", padding: "0 28px" }}>
        {/* Left Column: User Card */}
        <div>
          <div style={{ width: "180px", height: "180px", borderRadius: "50%", background: "linear-gradient(135deg, #a371f7, #1f6feb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "70px", border: "2px solid #30363d", boxShadow: "0 0 24px rgba(31,111,235,0.25)", margin: "0 auto 16px 0" }}>
            👨‍💻
          </div>

          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f0f6fc", margin: "0" }}>
            {userDetails.username || "Alok Kumar"}
          </h2>
          <div style={{ color: "#8b949e", fontSize: "16px", marginBottom: "16px" }}>
            @{userDetails.username || "alokkumar"}
          </div>

          <p style={{ fontSize: "14px", color: "#c9d1d9", lineHeight: "1.5", marginBottom: "16px" }}>
            Full-stack developer building decentralized systems, version control engines, and modern web applications.
          </p>

          <button
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: "#21262d",
              border: "1px solid #30363d",
              borderRadius: "6px",
              color: "#c9d1d9",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              marginBottom: "20px",
            }}
          >
            Edit profile
          </button>

          <div style={{ fontSize: "13px", color: "#8b949e", display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid #21262d", paddingTop: "16px" }}>
            <div>👥 <strong>42</strong> followers · <strong>19</strong> following</div>
            <div>📍 New Delhi, India</div>
            <div>✉️ {userDetails.email || "alok@example.com"}</div>
            <div>🔗 github.com/Alokkumar-design</div>
          </div>
        </div>

        {/* Right Column: Heatmap & Overview */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#f0f6fc", marginBottom: "12px" }}>
              Contribution Activity
            </h3>
            <HeatMapProfile />
          </div>

          <div>
            <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#f0f6fc", marginBottom: "12px" }}>
              Pinned Repositories
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: "8px", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ color: "#58a6ff", fontWeight: "600", fontSize: "14px" }}>CODEVAULT</span>
                  <span style={{ fontSize: "11px", color: "#8b949e", border: "1px solid #30363d", padding: "1px 6px", borderRadius: "10px" }}>Public</span>
                </div>
                <p style={{ fontSize: "12px", color: "#8b949e", margin: "0 0 16px 0" }}>
                  A GitHub-like version control system built with Node.js and MongoDB.
                </p>
                <div style={{ fontSize: "12px", color: "#8b949e", display: "flex", gap: "16px" }}>
                  <span>🟡 JavaScript</span>
                  <span>⭐ 14</span>
                </div>
              </div>

              <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: "8px", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ color: "#58a6ff", fontWeight: "600", fontSize: "14px" }}>my-sandbox</span>
                  <span style={{ fontSize: "11px", color: "#8b949e", border: "1px solid #30363d", padding: "1px 6px", borderRadius: "10px" }}>Public</span>
                </div>
                <p style={{ fontSize: "12px", color: "#8b949e", margin: "0 0 16px 0" }}>
                  Testing custom Git snapshots, staging area, and commit hashes.
                </p>
                <div style={{ fontSize: "12px", color: "#8b949e", display: "flex", gap: "16px" }}>
                  <span>🔵 TypeScript</span>
                  <span>⭐ 8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
