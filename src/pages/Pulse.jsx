import { useState, useCallback, useEffect } from "react";
import Card from "../components/Card";
import { fetchPulse } from "../api";

const INITIAL_DATA = [
  { id: 1, place: "Canteen A",        icon: "🍽️", detail: "Ground Floor, Block A",  status: "Busy"    },
  { id: 2, place: "Canteen B",        icon: "🍜", detail: "1st Floor, Block C",      status: "Low"     },
  { id: 3, place: "Main Library",     icon: "📚", detail: "Central Block",           status: "Moderate"},
  { id: 4, place: "Computer Lab 1",   icon: "💻", detail: "Block B, Room 102",       status: "Low"     },
  { id: 5, place: "Sports Ground",    icon: "⚽", detail: "Behind Hostel C",         status: "Busy"    },
  { id: 6, place: "Lecture Hall LH3", icon: "🎓", detail: "Block D, Hall 3",         status: "Moderate"},
];

const STATUSES = ["Busy", "Moderate", "Low"];

function getStatusClass(status) {
  if (status === "Busy")     return "busy";
  if (status === "Moderate") return "moderate";
  return "low";
}

// Smart time-based logic
function getTimeBasedStatus() {
  const hour = new Date().getHours();
  // Peak lunch hours → higher chance of busy
  if (hour >= 12 && hour <= 14) {
    return Math.random() > 0.3 ? "Busy" : "Moderate";
  }
  // Evening hours
  if (hour >= 17 && hour <= 19) {
    return Math.random() > 0.5 ? "Moderate" : "Busy";
  }
  // Off hours
  return STATUSES[Math.floor(Math.random() * STATUSES.length)];
}

export default function Pulse({ goHome }) {
  const [data, setData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await fetchPulse();
      setData(response.data);
      setLastUpdated(new Date());
      setToast(true);
      setTimeout(() => setToast(false), 2500);
    } catch (err) {
      console.error("Failed to fetch pulse data", err);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const busyCount     = data.filter((d) => d.status === "Busy").length;
  const moderateCount = data.filter((d) => d.status === "Moderate").length;
  const lowCount      = data.filter((d) => d.status === "Low").length;

  return (
    <section className="page" aria-label="Campus Pulse">
      <button className="btn-back" onClick={goHome} id="pulse-back-btn">
        ← Back to Home
      </button>

      <h1 className="page-title">🔴 Pulse</h1>
      <p className="page-subtitle">
        Live crowd status for campus hotspots.
        {" "}
        <span style={{ color: "var(--accent-cyan)", fontSize: "0.8rem" }}>
          ⚡ Smart time-based simulation active
        </span>
      </p>

      {/* Summary stats */}
      <div className="stats-row" style={{ marginBottom: 32 }}>
        <Card className="stat-card" id="pulse-stat-busy">
          <div className="stat-value" style={{ background: "linear-gradient(135deg, #ef4444, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {busyCount}
          </div>
          <div className="stat-label">Busy</div>
        </Card>
        <Card className="stat-card" id="pulse-stat-moderate">
          <div className="stat-value" style={{ background: "linear-gradient(135deg, #f59e0b, #eab308)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {moderateCount}
          </div>
          <div className="stat-label">Moderate</div>
        </Card>
        <Card className="stat-card" id="pulse-stat-low">
          <div className="stat-value" style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {lowCount}
          </div>
          <div className="stat-label">Free</div>
        </Card>
      </div>

      <p className="section-title">Locations</p>
      <div className="pulse-grid">
        {data.map((item) => {
          const cls = getStatusClass(item.status);
          return (
            <Card key={item._id} className="pulse-item" id={`pulse-item-${item._id}`}>
              <div className="pulse-item-left">
                <div className="pulse-item-icon">{item.icon}</div>
                <div>
                  <div className="pulse-item-name">{item.place}</div>
                  <div className="pulse-item-detail">📍 {item.detail}</div>
                </div>
              </div>
              <span className={`badge badge-${cls}`}>
                <span className={`dot dot-${cls}`} />
                {item.status}
              </span>
            </Card>
          );
        })}
      </div>

      <div className="refresh-btn-wrap">
        <button
          className="btn-primary"
          onClick={refresh}
          id="pulse-refresh-btn"
          disabled={refreshing}
          style={{ opacity: refreshing ? 0.7 : 1 }}
        >
          {refreshing ? "⏳ Refreshing…" : "🔄 Refresh Status"}
        </button>
        <span className="last-updated">
          Updated: {lastUpdated.toLocaleTimeString()}
        </span>
      </div>

      {toast && (
        <div className="toast" role="alert">
          ✅ Status refreshed successfully!
        </div>
      )}
    </section>
  );
}
