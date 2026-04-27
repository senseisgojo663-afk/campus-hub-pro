import { useState, useEffect } from "react";

export default function Navbar({ currentPage, setPage }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <nav className="navbar">
      <div
        className="navbar-brand"
        style={{ cursor: "pointer" }}
        onClick={() => setPage("home")}
        id="navbar-brand"
      >
        <span className="brand-icon">🏛️</span>
        CampusHub
        <span className="navbar-badge">Pro</span>
      </div>

      <div className="navbar-time" aria-live="polite">
        🕐 {formattedTime}
      </div>
    </nav>
  );
}
