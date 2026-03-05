import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAttendance, updateAttendance, logClass } from "../utils/api";
import { CalendarCheck, Plus, X, AlertTriangle, TrendingUp, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};
const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } }
};

export default function AttendancePage() {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [focused, setFocused] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [subject, setSubject] = useState("");
  const [totalClasses, setTotalClasses] = useState("");
  const [attendedClasses, setAttendedClasses] = useState("");

  useEffect(() => { fetchAttendance(); }, []);

  const fetchAttendance = async () => {
    try {
      const { data } = await getAttendance();
      setAttendance(data);
    } catch {}
    finally { setLoading(false); }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateAttendance({
        subject,
        totalClasses: Number(totalClasses),
        attendedClasses: Number(attendedClasses),
      });
      toast.success("Attendance updated!");
      setShowForm(false);
      setSubject(""); setTotalClasses(""); setAttendedClasses("");
      fetchAttendance();
    } catch { toast.error("Failed to update"); }
    finally { setSubmitting(false); }
  };

  const handleLogClass = async (subject, present) => {
    try {
      await logClass({ subject, present });
      toast.success(present ? "Marked present! ✓" : "Marked absent.");
      fetchAttendance();
    } catch { toast.error("Failed to log class"); }
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
        fontWeight: "600", textTransform: "uppercase",
        letterSpacing: "0.1em",
      }}>Loading Attendance...</p>
    </div>
  );

  const records = attendance?.records || [];
  const overall = attendance?.overallPercentage || 0;
  const danger = records.filter(r => r.percentage < 75);
  const safe = records.filter(r => r.percentage >= 75);

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
          }}>ACADEMIC TRACKER</p>
          <h1 style={{
            fontSize: "32px", fontWeight: "900",
            letterSpacing: "-0.04em", color: "var(--text)", lineHeight: 1,
          }}>Attendance</h1>
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
          <Plus size={14} /> Add Subject
        </motion.button>
      </div>

      {/* Add Subject Modal */}
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
                width: "100%", maxWidth: "480px",
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
                  }}>NEW ENTRY</p>
                  <h3 style={{
                    fontSize: "18px", fontWeight: "800",
                    letterSpacing: "-0.03em", color: "var(--text)",
                  }}>Add / Update Subject</h3>
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

              <form onSubmit={handleAddSubject} style={{ padding: "24px" }}>
                <div style={fieldWrap("subject")}>
                  <label style={labelStyle("subject")}>Subject Name</label>
                  <input type="text" placeholder="e.g. Data Structures"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    onFocus={() => setFocused("subject")}
                    onBlur={() => setFocused("")}
                    required style={inputStyle} />
                </div>

                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px",
                }}>
                  <div style={fieldWrap("total")}>
                    <label style={labelStyle("total")}>Total Classes</label>
                    <input type="number" placeholder="40"
                      value={totalClasses}
                      onChange={e => setTotalClasses(e.target.value)}
                      onFocus={() => setFocused("total")}
                      onBlur={() => setFocused("")}
                      required style={inputStyle} />
                  </div>
                  <div style={fieldWrap("attended")}>
                    <label style={labelStyle("attended")}>Attended</label>
                    <input type="number" placeholder="35"
                      value={attendedClasses}
                      onChange={e => setAttendedClasses(e.target.value)}
                      onFocus={() => setFocused("attended")}
                      onBlur={() => setFocused("")}
                      required style={inputStyle} />
                  </div>
                </div>

                {totalClasses && attendedClasses && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{
                      padding: "12px 16px", marginBottom: "16px",
                      background: Number(attendedClasses) / Number(totalClasses) >= 0.75
                        ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                      border: `1px solid ${Number(attendedClasses) / Number(totalClasses) >= 0.75
                        ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
                      borderRadius: "8px",
                    }}
                  >
                    <p style={{
                      fontSize: "13px", fontWeight: "700",
                      color: Number(attendedClasses) / Number(totalClasses) >= 0.75
                        ? "var(--success)" : "var(--danger)",
                    }}>
                      {Math.round((Number(attendedClasses) / Number(totalClasses)) * 100)}% attendance
                      {Number(attendedClasses) / Number(totalClasses) >= 0.75
                        ? " ✓ You're safe!" : " ⚠ Below 75%!"}
                    </p>
                  </motion.div>
                )}

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
                  }}>
                  {submitting ? "SAVING..." : "SAVE ATTENDANCE"}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ padding: "28px 32px" }}>

        {/* Overall Stats */}
        {records.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "16px", marginBottom: "28px",
            }}
          >
            {[
              { label: "Overall", value: `${overall}%`, icon: TrendingUp,
                color: overall >= 75 ? "var(--success)" : "var(--danger)" },
              { label: "Total Subjects", value: records.length,
                icon: BookOpen, color: "var(--accent)" },
              { label: "Safe Subjects", value: safe.length,
                icon: CalendarCheck, color: "var(--success)" },
              { label: "At Risk", value: danger.length,
                icon: AlertTriangle, color: "var(--danger)" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px", padding: "20px",
                    display: "flex", alignItems: "center", gap: "14px",
                  }}
                >
                  <div style={{
                    width: "40px", height: "40px",
                    borderRadius: "10px",
                    background: `${stat.color}15`,
                    border: `1px solid ${stat.color}30`,
                    display: "flex", alignItems: "center",
                    justifyContent: "center", flexShrink: 0,
                  }}>
                    <Icon size={18} color={stat.color} />
                  </div>
                  <div>
                    <p style={{
                      fontSize: "10px", fontWeight: "700",
                      textTransform: "uppercase", letterSpacing: "0.15em",
                      color: "var(--text3)", marginBottom: "3px",
                    }}>{stat.label}</p>
                    <p style={{
                      fontSize: "24px", fontWeight: "900",
                      letterSpacing: "-0.03em", color: stat.color,
                      lineHeight: 1,
                    }}>{stat.value}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Danger Alert */}
        {danger.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              background: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "10px", padding: "14px 18px",
              marginBottom: "24px", display: "flex",
              alignItems: "center", gap: "12px",
            }}
          >
            <AlertTriangle size={16} color="var(--danger)" />
            <p style={{ fontSize: "13px", color: "var(--danger)", fontWeight: "600" }}>
              Low attendance in: <strong>
                {danger.map(d => d.subject).join(", ")}
              </strong>
            </p>
          </motion.div>
        )}

        {/* Subject Cards */}
        {records.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              textAlign: "center", padding: "80px 24px",
              border: "1px solid var(--border)", borderRadius: "12px",
            }}>
            <CalendarCheck size={32} color="var(--text3)"
              style={{ margin: "0 auto 16px" }} />
            <p style={{
              color: "var(--text3)", fontWeight: "700",
              fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.1em",
              marginBottom: "8px",
            }}>No Subjects Yet</p>
            <p style={{ color: "var(--text3)", fontSize: "13px" }}>
              Click "Add Subject" to start tracking
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={stagger} initial="hidden" animate="show"
            style={{ display: "flex", flexDirection: "column", gap: "0" }}
          >
            {records.map((r, i) => {
              const pct = r.percentage || 0;
              const safe = pct >= 75;
              const classesNeeded = safe ? 0
                : Math.ceil((0.75 * r.totalClasses - r.attendedClasses) / 0.25);

              return (
                <motion.div key={r.subject} variants={fadeUp}
                  style={{
                    borderBottom: "1px solid var(--border)",
                    borderTop: i === 0 ? "1px solid var(--border)" : "none",
                    padding: "20px 0",
                  }}
                >
                  <div style={{
                    display: "flex", alignItems: "center",
                    gap: "20px", flexWrap: "wrap",
                  }}>
                    {/* Index */}
                    <span style={{
                      fontSize: "11px", fontWeight: "700",
                      color: "var(--accent)", fontFamily: "monospace",
                      letterSpacing: "0.1em", minWidth: "32px",
                    }}>{String(i + 1).padStart(2, "0")}</span>

                    {/* Subject Info */}
                    <div style={{ flex: 1, minWidth: "200px" }}>
                      <div style={{
                        display: "flex", alignItems: "center",
                        gap: "10px", marginBottom: "8px",
                      }}>
                        <h3 style={{
                          fontSize: "16px", fontWeight: "800",
                          letterSpacing: "-0.02em", color: "var(--text)",
                        }}>{r.subject}</h3>
                        <span style={{
                          fontSize: "10px", fontWeight: "700",
                          textTransform: "uppercase", letterSpacing: "0.08em",
                          padding: "2px 8px", borderRadius: "4px",
                          color: safe ? "var(--success)" : "var(--danger)",
                          background: safe
                            ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                          border: safe
                            ? "1px solid rgba(16,185,129,0.2)"
                            : "1px solid rgba(239,68,68,0.2)",
                        }}>
                          {safe ? "✓ Safe" : "⚠ At Risk"}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div style={{
                        height: "6px", background: "var(--border)",
                        borderRadius: "100px", overflow: "hidden",
                        marginBottom: "6px",
                      }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          style={{
                            height: "100%", borderRadius: "100px",
                            background: safe
                              ? "linear-gradient(90deg, #10b981, #34d399)"
                              : "linear-gradient(90deg, #ef4444, #f87171)",
                          }}
                        />
                      </div>

                      <div style={{
                        display: "flex", gap: "16px",
                        fontSize: "11px", color: "var(--text3)",
                        fontWeight: "600",
                      }}>
                        <span>{r.attendedClasses}/{r.totalClasses} classes</span>
                        {!safe && classesNeeded > 0 && (
                          <span style={{ color: "var(--danger)" }}>
                            Need {classesNeeded} more classes
                          </span>
                        )}
                        {r.aiWarning && (
                          <span style={{
                            color: safe ? "var(--success)" : "var(--danger)",
                            fontStyle: "italic",
                          }}>
                            AI: {r.aiWarning}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Percentage */}
                    <div style={{
                      fontSize: "32px", fontWeight: "900",
                      letterSpacing: "-0.03em",
                      color: safe ? "var(--success)" : "var(--danger)",
                      minWidth: "80px", textAlign: "right",
                    }}>{pct}%</div>

                    {/* Log Buttons */}
                    <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleLogClass(r.subject, true)}
                        style={{
                          padding: "8px 14px",
                          background: "rgba(16,185,129,0.1)",
                          border: "1px solid rgba(16,185,129,0.3)",
                          borderRadius: "8px", color: "var(--success)",
                          fontSize: "12px", fontWeight: "700",
                          cursor: "pointer", transition: "all 0.2s ease",
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = "var(--success)";
                          e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = "rgba(16,185,129,0.1)";
                          e.currentTarget.style.color = "var(--success)";
                        }}
                      >✓ Present</motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleLogClass(r.subject, false)}
                        style={{
                          padding: "8px 14px",
                          background: "rgba(239,68,68,0.1)",
                          border: "1px solid rgba(239,68,68,0.3)",
                          borderRadius: "8px", color: "var(--danger)",
                          fontSize: "12px", fontWeight: "700",
                          cursor: "pointer", transition: "all 0.2s ease",
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = "var(--danger)";
                          e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = "rgba(239,68,68,0.1)";
                          e.currentTarget.style.color = "var(--danger)";
                        }}
                      >✗ Absent</motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
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