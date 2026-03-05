import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Eye, EyeOff, ArrowRight, Sun, Moon, Zap } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();
  const { dark, setDark } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Access granted.");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const inputWrap = (name) => ({
    position: "relative",
    marginBottom: "16px",
    borderRadius: "10px",
    border: focused === name
      ? "2px solid var(--accent)"
      : "1.5px solid var(--border)",
    background: focused === name
      ? "var(--accent-bg)" : "var(--bg2)",
    transition: "all 0.25s ease",
    overflow: "hidden",
  });

  const inputStyle = {
    width: "100%",
    padding: "16px 18px",
    background: "transparent",
    border: "none",
    outline: "none",
    fontSize: "15px",
    fontWeight: "500",
    color: "var(--text)",
    fontFamily: "'Space Grotesk', sans-serif",
    letterSpacing: "0.01em",
  };

  const labelStyle = {
    display: "block",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    color: focused === "email" || focused === "password"
      ? "var(--accent)" : "var(--text3)",
    padding: "12px 18px 0",
    transition: "color 0.25s ease",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      fontFamily: "'Space Grotesk', sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* ── Top Bar ── */}
      <header style={{
        height: "60px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        position: "sticky",
        top: 0,
        background: "var(--bg)",
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "28px", height: "28px",
            borderRadius: "6px",
            background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Zap size={15} color="white" strokeWidth={2.5} />
          </div>
          <span style={{
            fontSize: "15px", fontWeight: "800",
            letterSpacing: "-0.03em", color: "var(--text)",
          }}>CampusAI</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setDark(!dark)}
            style={{
              background: "var(--bg2)",
              border: "1.5px solid var(--border)",
              borderRadius: "8px",
              padding: "7px 10px",
              cursor: "pointer",
              color: "var(--text2)",
              display: "flex", alignItems: "center",
              transition: "all 0.25s ease",
            }}
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </motion.button>
          <Link to="/register" style={{
            fontSize: "12px", fontWeight: "700",
            textTransform: "uppercase", letterSpacing: "0.1em",
            color: "var(--text3)", textDecoration: "none",
            transition: "color 0.25s ease",
          }}
            onMouseEnter={e => e.target.style.color = "var(--accent)"}
            onMouseLeave={e => e.target.style.color = "var(--text3)"}
          >Register →</Link>
        </div>
      </header>

      {/* ── Body ── */}
      <div style={{
        flex: 1, display: "flex",
        minHeight: "calc(100vh - 60px)",
      }}>

        {/* Left Hero Panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            flex: 1,
            borderRight: "1px solid var(--border)",
            padding: "64px 56px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Decorative circle */}
          <div style={{
            position: "absolute",
            right: "-120px", top: "50%",
            transform: "translateY(-50%)",
            width: "400px", height: "400px",
            borderRadius: "50%",
            border: "1px solid var(--border)",
            pointerEvents: "none", opacity: 0.5,
          }} />
          <div style={{
            position: "absolute",
            right: "-60px", top: "50%",
            transform: "translateY(-50%)",
            width: "240px", height: "240px",
            borderRadius: "50%",
            border: "1px solid var(--border)",
            pointerEvents: "none", opacity: 0.5,
          }} />

          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "var(--accent-bg)",
                border: "1px solid var(--accent-border)",
                borderRadius: "100px", padding: "5px 14px",
                marginBottom: "40px",
              }}
            >
              <div style={{
                width: "6px", height: "6px", borderRadius: "50%",
                background: "var(--accent)",
                animation: "pulse-dot 2s infinite",
              }} />
              <span style={{
                fontSize: "11px", fontWeight: "700",
                textTransform: "uppercase", letterSpacing: "0.15em",
                color: "var(--accent)",
              }}>AI-POWERED CAMPUS OS</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              style={{
                fontSize: "clamp(52px, 6vw, 88px)",
                fontWeight: "900",
                letterSpacing: "-0.04em",
                lineHeight: "0.88",
                color: "var(--text)",
                marginBottom: "28px",
              }}
            >
              WELCOME<br />
              <span style={{ color: "var(--accent)" }}>BACK.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              style={{
                fontSize: "16px", color: "var(--text2)",
                lineHeight: "1.7", maxWidth: "380px",
              }}
            >
              Your college life — notices, notes, canteen,
              attendance and AI chat, all unified in one place.
            </motion.p>
          </div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              borderTop: "1px solid var(--border)",
              paddingTop: "32px", gap: "0",
            }}
          >
            {[
              { num: "7+", label: "Features" },
              { num: "AI", label: "Powered" },
              { num: "₹0", label: "Forever Free" },
            ].map((s, i) => (
              <div key={i} style={{
                borderRight: i < 2 ? "1px solid var(--border)" : "none",
                padding: "0 24px 0 " + (i === 0 ? "0" : "24px"),
              }}>
                <div style={{
                  fontSize: "36px", fontWeight: "900",
                  letterSpacing: "-0.03em", color: "var(--accent)",
                  lineHeight: 1,
                }}>{s.num}</div>
                <div style={{
                  fontSize: "11px", fontWeight: "700",
                  textTransform: "uppercase", letterSpacing: "0.15em",
                  color: "var(--text3)", marginTop: "4px",
                }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Form Panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            width: "480px", flexShrink: 0,
            padding: "64px 48px",
            display: "flex", flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div style={{
              fontSize: "11px", fontWeight: "700",
              textTransform: "uppercase", letterSpacing: "0.2em",
              color: "var(--text3)", marginBottom: "8px",
            }}>01 / SIGN IN</div>

            <h2 style={{
              fontSize: "32px", fontWeight: "800",
              letterSpacing: "-0.03em", color: "var(--text)",
              marginBottom: "8px", lineHeight: 1,
            }}>Access your account</h2>
            <p style={{
              fontSize: "14px", color: "var(--text3)",
              marginBottom: "40px",
            }}>
              Enter your credentials to continue
            </p>

            <form onSubmit={handleSubmit}>

              {/* Email Field */}
              <div style={inputWrap("email")}>
                <label style={{
                  ...labelStyle,
                  color: focused === "email" ? "var(--accent)" : "var(--text3)",
                }}>Email Address</label>
                <input
                  type="email"
                  placeholder="you@college.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  required
                  style={inputStyle}
                />
              </div>

              {/* Password Field */}
              <div style={{ ...inputWrap("password"), marginBottom: "24px" }}>
                <label style={{
                  ...labelStyle,
                  color: focused === "password" ? "var(--accent)" : "var(--text3)",
                }}>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused("")}
                    required
                    style={{ ...inputStyle, paddingRight: "48px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: "absolute", right: "16px",
                      top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none",
                      color: "var(--text3)", cursor: "pointer",
                      display: "flex", alignItems: "center",
                    }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", padding: "16px",
                  background: loading ? "var(--text3)" : "var(--accent)",
                  border: "none", borderRadius: "10px",
                  color: "white", fontSize: "13px",
                  fontWeight: "700", textTransform: "uppercase",
                  letterSpacing: "0.15em", cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "8px",
                  transition: "all 0.25s ease",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {loading
                  ? <><span style={{
                      width: "14px", height: "14px",
                      border: "2px solid rgba(255,255,255,0.4)",
                      borderTopColor: "white", borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                      display: "inline-block",
                    }} /> AUTHENTICATING...</>
                  : <>SIGN IN <ArrowRight size={15} /></>
                }
              </motion.button>
            </form>

            {/* Divider */}
            <div style={{
              display: "flex", alignItems: "center",
              gap: "12px", margin: "24px 0",
            }}>
              <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
              <span style={{
                fontSize: "11px", color: "var(--text3)",
                fontWeight: "600", textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}>or</span>
              <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
            </div>

            <p style={{ textAlign: "center", fontSize: "14px", color: "var(--text3)" }}>
              New to CampusAI?{" "}
              <Link to="/register" style={{
                color: "var(--accent)", fontWeight: "700",
                textDecoration: "none",
              }}>
                Create account →
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        input::placeholder { color: var(--text3) !important; opacity: 0.6; }
        * { border-radius: 0; }
        .input-rounded { border-radius: 10px !important; }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .left-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}