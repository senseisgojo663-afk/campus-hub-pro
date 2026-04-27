import Card from "../components/Card";

const navItems = [
  {
    id: "pulse",
    icon: "🔴",
    title: "Pulse",
    desc: "Real-time crowd monitoring for campus hotspots — canteens, labs, and libraries.",
    accentClass: "card-accent-red",
  },
  {
    id: "exchange",
    icon: "🔁",
    title: "Exchange",
    desc: "Post and browse help requests from your campus community. Borrow, trade, assist.",
    accentClass: "card-accent-blue",
  },
  {
    id: "assist",
    icon: "🖨️",
    title: "Assist",
    desc: "Locate available printers, scanners and campus facilities near you.",
    accentClass: "card-accent-green",
  },
];

export default function Home({ setPage }) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <section className="page" aria-label="CampusHub Home">
      <div className="home-hero">
        <h1 className="page-title">
          {greeting} 👋
        </h1>
        <p className="page-subtitle">
          What do you need today? Choose a campus service below.
        </p>

        <div className="stats-row" role="list" aria-label="Campus statistics">
          <Card className="stat-card" id="stat-active-users" role="listitem">
            <div className="stat-value">247</div>
            <div className="stat-label">Active Students</div>
          </Card>
          <Card className="stat-card" id="stat-posts" role="listitem">
            <div className="stat-value">12</div>
            <div className="stat-label">Open Requests</div>
          </Card>
          <Card className="stat-card" id="stat-printers" role="listitem">
            <div className="stat-value">5</div>
            <div className="stat-label">Printers Available</div>
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
