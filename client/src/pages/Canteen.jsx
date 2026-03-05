import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getTodayMenu, updateMenu } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Coffee, Plus, X, Edit3, Check } from "lucide-react";
import toast from "react-hot-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};
const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } }
};

const MEALS = [
  { key: "breakfast", label: "Breakfast", time: "7:30 – 9:30 AM", emoji: "☕" },
  { key: "lunch", label: "Lunch", time: "12:00 – 2:00 PM", emoji: "🍱" },
  { key: "snacks", label: "Snacks", time: "4:00 – 5:30 PM", emoji: "🧃" },
];

export default function Canteen() {
  const { user } = useAuth();
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    breakfast: [], lunch: [], snacks: []
  });
  const [newItem, setNewItem] = useState({ meal: "breakfast", name: "", price: "" });
  const [focused, setFocused] = useState("");
  const [saving, setSaving] = useState(false);

  const canEdit = ["admin", "canteen"].includes(user?.role);

  useEffect(() => { fetchMenu(); }, []);

  const fetchMenu = async () => {
    try {
      const { data } = await getTodayMenu();
      setMenu(data);
      if (data) setDraft({
        breakfast: data.breakfast || [],
        lunch: data.lunch || [],
        snacks: data.snacks || [],
      });
    } catch {}
    finally { setLoading(false); }
  };

  const addItem = () => {
    if (!newItem.name || !newItem.price) return;
    setDraft(prev => ({
      ...prev,
      [newItem.meal]: [...prev[newItem.meal],
        { name: newItem.name, price: Number(newItem.price) }]
    }));
    setNewItem(prev => ({ ...prev, name: "", price: "" }));
  };

  const removeItem = (meal, idx) => {
    setDraft(prev => ({
      ...prev,
      [meal]: prev[meal].filter((_, i) => i !== idx)
    }));
  };

  const saveMenu = async () => {
    setSaving(true);
    try {
      await updateMenu(draft);
      toast.success("Menu updated!");
      setEditing(false);
      fetchMenu();
    } catch { toast.error("Failed to update menu"); }
    finally { setSaving(false); }
  };

  const fieldWrap = (name) => ({
    borderRadius: "10px",
    border: focused === name
      ? "2px solid var(--accent)" : "1.5px solid var(--border)",
    background: focused === name ? "var(--accent-bg)" : "var(--bg2)",
    transition: "all 0.25s ease", overflow: "hidden",
  });

  const inputStyle = {
    width: "100%", padding: "8px 16px 12px",
    background: "transparent", border: "none",
    outline: "none", fontSize: "14px",
    fontWeight: "600", color: "var(--text)",
    fontFamily: "'Space Grotesk', sans-serif",
  };

  if (loading) return (
    <div style={{
      display: "flex", alignItems: "center",
      justifyContent: "center", height: "60vh",
      flexDirection: "column", gap: "16px",
    }}>
      <motion.div animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{
          width: "36px", height: "36px",
          border: "3px solid var(--border)",
          borderTopColor: "var(--accent)", borderRadius: "50%",
        }} />
      <p style={{
        color: "var(--text3)", fontSize: "13px",
        fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.1em",
      }}>Loading Menu...</p>
    </div>
  );

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
          }}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long", month: "long", day: "numeric"
            })}
          </p>
          <h1 style={{
            fontSize: "32px", fontWeight: "900",
            letterSpacing: "-0.04em", color: "var(--text)", lineHeight: 1,
          }}>Today's Menu</h1>
        </div>
        {canEdit && (
          <div style={{ display: "flex", gap: "10px" }}>
            {editing ? (
              <>
                <motion.button whileTap={{ scale: 0.97 }}
                  onClick={() => setEditing(false)}
                  style={{
                    padding: "10px 16px",
                    background: "transparent",
                    border: "1px solid var(--border)",
                    borderRadius: "8px", color: "var(--text2)",
                    fontSize: "12px", fontWeight: "700",
                    textTransform: "uppercase", letterSpacing: "0.08em",
                    cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif",
                  }}>Cancel</motion.button>
                <motion.button whileTap={{ scale: 0.97 }}
                  onClick={saveMenu} disabled={saving}
                  style={{
                    padding: "10px 18px",
                    background: "var(--success)", border: "none",
                    borderRadius: "8px", color: "white",
                    fontSize: "12px", fontWeight: "700",
                    textTransform: "uppercase", letterSpacing: "0.08em",
                    cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif",
                    display: "flex", alignItems: "center", gap: "6px",
                  }}>
                  <Check size={14} />
                  {saving ? "Saving..." : "Save Menu"}
                </motion.button>
              </>
            ) : (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => setEditing(true)}
                style={{
                  padding: "10px 18px",
                  background: "var(--accent)", border: "none",
                  borderRadius: "8px", color: "white",
                  fontSize: "12px", fontWeight: "700",
                  textTransform: "uppercase", letterSpacing: "0.1em",
                  cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif",
                  display: "flex", alignItems: "center", gap: "8px",
                }}>
                <Edit3 size={14} /> Update Menu
              </motion.button>
            )}
          </div>
        )}
      </div>

      <div style={{ padding: "28px 32px" }}>

        {/* Edit Form */}
        {editing && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "var(--bg2)",
              border: "1px solid var(--accent-border)",
              borderRadius: "12px", padding: "24px",
              marginBottom: "28px",
            }}
          >
            <p style={{
              fontSize: "10px", fontWeight: "700",
              textTransform: "uppercase", letterSpacing: "0.2em",
              color: "var(--accent)", marginBottom: "16px",
            }}>ADD ITEM</p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr 1fr auto",
              gap: "12px", alignItems: "end",
            }}>
              <div style={fieldWrap("meal")}>
                <label style={{
                  display: "block", fontSize: "10px",
                  fontWeight: "700", textTransform: "uppercase",
                  letterSpacing: "0.15em", color: "var(--text3)",
                  padding: "8px 14px 2px",
                }}>Meal</label>
                <select value={newItem.meal}
                  onChange={e => setNewItem({ ...newItem, meal: e.target.value })}
                  onFocus={() => setFocused("meal")}
                  onBlur={() => setFocused("")}
                  style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="snacks">Snacks</option>
                </select>
              </div>
              <div style={fieldWrap("itemname")}>
                <label style={{
                  display: "block", fontSize: "10px",
                  fontWeight: "700", textTransform: "uppercase",
                  letterSpacing: "0.15em", color: "var(--text3)",
                  padding: "8px 14px 2px",
                }}>Item Name</label>
                <input type="text" placeholder="e.g. Idli Sambar"
                  value={newItem.name}
                  onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                  onFocus={() => setFocused("itemname")}
                  onBlur={() => setFocused("")}
                  onKeyDown={e => e.key === "Enter" && addItem()}
                  style={inputStyle} />
              </div>
              <div style={fieldWrap("price")}>
                <label style={{
                  display: "block", fontSize: "10px",
                  fontWeight: "700", textTransform: "uppercase",
                  letterSpacing: "0.15em", color: "var(--text3)",
                  padding: "8px 14px 2px",
                }}>Price (₹)</label>
                <input type="number" placeholder="30"
                  value={newItem.price}
                  onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                  onFocus={() => setFocused("price")}
                  onBlur={() => setFocused("")}
                  onKeyDown={e => e.key === "Enter" && addItem()}
                  style={inputStyle} />
              </div>
              <motion.button whileTap={{ scale: 0.95 }}
                onClick={addItem}
                style={{
                  padding: "14px 16px",
                  background: "var(--accent)", border: "none",
                  borderRadius: "10px", color: "white",
                  cursor: "pointer", display: "flex",
                  alignItems: "center", justifyContent: "center",
                }}>
                <Plus size={18} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Meals */}
        <motion.div
          variants={stagger} initial="hidden" animate="show"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "16px",
          }}
        >
          {MEALS.map(({ key, label, time, emoji }) => (
            <motion.div key={key} variants={fadeUp}
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "12px", overflow: "hidden",
              }}
            >
              {/* Meal Header */}
              <div style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--border)",
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
              }}>
                <div>
                  <span style={{ fontSize: "20px", marginRight: "8px" }}>{emoji}</span>
                  <span style={{
                    fontSize: "14px", fontWeight: "800",
                    letterSpacing: "-0.02em", color: "var(--text)",
                  }}>{label}</span>
                </div>
                <span style={{
                  fontSize: "11px", color: "var(--text3)",
                  fontWeight: "600",
                }}>{time}</span>
              </div>

              {/* Items */}
              <div style={{ padding: "16px 20px" }}>
                {(editing ? draft[key] : menu?.[key] || []).length === 0 ? (
                  <p style={{
                    color: "var(--text3)", fontSize: "13px",
                    textAlign: "center", padding: "20px 0",
                    fontWeight: "500",
                  }}>
                    {editing ? "No items added yet" : "Not updated yet"}
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {(editing ? draft[key] : menu?.[key]).map((item, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        style={{
                          display: "flex", alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 14px",
                          background: "var(--bg2)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                      >
                        <span style={{
                          fontSize: "14px", fontWeight: "600",
                          color: "var(--text)",
                        }}>{item.name}</span>
                        <div style={{
                          display: "flex", alignItems: "center", gap: "10px"
                        }}>
                          <span style={{
                            fontSize: "13px", fontWeight: "800",
                            color: "var(--accent)",
                          }}>₹{item.price}</span>
                          {editing && (
                            <button onClick={() => removeItem(key, i)}
                              style={{
                                background: "none", border: "none",
                                cursor: "pointer", color: "var(--text3)",
                                display: "flex", padding: "2px",
                                transition: "color 0.2s",
                              }}
                              onMouseEnter={e => e.currentTarget.style.color = "var(--danger)"}
                              onMouseLeave={e => e.currentTarget.style.color = "var(--text3)"}
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Total */}
              {(editing ? draft[key] : menu?.[key] || []).length > 0 && (
                <div style={{
                  padding: "12px 20px",
                  borderTop: "1px solid var(--border)",
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <span style={{
                    fontSize: "11px", fontWeight: "700",
                    textTransform: "uppercase", letterSpacing: "0.1em",
                    color: "var(--text3)",
                  }}>
                    {(editing ? draft[key] : menu?.[key]).length} items
                  </span>
                  <span style={{
                    fontSize: "13px", fontWeight: "800", color: "var(--text)",
                  }}>
                    Avg ₹{Math.round(
                      (editing ? draft[key] : menu?.[key])
                        .reduce((s, i) => s + i.price, 0) /
                      (editing ? draft[key] : menu?.[key]).length
                    )}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        input::placeholder, textarea::placeholder {
          color: var(--text3) !important; opacity: 0.5;
        }
        select option { background: var(--bg2); color: var(--text); }
      `}</style>
    </div>
  );
}