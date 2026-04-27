import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Pulse from "./pages/Pulse";
import Exchange from "./pages/Exchange";
import Assist from "./pages/Assist";
import Navbar from "./components/Navbar";
import "./index.css";

export default function App() {
  const [page, setPage] = useState("home");

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const renderPage = () => {
    switch (page) {
      case "pulse":    return <Pulse    goHome={() => setPage("home")} />;
      case "exchange": return <Exchange goHome={() => setPage("home")} />;
      case "assist":   return <Assist   goHome={() => setPage("home")} />;
      default:         return <Home setPage={setPage} />;
    }
  };

  return (
    <div className="app">
      <Navbar currentPage={page} setPage={setPage} />
      <main>
        {renderPage()}
      </main>
    </div>
  );
}
