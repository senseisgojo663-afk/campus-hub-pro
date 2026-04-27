import { useState, useEffect } from "react";
import Card from "../components/Card";
import { fetchPrinters } from "../api";

const PRINTERS = [
  {
    id: 1,
    name: "Printer A1",
    location: "Library — Ground Floor",
    icon: "🖨️",
    status: "available",
    queue: 0,
  },
  {
    id: 2,
    name: "Printer B2",
    location: "Block B — Admin Office",
    icon: "🖨️",
    status: "busy",
    queue: 4,
  },
  {
    id: 3,
    name: "Scanner S1",
    location: "Library — 1st Floor",
    icon: "📠",
    status: "available",
    queue: 0,
  },
  {
    id: 4,
    name: "Printer C3",
    location: "Hostel Block C",
    icon: "🖨️",
    status: "offline",
    queue: 0,
  },
  {
    id: 5,
    name: "Color Printer X1",
    location: "Main Block — Room 201",
    icon: "🖨️",
    status: "available",
    queue: 1,
  },
];

function statusLabel(status, queue) {
  if (status === "offline")   return "Offline";
  if (status === "busy")      return `Busy · ${queue} in queue`;
  return "Available";
}

export default function Assist({ goHome }) {
  const [printers, setPrinters] = useState([]);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrinters();
  }, []);

  const loadPrinters = async () => {
    try {
      const response = await fetchPrinters();
      setPrinters(response.data);
    } catch (err) {
      console.error("Failed to load printers", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (printer) => {
    if (printer.status === "offline") return;
    setToast(`📌 Reservation slot noted for ${printer.name}!`);
    setTimeout(() => setToast(""), 3000);
  };

  const handleOpenMap = () => {
    setToast("🗺️ Map feature — integrate Google Maps API for live deployment!");
    setTimeout(() => setToast(""), 3000);
  };

  const available = printers.filter((p) => p.status === "available").length;

  return (
    <section className="page" aria-label="Campus Assist">
      <button className="btn-back" onClick={goHome} id="assist-back-btn">
        ← Back to Home
      </button>

      <h1 className="page-title">🖨️ Assist</h1>
      <p className="page-subtitle">
        Find available printers, scanners, and campus facilities near you.
      </p>

      {/* Quick stat */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(16,185,129,0.1)",
          border: "1px solid rgba(16,185,129,0.3)",
          color: "#34d399",
          padding: "8px 16px",
          borderRadius: 100,
          fontSize: "0.85rem",
          fontWeight: 600,
          marginBottom: 32,
        }}
      >
        <span className="dot dot-available" />
        {available} printers/scanners available right now
      </div>

      {/* Map preview */}
      <div
        className="map-preview"
        id="assist-map-preview"
        onClick={handleOpenMap}
        role="button"
        aria-label="Open campus map"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleOpenMap()}
      >
        <div className="map-pin">📍</div>
        <p>Click to open Campus Map</p>
        <p style={{ fontSize: "0.75rem", opacity: 0.6 }}>
          Live map integration available with Google Maps API
        </p>
      </div>

      {/* Printer list */}
      <p className="section-title">Campus Printers & Scanners</p>
      <div className="assist-grid">
        {printers.map((printer) => (
          <Card key={printer._id} className="assist-item" id={`assist-printer-${printer._id}`}>
            <div className="assist-item-left">
              <div className="assist-icon-box">{printer.icon}</div>
              <div>
                <div className="assist-name">{printer.name}</div>
                <div className="assist-location">📍 {printer.location}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <span className={`badge badge-${printer.status}`}>
                <span className={`dot dot-${printer.status}`} />
                {statusLabel(printer.status, printer.queue)}
              </span>
              {printer.status !== "offline" && (
                <button
                  className="btn-secondary"
                  id={`assist-book-${printer._id}`}
                  onClick={() => handleBook(printer)}
                  style={{ padding: "6px 14px", fontSize: "0.78rem" }}
                >
                  {printer.status === "busy" ? "Join Queue" : "Reserve"}
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {toast && (
        <div className="toast" role="alert">
          {toast}
        </div>
      )}
    </section>
  );
}
