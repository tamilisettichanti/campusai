import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  getNotices, getTodayMenu, getLostItems, getAttendance
} from "../utils/api";
import {
  Bell, BookOpen, Coffee, Search,
  CalendarCheck, MessageSquare,
  TrendingUp, AlertTriangle, ArrowRight,
  Sparkles, Zap
} from "lucide-react";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } }
};

export default function Dashboard() {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [menu, setMenu] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [lostItems, setLostItems] = useState([]);
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [n, m, a, l] = await Promise.allSettled([
          getNotices(), getTodayMenu(), getAttendance(), getLostItems()
        ]);
        if (n.status === "fulfilled") setNotices(n.value.data.slice(0, 3));
        if (m.status === "fulfilled") setMenu(m.value.data);
        if (a.status === "fulfilled") setAttendance(a.value.data);
        if (l.status === "fulfilled") setLostItems(l.value.data.slice(0, 3));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const greeting = () => {
    const h = time.getHours();
    if (h < 12) return "GOOD MORNING";
    if (h < 17) return "GOOD AFTERNOON";
    return "GOOD EVENING";
  };

  const dangerSubjects = attendance?.records?.filter(r => r.percentage < 75) || [];

  const quickLinks = [
    { path: "/chat", icon: MessageSquare, label: "AI Chat", desc: "Ask anything" },
    { path: "/notices", icon: Bell, label: "Notices", desc: `${notices.length} recent` },
    { path: "/notes", icon: BookOpen, label: "Notes", desc: "Find notes" },
    { path: "/canteen", icon: Coffee, label: "Canteen", desc: "Today's menu" },
    { path: "/lost-found", icon: Search, label: "Lost & Found", desc: `${lostItems.length} items` },
    { path: "/attendance", icon: CalendarCheck, label: "Attendance", desc: `${attendance?.overallPercentage || 0}% overall` },
  ];

  if (loading) return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      height: "80vh", gap: "16px",
      fontFamily: "'Space Grotesk', sans-serif",
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{
          width: "36px", height: "36px",
          border: "3px solid var(--border)",
          borderTopColor: "var(--accent)",
          borderRadius: "50%",
        }}
      />
      <p style={{
        fontSize: "11px", fontWeight: "700",
        textTransform: "uppercase", letterSpacing: "0.2em",
        color: "var(--text3)",
      }}>Loading campus data...</p>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>

      {/* ── Hero Header ── */}
      <div style={{
        borderBottom: "1px solid var(--border)",
        padding: "0",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "0",
        }}>
          {/* Left: Greeting */}
          <div style={{
            padding: "40px 32px",
            borderRight: "1px solid var(--border)",
          }}>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "var(--accent-bg)",
                border: "1px solid var(--accent-border)",
                borderRadius: "100px", padding: "4px 12px",
                marginBottom: "16px",
              }}
            >
              <div style={{
                width: "6px", height: "6px", borderRadius: "50%",
                background: "var(--accent)",
                animation: "pulse-dot 2s infinite",
              }} />
              <span style={{
                fontSize: "10px", fontWeight: "700",
                textTransform: "uppercase", letterSpacing: "0.2em",
                color: "var(--accent)",
              }}>Live Dashboard</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                fontSize: "clamp(28px, 4vw, 48px)",
                fontWeight: "900", letterSpacing: "-0.04em",
                lineHeight: "0.9", color: "var(--text)",
                marginBottom: "12px",
              }}
            >
              {greeting()},<br />
              <span style={{ color: "var(--accent)" }}>
                {user?.name?.split(" ")[0]?.toUpperCase()}.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                fontSize: "13px", color: "var(--text3)",
                fontWeight: "600", textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {user?.branch} · Year {user?.year} · {user?.rollNumber}
            </motion.p>
          </div>

          {/* Right: Live Clock */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            style={{
              padding: "40px 32px",
              display: "flex", flexDirection: "column",
              justifyContent: "center", alignItems: "flex-end",
              minWidth: "200px",
            }}
          >
            <div style={{
              fontSize: "10px", fontWeight: "700",
              textTransform: "uppercase", letterSpacing: "0.2em",
              color: "var(--text3)", marginBottom: "8px",
            }}>Current Time</div>
            <div style={{
              fontSize: "36px", fontWeight: "900",
              letterSpacing: "-0.04em", color: "var(--text)",
              fontVariantNumeric: "tabular-nums", lineHeight: 1,
            }}>
              {time.toLocaleTimeString("en-US", {
                hour: "2-digit", minute: "2-digit",
                second: "2-digit", hour12: true,
              })}
            </div>
            <div style={{
              fontSize: "12px", color: "var(--text3)",
              fontWeight: "600", marginTop: "6px",
            }}>
              {time.toLocaleDateString("en-US", {
                weekday: "long", month: "short", day: "numeric",
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Danger Banner ── */}
      <AnimatePresence>
        {dangerSubjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: "rgba(239,68,68,0.06)",
              borderBottom: "1px solid rgba(239,68,68,0.2)",
              padding: "14px 32px",
              display: "flex", alignItems: "center",
              gap: "12px",
            }}
          >
            <AlertTriangle size={16} color="var(--danger)" />
            <p style={{
              fontSize: "13px", color: "var(--danger)",
              fontWeight: "700", flex: 1,
            }}>
              Below 75% attendance in:{" "}
              <span style={{ fontWeight: "600" }}>
                {dangerSubjects.map(s => s.subject).join(", ")}
              </span>
            </p>
            <Link to="/attendance" style={{
              fontSize: "11px", fontWeight: "700",
              textTransform: "uppercase", letterSpacing: "0.1em",
              color: "var(--danger)", textDecoration: "none",
              display: "flex", alignItems: "center", gap: "4px",
            }}>
              Fix it <ArrowRight size={13} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Quick Access ── */}
      <motion.div
        variants={stagger} initial="hidden" animate="show"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "0",
        }}>
          {quickLinks.map(({ path, icon: Icon, label, desc }, i) => (
            <motion.div key={path} variants={fadeUp}>
              <Link to={path} style={{ textDecoration: "none" }}>
                <motion.div
                  whileHover={{ background: "var(--bg2)" }}
                  style={{
                    padding: "24px 20px",
                    borderRight: i < 5
                      ? "1px solid var(--border)" : "none",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                >
                  <div style={{
                    width: "36px", height: "36px",
                    borderRadius: "8px",
                    background: "var(--accent-bg)",
                    border: "1px solid var(--accent-border)",
                    display: "flex", alignItems: "center",
                    justifyContent: "center", marginBottom: "12px",
                  }}>
                    <Icon size={17} color="var(--accent)" />
                  </div>
                  <div style={{
                    fontSize: "13px", fontWeight: "700",
                    color: "var(--text)", marginBottom: "2px",
                    letterSpacing: "-0.01em",
                  }}>{label}</div>
                  <div style={{
                    fontSize: "11px", color: "var(--text3)",
                    fontWeight: "500",
                  }}>{desc}</div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Main Content Grid ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0",
        borderBottom: "1px solid var(--border)",
      }}>

        {/* Attendance */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show"
          style={{
            padding: "32px",
            borderRight: "1px solid var(--border)",
          }}
        >
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-start", marginBottom: "24px",
          }}>
            <div>
              <div style={{
                fontSize: "10px", fontWeight: "700",
                textTransform: "uppercase", letterSpacing: "0.2em",
                color: "var(--text3)", marginBottom: "4px",
              }}>Attendance Overview</div>
              <h2 style={{
                fontSize: "24px", fontWeight: "900",
                letterSpacing: "-0.03em", color: "var(--text)",
                lineHeight: 1,
              }}>
                {attendance?.overallPercentage || 0}
                <span style={{ fontSize: "16px", color: "var(--text3)" }}>%</span>
              </h2>
            </div>
            <div style={{
              width: "40px", height: "40px",
              borderRadius: "8px", background: "var(--accent-bg)",
              border: "1px solid var(--accent-border)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <TrendingUp size={18} color="var(--accent)" />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {attendance?.records?.slice(0, 4).map((r, i) => (
              <div key={r.subject}>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  marginBottom: "6px",
                }}>
                  <span style={{
                    fontSize: "12px", fontWeight: "600",
                    color: "var(--text2)",
                  }}>
                    {r.subject.length > 24
                      ? r.subject.substring(0, 24) + "..." : r.subject}
                  </span>
                  <span style={{
                    fontSize: "12px", fontWeight: "800",
                    color: r.percentage >= 75
                      ? "var(--success)" : "var(--danger)",
                    letterSpacing: "-0.02em",
                  }}>{r.percentage}%</span>
                </div>
                <div style={{
                  height: "4px", background: "var(--border)",
                  borderRadius: "0", overflow: "hidden",
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${r.percentage}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                    style={{
                      height: "100%",
                      background: r.percentage >= 75
                        ? "var(--success)" : "var(--danger)",
                    }}
                  />
                </div>
              </div>
            ))}
            {!attendance?.records?.length && (
              <p style={{
                color: "var(--text3)", fontSize: "13px",
                padding: "20px 0", textAlign: "center",
              }}>No data yet — add subjects in Attendance</p>
            )}
          </div>

          <Link to="/attendance" style={{
            display: "inline-flex", alignItems: "center", gap: "5px",
            color: "var(--accent)", fontSize: "11px", fontWeight: "700",
            textDecoration: "none", marginTop: "20px",
            textTransform: "uppercase", letterSpacing: "0.1em",
          }}>
            View all subjects <ArrowRight size={13} />
          </Link>
        </motion.div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column" }}>

          {/* AI CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              padding: "32px",
              borderBottom: "1px solid var(--border)",
              background: "var(--accent)",
              position: "relative", overflow: "hidden",
            }}
          >
            {/* Decorative circles */}
            <div style={{
              position: "absolute", right: "-40px", top: "-40px",
              width: "160px", height: "160px", borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.15)",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", right: "20px", bottom: "-60px",
              width: "120px", height: "120px", borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.1)",
              pointerEvents: "none",
            }} />

            <div style={{
              fontSize: "10px", fontWeight: "700",
              textTransform: "uppercase", letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.6)", marginBottom: "8px",
            }}>AI ASSISTANT</div>
            <h2 style={{
              fontSize: "24px", fontWeight: "900",
              letterSpacing: "-0.03em", color: "white",
              lineHeight: "1", marginBottom: "8px",
            }}>Ask CampusAI</h2>
            <p style={{
              fontSize: "13px", color: "rgba(255,255,255,0.6)",
              marginBottom: "20px",
            }}>
              "Lunch?" · "My attendance?" · "Any notices?"
            </p>
            <Link to="/chat" style={{ textDecoration: "none" }}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "white",
                  padding: "10px 20px", borderRadius: "8px", cursor: "pointer",
                }}
              >
                <Sparkles size={14} color="var(--accent)" />
                <span style={{
                  fontSize: "12px", fontWeight: "700",
                  color: "var(--accent)", textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}>Chat Now</span>
                <ArrowRight size={13} color="var(--accent)" />
              </motion.div>
            </Link>
          </motion.div>

          {/* Canteen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            style={{ padding: "24px 32px" }}
          >
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: "16px",
            }}>
              <div>
                <div style={{
                  fontSize: "10px", fontWeight: "700",
                  textTransform: "uppercase", letterSpacing: "0.2em",
                  color: "var(--text3)", marginBottom: "2px",
                }}>Canteen Today</div>
                <h3 style={{
                  fontSize: "16px", fontWeight: "800",
                  color: "var(--text)", letterSpacing: "-0.02em",
                }}>
                  {menu ? "Menu Live 🍽️" : "Not Updated Yet"}
                </h3>
              </div>
              <Coffee size={18} color="var(--text3)" />
            </div>

            {menu ? (
              <div style={{
                display: "flex", flexDirection: "column", gap: "10px",
              }}>
                {[
                  { label: "☕ Breakfast", items: menu.breakfast },
                  { label: "🍱 Lunch", items: menu.lunch },
                ].map(({ label, items }) => items?.length > 0 && (
                  <div key={label}>
                    <p style={{
                      fontSize: "10px", fontWeight: "700",
                      textTransform: "uppercase", letterSpacing: "0.1em",
                      color: "var(--text3)", marginBottom: "5px",
                    }}>{label}</p>
                    <div style={{
                      display: "flex", flexWrap: "wrap", gap: "6px",
                    }}>
                      {items.slice(0, 4).map(i => (
                        <span key={i.name} style={{
                          background: "var(--bg2)",
                          border: "1px solid var(--border)",
                          borderRadius: "100px", padding: "3px 10px",
                          fontSize: "11px", color: "var(--text2)",
                          fontWeight: "500",
                        }}>
                          {i.name}
                          <span style={{
                            color: "var(--accent)", marginLeft: "4px",
                            fontWeight: "700",
                          }}>₹{i.price}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{
                color: "var(--text3)", fontSize: "13px",
              }}>
                Check back later ☕
              </p>
            )}

            <Link to="/canteen" style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              color: "var(--accent)", fontSize: "11px", fontWeight: "700",
              textDecoration: "none", marginTop: "14px",
              textTransform: "uppercase", letterSpacing: "0.1em",
            }}>
              Full menu <ArrowRight size={13} />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom Row: Notices + Lost & Found ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0",
      }}>

        {/* Notices */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            padding: "32px",
            borderRight: "1px solid var(--border)",
          }}
        >
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center", marginBottom: "20px",
          }}>
            <div>
              <div style={{
                fontSize: "10px", fontWeight: "700",
                textTransform: "uppercase", letterSpacing: "0.2em",
                color: "var(--text3)", marginBottom: "4px",
              }}>Recent</div>
              <h2 style={{
                fontSize: "20px", fontWeight: "900",
                letterSpacing: "-0.03em", color: "var(--text)",
              }}>Notices</h2>
            </div>
            <Bell size={18} color="var(--text3)" />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {notices.length > 0 ? notices.map((n, i) => (
              <motion.div
                key={n._id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  padding: "14px 0",
                  borderBottom: "1px solid var(--border)",
                  display: "flex", gap: "12px", alignItems: "flex-start",
                }}
              >
                <span style={{
                  fontSize: "10px", fontWeight: "700",
                  color: "var(--text3)", fontFamily: "monospace",
                  minWidth: "20px", paddingTop: "2px",
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: "flex", alignItems: "center",
                    gap: "8px", marginBottom: "3px",
                  }}>
                    <p style={{
                      fontSize: "13px", fontWeight: "700",
                      color: "var(--text)", letterSpacing: "-0.01em",
                    }}>{n.title}</p>
                    {n.important && (
                      <div style={{
                        width: "6px", height: "6px",
                        borderRadius: "50%", background: "var(--accent)",
                        flexShrink: 0,
                      }} />
                    )}
                  </div>
                  {n.aiSummary && (
                    <p style={{
                      fontSize: "11px", color: "var(--text3)",
                      lineHeight: "1.4",
                    }}>{n.aiSummary}</p>
                  )}
                </div>
              </motion.div>
            )) : (
              <p style={{
                color: "var(--text3)", fontSize: "13px",
                padding: "20px 0",
              }}>No notices yet 📋</p>
            )}
          </div>

          <Link to="/notices" style={{
            display: "inline-flex", alignItems: "center", gap: "5px",
            color: "var(--accent)", fontSize: "11px", fontWeight: "700",
            textDecoration: "none", marginTop: "16px",
            textTransform: "uppercase", letterSpacing: "0.1em",
          }}>
            All notices <ArrowRight size={13} />
          </Link>
        </motion.div>

        {/* Lost & Found */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{ padding: "32px" }}
        >
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center", marginBottom: "20px",
          }}>
            <div>
              <div style={{
                fontSize: "10px", fontWeight: "700",
                textTransform: "uppercase", letterSpacing: "0.2em",
                color: "var(--text3)", marginBottom: "4px",
              }}>Active Items</div>
              <h2 style={{
                fontSize: "20px", fontWeight: "900",
                letterSpacing: "-0.03em", color: "var(--text)",
              }}>Lost & Found</h2>
            </div>
            <Search size={18} color="var(--text3)" />
          </div>

          {/* Stats */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: "0", marginBottom: "20px",
            border: "1px solid var(--border)", borderRadius: "8px",
            overflow: "hidden",
          }}>
            {[
              {
                label: "Lost",
                val: lostItems.filter(i => i.type === "lost").length,
                color: "var(--danger)",
              },
              {
                label: "Found",
                val: lostItems.filter(i => i.type === "found").length,
                color: "var(--success)",
              },
            ].map((s, i) => (
              <div key={i} style={{
                padding: "14px 18px",
                borderRight: i === 0 ? "1px solid var(--border)" : "none",
              }}>
                <div style={{
                  fontSize: "10px", fontWeight: "700",
                  textTransform: "uppercase", letterSpacing: "0.1em",
                  color: "var(--text3)", marginBottom: "4px",
                }}>{s.label}</div>
                <div style={{
                  fontSize: "22px", fontWeight: "900",
                  color: s.color, letterSpacing: "-0.02em",
                }}>{s.val}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {lostItems.slice(0, 3).map((l, i) => (
              <div key={l._id} style={{
                display: "flex", alignItems: "center",
                gap: "10px", padding: "10px 0",
                borderBottom: i < 2 ? "1px solid var(--border)" : "none",
              }}>
                <span style={{
                  padding: "2px 8px",
                  background: l.type === "lost"
                    ? "rgba(239,68,68,0.08)"
                    : "rgba(16,185,129,0.08)",
                  border: `1px solid ${l.type === "lost"
                    ? "rgba(239,68,68,0.2)"
                    : "rgba(16,185,129,0.2)"}`,
                  borderRadius: "4px",
                  color: l.type === "lost" ? "var(--danger)" : "var(--success)",
                  fontSize: "10px", fontWeight: "700",
                  textTransform: "uppercase", letterSpacing: "0.05em",
                  flexShrink: 0,
                }}>{l.type}</span>
                <span style={{
                  fontSize: "13px", fontWeight: "600",
                  color: "var(--text2)", overflow: "hidden",
                  textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>{l.itemName}</span>
              </div>
            ))}
            {!lostItems.length && (
              <p style={{ color: "var(--text3)", fontSize: "13px" }}>
                Nothing lost today! 🎉
              </p>
            )}
          </div>

          <Link to="/lost-found" style={{
            display: "inline-flex", alignItems: "center", gap: "5px",
            color: "var(--accent)", fontSize: "11px", fontWeight: "700",
            textDecoration: "none", marginTop: "16px",
            textTransform: "uppercase", letterSpacing: "0.1em",
          }}>
            View all <ArrowRight size={13} />
          </Link>
        </motion.div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @media (max-width: 768px) {
          .dash-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}