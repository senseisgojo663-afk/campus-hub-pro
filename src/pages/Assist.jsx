import { useState, useEffect } from "react";
import Card from "../components/Card";
import { fetchPrinters } from "../api";

// Francis Xavier Engineering College coordinates
const COLLEGE_LAT = 8.7379;
const COLLEGE_LNG = 77.7029;

// OpenStreetMap embed URL with marker on the college
const MAP_EMBED_URL = `https://www.openstreetmap.org/export/embed.html?bbox=${COLLEGE_LNG - 0.008},${COLLEGE_LAT - 0.006},${COLLEGE_LNG + 0.008},${COLLEGE_LAT + 0.006}&layer=mapnik&marker=${COLLEGE_LAT},${COLLEGE_LNG}`;
const MAP_LINK = `https://www.openstreetmap.org/?mlat=${COLLEGE_LAT}&mlon=${COLLEGE_LNG}#map=16/${COLLEGE_LAT}/${COLLEGE_LNG}`;

function statusLabel(status, queue) {
  if (status === "offline") return "Offline";
  if (status === "busy")    return `Busy · ${queue} in queue`;
  return "Available";
}

export default function Assist({ goHome }) {
  const [printers, setPrinters] = useState([]);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadPrinters(); }, []);

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
      <div className="available-badge">
        <span className="dot dot-available" />
        {available} printers/scanners available right now
      </div>

      {/* Campus Illustration + Map */}
      <p className="section-title">Campus Location</p>
      <div className="campus-map-wrapper">

        {/* Animated campus scene */}
        <div className="campus-scene" aria-label="Francis Xavier Engineering College illustration">

          {/* Sky & clouds */}
          <div className="campus-sky">
            <div className="cloud cloud-1" />
            <div className="cloud cloud-2" />
            <div className="cloud cloud-3" />
            {/* Birds */}
            <div className="bird bird-1">〜</div>
            <div className="bird bird-2">〜</div>
            <div className="bird bird-3">〜</div>
            {/* Sun */}
            <div className="campus-sun" />
          </div>

          {/* Main building */}
          <div className="campus-ground">

            {/* Flag pole */}
            <div className="flag-pole">
              <div className="flag" />
            </div>

            {/* College name sign */}
            <div className="college-sign">FXEC</div>

            {/* Main block */}
            <div className="building main-building">
              <div className="building-roof" />
              <div className="building-body">
                {/* Windows row 1 */}
                <div className="win-row">
                  {[0,1,2,3,4].map(i => <div key={i} className={`window win-${i%3}`} />)}
                </div>
                {/* Windows row 2 */}
                <div className="win-row">
                  {[0,1,2,3,4].map(i => <div key={i} className={`window win-${(i+1)%3}`} />)}
                </div>
                {/* Gate */}
                <div className="gate">
                  <div className="gate-arch" />
                </div>
              </div>
            </div>

            {/* Left wing */}
            <div className="building wing-left">
              <div className="building-roof" />
              <div className="building-body small">
                <div className="win-row">
                  {[0,1,2].map(i => <div key={i} className={`window win-${i%3}`} />)}
                </div>
                <div className="win-row">
                  {[0,1,2].map(i => <div key={i} className={`window win-${(i+2)%3}`} />)}
                </div>
              </div>
            </div>

            {/* Right wing */}
            <div className="building wing-right">
              <div className="building-roof" />
              <div className="building-body small">
                <div className="win-row">
                  {[0,1,2].map(i => <div key={i} className={`window win-${(i+1)%3}`} />)}
                </div>
                <div className="win-row">
                  {[0,1,2].map(i => <div key={i} className={`window win-${i%3}`} />)}
                </div>
              </div>
            </div>

            {/* Trees */}
            <div className="tree tree-1"><div className="tree-top" /><div className="tree-trunk" /></div>
            <div className="tree tree-2"><div className="tree-top" /><div className="tree-trunk" /></div>
            <div className="tree tree-3"><div className="tree-top" /><div className="tree-trunk" /></div>
            <div className="tree tree-4"><div className="tree-top" /><div className="tree-trunk" /></div>

            {/* Road / path */}
            <div className="campus-road">
              <div className="road-mark" /><div className="road-mark" /><div className="road-mark" />
            </div>
          </div>

          {/* Location pin */}
          <div className="scene-pin">
            <div className="scene-pin-dot" />
            <div className="scene-pin-ring r1" />
            <div className="scene-pin-ring r2" />
            <div className="scene-pin-ring r3" />
          </div>
        </div>

        {/* Map header */}
        <div className="campus-map-header">
          <div className="campus-map-info">
            <span className="campus-map-name">
              🏛️ Francis Xavier Engineering College
              <span className="map-live-badge">
                <span className="map-live-dot" />
                Live
              </span>
            </span>
            <span className="campus-map-address">
              103/G2, Bypass Road, Vannarpettai, Tirunelveli – 627 003, Tamil Nadu
            </span>
          </div>
          <a href={MAP_LINK} target="_blank" rel="noopener noreferrer" className="campus-map-open-btn">
            Open Map ↗
          </a>
        </div>

        {/* Iframe */}
        <div className="campus-map-iframe-wrap">
          <iframe
            id="campus-map-iframe"
            title="Francis Xavier Engineering College Campus Map"
            src={MAP_EMBED_URL}
            className="campus-map-iframe"
            loading="lazy"
            allowFullScreen
          />

          {/* Animated overlay — centered exactly where the OSM pin sits */}
          <div className="map-pin-overlay">
            {/* Expanding sonar rings */}
            <div className="sonar-ring sr1" />
            <div className="sonar-ring sr2" />
            <div className="sonar-ring sr3" />
            <div className="sonar-ring sr4" />
            {/* Glowing dot */}
            <div className="sonar-dot" />
            {/* Floating label */}
            <div className="pin-label">
              🏛️ FXEC
            </div>
          </div>
        </div>

        <div className="campus-map-footer">
          <span>📍 Powered by OpenStreetMap · Francis Xavier Engineering College</span>
        </div>
      </div>

      {/* Printer list */}
      <p className="section-title">Campus Printers &amp; Scanners</p>
      <div className="assist-grid">
        {loading ? (
          <div style={{ textAlign: "center", padding: "32px" }}>
            <span className="spinner" />
          </div>
        ) : (
          printers.map((printer) => (
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
          ))
        )}
      </div>

      {toast && <div className="toast" role="alert">{toast}</div>}
    </section>
  );
}
