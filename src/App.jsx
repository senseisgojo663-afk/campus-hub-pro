import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Home from "./pages/Home";
import Pulse from "./pages/Pulse";
import Exchange from "./pages/Exchange";
import Assist from "./pages/Assist";
import Navbar from "./components/Navbar";
import "./index.css";

const SERVER_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace("/api", "")
  : "http://localhost:5001";

function getSessionId() {
  let id = localStorage.getItem("campus_session_id");
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem("campus_session_id", id);
  }
  return id;
}

export default function App() {
  const [page, setPage] = useState("home");
  const [broadcastNotif, setBroadcastNotif] = useState(null);
  const socketRef = useRef(null);
  const sessionId = getSessionId();

  // Global socket connection — active on all pages
  useEffect(() => {
    const socket = io(SERVER_URL, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.emit("join_session", sessionId);

    // Listen for new post broadcasts from any user
    socket.on("new_post_notification", (data) => {
      // Don't notify the person who posted
      if (data.posterSessionId === sessionId) return;

      setBroadcastNotif(data);
      setTimeout(() => setBroadcastNotif(null), 6000);
    });

    return () => socket.disconnect();
  }, [sessionId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const renderPage = () => {
    switch (page) {
      case "pulse":    return <Pulse    goHome={() => setPage("home")} />;
      case "exchange": return <Exchange goHome={() => setPage("home")} sessionId={sessionId} />;
      case "assist":   return <Assist   goHome={() => setPage("home")} />;
      default:         return <Home setPage={setPage} />;
    }
  };

  return (
    <div className="app">
      <Navbar currentPage={page} setPage={setPage} />
      <main>{renderPage()}</main>

      {/* Global broadcast notification — shown on ALL pages */}
      {broadcastNotif && (
        <div className="broadcast-notification" role="alert">
          <div className="broadcast-icon">📢</div>
          <div className="broadcast-content">
            <div className="broadcast-title">New Request Posted!</div>
            <div className="broadcast-author">
              <strong>{broadcastNotif.author}</strong> needs help with{" "}
              <span className="broadcast-category">{broadcastNotif.category}</span>
            </div>
            <div className="broadcast-body">"{broadcastNotif.body}"</div>
            <button
              className="broadcast-action"
              onClick={() => { setPage("exchange"); setBroadcastNotif(null); }}
            >
              View Request →
            </button>
          </div>
          <button
            className="help-notif-close"
            onClick={() => setBroadcastNotif(null)}
            aria-label="Dismiss"
          >✕</button>
        </div>
      )}
    </div>
  );
}
