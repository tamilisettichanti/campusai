import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getLostItems, postLostItem, resolveItem } from "../utils/api";
import { Search, Plus, X, MapPin, CheckCircle, Zap } from "lucide-react";
import toast from "react-hot-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};
const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

export default function LostFound() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [focused, setFocused] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [type, setType] = useState("lost");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => { fetchItems(); }, [tab]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = tab !== "all" ? { type: tab } : {};
      const { data } = await getLostItems(params);
      setItems(data);
    } catch { toast.error("Failed to load items"); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await postLostItem({ type, itemName, description, location });
      toast.success("Item posted! AI is looking for matches 🤖");
      setShowForm(false);
      setItemName(""); setDescription(""); setLocation("");
      fetchItems();
    } catch { toast.error("Failed to post item"); }
    finally { setSubmitting(false); }
  };

  const handleResolve = async (id) => {
    try {
      await resolveItem(id);
      setItems(prev => prev.map(i =>
        i._id === id ? { ...i, resolved: true } : i
      ));
      toast.success("Marked as resolved!");
    } catch { toast.error("Failed to resolve"); }
  };

  const fieldWrap = (name) => ({
    borderRadius: "10px",
    border: focused === name
      ? "2px solid var(--accent)" : "1.5px solid var(--border)",
    background: focused === name ? "var(--accent-bg)" : "var(--bg2)",
    transition: "all 0.25s ease", overflow: "hidden",
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
    display: "block", fontSize: "10px", fontWeight: "700",
    textTransform: "uppercase", letterSpacing: "0.15em",
    color: focused === name ? "var(--accent)" : "var(--text3)",
    padding: "10px 16px 2px", transition: "color 0.25s ease",
  });

  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>

      {/* Header */}
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
          }}>AI POWERED</p>
          <h1 style={{
            fontSize: "32px", fontWeight: "900",
            letterSpacing: "-0.04em", color: "var(--text)", lineHeight: 1,
          }}>Lost & Found</h1>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {/* Tab Filter */}
          <div style={{
            display: "flex",
            border: "1px solid var(--border)",
            borderRadius: "8px", overflow: "hidden",
          }}>
            {["all", "lost", "found"].map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{
                  padding: "8px 16px",
                  background: tab === t ? "var(--accent)" : "transparent",
                  border: "none",
                  color: tab === t ? "white" : "var(--text3)",
                  fontSize: "12px", fontWeight: "700",
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  cursor: "pointer", transition: "all 0.2s ease",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}>{t}</button>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowForm(true)}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "10px 18px", background: "var(--accent)",
              border: "none", borderRadius: "8px", color: "white",
              fontSize: "12px", fontWeight: "700",
              textTransform: "uppercase", letterSpacing: "0.1em",
              cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif",
            }}>
            <Plus size={14} /> Post Item
          </motion.button>
        </div>
      </div>

      {/* Post Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 50,
              background: "rgba(0,0,0,0.6)",
              display: "flex", alignItems: "center",
              justifyContent: "center", padding: "24px",
            }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: "100%", maxWidth: "520px",
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
                  }}>AI WILL MATCH AUTOMATICALLY</p>
                  <h3 style={{
                    fontSize: "18px", fontWeight: "800",
                    letterSpacing: "-0.03em", color: "var(--text)",
                  }}>Post Item</h3>
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

              <form onSubmit={handleSubmit} style={{ padding: "24px" }}>

                {/* Type Toggle */}
                <div style={{ marginBottom: "16px" }}>
                  <p style={{
                    fontSize: "10px", fontWeight: "700",
                    textTransform: "uppercase", letterSpacing: "0.15em",
                    color: "var(--text3)", marginBottom: "10px",
                  }}>Type</p>
                  <div style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px",
                  }}>
                    {["lost", "found"].map(t => (
                      <motion.button key={t} type="button"
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setType(t)}
                        style={{
                          padding: "14px",
                          background: type === t
                            ? t === "lost"
                              ? "rgba(239,68,68,0.1)"
                              : "rgba(16,185,129,0.1)"
                            : "var(--bg2)",
                          border: type === t
                            ? t === "lost"
                              ? "2px solid rgba(239,68,68,0.5)"
                              : "2px solid rgba(16,185,129,0.5)"
                            : "1.5px solid var(--border)",
                          borderRadius: "10px",
                          color: type === t
                            ? t === "lost" ? "var(--danger)" : "var(--success)"
                            : "var(--text3)",
                          fontSize: "13px", fontWeight: "700",
                          textTransform: "uppercase", letterSpacing: "0.1em",
                          cursor: "pointer", transition: "all 0.25s ease",
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}>
                        {t === "lost" ? "😟 I Lost It" : "😊 I Found It"}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div style={fieldWrap("itemName")}>
                  <label style={labelStyle("itemName")}>Item Name</label>
                  <input type="text" placeholder="e.g. Blue ID Card"
                    value={itemName}
                    onChange={e => setItemName(e.target.value)}
                    onFocus={() => setFocused("itemName")}
                    onBlur={() => setFocused("")}
                    required style={inputStyle} />
                </div>

                <div style={fieldWrap("description")}>
                  <label style={labelStyle("description")}>Description</label>
                  <textarea placeholder="Describe the item..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    onFocus={() => setFocused("description")}
                    onBlur={() => setFocused("")}
                    rows={3}
                    style={{ ...inputStyle, resize: "none", lineHeight: "1.5" }} />
                </div>

                <div style={fieldWrap("location")}>
                  <label style={labelStyle("location")}>Location</label>
                  <input type="text" placeholder="e.g. Near Library Gate"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    onFocus={() => setFocused("location")}
                    onBlur={() => setFocused("")}
                    style={inputStyle} />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  type="submit" disabled={submitting}
                  style={{
                    width: "100%", padding: "14px",
                    background: submitting ? "var(--text3)" : "var(--accent)",
                    border: "none", borderRadius: "10px",
                    color: "white", fontSize: "13px",
                    fontWeight: "700", textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    cursor: submitting ? "not-allowed" : "pointer",
                    fontFamily: "'Space Grotesk', sans-serif",
                    display: "flex", alignItems: "center",
                    justifyContent: "center", gap: "8px",
                  }}>
                  {submitting ? "POSTING..." : <><Zap size={15} /> POST & MATCH WITH AI</>}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items Grid */}
      <div style={{ padding: "28px 32px" }}>
        {loading ? (
          <div style={{
            display: "flex", justifyContent: "center",
            padding: "60px 0",
          }}>
            <motion.div animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{
                width: "36px", height: "36px",
                border: "3px solid var(--border)",
                borderTopColor: "var(--accent)", borderRadius: "50%",
              }} />
          </div>
        ) : items.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              textAlign: "center", padding: "80px 24px",
              border: "1px solid var(--border)", borderRadius: "12px",
            }}>
            <Search size={32} color="var(--text3)"
              style={{ margin: "0 auto 16px" }} />
            <p style={{
              color: "var(--text3)", fontWeight: "700",
              fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.1em",
            }}>No Items Found</p>
          </motion.div>
        ) : (
          <motion.div
            variants={stagger} initial="hidden" animate="show"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {items.map((item, i) => (
              <motion.div key={item._id} variants={fadeUp}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px", overflow: "hidden",
                  opacity: item.resolved ? 0.6 : 1,
                  transition: "all 0.2s",
                }}
              >
                {/* Card Header */}
                <div style={{
                  padding: "14px 18px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between",
                }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <span style={{
                      padding: "3px 10px",
                      background: item.type === "lost"
                        ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
                      color: item.type === "lost" ? "var(--danger)" : "var(--success)",
                      fontSize: "10px", fontWeight: "700",
                      textTransform: "uppercase", letterSpacing: "0.1em",
                      borderRadius: "4px",
                      border: item.type === "lost"
                        ? "1px solid rgba(239,68,68,0.2)"
                        : "1px solid rgba(16,185,129,0.2)",
                    }}>{item.type}</span>
                    {item.aiMatchId && (
                      <span style={{
                        padding: "3px 10px",
                        background: "var(--accent-bg)",
                        color: "var(--accent)",
                        fontSize: "10px", fontWeight: "700",
                        letterSpacing: "0.08em",
                        borderRadius: "4px",
                        border: "1px solid var(--accent-border)",
                      }}>🤖 AI MATCH</span>
                    )}
                    {item.resolved && (
                      <span style={{
                        padding: "3px 10px",
                        background: "rgba(16,185,129,0.1)",
                        color: "var(--success)",
                        fontSize: "10px", fontWeight: "700",
                        borderRadius: "4px",
                        border: "1px solid rgba(16,185,129,0.2)",
                      }}>✓ RESOLVED</span>
                    )}
                  </div>
                  <span style={{
                    fontSize: "10px", fontWeight: "600",
                    color: "var(--text3)",
                  }}>
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric"
                    })}
                  </span>
                </div>

                {/* Card Body */}
                <div style={{ padding: "16px 18px" }}>
                  <h3 style={{
                    fontSize: "16px", fontWeight: "800",
                    letterSpacing: "-0.02em", color: "var(--text)",
                    marginBottom: "8px",
                  }}>{item.itemName}</h3>
                  {item.description && (
                    <p style={{
                      fontSize: "13px", color: "var(--text2)",
                      lineHeight: "1.5", marginBottom: "12px",
                    }}>{item.description}</p>
                  )}
                  {item.location && (
                    <div style={{
                      display: "flex", alignItems: "center",
                      gap: "6px", marginBottom: "14px",
                    }}>
                      <MapPin size={12} color="var(--accent)" />
                      <span style={{
                        fontSize: "12px", color: "var(--text3)",
                        fontWeight: "600",
                      }}>{item.location}</span>
                    </div>
                  )}
                  {!item.resolved && (
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={() => handleResolve(item._id)}
                      style={{
                        width: "100%", padding: "9px",
                        background: "transparent",
                        border: "1px solid var(--border)",
                        borderRadius: "8px", color: "var(--text2)",
                        fontSize: "11px", fontWeight: "700",
                        textTransform: "uppercase", letterSpacing: "0.1em",
                        cursor: "pointer", transition: "all 0.2s ease",
                        fontFamily: "'Space Grotesk', sans-serif",
                        display: "flex", alignItems: "center",
                        justifyContent: "center", gap: "6px",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = "var(--success)";
                        e.currentTarget.style.color = "white";
                        e.currentTarget.style.borderColor = "var(--success)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--text2)";
                        e.currentTarget.style.borderColor = "var(--border)";
                      }}
                    >
                      <CheckCircle size={13} /> Mark Resolved
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <style>{`
        input::placeholder, textarea::placeholder {
          color: var(--text3) !important; opacity: 0.5;
        }
      `}</style>
    </div>
  );
}