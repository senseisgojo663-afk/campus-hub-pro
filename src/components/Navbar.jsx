import { useState, useEffect } from "react";

const PAGES = [
  { id: "home",     icon: "🏠", label: "Home"     },
  { id: "pulse",    icon: "🔴", label: "Pulse"    },
  { id: "exchange", icon: "🔁", label: "Exchange" },
  { id: "assist",   icon: "🖨️", label: "Assist"  },
];

export default function Navbar({ currentPage, setPage }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const fmt = time.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });

  return (
    <>
      {/* Top bar */}
      <nav className="navbar">
        <div className="navbar-brand" onClick={() => setPage("home")} id="navbar-brand">
          <span className="brand-icon">🏛️</span>
          CampusHub
          <span className="navbar-badge">Pro</span>
        </div>
        <div className="navbar-right">
          <span className="navbar-time">🕐 {fmt}</span>
        </div>
      </nav>

      {/* Bottom navigation */}
      <nav className="bottom-nav" aria-label="Main Navigation">
        {PAGES.map((p) => (
          <button
            key={p.id}
            className={`bnav-item${currentPage === p.id ? " active" : ""}`}
            onClick={() => setPage(p.id)}
            id={`bnav-${p.id}`}
            aria-label={p.label}
          >
            <span className="bnav-icon">{p.icon}</span>
            <span className="bnav-label">{p.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
