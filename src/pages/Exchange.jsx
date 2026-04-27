import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Card from "../components/Card";
import { fetchPosts, createPost, offerHelp } from "../api";

const CATEGORIES = ["Books", "Notes", "Equipment", "Food", "Other"];
const SERVER_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace("/api", "")
  : "http://localhost:5001";

// Get or create a persistent session ID for this browser
function getSessionId() {
  let id = localStorage.getItem("campus_session_id");
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem("campus_session_id", id);
  }
  return id;
}

function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function Exchange({ goHome }) {
  const sessionId = getSessionId();
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Other");
  const [body, setBody] = useState("");
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const bodyRef = useRef();
  const socketRef = useRef(null);

  // Connect Socket.io and join session room
  useEffect(() => {
    const socket = io(SERVER_URL, { transports: ["websocket", "polling"] });
    socketRef.current = socket;
    socket.emit("join_session", sessionId);

    // Listen for help notifications meant for this user
    socket.on("help_notification", (data) => {
      setNotification(data);
      // Auto-dismiss after 7 seconds
      setTimeout(() => setNotification(null), 7000);
    });

    return () => socket.disconnect();
  }, [sessionId]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const res = await fetchPosts();
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to load posts", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!body.trim()) {
      setError("Please write your request before posting.");
      bodyRef.current?.focus();
      return;
    }
    setError("");
    const authorName = name.trim() || "Anonymous";
    try {
      const res = await createPost({
        author: authorName,
        initials: getInitials(authorName),
        category,
        body: body.trim(),
        sessionId,       // ← attach this user's session so notifications can be sent back
      });
      setPosts([res.data, ...posts]);
      setName("");
      setBody("");
      setCategory("Other");
      showToast("✅ Request posted!");
    } catch (err) {
      setError("Failed to post. Please try again.");
    }
  };

  const handleHelp = async (post) => {
    try {
      const helperName = name.trim() || "Someone";
      await offerHelp(post._id, helperName);
      setPosts((prev) => prev.filter((p) => p._id !== post._id));
      showToast("🤝 Help offered! The poster has been notified.");
    } catch (err) {
      console.error("Failed to offer help", err);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <section className="page" aria-label="Exchange Board">
      <button className="btn-back" onClick={goHome} id="exchange-back-btn">
        ← Back to Home
      </button>

      <h1 className="page-title">🔁 Exchange</h1>
      <p className="page-subtitle">
        Request help, share resources, and connect with your campus community.
      </p>

      {/* Post form */}
      <p className="section-title">Post a Request</p>
      <Card className="glass-card" id="exchange-form-card" style={{ marginBottom: 28 }}>
        <div className="exchange-form">
          <div className="form-row">
            <input
              className="form-input"
              id="exchange-name-input"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <select
              className="form-select"
              id="exchange-category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <textarea
            ref={bodyRef}
            className="form-textarea"
            id="exchange-body-input"
            placeholder="What do you need? e.g. 'Looking for OS notes, Unit 4'"
            rows={3}
            value={body}
            onChange={(e) => { setBody(e.target.value); setError(""); }}
          />
          {error && <p style={{ color: "var(--red)", fontSize: "0.8rem" }}>⚠️ {error}</p>}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="btn-primary" id="exchange-post-btn" onClick={handlePost}>
              + Post Request
            </button>
          </div>
        </div>
      </Card>

      {/* Posts list */}
      <p className="section-title">Active Requests ({posts.length})</p>

      {loading ? (
        <div style={{ textAlign: "center", padding: "32px" }}>
          <span className="spinner" />
        </div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p>No requests yet. Be the first to post!</p>
        </div>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <Card key={post._id} className="post-card" id={`exchange-post-${post._id}`}>
              <div className="post-header">
                <div className="post-author">
                  <div className="post-avatar">{post.initials}</div>
                  <div>
                    <div className="post-name">{post.author}</div>
                    <div className="post-time">
                      {new Date(post.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <span className="post-category">{post.category}</span>
              </div>
              <p className="post-body">{post.body}</p>
              <div className="post-actions">
                <button
                  className="btn-action"
                  id={`exchange-help-${post._id}`}
                  onClick={() => handleHelp(post)}
                >
                  🤝 I can help!
                </button>
                <button className="btn-action" id={`exchange-share-${post._id}`}>
                  🔗 Share
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Standard toast */}
      {toast && <div className="toast" role="alert">{toast}</div>}

      {/* Real-time help notification popup */}
      {notification && (
        <div className="help-notification" role="alert">
          <div className="help-notif-icon">🤝</div>
          <div className="help-notif-content">
            <div className="help-notif-title">Someone wants to help!</div>
            <div className="help-notif-body">
              <strong>{notification.helperName}</strong> offered help for your{" "}
              <em>{notification.category}</em> request.
            </div>
            <div className="help-notif-snippet">"{notification.postBody}"</div>
          </div>
          <button
            className="help-notif-close"
            onClick={() => setNotification(null)}
            aria-label="Dismiss"
          >✕</button>
        </div>
      )}
    </section>
  );
}
