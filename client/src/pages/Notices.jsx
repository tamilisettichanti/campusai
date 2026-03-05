import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getNotices, createNotice, deleteNotice } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import {
  Bell, Plus, Trash2, X, ChevronDown,
  AlertCircle, Clock, ArrowRight
} from "lucide-react";
import toast from "react-hot-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
};
const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

export default function Notices() {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("all");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [targetBranch, setTargetBranch] = useState("ALL");
  const [targetYear, setTargetYear] = useState("ALL");
  const [important, setImportant] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [focused, setFocused] = useState("");

  useEffect(() => { fetchNotices(); }, []);

  const fetchNotices = async () => {
    try {
      const { data } = await getNotices();
      setNotices(data);
    } catch { toast.error("Failed to load notices"); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createNotice({ title, content, targetBranch, targetYear, important });
      toast.success("Notice posted!");
      setShowForm(false);
      setTitle(""); setContent("");
      setTargetBranch("ALL"); setTargetYear("ALL");
      setImportant(false);
      fetchNotices();
    } catch { toast.error("Failed to post notice"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotice(id);
      setNotices(prev => prev.filter(n => n._id !== id));
      toast.success("Notice deleted.");
    } catch { toast.error("Failed to delete"); }
  };

  const filtered = filter === "important"
    ? notices.filter(n => n.important) : notices;

  const fieldWrap = (name) => ({
    borderRadius: "10px",
    border: focused === name
      ? "2px solid var(--accent)"
      : "1.5px solid var(--border)",
    background: focused === name ? "var(--accent-bg)" : "var(--bg2)",
    transition: "all 0.25s ease",
    overflow: "hidden",
    marginBottom: "12px",
  });

  const inputStyle = {
    width: "100%", padding: "8px 16px 14px",
    background: "transparent", border: "none",
    outline: "none", fontSize: "14px",
    fontWeight: "600", color: "var(--text)",
    fontFamily: "'Space Grotesk', sans-serif",
  };

  const labelStyle = (name) => ({
    display: "block", fontSize: "10px",
    fontWeight: "700", textTransform: "uppercase",
    letterSpacing: "0.15em",
    color: focused === name ? "var(--accent)" : "var(--text3)",
    padding: "10px 16px 2px", transition: "color 0.25s ease",
  });

  const canPost = ["admin", "faculty"].includes(user?.role);

  if (loading) return (
    <div style={{
      display: "flex", alignItems: "center",
      justifyContent: "center", height: "60vh",
      flexDirection: "column", gap: "16px",
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{
          width: "36px", height: "36px",
          border: "3px solid var(--border)",
          borderTopColor: "var(--accent)", borderRadius: "50%",
        }}
      />
      <p style={{ color: "var(--text3)", fontSize: "13px",
        fontWeight: "600", textTransform: "uppercase",
        letterSpacing: "0.1em" }}>Loading Notices...</p>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>

      {/* ── Page Header ── */}
      <div style={{
        borderBottom: "1px solid var(--border)",
        padding: "28px 32px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap", gap: "16px",
      }}>
        <div>
          <p style={{
            fontSize: "10px", fontWeight: "700",
            textTransform: "uppercase", letterSpacing: "0.2em",
            color: "var(--text3)", marginBottom: "6px",
          }}>CAMPUS BOARD</p>
          <h1 style={{
            fontSize: "32px", fontWeight: "900",
            letterSpacing: "-0.04em", color: "var(--text)",
            lineHeight: 1,
          }}>Notices</h1>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {/* Filter */}
          <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
            {["all", "important"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{
                  padding: "8px 16px",
                  background: filter === f ? "var(--accent)" : "transparent",
                  border: "none", color: filter === f ? "white" : "var(--text3)",
                  fontSize: "12px", fontWeight: "700",
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  cursor: "pointer", transition: "all 0.2s ease",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}>{f}</button>
            ))}
          </div>
          {canPost && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowForm(true)}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "10px 18px",
                background: "var(--accent)", border: "none",
                borderRadius: "8px", color: "white",
                fontSize: "12px", fontWeight: "700",
                textTransform: "uppercase", letterSpacing: "0.1em",
                cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              <Plus size={14} /> Post Notice
            </motion.button>
          )}
        </div>
      </div>

      {/* ── Create Form Modal ── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 50,
              background: "rgba(0,0,0,0.6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "24px",
            }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: "100%", maxWidth: "560px",
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "16px", overflow: "hidden",
              }}
            >
              <div style={{
                padding: "20px 24px",
                borderBottom: "1px solid var(--border)",
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
              }}>
                <div>
                  <p style={{
                    fontSize: "10px", fontWeight: "700",
                    textTransform: "uppercase", letterSpacing: "0.2em",
                    color: "var(--text3)",
                  }}>NEW NOTICE</p>
                  <h3 style={{
                    fontSize: "18px", fontWeight: "800",
                    letterSpacing: "-0.03em", color: "var(--text)",
                  }}>Post to Campus Board</h3>
                </div>
                <button onClick={() => setShowForm(false)}
                  style={{
                    background: "var(--bg2)", border: "1px solid var(--border)",
                    borderRadius: "8px", padding: "6px",
                    cursor: "pointer", color: "var(--text2)",
                    display: "flex", alignItems: "center",
                  }}>
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreate} style={{ padding: "24px" }}>
                <div style={fieldWrap("title")}>
                  <label style={labelStyle("title")}>Title</label>
                  <input type="text" placeholder="Notice title..."
                    value={title} onChange={e => setTitle(e.target.value)}
                    onFocus={() => setFocused("title")}
                    onBlur={() => setFocused("")}
                    required style={inputStyle} />
                </div>

                <div style={fieldWrap("content")}>
                  <label style={labelStyle("content")}>Content</label>
                  <textarea placeholder="Write notice content..."
                    value={content} onChange={e => setContent(e.target.value)}
                    onFocus={() => setFocused("content")}
                    onBlur={() => setFocused("")}
                    required rows={4}
                    style={{ ...inputStyle, resize: "none", lineHeight: "1.5" }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div style={fieldWrap("branch")}>
                    <label style={labelStyle("branch")}>Branch</label>
                    <select value={targetBranch}
                      onChange={e => setTargetBranch(e.target.value)}
                      onFocus={() => setFocused("branch")}
                      onBlur={() => setFocused("")}
                      style={{ ...inputStyle, cursor: "pointer" }}>
                      {["ALL","CSE","IT","ECE","EEE","MECH","CIVIL"].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div style={fieldWrap("year")}>
                    <label style={labelStyle("year")}>Year</label>
                    <select value={targetYear}
                      onChange={e => setTargetYear(e.target.value)}
                      onFocus={() => setFocused("year")}
                      onBlur={() => setFocused("")}
                      style={{ ...inputStyle, cursor: "pointer" }}>
                      {["ALL","1","2","3","4"].map(y => (
                        <option key={y} value={y}>{y === "ALL" ? "All Years" : `Year ${y}`}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <motion.button
                  type="button" onClick={() => setImportant(!important)}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "12px 16px", width: "100%",
                    background: important ? "rgba(239,68,68,0.08)" : "var(--bg2)",
                    border: important ? "1.5px solid rgba(239,68,68,0.4)" : "1.5px solid var(--border)",
                    borderRadius: "10px", marginBottom: "16px",
                    cursor: "pointer", transition: "all 0.25s ease",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}>
                  <AlertCircle size={16} color={important ? "var(--danger)" : "var(--text3)"} />
                  <span style={{
                    fontSize: "13px", fontWeight: "600",
                    color: important ? "var(--danger)" : "var(--text2)",
                  }}>Mark as Important</span>
                  <div style={{
                    marginLeft: "auto",
                    width: "18px", height: "18px",
                    borderRadius: "4px",
                    background: important ? "var(--danger)" : "transparent",
                    border: `2px solid ${important ? "var(--danger)" : "var(--border)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}>
                    {important && <span style={{ color: "white", fontSize: "12px", lineHeight: 1 }}>✓</span>}
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  type="submit" disabled={submitting}
                  style={{
                    width: "100%", padding: "14px",
                    background: submitting ? "var(--text3)" : "var(--accent)",
                    border: "none", borderRadius: "10px",
                    color: "white", fontSize: "13px",
                    fontWeight: "700", textTransform: "uppercase",
                    letterSpacing: "0.1em", cursor: submitting ? "not-allowed" : "pointer",
                    fontFamily: "'Space Grotesk', sans-serif",
                    display: "flex", alignItems: "center",
                    justifyContent: "center", gap: "8px",
                  }}>
                  {submitting ? "POSTING..." : <><Plus size={15} /> POST NOTICE</>}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Notices List ── */}
      <motion.div
        variants={stagger} initial="hidden" animate="show"
        style={{ padding: "24px 32px", display: "flex",
          flexDirection: "column", gap: "0" }}
      >
        {filtered.length === 0 ? (
          <motion.div variants={fadeUp} style={{
            textAlign: "center", padding: "80px 24px",
            border: "1px solid var(--border)", borderRadius: "12px",
          }}>
            <Bell size={32} color="var(--text3)"
              style={{ margin: "0 auto 16px" }} />
            <p style={{ color: "var(--text3)", fontWeight: "700",
              fontSize: "14px", textTransform: "uppercase",
              letterSpacing: "0.1em" }}>
              No Notices Yet
            </p>
          </motion.div>
        ) : filtered.map((n, i) => (
          <motion.div key={n._id} variants={fadeUp}
            style={{
              borderBottom: "1px solid var(--border)",
              borderTop: i === 0 ? "1px solid var(--border)" : "none",
            }}
          >
            <div
              onClick={() => setExpanded(expanded === n._id ? null : n._id)}
              style={{
                padding: "20px 0",
                display: "flex", alignItems: "flex-start",
                gap: "20px", cursor: "pointer",
              }}
            >
              {/* Index */}
              <span style={{
                fontSize: "11px", fontWeight: "700",
                color: "var(--accent)", fontFamily: "monospace",
                letterSpacing: "0.1em", minWidth: "32px",
                paddingTop: "2px",
              }}>
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: "flex", alignItems: "center",
                  gap: "10px", marginBottom: "6px",
                }}>
                  {n.important && (
                    <span style={{
                      fontSize: "10px", fontWeight: "700",
                      textTransform: "uppercase", letterSpacing: "0.1em",
                      color: "var(--danger)",
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.2)",
                      borderRadius: "4px", padding: "2px 8px",
                    }}>⚠ Important</span>
                  )}
                  <span style={{
                    fontSize: "10px", fontWeight: "600",
                    color: "var(--text3)", fontFamily: "monospace",
                  }}>
                    {n.targetBranch || "ALL"} · Year {n.targetYear || "ALL"}
                  </span>
                </div>
                <h3 style={{
                  fontSize: "18px", fontWeight: "800",
                  letterSpacing: "-0.02em", color: "var(--text)",
                  marginBottom: "4px", lineHeight: 1.2,
                  transition: "color 0.2s ease",
                }}
                  onMouseEnter={e => e.target.style.color = "var(--accent)"}
                  onMouseLeave={e => e.target.style.color = "var(--text)"}
                >
                  {n.title}
                </h3>
                {n.aiSummary && (
                  <p style={{
                    fontSize: "13px", color: "var(--text3)",
                    fontStyle: "italic",
                  }}>
                    AI: {n.aiSummary}
                  </p>
                )}
              </div>

              {/* Right */}
              <div style={{
                display: "flex", alignItems: "center",
                gap: "12px", flexShrink: 0,
              }}>
                <span style={{
                  fontSize: "11px", color: "var(--text3)",
                  fontWeight: "600",
                }}>
                  {new Date(n.createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric"
                  })}
                </span>
                {canPost && (
                  <button onClick={e => { e.stopPropagation(); handleDelete(n._id); }}
                    style={{
                      background: "none", border: "1px solid var(--border)",
                      borderRadius: "6px", padding: "5px",
                      cursor: "pointer", color: "var(--text3)",
                      display: "flex", alignItems: "center",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = "var(--danger)";
                      e.currentTarget.style.color = "var(--danger)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.color = "var(--text3)";
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
                <motion.div
                  animate={{ rotate: expanded === n._id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={16} color="var(--text3)" />
                </motion.div>
              </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
              {expanded === n._id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{
                    padding: "0 0 24px 52px",
                    borderTop: "1px solid var(--border)",
                    paddingTop: "20px",
                  }}>
                    <p style={{
                      fontSize: "15px", color: "var(--text2)",
                      lineHeight: "1.7", marginBottom: "16px",
                    }}>{n.content}</p>
                    <div style={{
                      display: "flex", gap: "12px",
                      fontSize: "11px", color: "var(--text3)",
                      fontWeight: "600", textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}>
                      <span>Posted by: {n.postedBy?.name || "Admin"}</span>
                      <span>·</span>
                      <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>

      <style>{`
        select option { background: var(--bg2); color: var(--text); }
        textarea::placeholder, input::placeholder {
          color: var(--text3) !important; opacity: 0.5;
        }
      `}</style>
    </div>
  );
}