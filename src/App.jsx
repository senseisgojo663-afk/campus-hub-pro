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

// Register the service worker once
async function registerSW() {
  if (!("serviceWorker" in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    await navigator.serviceWorker.ready;
    return reg;
  } catch (e) {
    console.warn("SW registration failed:", e);
    return null;
  }
}

// Show a notification via the service worker (works even when tab is backgrounded)
async function showPushNotification(title, body) {
  if (!("serviceWorker" in navigator)) return;
  if (Notification.permission !== "granted") return;
  try {
    const reg = await navigator.serviceWorker.ready;
    reg.active?.postMessage({
      type: "SHOW_NOTIFICATION",
      payload: { title, body, icon: "/favicon.svg", tag: "campushub-help" }
    });
  } catch (e) {
    // Fallback to basic Notification API
    try { new Notification(title, { body, icon: "/favicon.svg" }); } catch (_) {}
  }
}

export default function App() {
  const [page, setPage] = useState("home");
  const [broadcastNotif, setBroadcastNotif] = useState(null);
  const [notifPermission, setNotifPermission] = useState(
    "Notification" in window ? Notification.permission : "denied"
  );
  const socketRef = useRef(null);
  const sessionId = getSessionId();

  // Register service worker on mount
  useEffect(() => {
    registerSW();
  }, []);

  // Global socket connection — active on all pages
  useEffect(() => {
    const socket = io(SERVER_URL, { transports: ["websocket", "polling"] });
    socketRef.current = socket;
    socket.emit("join_session", sessionId);

    socket.on("new_post_notification", (data) => {
      if (data.posterSessionId === sessionId) return;
      setBroadcastNotif(data);
      setTimeout(() => setBroadcastNotif(null), 6000);
      // Fire OS notification via service worker
      showPushNotification(
        "CampusHub · New Request 📢",
        `${data.author} needs ${data.category} help: "${data.body}"`
      );
    });

    socket.on("help_notification", (data) => {
      // This fires when someone clicks "I can help!" on your post
      showPushNotification(
        `CampusHub · ${data.helperName} can help you! 🤝`,
        `${data.helperName} can help with your ${data.category} request: "${data.postBody}"`
      );
    });

    return () => socket.disconnect();
  }, [sessionId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // Browsers REQUIRE a user gesture (button tap) to show the permission dialog
  const requestNotifPermission = async () => {
    if (!("Notification" in window)) {
      alert("Your browser doesn't support notifications. Try Chrome or Safari on iOS 16.4+.");
      return;
    }
    const result = await Notification.requestPermission();
    setNotifPermission(result);
    if (result === "granted") {
      // Register SW first, then test notification
      await registerSW();
      showPushNotification(
        "CampusHub Notifications Enabled! 🎉",
        "You'll now get alerts when someone can help you."
      );
    } else if (result === "denied") {
      alert(
        "Notifications were blocked.\n\nTo fix this:\n1. Tap the 🔒 lock/info icon in your browser address bar\n2. Find 'Notifications' → set to Allow\n3. Refresh the page"
      );
    }
  };

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

      {/* Enable Notifications banner */}
      {(notifPermission === "default" || notifPermission === "denied") && notifPermission !== "dismissed" && (
        <div className={`notif-enable-bar ${notifPermission === "denied" ? "notif-bar-blocked" : ""}`}>
          <span className="notif-enable-text">
            {notifPermission === "denied"
              ? "🚫 Notifications blocked — tap to see how to enable them"
              : "🔔 Enable notifications to get real-time help alerts on your device"}
          </span>
          <button
            className="notif-enable-btn"
            id="enable-notifications-btn"
            onClick={requestNotifPermission}
          >
            {notifPermission === "denied" ? "How to fix" : "Enable"}
          </button>
          <button
            className="notif-enable-dismiss"
            onClick={() => setNotifPermission("dismissed")}
            aria-label="Dismiss"
          >✕</button>
        </div>
      )}

      <main>{renderPage()}</main>

      {/* OS-style in-app notification stack */}
      <div className="notif-stack">
        {broadcastNotif && (
          <div
            className="os-notif"
            role="alert"
            onClick={() => { setPage("exchange"); setBroadcastNotif(null); }}
          >
            <div className="os-notif-icon cyan">📢</div>
            <div className="os-notif-body">
              <div className="os-notif-header">
                <span className="os-notif-app">CampusHub · Exchange</span>
                <span className="os-notif-time">now</span>
              </div>
              <div className="os-notif-title">
                {broadcastNotif.author} needs {broadcastNotif.category} help
              </div>
              <div className="os-notif-msg">"{broadcastNotif.body}"</div>
            </div>
            <button className="os-notif-action" onClick={(e) => { e.stopPropagation(); setPage("exchange"); setBroadcastNotif(null); }}>
              View
            </button>
            <button className="os-notif-close" onClick={(e) => { e.stopPropagation(); setBroadcastNotif(null); }} aria-label="Dismiss">✕</button>
            <div className="os-notif-progress cyan" />
          </div>
        )}
      </div>
    </div>
  );
}
