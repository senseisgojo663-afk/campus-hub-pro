import { useState, useEffect } from "react";
import Card from "../components/Card";
import { fetchPosts, fetchPrinters, fetchPulse } from "../api";

const navItems = [
  { id: "pulse",    icon: "🔴", title: "Pulse",    accentClass: "card-accent-red",
    desc: "Real-time crowd monitoring for canteens, labs & libraries." },
  { id: "exchange", icon: "🔁", title: "Exchange",  accentClass: "card-accent-blue",
    desc: "Post and browse help requests from your campus community." },
  { id: "assist",   icon: "🖨️", title: "Assist",   accentClass: "card-accent-green",
    desc: "Locate available printers, scanners & campus facilities." },
];

export default function Home({ setPage }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const [stats, setStats] = useState({ posts: 0, printers: 0, busy: 0 });

  useEffect(() => {
    Promise.all([fetchPosts(), fetchPrinters(), fetchPulse()]).then(
      ([postsRes, printersRes, pulseRes]) => {
        setStats({
          posts: postsRes.data.length,
          printers: printersRes.data.filter((p) => p.status === "available").length,
          busy: pulseRes.data.filter((p) => p.status === "Busy").length,
        });
      }
    ).catch(() => {});
  }, []);

  return (
    <section className="page" aria-label="CampusHub Home">
      <div className="home-hero">
        <p className="hero-greeting">Welcome back</p>
        <h1 className="page-title">{greeting} 👋</h1>
        <p className="page-subtitle">
          Your smart campus companion. What do you need today?
        </p>

        <div className="stats-row" role="list">
          <Card className="stat-card" id="stat-busy" role="listitem">
            <div className="stat-value">{stats.busy}</div>
            <div className="stat-label">Busy Spots</div>
          </Card>
          <Card className="stat-card" id="stat-posts" role="listitem">
            <div className="stat-value">{stats.posts}</div>
            <div className="stat-label">Open Requests</div>
          </Card>
          <Card className="stat-card" id="stat-printers" role="listitem">
            <div className="stat-value">{stats.printers}</div>
            <div className="stat-label">Printers Free</div>
          </Card>
        </div>
      </div>

      <p className="section-title">Services</p>
      <div className="home-grid" role="list">
        {navItems.map((item) => (
          <Card
            key={item.id}
            id={`nav-card-${item.id}`}
            className={`nav-card ${item.accentClass}`}
            onClick={() => setPage(item.id)}
            role="listitem"
          >
            <div className="nav-card-icon">{item.icon}</div>
            <div className="nav-card-title">{item.title}</div>
            <div className="nav-card-desc">{item.desc}</div>
            <div className="nav-card-arrow">→</div>
          </Card>
        ))}
      </div>
    </section>
  );
}
