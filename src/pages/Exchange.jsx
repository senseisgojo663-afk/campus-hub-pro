import { useState, useRef, useEffect } from "react";
import Card from "../components/Card";
import { fetchPosts, createPost, deletePost } from "../api";

const CATEGORIES = ["Books", "Notes", "Equipment", "Food", "Other"];

const SAMPLE_POSTS = [
  {
    id: 1,
    author: "Priya S.",
    initials: "PS",
    time: "2 min ago",
    category: "Notes",
    body: "Looking for Operating Systems notes from last semester — specifically Unit 4 (Memory Management). Happy to trade DSA notes!",
  },
  {
    id: 2,
    author: "Rahul M.",
    initials: "RM",
    time: "15 min ago",
    category: "Books",
    body: "Does anyone have 'Computer Networks' by Forouzan (5th edition)? Need it for just two days for exam prep.",
  },
];

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

let nextId = 3;

export default function Exchange({ goHome }) {
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Other");
  const [body, setBody] = useState("");
  const [toast, setToast] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const bodyRef = useRef();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await fetchPosts();
      setPosts(response.data);
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
    const newPostData = {
      author: authorName,
      initials: getInitials(authorName),
      category,
      body: body.trim(),
    };

    try {
      const response = await createPost(newPostData);
      setPosts([response.data, ...posts]);
      setName("");
      setBody("");
      setCategory("Other");
      setToast(true);
      setTimeout(() => setToast(false), 2500);
    } catch (err) {
      console.error("Failed to create post", err);
      setError("Failed to post request. Please try again.");
    }
  };

  const handleHelp = async (id) => {
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete post", err);
    }
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
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <textarea
            ref={bodyRef}
            className="form-textarea"
            id="exchange-body-input"
            placeholder="What do you need? Be specific — e.g. 'Looking for Engineering Maths notes, Unit 3'"
            rows={3}
            value={body}
            onChange={(e) => { setBody(e.target.value); setError(""); }}
          />
          {error && (
            <p style={{ color: "var(--accent-red)", fontSize: "0.8rem" }}>
              ⚠️ {error}
            </p>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="btn-primary" id="exchange-post-btn" onClick={handlePost}>
              + Post Request
            </button>
          </div>
        </div>
      </Card>

      {/* Posts list */}
      <p className="section-title">Active Requests ({posts.length})</p>

      {posts.length === 0 ? (
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
                    <div className="post-time">{new Date(post.createdAt).toLocaleString()}</div>
                  </div>
                </div>
                <span className="post-category">{post.category}</span>
              </div>
              <p className="post-body">{post.body}</p>
              <div className="post-actions">
                <button
                  className="btn-action"
                  id={`exchange-help-${post._id}`}
                  onClick={() => handleHelp(post._id)}
                >
                  ✅ I can help!
                </button>
                <button className="btn-action" id={`exchange-share-${post._id}`}>
                  🔗 Share
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {toast && (
        <div className="toast" role="alert">
          ✅ Request posted successfully!
        </div>
      )}
    </section>
  );
}
